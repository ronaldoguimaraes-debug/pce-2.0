// ====================================================================
// V2 — AÇÃO-FIRST
// O usuário é OPERACIONAL. A pergunta principal: "como está a saúde?"
// Estrutura: 1 health-score no topo + lista DOS 43 SEM RETORNO como herói.
// Cada linha tem ações inline (WhatsApp, Email, Marcar como contatado).
// ====================================================================
function V2AcaoFirst() {
  const [filter, setFilter] = React.useState('all');
  const [selected, setSelected] = React.useState(new Set());
  const list = PCE_DATA.semRetorno.filter(p =>
    filter === 'all' ? true : p.priority === filter
  );

  const toggle = (name) => {
    const s = new Set(selected);
    s.has(name) ? s.delete(name) : s.add(name);
    setSelected(s);
  };

  const PriorityChip = ({ p }) => {
    const cls = p === 'high' ? 'red' : p === 'med' ? 'amber' : 'blue';
    const lbl = p === 'high' ? 'URGENTE' : p === 'med' ? 'MÉDIA' : 'BAIXA';
    return <span className={'pce-chip ' + cls}><span className="d"></span>{lbl}</span>;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <PCETopbar turma="T14" />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <PCESidebar active="dashboard" />
        <main className="grow col" style={{ minWidth: 0 }}>
          <PCEPageHead active="T14" title="DASHBOARD" />
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>

            {/* HEALTH BAR — única visualização "alta" no topo */}
            <div className="pce-card" style={{ padding: 18 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: 'var(--green-soft)', border: '1px solid var(--green-line)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'JetBrains Mono, monospace', color: 'var(--green)', fontWeight: 800 }}>BR</div>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Saúde da T14 · Imersão Brasil</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>SAUDÁVEL <span style={{ fontSize: 14, color: 'var(--text-2)', fontWeight: 500 }}>· 9 dias para o início</span></div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
                  <button className="pce-btn ghost">⤓ Exportar lista</button>
                  <button className="pce-btn solid">📱 Disparo em massa</button>
                </div>
              </div>

              {/* Health bar segmentada */}
              <div style={{ display: 'flex', height: 36, borderRadius: 6, overflow: 'hidden', border: '1px solid var(--border)' }}>
                <Seg value={187} total={278} color="var(--green)" label="Onboarding feito" />
                <Seg value={14}  total={278} color="var(--blue)"  label="Confirmados sem onboarding" />
                <Seg value={34}  total={278} color="var(--amber)" label="Pendentes" />
                <Seg value={43}  total={278} color="var(--red)"   label="Sem retorno" />
              </div>

              <div style={{ display: 'flex', gap: 22, marginTop: 12, fontSize: 11, color: 'var(--text-2)', flexWrap: 'wrap' }}>
                <Legend dot="var(--green)" label="187 onboarding (67%)" />
                <Legend dot="var(--blue)"  label="14 confirmados aguardando" />
                <Legend dot="var(--amber)" label="34 pendentes" />
                <Legend dot="var(--red)"   label="43 sem retorno" highlight />
                <span style={{ marginLeft: 'auto', color: 'var(--text-3)' }}>Total da turma: <strong className="num" style={{ color: 'var(--text)' }}>278</strong></span>
              </div>
            </div>

            {/* HERÓI: lista dos 43 sem retorno */}
            <div className="pce-card" style={{ padding: 0 }}>
              <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', letterSpacing: '.1em', textTransform: 'uppercase' }}>Ação requerida</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    <span style={{ color: 'var(--red)' }}>43 sem retorno</span>
                    <span style={{ color: 'var(--text-3)', fontWeight: 500, fontSize: 13, marginLeft: 8 }}>· precisam de follow-up</span>
                  </div>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                  {['all','high','med','low'].map(f => (
                    <button key={f} className={'pce-tab' + (filter === f ? ' active' : '')} onClick={() => setFilter(f)}>
                      {f === 'all' ? `Todos · 43` : f === 'high' ? 'Urgente · 12' : f === 'med' ? 'Média · 18' : 'Baixa · 13'}
                    </button>
                  ))}
                </div>
              </div>

              {/* batch-action bar */}
              {selected.size > 0 && (
                <div style={{ padding: '10px 18px', background: 'var(--green-soft)', borderBottom: '1px solid var(--green-line)', display: 'flex', alignItems: 'center', gap: 12, fontSize: 12 }}>
                  <span className="num" style={{ color: 'var(--green)', fontWeight: 700 }}>{selected.size} selecionado{selected.size > 1 ? 's' : ''}</span>
                  <button className="pce-btn solid">📱 WhatsApp em massa</button>
                  <button className="pce-btn ghost">✉ Email</button>
                  <button className="pce-btn ghost">📞 Distribuir para SDRs</button>
                  <button className="pce-btn ghost" style={{ marginLeft: 'auto' }} onClick={() => setSelected(new Set())}>Limpar</button>
                </div>
              )}

              <table className="pce-table">
                <thead>
                  <tr>
                    <th style={{ width: 30 }}></th>
                    <th>Participante</th>
                    <th>Prioridade</th>
                    <th>Sem contato</th>
                    <th>Último toque</th>
                    <th>Tentativas</th>
                    <th style={{ textAlign: 'right' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((p) => (
                    <tr key={p.name}>
                      <td><input type="checkbox" checked={selected.has(p.name)} onChange={() => toggle(p.name)} /></td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span className="pce-avt">{p.name.split(' ').map(n=>n[0]).slice(0,2).join('')}</span>
                          <div>
                            <div className="name">{p.name}</div>
                            <div style={{ fontSize: 10, color: 'var(--text-3)' }}>{p.city} · {p.phone}</div>
                          </div>
                        </div>
                      </td>
                      <td><PriorityChip p={p.priority} /></td>
                      <td className="num" style={{ color: p.days >= 7 ? 'var(--red)' : p.days >= 4 ? 'var(--amber)' : 'var(--text-2)' }}>{p.days}d</td>
                      <td style={{ fontSize: 11 }}>{p.last}</td>
                      <td className="num">{p.tries}</td>
                      <td>
                        <div style={{ display: 'flex', gap: 4, justifyContent: 'flex-end' }}>
                          <IconBtn title="WhatsApp" color="var(--green)">📱</IconBtn>
                          <IconBtn title="Email" color="var(--blue)">✉</IconBtn>
                          <IconBtn title="Ligar" color="var(--text-2)">📞</IconBtn>
                          <IconBtn title="Mais" color="var(--text-2)">⋯</IconBtn>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div style={{ padding: '10px 18px', borderTop: '1px solid var(--border)', display: 'flex', alignItems: 'center', fontSize: 11, color: 'var(--text-3)' }}>
                Mostrando <strong className="num" style={{ color: 'var(--text-2)' }}>{list.length}</strong> de <strong className="num" style={{ color: 'var(--text-2)' }}>43</strong>
                <button className="pce-btn ghost" style={{ marginLeft: 'auto' }}>Ver todos →</button>
              </div>
            </div>

            {/* fila secundária — números resumo no rodapé, como contexto */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <MiniStat lbl="Total" value="278" />
              <MiniStat lbl="Confirmados" value="201" pct="72%" color="var(--green)" />
              <MiniStat lbl="Onboarding" value="187" pct="67%" color="var(--blue)" />
              <MiniStat lbl="Cancelamentos" value="2" pct="0,7%" color="var(--text-2)" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Seg({ value, total, color, label }) {
  const pct = total ? value / total * 100 : 0;
  return (
    <div style={{ flex: pct, background: color, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', minWidth: 0 }}
         title={`${label}: ${value} (${pct.toFixed(1)}%)`}>
      <span className="num" style={{ fontSize: 12, fontWeight: 700, color: '#001b0d', mixBlendMode: 'normal' }}>{value}</span>
    </div>
  );
}
function Legend({ dot, label, highlight }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: highlight ? 700 : 400, color: highlight ? 'var(--text)' : 'var(--text-2)' }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: dot }}></span>{label}
    </span>
  );
}
function IconBtn({ children, title, color }) {
  return (
    <button title={title} style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid var(--border)', background: 'var(--surface-2)', color: color || 'var(--text-2)', cursor: 'pointer', fontSize: 13, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </button>
  );
}
function MiniStat({ lbl, value, pct, color }) {
  return (
    <div className="pce-card" style={{ padding: '12px 14px' }}>
      <div className="lbl" style={{ marginBottom: 4 }}>{lbl}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span className="num" style={{ fontSize: 22, fontWeight: 700, color: color || 'var(--text)' }}>{value}</span>
        {pct && <span className="num" style={{ fontSize: 11, color: 'var(--text-3)' }}>{pct}</span>}
      </div>
    </div>
  );
}
window.V2AcaoFirst = V2AcaoFirst;
