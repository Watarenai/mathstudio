
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    // CORS handle
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_ANON_KEY') ?? '',
            { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
        )

        // 1. 呼び出し元（親）のユーザーを取得
        const {
            data: { user },
        } = await supabaseClient.auth.getUser()

        if (!user) {
            throw new Error('Unauthorized')
        }

        const parentId = user.id

        // 2. 親のプラン確認（DB直接参照）
        // Adminクライアントを作成してRLSをバイパス、またはRPC経由でも良いが、
        // ここではServiceRoleで確実にチェックする
        const supabaseAdmin = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        const { data: profile } = await supabaseAdmin
            .from('user_profiles')
            .select('plan_type')
            .eq('id', parentId)
            .single()

        if (!profile || !['family', 'school', 'pro'].includes(profile.plan_type)) {
            throw new Error('Family Plan required')
        }

        // 3. リクエストボディから子供の名前を取得
        const { childName, childGrade } = await req.json()
        if (!childName) throw new Error('Child name is required')

        // 4. ダミーメールアドレスとパスワードの生成
        // ランダムなIDを付与してユニークにする
        const randomId = Math.floor(Math.random() * 1000000)
        const email = `child_${parentId.slice(0, 8)}_${randomId}@mathbudy.internal` // .internal ドメインを使用
        const password = `pass_${Math.random().toString(36).slice(-8)}` // 簡易パスワード生成

        // 5. ユーザー作成 (Admin API)
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: password,
            email_confirm: true,
            user_metadata: {
                display_name: childName, // メタデータにも入れておく
            }
        })

        if (createError) throw createError
        if (!newUser.user) throw new Error('Failed to create user')

        // 6. プロフィール更新（parent_id, display_name, grade）
        // トリガー等でプロファイルが作られている可能性があるが、確実にUPDATEする
        const { error: updateError } = await supabaseAdmin
            .from('user_profiles')
            .update({
                parent_id: parentId,
                display_name: childName,
                grade: childGrade || 'middle1',
                plan_type: profile.plan_type // 親と同じプランを適用（あるいは 'child' プランを作るか？現状は親に合わせる運用）
            })
            .eq('id', newUser.user.id)

        if (updateError) {
            // 失敗したらユーザーを削除するロールバック処理を入れるのが望ましいが、MVPでは省略
            throw updateError
        }

        // 7. 生成された認証情報を返す
        return new Response(
            JSON.stringify({
                user: newUser.user,
                credentials: {
                    email,
                    password
                }
            }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200,
            }
        )

    } catch (error) {
        return new Response(
            JSON.stringify({ error: error.message }),
            {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 400,
            }
        )
    }
})
