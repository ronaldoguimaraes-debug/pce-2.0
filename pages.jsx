// Dashboard, Perfil, Insights, FAQ, Manual, Drawer, Login, App shell

// ============================================================
// DRAWER — detail panel for a single aluno
// ============================================================
function AlunoDrawer({aluno, onClose, updateRow}){
  const [note, setNote] = React.useState(aluno._note || '');
  if (!aluno) return null;
  const r = aluno;
  return (
    <>
      <div className="drawer-bg" onClick={onClose}/>
      <div className="drawer">
        <div className="drawer-head">
          <div>
            <div className="section-label">Aluno · {r.id}</div>
            <h2 style={{fontFamily:'Barlow Condensed',fontSize:22,fontWeight:800,marginTop:4,lineHeight:1.1}}>
              {r.nome}
            </h2>
            <div style={{fontSize:12,color:'var(--muted)',marginTop:4}}>
              {r.empresa || 'Sem empresa'} · {r.tipo}
            </div>
          </div>
          <button className="btn ghost sm" onClick={onClose}>
            <Icon n="x" sz={14}/>
          </button>
        </div>
        <div className="drawer-body">
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,marginBottom:18}}>
            <div className={`badge ${presencaBadge(r.presenca).cls}`} style={{justifyContent:'center',padding:'6px'}}>
              {presencaBadge(r.presenca).label}
            </div>
            <div className={`badge ${onbBadge(r.onboarding).cls}`} style={{justifyContent:'center',padding:'6px'}}>
              ONB · {onbBadge(r.onboarding).label}
            </div>
          </div>

          <div className="section-label" style={{marginBottom:10}}>Contato</div>
          <div className="field"><label>E-mail</label><div className="field-val">{r.email||'—'}</div></div>
          <div className="field-row">
            <div className="field"><label>Telefone</label><div className="field-val">{r.telefone||'—'}</div></div>
            <div className="field"><label>CPF</label><div className="field-val">{r.cpf||'—'}</div></div>
          </div>

          <div className="section-label" style={{marginBottom:10,marginTop:10}}>Origem</div>
          <div className="field-row">
            <div className="field"><label>Evento</label><div className="field-val">{r.evento||'—'}</div></div>
            <div className="field"><label>Local venda</label><div className="field-val">{r.localVenda||'—'}</div></div>
          </div>
          <div className="field"><label>Promoção</label><div className="field-val muted">{r.promocao||'—'}</div></div>

          <div className="section-label" style={{marginBottom:10,marginTop:10}}>Status onboarding</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:12}}>WhatsApp adicionado</span>
              <span className={`badge ${r.whats==='SIM'?'ok':'bad'}`}>{r.whats||'—'}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:12}}>Typeform</span>
              <span className={`badge ${yesNo(r.typeform).cls}`}>{yesNo(r.typeform).label}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0',borderBottom:'1px solid var(--border)'}}>
              <span style={{fontSize:12}}>Contrato</span>
              <span className={`badge ${yesNo(r.contrato).cls}`}>{yesNo(r.contrato).label}</span>
            </div>
            <div style={{display:'flex',justifyContent:'space-between',padding:'6px 0'}}>
              <span style={{fontSize:12}}>Salesforce</span>
              <span className={`badge ${r.salesforce==='SIM'?'ok':'muted'}`}>{r.salesforce||'—'}</span>
            </div>
          </div>

          {r.consumidorVaga && (
            <>
              <div className="section-label" style={{marginBottom:10,marginTop:14}}>Acompanhante</div>
              <div className="field"><label>Nome</label><div className="field-val">{r.consumidorVaga||'—'}</div></div>
              <div className="field"><label>Tipo</label><div className="field-val">{r.conjugeSocio||'—'}</div></div>
            </>
          )}

          <div className="section-label" style={{marginBottom:10,marginTop:14}}>Anotações</div>
          <div className="field">
            <textarea rows="4" placeholder="Notas internas sobre este aluno..."
              value={note} onChange={(e)=>setNote(e.target.value)}/>
          </div>
        </div>
        <div className="drawer-foot">
          <button className="btn ghost sm" style={{flex:1}}>
            <Icon n="msg" sz={12}/> WhatsApp
          </button>
          <button className="btn sm" style={{flex:1}} onClick={()=>{
            updateRow(r.id, {_note: note}); onClose();
          }}>
            <Icon n="check" sz={12}/> Salvar
          </button>
        </div>
      </div>
    </>
  );
}

// ============================================================
// DASHBOARD
// ============================================================
function DashPage({rows}){
  const total = rows.length;
  const conf = rows.filter(r => r.presenca === 'BR CONFIRMADO' || r.presenca === 'BR + US CONFIRMAOD').length;
  const semRet = rows.filter(r => r.presenca === 'SEM RETORNO').length;
  const proxT = rows.filter(r => r.presenca === 'PROXIMA TURMA').length;
  const cancel = rows.filter(r => r.presenca === 'CANCELAMENTO').length;
  const onbReal = rows.filter(r => r.onboarding === 'REALIZADO').length;
  const onbPend = rows.filter(r => r.onboarding && (r.onboarding.includes('PENDENTE') || r.onboarding === 'NÃO INICIADO')).length;
  const whats = rows.filter(r => r.whats === 'SIM').length;
  const typef = rows.filter(r => r.typeform === 'PREENCHIDO').length;
  const contr = rows.filter(r => r.contrato === 'SIM' || r.contrato === 'Link enviado').length;

  const pct = (n) => total ? Math.round(n/total*100) : 0;

  const donuts = [
    { lbl:'Confirmados', val:conf, total, color:'var(--green)' },
    { lbl:'Onboarding', val:onbReal, total, color:'var(--green)' },
    { lbl:'WhatsApp', val:whats, total, color:'var(--blue)' },
    { lbl:'Typeform', val:typef, total, color:'var(--amber)' },
    { lbl:'Contrato', val:contr, total, color:'var(--purple)' },
  ];

  return (
    <div className="dash-grid" data-screen-label="Dashboard">
      <div className="dash-row r-4">
        <div className="kpi">
          <div className="kpi-label">Matriculados</div>
          <div className="kpi-val">{total}</div>
          <div className="kpi-sub">Turma 14 · <b>+{Math.round(total*0.04)}</b> esta semana</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Confirmados BR</div>
          <div className="kpi-val green">{conf}</div>
          <div className="kpi-sub">{pct(conf)}% da turma</div>
          <span className="kpi-spark up">+{Math.round(conf*0.08)}</span>
        </div>
        <div className="kpi">
          <div className="kpi-label">Onboarding pendente</div>
          <div className="kpi-val amber">{onbPend}</div>
          <div className="kpi-sub">requer ação operacional</div>
          <span className="kpi-spark down">-3</span>
        </div>
        <div className="kpi">
          <div className="kpi-label">Sem retorno</div>
          <div className="kpi-val red">{semRet}</div>
          <div className="kpi-sub">precisam de follow-up</div>
        </div>
      </div>

      <div className="card">
        <div className="card-head">
          <div>
            <div className="card-title">Saúde da turma</div>
            <div className="card-sub">Indicadores principais — {total} alunos</div>
          </div>
          <span className="badge ok"><Icon n="sparkle" sz={10}/> ATUALIZADO 2 MIN</span>
        </div>
        <div className="donut-grid" style={{padding:'18px'}}>
          {donuts.map(d => (
            <div key={d.lbl} className="donut-cell">
              <div className="donut-svg">
                <Donut pct={d.total ? d.val/d.total*100 : 0} color={d.color}/>
                <div className="donut-pct">{d.total ? Math.round(d.val/d.total*100) : 0}<span style={{fontSize:12}}>%</span></div>
              </div>
              <div className="donut-meta">{d.val} de {d.total}</div>
              <div className="donut-lbl">{d.lbl}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="dash-row r-2-3">
        {/* Funil */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Funil de matrícula</div>
          </div>
          <div className="funil">
            <div className="funil-row">
              <div className="lbl">Matriculado</div>
              <div className="bar"><div className="bar-fill" style={{width:'100%'}}/></div>
              <div className="val">{total}</div>
            </div>
            <div className="funil-row">
              <div className="lbl">Confirmado BR</div>
              <div className="bar"><div className="bar-fill" style={{width:`${pct(conf)}%`}}/></div>
              <div className="val">{conf}</div>
            </div>
            <div className="funil-row">
              <div className="lbl">WhatsApp</div>
              <div className="bar"><div className="bar-fill blue" style={{width:`${pct(whats)}%`}}/></div>
              <div className="val">{whats}</div>
            </div>
            <div className="funil-row">
              <div className="lbl">Typeform</div>
              <div className="bar"><div className="bar-fill amber" style={{width:`${pct(typef)}%`}}/></div>
              <div className="val">{typef}</div>
            </div>
            <div className="funil-row">
              <div className="lbl">Contrato</div>
              <div className="bar"><div className="bar-fill" style={{width:`${pct(contr)}%`}}/></div>
              <div className="val">{contr}</div>
            </div>
            <div className="funil-row">
              <div className="lbl">Onb. realizado</div>
              <div className="bar"><div className="bar-fill" style={{width:`${pct(onbReal)}%`}}/></div>
              <div className="val">{onbReal}</div>
            </div>
          </div>
        </div>

        {/* Alertas list */}
        <div className="card">
          <div className="card-head">
            <div className="card-title">Atenção imediata</div>
            <span className="badge bad">{semRet + onbPend}</span>
          </div>
          <div style={{maxHeight:340,overflowY:'auto'}}>
            {rows.filter(r => r.presenca==='SEM RETORNO' || r.onboarding==='NÃO INICIADO'
              || (r.onboarding && r.onboarding.includes('PENDENTE'))).slice(0,10).map(r => (
              <div key={r.id} style={{
                display:'flex',alignItems:'center',gap:10,
                padding:'10px 18px',borderBottom:'1px solid var(--border)',
              }}>
                <div className="avatar" style={{width:30,height:30,fontSize:10}}>
                  {(r.nome||'?').split(' ').slice(0,2).map(x=>x[0]).join('').toUpperCase()}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:600,fontSize:12,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.nome}</div>
                  <div style={{fontSize:10,color:'var(--muted)'}}>{r.empresa||'—'}</div>
                </div>
                <div style={{display:'flex',gap:4}}>
                  <span className={`badge ${presencaBadge(r.presenca).cls}`}>{presencaBadge(r.presenca).label}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// PERFIL DA TURMA
// ============================================================
function PerfilPage({rows}){
  const tipoCounts = {};
  rows.forEach(r => { tipoCounts[r.tipo||'(?)'] = (tipoCounts[r.tipo||'(?)']||0)+1; });
  const eventoCounts = {};
  rows.forEach(r => { eventoCounts[r.evento||'(?)'] = (eventoCounts[r.evento||'(?)']||0)+1; });
  const localCounts = {};
  rows.forEach(r => {
    const k = (r.localVenda||'(sem)').slice(0,30);
    localCounts[k] = (localCounts[k]||0)+1;
  });

  const Bars = ({title, data, max}) => {
    const sorted = Object.entries(data).sort((a,b)=>b[1]-a[1]).slice(0, max||8);
    const top = sorted[0]?.[1] || 1;
    return (
      <div className="card">
        <div className="card-head"><div className="card-title">{title}</div></div>
        <div className="bar-list">
          {sorted.map(([k,v]) => (
            <div key={k} className="bar-item">
              <div className="lbl" title={k}>{k}</div>
              <div className="val">{v}</div>
              <div className="bar"><div className="bar-fill" style={{width:`${v/top*100}%`}}/></div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="dash-grid" data-screen-label="Perfil">
      <div className="dash-row r-3">
        <Bars title="Tipo de matrícula" data={tipoCounts} max={8}/>
        <Bars title="Evento de origem" data={eventoCounts} max={8}/>
        <Bars title="Local da venda" data={localCounts} max={10}/>
      </div>
    </div>
  );
}

// ============================================================
// INSIGHTS / MANUAL / FAQ
// ============================================================
function InsightsPage(){
  const tiles = [
    { tag:'Conversão', title:'Taxa de presença vs evento', desc:'Eventos com maior taxa de confirmação BR comparados ao histórico das últimas 5 turmas.' },
    { tag:'Funil', title:'Onde os alunos travam?', desc:'Análise do gargalo: 23% travam entre WhatsApp e Typeform. Identifica padrões.' },
    { tag:'Tempo', title:'Tempo médio até onboarding', desc:'Quantos dias entre matrícula e onboarding realizado, segmentado por evento.' },
    { tag:'Atenção', title:'Alunos em risco de churn', desc:'Modelo identifica perfis com alta probabilidade de cancelamento antes do início.' },
    { tag:'Equipe', title:'Performance por atendente', desc:'Volume de onboardings, tempo médio de resposta e taxa de conclusão.' },
    { tag:'Comparação', title:'T14 vs T13 vs T12', desc:'Velocidade do funil comparada às últimas turmas. Onde estamos melhores ou piores.' },
  ];
  return (
    <div className="tile-grid" data-screen-label="Insights">
      {tiles.map(t => (
        <div key={t.title} className="tile">
          <div className="tile-tag">{t.tag}</div>
          <div className="tile-title">{t.title}</div>
          <div className="tile-desc">{t.desc}</div>
        </div>
      ))}
    </div>
  );
}

function ManualPage(){
  const tiles = [
    { tag:'Programa', title:'Jornada PCE', desc:'Linha do tempo da turma — pré-imersão, BR, US, encerramento.' },
    { tag:'Programa', title:'Experiências', desc:'Datas, locais e o que esperar de cada experiência presencial.' },
    { tag:'PFC', title:'Plano de fluxo de caixa', desc:'Material de apoio para implementação do PFC com os alunos.' },
    { tag:'PPE', title:'Plano de plenitude empresarial', desc:'Conteúdo e roteiro de aplicação do PPE.' },
    { tag:'Suporte', title:'Como abrir um chamado', desc:'Fluxo de atendimento técnico e de relacionamento.' },
    { tag:'Operação', title:'Status do aluno', desc:'O que cada status (BR confirmado, sem retorno, etc) significa e quando aplicar.' },
  ];
  return (
    <div className="tile-grid" data-screen-label="Manual">
      {tiles.map(t => (
        <div key={t.title} className="tile">
          <div className="tile-tag">{t.tag}</div>
          <div className="tile-title">{t.title}</div>
          <div className="tile-desc">{t.desc}</div>
        </div>
      ))}
    </div>
  );
}

function FaqPage(){
  const faqs = [
    { q:'O que significa "BR Confirmado"?', a:'Significa que o aluno confirmou presença na imersão Brasil. É o status base esperado após o onboarding inicial.' },
    { q:'Quando devo marcar "Sem retorno"?', a:'Quando após 3 tentativas (ligação + WhatsApp + e-mail) em dias diferentes não houve nenhuma resposta do aluno.' },
    { q:'Como diferenciar "Próxima turma" de "Cancelamento"?', a:'"Próxima turma" mantém a matrícula ativa para a turma seguinte. "Cancelamento" é solicitação formal de cancelamento — ação irreversível sem aprovação financeira.' },
    { q:'O que entra em "Onboarding pendente acompanhante"?', a:'Quando o aluno principal foi onboardado mas falta dados ou contato do cônjuge/sócio que vai ocupar a vaga acompanhante.' },
    { q:'Posso editar o CSV exportado e re-importar?', a:'Não no protótipo atual. A exportação é unidirecional para análise externa.' },
    { q:'O Typeform é obrigatório?', a:'Sim para todos os alunos confirmados. É a fonte do perfil comportamental usado nas dinâmicas presenciais.' },
  ];
  const [open, setOpen] = React.useState(0);
  return (
    <div className="faq-list" data-screen-label="FAQ">
      {faqs.map((f, i) => (
        <div key={i} className={`faq-item ${open===i?'open':''}`}>
          <div className="faq-q" onClick={()=>setOpen(open===i?-1:i)}>
            <span>{f.q}</span>
            <span className="chev"><Icon n="chev"/></span>
          </div>
          <div className="faq-a">{f.a}</div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// LOGIN (mocked)
// ============================================================
function LoginScreen({onLogin}){
  const [tab, setTab] = React.useState('login');
  const [email, setEmail] = React.useState('maria@febracis.com.br');
  const [pwd, setPwd] = React.useState('••••••••');
  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-mark" style={{width:36,height:36,fontSize:15}}>PCE</div>
          <div className="logo-text">
            <div className="lt-tag">Onboarding</div>
            <div className="lt-name" style={{fontSize:16}}>Comando T14</div>
          </div>
        </div>
        <div className="login-tab">
          <button className={tab==='login'?'on':''} onClick={()=>setTab('login')}>Entrar</button>
          <button className={tab==='signup'?'on':''} onClick={()=>setTab('signup')}>Criar conta</button>
        </div>
        {tab==='login' ? (
          <>
            <div className="field">
              <label>E-mail</label>
              <input value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <div className="field">
              <label>Senha</label>
              <input type="password" value={pwd} onChange={(e)=>setPwd(e.target.value)}/>
            </div>
            <button className="btn" style={{width:'100%',justifyContent:'center'}} onClick={onLogin}>
              Entrar →
            </button>
          </>
        ) : (
          <>
            <div className="field"><label>Nome</label><input/></div>
            <div className="field"><label>E-mail corporativo</label><input/></div>
            <div className="field"><label>Senha</label><input type="password"/></div>
            <button className="btn" style={{width:'100%',justifyContent:'center'}} onClick={onLogin}>
              Criar conta →
            </button>
          </>
        )}
        <div className="login-foot">
          Acesso restrito · Equipe de operação PCE
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { AlunoDrawer, DashPage, PerfilPage, InsightsPage, ManualPage, FaqPage, LoginScreen });
