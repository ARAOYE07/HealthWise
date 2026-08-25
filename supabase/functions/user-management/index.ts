import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Reusable function to verify if the requesting user has appropriate admin privileges
async function verifyAdminRole(supabaseClient: any, userId: string): Promise<boolean> {
  const { data, error } = await supabaseClient
    .from('admin_roles')
    .select('role')
    .eq('user_id', userId)
    .in('role', ['admin', 'super_admin'])
    .single();
    
  return !error && !!data;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    if (authError || !user) throw new Error('Unauthorized');

    // Security Check: Is the caller an Admin?
    const isAdmin = await verifyAdminRole(supabaseClient, user.id);
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: { code: 'FORBIDDEN', message: 'Administrator privileges required.' } }), { status: 403, headers: corsHeaders });
    }

    const { action, payload } = await req.json();
    const supabaseAdmin = createClient(Deno.env.get('SUPABASE_URL') ?? '', Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '');

    switch (action) {
      case 'suspend_user':
        // Edge function uses service role to interact with auth.admin
        const { error: suspendErr } = await supabaseAdmin.auth.admin.updateUserById(
          payload.target_user_id,
          { ban_duration: '87600h' } // 10 years ~ permanent ban
        );
        if (suspendErr) throw suspendErr;
        
        // Audit log
        await supabaseAdmin.rpc('log_audit_event', {
          p_admin_id: user.id,
          p_action: 'SUSPEND_USER',
          p_target_type: 'auth.user',
          p_target_id: payload.target_user_id,
          p_metadata: { reason: payload.reason }
        });
        
        return new Response(JSON.stringify({ success: true }), { headers: corsHeaders });

      case 'get_statistics':
        // Retrieve heavy aggregation queries
        const { count: usersCount } = await supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true });
        const { count: assessmentsCount } = await supabaseAdmin.from('health_assessments').select('*', { count: 'exact', head: true });
        const { count: emergenciesCount } = await supabaseAdmin.from('health_advice').select('*', { count: 'exact', head: true }).eq('safety_level', 'EMERGENCY');
        
        return new Response(JSON.stringify({
          users: usersCount,
          assessments: assessmentsCount,
          emergencies: emergenciesCount
        }), { headers: corsHeaders });
        
      default:
        return new Response(JSON.stringify({ error: 'Unknown action' }), { status: 400, headers: corsHeaders });
    }

  } catch (error: any) {
    return new Response(JSON.stringify({ error: { message: error.message } }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
