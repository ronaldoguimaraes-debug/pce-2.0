// ============================================================
// PCE Onboarding — Cliente Supabase
// ============================================================
// Inicializa o cliente, gerencia login Google com restrição de domínio,
// e expõe helpers para o resto do app.
// ============================================================

(function () {
  const SUPABASE_URL = 'https://avhhreybvcbgqacbvjgm.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF2aGhyZXlidmNiZ3FhY2J2amdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwODgyMDQsImV4cCI6MjA5MzY2NDIwNH0.h_RkqqnXVfo-a_rSEdQ64Gfn599Jx9E8adTEwQU3QJI';

  // Domínios permitidos — qualquer outro é deslogado automaticamente
  const ALLOWED_DOMAINS = ['febracis.com.br', 'cisassessment.com.br'];

  if (!window.supabase) {
    console.error('[PCE] supabase-js não carregou. Verifique o <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> no <head>.');
    return;
  }

  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });

  // ===== Auth helpers =====

  function isEmailAllowed(email) {
    if (!email) return false;
    const domain = email.split('@')[1]?.toLowerCase();
    return ALLOWED_DOMAINS.includes(domain);
  }

  async function signInWithGoogle() {
    const redirectTo = window.location.origin + window.location.pathname;
    const { error } = await client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo,
        queryParams: {
          access_type: 'offline',
          prompt: 'select_account',
        },
      },
    });
    if (error) {
      console.error('[PCE] Erro no login:', error);
      throw error;
    }
  }

  async function signOut() {
    await client.auth.signOut();
    window.location.reload();
  }

  async function getCurrentUser() {
    const { data: { user } } = await client.auth.getUser();
    if (!user) return null;
    if (!isEmailAllowed(user.email)) {
      console.warn('[PCE] Email fora do domínio permitido:', user.email);
      await client.auth.signOut();
      return null;
    }
    return user;
  }

  function onAuthChange(callback) {
    return client.auth.onAuthStateChange((event, session) => {
      const user = session?.user || null;
      if (user && !isEmailAllowed(user.email)) {
        client.auth.signOut();
        callback(null, 'domain_not_allowed');
        return;
      }
      callback(user, event);
    });
  }

  // Expor globalmente
  window.PCE = window.PCE || {};
  window.PCE.supabase = client;
  window.PCE.auth = {
    signInWithGoogle,
    signOut,
    getCurrentUser,
    onAuthChange,
    isEmailAllowed,
    ALLOWED_DOMAINS,
  };

  console.log('[PCE] Cliente Supabase inicializado.');
})();
