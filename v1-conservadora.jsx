// ====================================================================
// V1 — CONSERVADORA
// Reorganização limpa do dashboard atual.
// Remove redundância. Mantém visual quase idêntico.
// Hero: KPIs + Funil + Tendência. Bloco "Imersão" vira contexto compacto.
// ====================================================================
function V1Conservadora() {
  const t = PCE_DATA.turmas.T14;
  // tendência fictícia (vs últimas turmas)
  const sparks = {
    confirmados: [142, 168, 175, 190, 195, 198, 201],
    onboarding:  [88, 110, 135, 152, 168, 180, 187],
    semRetorno:  [12, 18, 25, 30, 36, 40, 43],
  };

  const KPICard = ({ lbl, value, sub, color, trend, spark, sparkColor }) => (
    <div className="pce-card" style={{ display: 'flex', flexDirection: 'column', gap: 10, minHeight: 130 }}>
      <div className="lbl" style={{ marginBottom: 0 }}>{lbl}</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 8 }}>
        <div className="num" style={{ fontSize: 38, fontWeight: 700, color, lineHeight: 1 }}>{value}</div>
        {spark && <Sparkline values={spark} color={sparkColor || color} width={80} height={26} />}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11, color: 'var(--text-3)' }}>
        <span>{sub}</span>
        {trend && <span style={{ marginLeft: 'auto' }} className={'trend ' + trend.dir}>
          {trend.dir === 'up' ? '↑' : trend.dir === 'down' ? '↓' : '·'} {trend.value}
        </span>}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg)' }}>
      <PCETopbar turma="T14" />
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <PCESidebar active="dashboard" />
        <main className="grow col" style={{ minWidth: 0 }}>
          <PCEPageHead active="T14" title="DASHBOARD" />
          <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflow: 'auto' }}>

            {/* contexto da turma — compacto, 1 linha */}
            <div className="pce-card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--green-soft)', border: '1px solid var(--green-line)', color: 'var(--green)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 11, fontFamily: 'JetBrains Mono, monospace' }}>BR</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700 }}>T14 — Imersão Brasil</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Programa de Crescimento Empresarial · Maio 2026</div>
              </div>
              <div style={{ marginLeft: 'auto', display: 'flex', gap: 24, fontSize: 11, color: 'var(--text-3)' }}>
                <div><span style={{ display: 'block', fontSize: 9, letterSpacing: '.1em' }}>INÍCIO</span><span className="num" style={{ color: 'var(--text), fontSize: 12' }}>15/05/2026</span></div>
                <div><span style={{ display: 'block', fontSize: 9, letterSpacing: '.1em' }}>DURAÇÃO</span><span className="num" style={{ color: 'var(--text)' }}>3 dias</span></div>
                <div><span style={{ display: 'block', fontSize: 9, letterSpacing: '.1em' }}>RESPONSÁVEL</span><span style={{ color: 'var(--text)' }}>R. Guimarães</span></div>
              </div>
            </div>

            {/* KPIs — 4 cartões com sparkline e tendência */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              <KPICard lbl="Total da Turma" value={278} sub="participantes registrados" color="var(--green)"
                trend={{ dir: 'up', value: '+8% vs T13' }} spark={[230,245,250,260,268,272,278]} />
              <KPICard lbl="Confirmados" value={201} sub="72% da turma" color="var(--green)"
                trend={{ dir: 'up', value: '+4% vs T13' }} spark={sparks.confirmados} />
              <KPICard lbl="Onboarding feito" value={187} sub="67% realizado" color="var(--blue)"
                trend={{ dir: 'up', value: '+12% vs T13' }} spark={sparks.onboarding} sparkColor="var(--blue)" />
              <KPICard lbl="Sem retorno" value={43} sub="15% do total · ação requerida" color="var(--red)"
                trend={{ dir: 'down', value: 'pior que T13' }} spark={sparks.semRetorno} sparkColor="var(--red)" />
            </div>

            {/* Funil + meta */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 12 }}>
              <div className="pce-card">
                <div className="pce-card-title">Funil de conversão · T14</div>
                <FunnelBar stages={[
                  { label: 'Total da turma', value: 278, color: 'var(--green-2)' },
                  { label: 'WhatsApp', value: 272, color: 'var(--green-2)' },
                  { label: 'Typeform', value: 197, color: 'var(--green-2)' },
                  { label: 'Confirmados', value: 201, color: 'var(--green)' },
                  { label: 'Onboarding', value: 187, color: 'var(--blue)' },
                  { label: 'Contrato assinado', value: 0, color: 'var(--amber)' },
                ]} />
              </div>
              <div className="pce-card">
                <div className="pce-card-title">Meta de confirmação</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                  <Donut value={201} total={280} size={110} color="var(--green)" label="META 280" />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-3)' }}>Confirmados / meta</div>
                    <div className="num" style={{ fontSize: 22, fontWeight: 700 }}>201 <span style={{ color: 'var(--text-3)', fontSize: 14 }}>/ 280</span></div>
                    <div style={{ fontSize: 11, color: 'var(--text-2)' }}>Faltam <strong style={{ color: 'var(--green)' }}>79 confirmações</strong> em 9 dias</div>
                    <div style={{ marginTop: 6 }}><span className="pce-chip green"><span className="d"></span>NO PRAZO</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Presença & Onboarding (mantido, mas refinado) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="pce-card">
                <div className="pce-card-title">Presença na turma</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Donut value={272} total={278} size={88} color="var(--green)" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                    <Row dot="var(--green)" label="WhatsApp ativo" value="272 (98%)" />
                    <Row dot="var(--blue)"  label="Typeform preenchido" value="197 (71%)" />
                    <Row dot="var(--amber)" label="Pendente" value="6 (2%)" />
                  </div>
                </div>
              </div>
              <div className="pce-card">
                <div className="pce-card-title">Onboarding</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <Donut value={187} total={278} size={88} color="var(--blue)" />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 12 }}>
                    <Row dot="var(--blue)"  label="Realizado" value="187 (67%)" />
                    <Row dot="var(--amber)" label="Em andamento" value="14 (5%)" />
                    <Row dot="var(--red)"   label="Não iniciado" value="77 (28%)" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Row({ dot, label, value }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: dot }}></span>
      <span style={{ color: 'var(--text-2)' }}>{label}</span>
      <span className="num" style={{ marginLeft: 'auto', color: 'var(--text)' }}>{value}</span>
    </div>
  );
}

window.V1Conservadora = V1Conservadora;
