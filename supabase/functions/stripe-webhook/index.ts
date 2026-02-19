// @ts-nocheck — Deno Edge Function（VS Code TypeScript LSP の誤検知を抑制）
// 外部 import ゼロ：Deno 組み込み API のみ使用
// esm.sh 経由の import は Deno.core.runMicrotasks エラーの原因になるため排除

const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET') ?? ''
const SUPABASE_URL = Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''

/** Stripe Webhook 署名を HMAC-SHA256 で検証 */
async function verifyStripeSignature(
    payload: string,
    sigHeader: string,
    secret: string
): Promise<boolean> {
    try {
        const parts = sigHeader.split(',')
        let timestamp = ''
        const signatures: string[] = []

        for (const part of parts) {
            const [key, value] = part.split('=')
            if (key === 't') timestamp = value
            if (key === 'v1') signatures.push(value)
        }

        if (!timestamp || signatures.length === 0) return false

        // 5分以内のリクエストのみ受け付ける
        const age = Math.floor(Date.now() / 1000) - parseInt(timestamp)
        if (age > 300) return false

        const signedPayload = `${timestamp}.${payload}`
        const key = await crypto.subtle.importKey(
            'raw',
            new TextEncoder().encode(secret),
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        )
        const sig = await crypto.subtle.sign(
            'HMAC',
            key,
            new TextEncoder().encode(signedPayload)
        )
        const expected = Array.from(new Uint8Array(sig))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('')

        return signatures.includes(expected)
    } catch {
        return false
    }
}

/**
 * 冪等性チェック: stripe_events テーブルへの INSERT を試みる。
 * PRIMARY KEY 衝突（重複イベント）の場合は [] が返る（ON CONFLICT DO NOTHING）。
 * @returns true = 新規イベント（処理続行）/ false = 処理済み（スキップ）
 */
async function recordEventIfNew(eventId: string): Promise<boolean> {
    const res = await fetch(
        `${SUPABASE_URL}/rest/v1/stripe_events`,
        {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                'apikey': SUPABASE_SERVICE_ROLE_KEY,
                'Content-Type': 'application/json',
                // ignore-duplicates = ON CONFLICT DO NOTHING
                // return=representation で挿入された行を返す（0行なら重複）
                'Prefer': 'resolution=ignore-duplicates,return=representation',
            },
            body: JSON.stringify({ id: eventId }),
        }
    )

    if (!res.ok) {
        const errText = await res.text()
        throw new Error(`stripe_events insert failed: ${errText}`)
    }

    const inserted = await res.json()
    // 空配列 = 重複（すでに処理済み）
    return Array.isArray(inserted) && inserted.length > 0
}

Deno.serve(async (req) => {
    const signature = req.headers.get('Stripe-Signature')
    if (!signature) {
        return new Response('No signature', { status: 400 })
    }

    try {
        const body = await req.text()

        // 署名検証
        const isValid = await verifyStripeSignature(body, signature, STRIPE_WEBHOOK_SECRET)
        if (!isValid) {
            console.error('Invalid Stripe signature')
            return new Response('Invalid signature', { status: 400 })
        }

        const event = JSON.parse(body)
        console.log(`Stripe event: ${event.type} (${event.id})`)

        // 冪等性チェック: 処理済みイベントはスキップ
        const isNew = await recordEventIfNew(event.id)
        if (!isNew) {
            console.log(`Duplicate event ${event.id}, skipping`)
            return new Response(JSON.stringify({ received: true, skipped: true }), {
                headers: { 'Content-Type': 'application/json' }
            })
        }

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object
            const userId = session.client_reference_id
            // メタデータからプランタイプを取得（未設定なら 'pro' にフォールバック）
            const planType = session.metadata?.plan_type ?? 'pro'

            if (userId) {
                // Supabase REST API で user_profiles を更新 (fetch のみ)
                const res = await fetch(
                    `${SUPABASE_URL}/rest/v1/user_profiles?id=eq.${userId}`,
                    {
                        method: 'PATCH',
                        headers: {
                            'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
                            'apikey': SUPABASE_SERVICE_ROLE_KEY,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=minimal',
                        },
                        body: JSON.stringify({
                            is_pro: true,
                            plan_type: planType,
                            stripe_customer_id: session.customer,
                        }),
                    }
                )

                if (!res.ok) {
                    const errText = await res.text()
                    console.error('Supabase update error:', errText)
                    throw new Error(`DB update failed: ${errText}`)
                }
                console.log(`User ${userId} upgraded to Pro!`)
            }
        }

        return new Response(JSON.stringify({ received: true }), {
            headers: { 'Content-Type': 'application/json' }
        })
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err)
        console.error(`Webhook error: ${message}`)
        return new Response(`Webhook Error: ${message}`, { status: 400 })
    }
})
