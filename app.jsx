// App root — composes everything (Supabase-integrado)

function LoginScreenReal({ onError }) {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await window.PCE.auth.signInWithGoogle();
    } catch (e) {
      setError(e.message || 'Erro ao iniciar login');
      setLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-logo">PCE Onboarding</div>
        <div className="login-title">Acesso restrito</div>
        <div className="login-sub">
          Entre com sua conta corporativa para acessar o sistema.
        </div>
        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? 'Conectando…' : (
            <>
              <svg width="18" height="18" viewBox="0 0 18 18" style={{marginRight:8}}>
                <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.08-1.79 2.72v2.26h2.9c1.7-1.56 2.69-3.87 2.69-6.62z"/>
                <path fill="#34A853" d="M9 18c2.43 0 4.47-.81 5.96-2.18l-2.9-2.26c-.81.54-1.83.86-3.06.86-2.36 0-4.36-1.59-5.07-3.74H.95v2.33C2.44 15.98 5.48 18 9 18z"/>
                <path fill="#FBBC05" d="M3.93 10.68c-.18-.54-.28-1.12-.28-1.71s.1-1.17.28-1.71V4.93H.95C.34 6.13 0 7.52 0 9s.34 2.87.95 4.07l2.98-2.39z"/>
                <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.42 0 9 0 5.48 0 2.44 2.02.95 4.93l2.98 2.39C4.64 5.16 6.64 3.58 9 3.58z"/>
              </svg>
              Entrar com Google
            </>
          )}
        </button>
        {error && <div className="login-err">{error}</div>}
        <div className="login-foot">
          Apenas emails <b>@febracis.com.br</b> e <b>@cisassessment.com.br</b>
        </div>
      </div>
      <style>{`
        .login-screen{position:fixed;inset:0;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0a0a0a 0%,#1a1a1a 100%);z-index:9999;font-family:Barlow,sans-serif}
        .login-card{background:#fff;padding:48px 40px;border-radius:16px;width:380px;box-shadow:0 20px 60px rgba(0,0,0,.4);text-align:center}
        .login-logo{font-family:'Barlow Condensed',sans-serif;font-weight:800;letter-spacing:.04em;text-transform:uppercase;font-size:13px;color:#999;margin-bottom:24px}
        .login-title{font-size:24px;font-weight:700;margin-bottom:8px;color:#0a0a0a}
        .login-sub{color:#666;font-size:14px;margin-bottom:32px;line-height:1.5}
        .login-btn{width:100%;padding:14px;background:#0a0a0a;color:#fff;border:none;border-radius:8px;font-weight:600;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit;transition:opacity .2s}
        .login-btn:disabled{opacity:.6;cursor:wait}
        .login-btn:hover:not(:disabled){background:#222}
        .login-err{margin-top:16px;padding:10px;background:#fee;color:#c33;border-radius:6px;font-size:13px}
        .login-foot{margin-top:24px;font-size:12px;color:#999}
      `}</style>
    </div>
  );
}

function App(){
  const [authLoading, setAuthLoading] = React.useState(true);
  const [user, setUser] = React.useState(null);
  const [domainError, setDomainError] = React.useState(false);
  const [page, setPage] = React.useState('gestao');
  const [turma, setTurma] = React.useState('T14');
  const [rows, setRows] = React.useState([]);
  const [rowsLoading, setRowsLoading] = React.useState(true);
  const [selected, setSelected] = React.useState(new Set());
  const [drawerAluno, setDrawerAluno] = React.useState(null);
  const [toast, setToast] = React.useState(null);

  const [syncState, setSyncState] = React.useState({
    frases: new Set(), frasesData: {}, cartas: new Set(), cartasData: {}, history: [],
  });
  const [lastRun, setLastRun] = React.useState({ onboarding: null, frases: null, cartas: null });

  // Auth check on mount + listen to changes
  React.useEffect(() => {
    let unsub;
    (async () => {
      const u = await window.PCE.auth.getCurrentUser();
      setUser(u);
      setAuthLoading(false);
      const sub = window.PCE.auth.onAuthChange((newUser, evt) => {
        if (evt === 'domain_not_allowed') {
          setDomainError(true);
          setUser(null);
        } else {
          setUser(newUser);
          setDomainError(false);
        }
      });
      unsub = sub.data?.subscription?.unsubscribe?.bind(sub.data.subscription);
    })();
    return () => unsub?.();
  }, []);

  // Load alunos + subscribe realtime once authed
  React.useEffect(() => {
    if (!user) return;
    setRowsLoading(true);
    window.PCE.data.loadAlunos(turma).then(data => {
      setRows(data);
      setRowsLoading(false);
    }).catch(err => {
      console.error(err);
      setRowsLoading(false);
    });
    const unsub = window.PCE.data.subscribeAlunos(turma, (evt, aluno, oldId) => {
      setRows(prev => {
        if (evt === 'INSERT') return [aluno, ...prev.filter(r => r.id !== aluno.id)];
        if (evt === 'UPDATE') return prev.map(r => r.id === aluno.id ? aluno : r);
        if (evt === 'DELETE') return prev.filter(r => r.id !== oldId);
        return prev;
      });
    });
    return unsub;
  }, [user, turma]);

  const visibleRows = turma === 'T14' ? rows : [];

  const updateRow = async (id, patch) => {
    // Optimistic update
    setRows(prev => prev.map(r => r.id === id ? {...r, ...patch} : r));
    if (drawerAluno && drawerAluno.id === id) {
      setDrawerAluno(d => ({...d, ...patch}));
    }
    // Persist each field
    for (const [campo, valor] of Object.entries(patch)) {
      const { error } = await window.PCE.data.updateAluno(id, campo, valor);
      if (error) showToast(`Erro ao salvar ${campo}`, 0, 'err');
    }
  };

  const showToast = (msg, count, kind) => {
    setToast({msg, count, kind: kind||'ok', t: Date.now()});
    setTimeout(()=>setToast(null), 3500);
  };

  const nowStr = () => {
    const d = new Date();
    return d.toLocaleString('pt-BR', {day:'2-digit',month:'2-digit',hour:'2-digit',minute:'2-digit'});
  };

  const runSync = async (kind) => {
    if (kind === 'onboarding') {
      const { data, error } = await window.PCE.data.syncDossie(turma);
      if (error) { showToast('Erro na sincronização', 0, 'err'); return; }
      const count = data || 0;
      const when = nowStr();
      setLastRun(s => ({...s, onboarding: when}));
      setSyncState(s => ({...s, history: [
        {fn:'sync_dossie_para_alunos', when, count, op: user?.email || '—', status:'OK'},
        ...s.history
      ]}));
      showToast(`Onboarding atualizado`, count);
    }
    if (kind === 'frases') {
      const { data, error } = await window.PCE.data.syncFrases(turma);
      if (error) { showToast('Erro na sincronização', 0, 'err'); return; }
      const count = data || 0;
      const when = nowStr();
      setLastRun(s => ({...s, frases: when}));
      setSyncState(s => ({...s, history: [
        {fn:'sync_frases', when, count, op: user?.email || '—', status:'OK'}, ...s.history
      ]}));
      showToast(`Frases criadas`, count);
    }
    if (kind === 'cartas') {
      const { data, error } = await window.PCE.data.syncCartas(turma);
      if (error) { showToast('Erro na sincronização', 0, 'err'); return; }
      const count = data || 0;
      const when = nowStr();
      setLastRun(s => ({...s, cartas: when}));
      setSyncState(s => ({...s, history: [
        {fn:'sync_cartas', when, count, op: user?.email || '—', status:'OK'}, ...s.history
      ]}));
      showToast(`Cartas criadas`, count);
    }
  };

  const updateFrase = (id, patch) => {
    setSyncState(s => ({...s, frasesData: {...s.frasesData, [id]: {...(s.frasesData[id]||{}), ...patch}}}));
  };
  const updateCarta = (id, patch) => {
    setSyncState(s => ({...s, cartasData: {...s.cartasData, [id]: {...(s.cartasData[id]||{}), ...patch}}}));
  };

  const pendingCount = React.useMemo(() => {
    const PD = window.PENDING_DOSSIE || [];
    let c = 0;
    PD.forEach(([id]) => {
      const r = rows.find(x => x.id === id);
      if (r && r.typeform !== 'PREENCHIDO') c++;
      if (!syncState.frases.has(id)) c++;
      if (!syncState.cartas.has(id)) c++;
    });
    return c;
  }, [rows, syncState]);

  const exportCSV = () => {
    const cols = ['nome','empresa','cpf','telefone','email','tipo','evento','presenca','onboarding','whats','typeform','contrato','grupoBR','perfilComp','perfil','localVenda'];
    const head = cols.join(',');
    const body = visibleRows.map(r => cols.map(c =>
      `"${(r[c]||'').toString().replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([head+'\n'+body], {type:'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `pce-${turma.toLowerCase()}-${Date.now()}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  };

  const addAluno = async () => {
    const nome = prompt('Nome do aluno?');
    if (!nome) return;
    const { data, error } = await window.PCE.data.addAluno(turma, {
      nome, tipo:'Matrícula', registro:'PENDENTE',
      onboarding:'NÃO INICIADO', whats:'NÃO', typeform:'NÃO PREENCHEU', grupoBR:'NÃO',
    });
    if (error) { showToast('Erro ao adicionar', 0, 'err'); return; }
    showToast('Aluno adicionado', 1);
  };

  const renderPage = () => {
    if (turma !== 'T14') {
      return (
        <div className="empty" style={{paddingTop:120}}>
          <div className="empty-i"><Icon n="inbox" sz={24}/></div>
          <div className="empty-t">Turma {turma} ainda não iniciou</div>
          <div className="empty-s">Os dados de {turma} aparecerão aqui quando começar a captação.</div>
        </div>
      );
    }
    if (rowsLoading) {
      return <div className="empty" style={{paddingTop:120}}>
        <div className="empty-t">Carregando alunos…</div>
      </div>;
    }
    switch(page){
      case 'gestao':   return <GestaoPage rows={visibleRows} updateRow={updateRow}
                                selected={selected} setSelected={setSelected}
                                onOpenDrawer={setDrawerAluno}/>;
      case 'dash':     return <DashPage rows={visibleRows}/>;
      case 'perfil':   return <PerfilPage rows={visibleRows}/>;
      case 'sync':     return <SyncPage rows={visibleRows} updateRow={updateRow}
                                syncState={syncState} runSync={runSync} lastRun={lastRun}/>;
      case 'frases':   return <FrasesPage rows={visibleRows} syncState={syncState} updateFrase={updateFrase}/>;
      case 'cartas':   return <CartasPage rows={visibleRows} syncState={syncState} updateCarta={updateCarta}/>;
      case 'insights': return <InsightsPage/>;
      case 'manual':   return <ManualPage/>;
      case 'faq':      return <FaqPage/>;
      default: return null;
    }
  };

  if (authLoading) {
    return <div style={{position:'fixed',inset:0,display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Barlow,sans-serif',color:'#666'}}>Verificando sessão…</div>;
  }

  if (!user) {
    return <>
      {domainError && <div style={{position:'fixed',top:20,left:'50%',transform:'translateX(-50%)',background:'#c33',color:'#fff',padding:'10px 16px',borderRadius:6,zIndex:10000,fontFamily:'Barlow,sans-serif',fontSize:13}}>
        Email fora do domínio permitido. Use uma conta @febracis.com.br ou @cisassessment.com.br.
      </div>}
      <LoginScreenReal/>
    </>;
  }

  return (
    <div className="app">
      <Sidebar page={page} setPage={setPage} totalCount={visibleRows.length} pendingCount={pendingCount} user={user} onLogout={()=>window.PCE.auth.signOut()}/>
      <div className="main">
        <Topbar page={page} turma={turma} setTurma={setTurma}
          totalT={visibleRows.length}
          pendingCount={pendingCount} goToSync={()=>setPage('sync')}
          onAddAluno={addAluno} onExport={exportCSV}/>
        <div className="content">
          {renderPage()}
        </div>
      </div>
      {drawerAluno && (
        <AlunoDrawer aluno={drawerAluno} onClose={()=>setDrawerAluno(null)} updateRow={updateRow}/>
      )}
      {toast && (
        <div className="toast" data-kind={toast.kind}>
          <div className="toast-i"><Icon n={toast.kind==='err'?'alert':'check'} sz={14} sw={3}/></div>
          <div>
            <div className="toast-t">{toast.msg}</div>
            {toast.count > 0 && <div className="toast-s">{toast.count} registros atualizados</div>}
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
