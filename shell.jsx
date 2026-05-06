// Sidebar + Topbar shell
const NAV = [
  { sec: 'Operação' },
  { id: 'gestao',   label: 'Gestão',         icon: 'table',  badge: 'total' },
  { id: 'dash',     label: 'Dashboard',      icon: 'dash',   badge: null },
  { id: 'perfil',   label: 'Perfil da turma', icon: 'users', badge: null },
  { sec: 'Sincronizações' },
  { id: 'sync',     label: 'Dossê → T14',      icon: 'sparkle', badge: 'pending' },
  { id: 'frases',   label: 'Frases do cliente', icon: 'note', badge: null },
  { id: 'cartas',   label: 'Cartas Proféticas', icon: 'edit', badge: null },
  { sec: 'Recursos' },
  { id: 'insights', label: 'Insights',       icon: 'chart',  badge: null },
  { id: 'manual',   label: 'Manual experts', icon: 'book',   badge: null },
  { id: 'faq',      label: 'FAQ — PCE',      icon: 'help',   badge: null },
];

function Sidebar({page, setPage, totalCount, pendingCount, user, onLogout}){
  const initials = (user?.user_metadata?.full_name || user?.email || 'U')
    .split(/\s+/).map(s=>s[0]).filter(Boolean).slice(0,2).join('').toUpperCase();
  const displayName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Usuário';
  return (
    <aside className="sidebar">
      <div className="sidebar-head">
        <div className="logo-mark">PCE</div>
        <div className="logo-text">
          <div className="lt-tag">Onboarding</div>
          <div className="lt-name">Comando T14</div>
        </div>
      </div>
      <nav className="sidebar-nav">
        {NAV.map((it, i) => it.sec ? (
          <div key={i} className="nav-section">{it.sec}</div>
        ) : (
          <button key={it.id}
            className={`nav-item ${page === it.id ? 'active' : ''}`}
            onClick={() => setPage(it.id)}>
            <Icon n={it.icon} />
            <span>{it.label}</span>
            {it.badge === 'total' && (
              <span className="nav-badge">{totalCount}</span>
            )}
            {it.badge === 'pending' && pendingCount > 0 && (
              <span className="nav-badge warn">{pendingCount}</span>
            )}
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="avatar" title={user?.email || ''}>{initials}</div>
        <div className="user-meta">
          <div className="user-name">{displayName}</div>
          <div className="user-role">Operação · Online</div>
        </div>
        <button className="filter-pill" title="Sair" onClick={onLogout} style={{padding:6}}>
          <Icon n="x" sz={13}/>
        </button>
      </div>
    </aside>
  );
}

function Topbar({page, turma, setTurma, totalT, onAddAluno, onExport, pendingCount, goToSync}){
  const titles = {
    gestao: 'Gestão de matriculados',
    dash:   'Dashboard',
    perfil: 'Perfil da turma',
    sync:   'Sincronizações Dossê → T14',
    frases: 'Frases do cliente',
    cartas: 'Cartas Proféticas',
    insights:'Insights',
    manual: 'Manual experts',
    faq:    'FAQ — PCE',
  };
  return (
    <div className="topbar">
      <div className="topbar-left">
        <div className="page-title">{titles[page]}</div>
        <div className="crumbs">
          PCE · <b>Turma {turma}</b> · {totalT} alunos
        </div>
      </div>
      <div className="topbar-right">
        {pendingCount > 0 ? (
          <button className="pill pending" onClick={goToSync}>
            <span className="dot"/> {pendingCount} pendentes do Dossiê
          </button>
        ) : (
          <span className="pill live"><span className="dot"/> Em sincronia</span>
        )}
        <div className="turma-tabs">
          {['T14','T15','T16'].map(t => (
            <button key={t} className={`turma-tab ${turma===t?'active':''}`}
              onClick={() => setTurma(t)}>{t}</button>
          ))}
        </div>
        {page === 'gestao' && (
          <>
            <button className="btn ghost sm" onClick={onExport}>
              <Icon n="download"/> CSV
            </button>
            <button className="btn sm" onClick={onAddAluno}>
              <Icon n="plus"/> Novo aluno
            </button>
          </>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { Sidebar, Topbar });
