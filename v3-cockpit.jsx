// ====================================================================
// V3 — COCKPIT
// Densidade alta. Mostra T14 + T15 + T16 lado a lado SEMPRE.
// Inspirado em terminais financeiros / Linear / Notion.
// Sem decoração, tudo é informação. Layout 2-coluna.
// ====================================================================
function V3Cockpit() {
  const turmas = [PCE_DATA.turmas.T14, PCE_DATA.turmas.T15, PCE_DATA.turmas.T16];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <PCETopbar turma="T14" />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <PCESidebar active="dashboard" />
        <main className="grow col" style={{ minWidth: 0 }}>
          <PCEPageHead active="GERAL" title="COCKPIT" />
          <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 12, overflow: 'auto' }}>

            {/* Linha de turmas — comparação direta */}
            <div className="pce-card" style={{ padding: 0 }}>
              <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="pce-card-title" style={{ margin: 0 }}>Turmas em andamento</div>
                <span className="pce-chip green" style={{ marginLeft: 'auto' }}><span className="d"></span>T14 ativa</span>
                <span className="pce-chip blue"><span className="d"></span>T15 captação</span>
                <span className="pce-chip"><span className="d"></span>T16 planejamento</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)' }}>
                {turmas.map((t, i) => (
                  <TurmaCol key={t.code} t={t} active={i === 0} />
                ))}
              </div>
            </div>

            {/* duas colunas: funil + tabela compacta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.3fr 1fr', gap: 12 }}>

              {/* Funil comparativo */}
              <div className="pce-card">
                <div className="pce-card-title">Funil — T14 (focada)</div>
                <FunnelBar stages={[
                  { label: 'Total', value: 278, color: 'var(--green-2)' },
                  { label: 'WhatsApp', value: 272, color: 'var(--green-2)' },
                  { label: 'Typeform', value: 197, color: 'var(--green-2)' },
                  { label: 'Confirmados', value: 201, color: 'var(--green)' },
                  { label: 'Onboarding', value: 187, color: 'var(--blue)' },
                  { label: 'Contrato', value: 0, color: 'var(--amber)' },
                ]} />
                <div style={{ marginTop: 14, paddingTop: 12, borderTop: '1px dashed var(--border)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                  <Drop label="WhatsApp → Typeform" value="−27%" warn />
                  <Drop label="Confirmados → Onboarding" value="−7%" />
                  <Drop label="Onboarding → Contrato" value="−100%" warn />
                </div>
              </div>

              {/* Top 10 sem retorno — compacto */}
              <div className="pce-card" style={{ padding: 0 }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center' }}>
                  <div className="pce-card-title" style={{ margin: 0 }}>Top 10 sem retorno · T14</div>
                  <button className="pce-btn ghost" style={{ marginLeft: 'auto' }}>Ver 43 →</button>
                </div>
                <table className="pce-table" style={{ fontSize: 11 }}>
                  <thead>
                    <tr>
                      <th>Participante</th>
                      <th style={{ textAlign: 'right' }}>Dias</th>
                      <th style={{ textAlign: 'right' }}>Tent.</th>
                      <th style={{ width: 80 }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {PCE_DATA.semRetorno.map(p => (
                      <tr key={p.name}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span style={{ width: 4, height: 28, borderRadius: 2, background: p.priority === 'high' ? 'var(--red)' : p.priority === 'med' ? 'var(--amber)' : 'var(--blue)' }}></span>
                            <div>
                              <div className="name" style={{ fontSize: 11.5 }}>{p.name}</div>
                              <div style={{ fontSize: 9.5, color: 'var(--text-3)' }}>{p.city}</div>
                            </div>
                          </div>
                        </td>
                        <td className="num" style={{ textAlign: 'right', color: p.days >= 7 ? 'var(--red)' : 'var(--text-2)' }}>{p.days}</td>
                        <td className="num" style={{ textAlign: 'right' }}>{p.tries}</td>
                        <td style={{ textAlign: 'right' }}>
                          <button style={{ padding: '3px 7px', fontSize: 10, borderRadius: 4, border: '1px solid var(--green-line)', background: 'var(--green-soft)', color: 'var(--green)', cursor: 'pointer' }}>📱 contatar</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* tendência semanal — full width, denso */}
            <div className="pce-card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
                <div className="pce-card-title" style={{ margin: 0 }}>Tendência · últimas 7 semanas</div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: 14, fontSize: 10, color: 'var(--text-3)' }}>
                  <Legend dot="var(--green)" label="Confirmados" />
                  <Legend dot="var(--blue)" label="Onboarding" />
                  <Legend dot="var(--red)" label="Sem retorno" />
                </div>
              </div>
              <BigSpark />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function TurmaCol({ t, active }) {
  const pct = (a, b) => b ? Math.round(a/b*100) : 0;
  return (
    <div style={{ borderRight: '1px solid var(--border)', padding: 16, opacity: active ? 1 : 0.78, position: 'relative' }}>
      {active && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 2, background: 'var(--green)' }}></div>}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 2 }}>
        <span className="num" style={{ fontSize: 9, color: 'var(--text-3)' }}>{t.flag}</span>
        <span style={{ fontSize: 18, fontWeight: 800, fontFamily: 'JetBrains Mono, monospace', color: active ? 'var(--green)' : 'var(--text)' }}>{t.code}</span>
        <span style={{ fontSize: 11, color: 'var(--text-3)', marginLeft: 'auto', letterSpacing: '.1em' }}>{t.month}</span>
      </div>
      <div style={{ fontSize: 10.5, color: 'var(--text-3)', marginBottom: 14 }}>{t.label} · Programa de Crescimento Empresarial</div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <Stat label="Total" value={t.total} color="var(--text)" />
        <Stat label="Confirm." value={t.confirmados} sub={pct(t.confirmados, t.total) + '%'} color="var(--green)" />
        <Stat label="Sem ret." value={t.semRetorno} sub={pct(t.semRetorno, t.total) + '%'} color={t.semRetorno ? 'var(--red)' : 'var(--text-3)'} />
        <Stat label="Onboard." value={t.onboarding} sub={pct(t.onboarding, t.total) + '%'} color="var(--blue)" />
        <Stat label="Próx." value={t.proxTurma} color="var(--amber)" />
        <Stat label="Cancel." value={t.cancelamentos} color="var(--text-2)" />
      </div>

      {/* progress bar do funil */}
      <div style={{ marginTop: 14 }}>
        <div style={{ fontSize: 9.5, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 6 }}>Conversão</div>
        <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', background: 'var(--surface-2)' }}>
          <div style={{ flex: t.confirmados, background: 'var(--green)' }}></div>
          <div style={{ flex: t.onboarding, background: 'var(--blue)' }}></div>
          <div style={{ flex: t.semRetorno, background: 'var(--red)' }}></div>
          <div style={{ flex: Math.max(t.total - t.confirmados - t.semRetorno, 0), background: 'transparent' }}></div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, sub, color }) {
  return (
    <div>
      <div style={{ fontSize: 9, letterSpacing: '.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 2 }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 5 }}>
        <span className="num" style={{ fontSize: 18, fontWeight: 700, color: color || 'var(--text)' }}>{value}</span>
        {sub && <span className="num" style={{ fontSize: 10, color: 'var(--text-3)' }}>{sub}</span>}
      </div>
    </div>
  );
}

function Drop({ label, value, warn }) {
  return (
    <div>
      <div style={{ fontSize: 10, color: 'var(--text-3)', marginBottom: 3 }}>{label}</div>
      <div className="num" style={{ fontSize: 16, fontWeight: 700, color: warn ? 'var(--red)' : 'var(--amber)' }}>{value}</div>
    </div>
  );
}

function BigSpark() {
  // 3 linhas overlaid
  const W = 800, H = 120;
  const conf = [142, 168, 175, 190, 195, 198, 201];
  const onb  = [88, 110, 135, 152, 168, 180, 187];
  const sem  = [12, 18, 25, 30, 36, 40, 43];
  const max = Math.max(...conf, ...onb, ...sem);
  const path = (vals) => {
    const step = W / (vals.length - 1);
    return vals.map((v, i) => (i === 0 ? 'M' : 'L') + (i*step).toFixed(1) + ',' + (H - (v/max)*H*0.9 - 6).toFixed(1)).join(' ');
  };
  const labels = ['s−6', 's−5', 's−4', 's−3', 's−2', 's−1', 'agora'];
  return (
    <div style={{ position: 'relative' }}>
      <svg viewBox={`0 0 ${W} ${H+18}`} preserveAspectRatio="none" style={{ width: '100%', height: 140, display: 'block' }}>
        {[0, 0.25, 0.5, 0.75, 1].map((y, i) => (
          <line key={i} x1="0" x2={W} y1={H*y + 3} y2={H*y + 3} stroke="rgba(255,255,255,0.04)" />
        ))}
        <path d={path(conf)} fill="none" stroke="var(--green)" strokeWidth="1.8" />
        <path d={path(onb)}  fill="none" stroke="var(--blue)"  strokeWidth="1.8" />
        <path d={path(sem)}  fill="none" stroke="var(--red)"   strokeWidth="1.8" />
        {labels.map((l, i) => (
          <text key={i} x={(i * W / (labels.length - 1))} y={H + 14} fill="var(--text-3)" fontSize="9" textAnchor={i === 0 ? 'start' : i === labels.length-1 ? 'end' : 'middle'} fontFamily="JetBrains Mono, monospace">{l}</text>
        ))}
      </svg>
    </div>
  );
}

window.V3Cockpit = V3Cockpit;
