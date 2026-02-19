// 外部 import ゼロ：Deno 組み込み API のみ使用

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') ?? ''
const SUPABASE_URL = Deno.env.get('STRIPE_SUPABASE_URL') ?? Deno.env.get('SUPABASE_URL') ?? ''
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

Deno.serve(async (req) => {
    // CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
            }
        })
    }

    try {
        const { priceId, planType, successUrl, cancelUrl } = await req.json()

        // ユーザー認証: Supabase Auth API を叩いて確認する
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('No Authorization header')
        }

        const userRes = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
            headers: {
                'Authorization': authHeader,
                'apikey': SUPABASE_ANON_KEY,
            }
        })

        if (!userRes.ok) {
            throw new Error('Unauthorized: Invalid token')
        }

        const { id: userId, email } = await userRes.json()

        // Stripe Checkout Session を fetch で作成
        const params = new URLSearchParams()
        params.append('payment_method_types[]', 'card')
        params.append('line_items[0][price]', priceId)
        params.append('line_items[0][quantity]', '1')
        params.append('mode', 'subscription')
        params.append('success_url', successUrl)
        params.append('cancel_url', cancelUrl)
        params.append('client_reference_id', userId)
        if (email) params.append('customer_email', email)
        params.append('metadata[plan_type]', planType ?? 'pro')

        const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${STRIPE_SECRET_KEY}`,
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: params.toString(),
        })

        const session = await stripeRes.json()

        if (!stripeRes.ok) {
            console.error('Stripe API error:', JSON.stringify(session))
            throw new Error(session.error?.message ?? 'Stripe API error')
        }

        return new Response(JSON.stringify({ url: session.url }), {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        })
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : String(error)
        console.error('Function error:', message)
        return new Response(JSON.stringify({ error: message }), {
            status: 400,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        })
    }
})
