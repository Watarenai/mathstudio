// 外部 import ゼロ：Deno 組み込み API のみ使用

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY') ?? ''
const ENV_SUPABASE_URL = Deno.env.get('STRIPE_SUPABASE_URL') ?? Deno.env.get('SUPABASE_URL') ?? ''
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
        const { returnUrl } = await req.json()

        // ユーザー認証: Supabase Auth API を叩いて確認する
        const authHeader = req.headers.get('Authorization')
        if (!authHeader) {
            throw new Error('No Authorization header')
        }

        const userRes = await fetch(`${ENV_SUPABASE_URL}/auth/v1/user`, {
            headers: {
                'Authorization': authHeader,
                'apikey': SUPABASE_ANON_KEY,
            }
        })

        if (!userRes.ok) {
            throw new Error('Unauthorized: Invalid token')
        }

        const { id: userId } = await userRes.json()

        // user_profiles から stripe_customer_id を取得
        // Service Role Key を使っていないので、Rls Policy に従う必要があるが、
        // ここでは postgres を直接叩くのではなく、Rest API を使う
        // しかし、Rest API だと RLS が効くので、自分のデータは取れるはず
        const profileRes = await fetch(`${ENV_SUPABASE_URL}/rest/v1/user_profiles?id=eq.${userId}&select=stripe_customer_id`, {
            headers: {
                'Authorization': authHeader,
                'apikey': SUPABASE_ANON_KEY,
            }
        })

        if (!profileRes.ok) {
            throw new Error('Failed to fetch user profile')
        }

        const profiles = await profileRes.json()
        const customerId = profiles[0]?.stripe_customer_id

        if (!customerId) {
            throw new Error('No Stripe Customer ID found for this user.')
        }

        // Stripe Portal Session を作成
        const params = new URLSearchParams()
        params.append('customer', customerId)
        params.append('return_url', returnUrl || 'http://localhost:5173/') // Default to home if not provided

        const stripeRes = await fetch('https://api.stripe.com/v1/billing_portal/sessions', {
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
