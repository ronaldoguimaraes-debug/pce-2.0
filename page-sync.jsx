// page-sync.jsx — Sincronizações + Frases + Cartas Proféticas
// Mocked Apps Script flow: Dossiê → Onboarding T14, Frases T14, Carta Profética T14

// ============================================================
// MOCKED "DOSSIÊ" RESPONSES (ainda não sincronizadas)
// ============================================================
// IDs reais da T14 que estão com Typeform = '' ou 'NÃO PREENCHEU'
// vão ser elegíveis. Esta lista representa CPFs que JÁ responderam
// no Typeform/Dossiê e estão aguardando rodar o script.
const PENDING_DOSSIE = [
  // [id, nomePref, empresa, fraseCliente]
  ['A005', 'Carlos', 'Construtora Vale Sul', 'Empresário visionário, transformo desafios em oportunidades.'],
  ['A012', 'Patrícia', 'Studio P&D Arquitetura', 'Crio espaços que contam histórias e geram valor.'],
  ['A018', 'Roberto', 'TechFlow Soluções', 'Inovação é minha linguagem, resultado é minha assinatura.'],
  ['A024', 'Mariana', 'Boutique Floralis', 'Floresço onde planto, colho onde semeio com excelência.'],
  ['A031', 'Eduardo', 'Logística Andrade', 'Movo o impossível, entrego o necessário, supero o esperado.'],
  ['A039', 'Beatriz', 'Clínica Vitalis', 'Cuido de vidas, lidero com propósito, prospero com gratidão.'],
  ['A046', 'Lucas', 'Engenharia LP', 'Construo com excelência, lidero com integridade.'],
  ['A058', 'Andréa', 'Consultoria Andra', 'Transformo conhecimento em resultados extraordinários.'],
  ['A067', 'Felipe', 'AgroTech Sertão', 'Da terra à mesa, inovação que alimenta o Brasil.'],
  ['A074', 'Camila', 'Café Cultura', 'Sirvo experiências, vendo memórias afetivas.'],
  ['A082', 'Rodrigo', 'RP Investimentos', 'Multiplico capital, multiplico oportunidades.'],
  ['A091', 'Juliana', 'Belezza Estética', 'Realço a beleza que já existe em cada pessoa.'],
  ['A105', 'Gabriel', 'Auto Center G&G', 'Excelência em mecânica, confiança em movimento.'],
  ['A118', 'Renata', 'Modabella Confecções', 'Visto histórias, vendo autoestima.'],
  ['A127', 'Tiago', 'TecnoBuild', 'Edifico futuros com tijolos de coragem.'],
  ['A139', 'Sandra', 'Padaria São José', 'Pão fresquinho todo dia, prosperidade todo mês.'],
  ['A148', 'Bruno', 'Auto Peças Brasil', 'Movo o país com peças de qualidade.'],
];

// ============================================================
// SYNC PAGE — três cards de sincronização
// ============================================================
function SyncPage({rows, updateRow, syncState, runSync, lastRun}){
  const t14ByCpf = React.useMemo(() => {
    const m = new Map();
    rows.forEach(r => { if (r.cpf) m.set(r.cpf, r); });
    return m;
  }, [rows]);

  // Quantos pendentes existem hoje em cada destino:
  const pendingOnboarding = PENDING_DOSSIE.filter(([id]) => {
    const r = rows.find(x => x.id === id);
    return r && r.typeform !== 'PREENCHIDO';
  }).length;

  const pendingFrases = PENDING_DOSSIE.filter(([id]) => {
    const r = rows.find(x => x.id === id);
    return r && !syncState.frases.has(id);
  }).length;

  const pendingCartas = PENDING_DOSSIE.filter(([id]) => {
    const r = rows.find(x => x.id === id);
    return r && !syncState.cartas.has(id);
  }).length;

  const Card = ({title, source, dest, fn, pending, action, lastIso, desc}) => (
    <div className="sync-card">
      <div className="sync-card-head">
        <div>
          <div className="sync-flow">
            <span>{source}</span>
            <Icon n="chevR" sz={11}/>
            <span>{dest}</span>
          </div>
          <div className="sync-title">{title}</div>
        </div>
        <span className={`badge ${pending>0?'warn':'ok'}`}>
          {pending>0 ? `${pending} pendentes` : 'em dia'}
        </span>
      </div>
      <div className="sync-desc">{desc}</div>
      <div className="sync-meta">
        <span><Icon n="sparkle" sz={10}/> Última sync: {lastIso ? lastIso : 'nunca'}</span>
        <span>·</span>
        <span>{fn}</span>
      </div>
      <div className="sync-actions">
        <button className="btn sm" onClick={action} disabled={pending===0}>
          <Icon n="check" sz={12}/> {pending>0?`Executar (${pending})`:'Sem pendentes'}
        </button>
        <button className="btn ghost sm">
          <Icon n="note" sz={12}/> Ver log
        </button>
      </div>
    </div>
  );

  return (
    <div style={{padding:'18px 24px'}} data-screen-label="Sincronizações">
      <div className="card" style={{padding:18,marginBottom:18,background:'linear-gradient(180deg,rgba(34,197,94,.06),rgba(34,197,94,0))'}}>
        <div style={{display:'flex',gap:14,alignItems:'flex-start'}}>
          <div style={{
            width:42,height:42,borderRadius:10,
            background:'rgba(34,197,94,.15)',color:'var(--green)',
            display:'grid',placeItems:'center',flexShrink:0
          }}>
            <Icon n="sparkle" sz={20}/>
          </div>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700}}>Fluxo automatizado Dossiê → T14</div>
            <div style={{fontSize:12,color:'var(--muted)',marginTop:4,maxWidth:680}}>
              Quando um aluno responde o Typeform, ele cai na aba <b>Dossiê - PCE - BRASIL</b>.
              Os 3 scripts abaixo distribuem a resposta para os destinos certos: marcam o aluno
              como Typeform <b>PREENCHIDO</b> com nome e empresa atualizados, e criam linhas
              de trabalho para a equipe nas abas Frases e Carta Profética.
            </div>
          </div>
        </div>
      </div>

      <div className="sync-grid">
        <Card
          title="Atualizar onboarding"
          source="Dossiê PCE Brasil"
          dest="Onboarding T14"
          fn="sincronizarDossieParaOnboardingT14()"
          pending={pendingOnboarding}
          lastIso={lastRun.onboarding}
          desc="Para cada CPF respondido, atualiza Typeform → PREENCHIDO, preenche Nome de preferência e Empresa."
          action={() => runSync('onboarding')}
        />
        <Card
          title="Criar frases pendentes"
          source="Dossiê PCE Brasil"
          dest="Frase do cliente T14"
          fn="sincronizarFrasesT14()"
          pending={pendingFrases}
          lastIso={lastRun.frases}
          desc="Cria linha 'Pendente' para cada nova frase do cliente. A cada 10 acumuladas, dispara e-mail para Vitor e Denise."
          action={() => runSync('frases')}
        />
        <Card
          title="Criar cartas proféticas"
          source="Dossiê PCE Brasil"
          dest="Carta Profética T14"
          fn="sincronizarCartaProfeticaT14()"
          pending={pendingCartas}
          lastIso={lastRun.cartas}
          desc="Gera tarefa de carta profética com responsável NÃO ATRIBUÍDO para cada novo respondente."
          action={() => runSync('cartas')}
        />
      </div>

      <div className="card" style={{marginTop:18}}>
        <div className="card-head">
          <div className="card-title">Histórico de execuções</div>
          <span style={{fontSize:11,color:'var(--muted)'}}>Últimas 8</span>
        </div>
        <table className="gestao" style={{width:'100%'}}>
          <thead>
            <tr>
              <th style={{width:160}}>Função</th>
              <th style={{width:160}}>Quando</th>
              <th style={{width:100}}>Atualizados</th>
              <th>Operador</th>
              <th style={{width:100}}>Status</th>
            </tr>
          </thead>
          <tbody>
            {syncState.history.slice(0,8).map((h,i) => (
              <tr key={i}>
                <td className="muted" style={{fontSize:11,fontFamily:'ui-monospace,monospace'}}>{h.fn}</td>
                <td className="muted" style={{fontSize:11}}>{h.when}</td>
                <td>{h.count}</td>
                <td className="muted" style={{fontSize:11}}>{h.op}</td>
                <td><span className={`badge ${h.status==='OK'?'ok':'bad'}`}>{h.status}</span></td>
              </tr>
            ))}
            {syncState.history.length === 0 && (
              <tr><td colSpan={5}>
                <div className="empty"><div className="empty-t">Sem execuções ainda</div></div>
              </td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================
// FRASES PAGE
// ============================================================
function FrasesPage({rows, syncState, updateFrase}){
  const data = React.useMemo(() => {
    return PENDING_DOSSIE.filter(([id]) => syncState.frases.has(id))
      .map(([id, nomePref, empresa, frase]) => {
        const r = rows.find(x => x.id === id) || {};
        const ext = syncState.frasesData[id] || {};
        return {
          id, nome: r.nome || nomePref, cpf: r.cpf, frase,
          status: ext.status || 'Pendente',
          obs: ext.obs || '',
        };
      });
  }, [syncState, rows]);

  const STATUSES = ['Pendente','Em criação','Aprovada','Publicada'];

  return (
    <div style={{padding:'18px 24px'}} data-screen-label="Frases">
      <div className="card" style={{padding:18,marginBottom:18}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <div style={{fontSize:18,fontWeight:700,fontFamily:'Barlow Condensed',letterSpacing:'.5px',textTransform:'uppercase'}}>
              Frase do cliente — T14
            </div>
            <div style={{fontSize:12,color:'var(--muted)',marginTop:4,maxWidth:680}}>
              Frases respondidas pelos alunos no Typeform. Cada linha vira material para a
              equipe de criação. A cada 10 acumuladas, automacao dispara email para os responsáveis.
            </div>
          </div>
          <div style={{display:'flex',gap:8}}>
            <span className="badge warn">
              {data.filter(r=>r.status==='Pendente').length} pendentes
            </span>
            <span className="badge ok">
              {data.filter(r=>r.status==='Publicada').length} publicadas
            </span>
          </div>
        </div>
      </div>

      <div className="tbl-wrap">
        <div className="tbl-scroll">
          <table className="gestao">
            <colgroup>
              <col style={{width:200}}/>
              <col style={{width:130}}/>
              <col style={{width:'auto',minWidth:340}}/>
              <col style={{width:140}}/>
              <col style={{width:240}}/>
            </colgroup>
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Frase do cliente</th>
                <th>Status</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={5}>
                  <div className="empty">
                    <div className="empty-i"><Icon n="inbox" sz={20}/></div>
                    <div className="empty-t">Nenhuma frase sincronizada ainda</div>
                    <div className="empty-s">Vá em Sincronizações e execute "Criar frases pendentes".</div>
                  </div>
                </td></tr>
              ) : data.map(r => (
                <tr key={r.id}>
                  <td className="nome">{r.nome}</td>
                  <td className="cpf">{r.cpf||'—'}</td>
                  <td style={{fontSize:12,whiteSpace:'normal',padding:'8px 12px',lineHeight:1.4}}>"{r.frase}"</td>
                  <td>
                    <select className="cell-select" value={r.status}
                      onChange={(e)=>updateFrase(r.id,{status:e.target.value})}>
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <input className="cell-input" type="text"
                      value={r.obs} placeholder="—"
                      onChange={(e)=>updateFrase(r.id,{obs:e.target.value})}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// CARTAS PROFÉTICAS PAGE
// ============================================================
function CartasPage({rows, syncState, updateCarta}){
  const data = React.useMemo(() => {
    return PENDING_DOSSIE.filter(([id]) => syncState.cartas.has(id))
      .map(([id]) => {
        const r = rows.find(x => x.id === id) || {};
        const ext = syncState.cartasData[id] || {};
        return {
          id, nome: r.nome, cpf: r.cpf, empresa: r.empresa,
          responsavel: ext.responsavel || 'NÃO ATRIBUÍDO',
          atividade: ext.atividade || 'Pendente',
          obs: ext.obs || '',
        };
      });
  }, [syncState, rows]);

  const RESP = ['NÃO ATRIBUÍDO','Vitor','Denise','Maria','Carla'];
  const ATIV = ['Pendente','Em escrita','Revisão','Concluída','Entregue'];

  const counts = data.reduce((acc,r) => {
    acc[r.atividade] = (acc[r.atividade]||0)+1;
    return acc;
  }, {});

  return (
    <div style={{padding:'18px 24px'}} data-screen-label="Cartas Proféticas">
      <div className="card" style={{padding:18,marginBottom:18}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <div style={{fontSize:18,fontWeight:700,fontFamily:'Barlow Condensed',letterSpacing:'.5px',textTransform:'uppercase'}}>
              Carta Profética — T14
            </div>
            <div style={{fontSize:12,color:'var(--muted)',marginTop:4,maxWidth:680}}>
              Tarefas de carta profética geradas pelo Dossiê. Cada respondente vira uma tarefa
              que precisa de responsável atribuído + execução.
            </div>
          </div>
          <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
            <span className="badge warn">{counts['Pendente']||0} pendentes</span>
            <span className="badge info">{counts['Em escrita']||0} em escrita</span>
            <span className="badge ok">{counts['Concluída']||0} concluídas</span>
          </div>
        </div>
      </div>

      <div className="tbl-wrap">
        <div className="tbl-scroll">
          <table className="gestao">
            <colgroup>
              <col style={{width:160}}/>
              <col style={{width:130}}/>
              <col style={{width:200}}/>
              <col style={{width:170}}/>
              <col style={{width:150}}/>
              <col style={{width:140}}/>
              <col style={{width:'auto',minWidth:200}}/>
            </colgroup>
            <thead>
              <tr>
                <th>Responsável</th>
                <th>Atividade</th>
                <th>Aluno</th>
                <th>Empresa</th>
                <th>CPF</th>
                <th>Origem</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {data.length === 0 ? (
                <tr><td colSpan={7}>
                  <div className="empty">
                    <div className="empty-i"><Icon n="inbox" sz={20}/></div>
                    <div className="empty-t">Nenhuma carta sincronizada ainda</div>
                    <div className="empty-s">Vá em Sincronizações e execute "Criar cartas proféticas".</div>
                  </div>
                </td></tr>
              ) : data.map(r => (
                <tr key={r.id}>
                  <td>
                    <select className="cell-select" value={r.responsavel}
                      onChange={(e)=>updateCarta(r.id,{responsavel:e.target.value})}>
                      {RESP.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td>
                    <select className="cell-select" value={r.atividade}
                      onChange={(e)=>updateCarta(r.id,{atividade:e.target.value})}>
                      {ATIV.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="nome">{r.nome}</td>
                  <td className="empresa">{r.empresa||'—'}</td>
                  <td className="cpf">{r.cpf||'—'}</td>
                  <td className="muted" style={{fontSize:11}}>Dossiê PCE</td>
                  <td>
                    <input className="cell-input" type="text"
                      value={r.obs} placeholder="—"
                      onChange={(e)=>updateCarta(r.id,{obs:e.target.value})}/>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PENDING_DOSSIE, SyncPage, FrasesPage, CartasPage });
