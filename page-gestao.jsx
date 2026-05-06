// Gestão — dense editable table

const PRESENCA_OPTS = ['BR CONFIRMADO','BR + US CONFIRMAOD','PROXIMA TURMA','SEM RETORNO','CANCELAMENTO','NÃO CHAMAR','TROCA DE CONS.'];
const ONB_OPTS = ['REALIZADO','INICIADO','INICIADO - PENDENTE ACOMPANHATE','NÃO INICIADO'];
const TYPEFORM_OPTS = ['PREENCHIDO','NÃO PREENCHEU','ENVIADO',''];
const CONTRATO_OPTS = ['SIM','NÃO','Link enviado',''];
const YESNO = ['SIM','NÃO'];

function StatusCell({value, options, onChange, render}){
  const ref = React.useRef();
  const [open, setOpen] = React.useState(false);
  const r = render(value);
  return (
    <>
      <span ref={ref} className="edit-cell" onClick={(e) => { e.stopPropagation(); setOpen(o=>!o); }}>
        <span className={`badge ${r.cls}`}>{r.label}</span>
        <Icon n="chev" sz={11} sw={2}/>
      </span>
      {open && (
        <Popover anchorRef={ref} onClose={() => setOpen(false)}>
          {options.map(opt => {
            const rr = render(opt);
            const sel = opt === value;
            return (
              <div key={opt||'_empty'} className={`popover-item ${sel?'selected':''}`}
                onClick={() => { onChange(opt); setOpen(false); }}>
                <div className="chk">{sel && <Icon n="check" sz={10} sw={3}/>}</div>
                <span className={`badge ${rr.cls}`}>{rr.label || '—'}</span>
              </div>
            );
          })}
        </Popover>
      )}
    </>
  );
}

function CheckBox({on, onChange}){
  return (
    <span className={`checkbox ${on?'on':''}`} onClick={(e)=>{e.stopPropagation();onChange(!on);}}>
      <Icon n="check" sz={11} sw={3}/>
    </span>
  );
}

function FilterPill({label, count, on, onClick}){
  return (
    <button className={`filter-pill ${on?'on':''}`} onClick={onClick}>
      {label}
      {count !== undefined && <span className="count">{count}</span>}
    </button>
  );
}

const REGISTRO_OPTS = ['REGISTRADO','DUPLICADO','PENDENTE',''];

const COLUMNS = [
  { id: 'sel',         label: '',                 w: 36,  pin: 'pin-l',  sortable: false },
  { id: 'nome',        label: 'Nome',             w: 220, pin: 'pin-l2', sortable: true },
  { id: 'tipo',        label: 'Tipo matrícula',   w: 150 },
  { id: 'registro',    label: 'Registratus',      w: 120 },
  { id: 'evento',      label: 'Evento',           w: 130 },
  { id: 'presenca',    label: 'Presença',         w: 160, sortable: true },
  { id: 'nomePref',    label: 'Nome preferência', w: 150 },
  { id: 'empresa',     label: 'Empresa',          w: 170 },
  { id: 'cpf',         label: 'CPF',              w: 125, sortable: false },
  { id: 'telefone',    label: 'Telefone',         w: 130, sortable: false },
  { id: 'email',       label: 'E-mail',           w: 200, sortable: false },
  { id: 'onboarding',  label: 'Onboarding',       w: 150, sortable: true },
  { id: 'whats',       label: 'WhatsApp',         w: 90 },
  { id: 'dataEntrada', label: 'Data entrada',     w: 130 },
  { id: 'typeform',    label: 'Typeform',         w: 130 },
  { id: 'contrato',    label: 'Contrato',         w: 110 },
  { id: 'grupoBR',     label: 'Grupo WhatsApp BR',w: 90 },
  { id: 'perfilComp',  label: 'Perfil comport.',  w: 170 },
  { id: 'perfil',      label: 'Perfil',           w: 130 },
];

function GestaoPage({rows, updateRow, selected, setSelected, onOpenDrawer}){
  const [search, setSearch] = React.useState('');
  const [presFilter, setPresFilter] = React.useState(new Set());
  const [onbFilter, setOnbFilter] = React.useState(new Set());
  const [tipoFilter, setTipoFilter] = React.useState(new Set());
  const [alertOnly, setAlertOnly] = React.useState(false);
  const [sort, setSort] = React.useState({ col: null, dir: 'asc' });

  const presCounts = React.useMemo(() => {
    const c = {};
    rows.forEach(r => { c[r.presenca||'(vazio)'] = (c[r.presenca||'(vazio)']||0) + 1; });
    return c;
  }, [rows]);
  const onbCounts = React.useMemo(() => {
    const c = {};
    rows.forEach(r => { c[r.onboarding||'(vazio)'] = (c[r.onboarding||'(vazio)']||0) + 1; });
    return c;
  }, [rows]);

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase();
    let out = rows.filter(r => {
      if (q) {
        const hay = `${r.nome} ${r.empresa} ${r.cpf} ${r.email} ${r.telefone}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (presFilter.size && !presFilter.has(r.presenca)) return false;
      if (onbFilter.size && !onbFilter.has(r.onboarding)) return false;
      if (tipoFilter.size && !tipoFilter.has(r.tipo)) return false;
      if (alertOnly) {
        const alert = r.presenca === 'SEM RETORNO'
          || r.onboarding === 'NÃO INICIADO'
          || (r.onboarding && r.onboarding.includes('PENDENTE'))
          || r.contrato === 'NÃO'
          || r.typeform === 'NÃO PREENCHEU';
        if (!alert) return false;
      }
      return true;
    });
    if (sort.col) {
      const dir = sort.dir === 'asc' ? 1 : -1;
      out = [...out].sort((a, b) => {
        const av = (a[sort.col]||'').toLowerCase();
        const bv = (b[sort.col]||'').toLowerCase();
        if (av < bv) return -1*dir;
        if (av > bv) return 1*dir;
        return 0;
      });
    }
    return out;
  }, [rows, search, presFilter, onbFilter, tipoFilter, alertOnly, sort]);

  const toggleSel = (id) => {
    const s = new Set(selected);
    if (s.has(id)) s.delete(id); else s.add(id);
    setSelected(s);
  };
  const toggleAllSel = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(r => r.id)));
  };
  const toggleSet = (set, val, setter) => {
    const s = new Set(set);
    if (s.has(val)) s.delete(val); else s.add(val);
    setter(s);
  };
  const setSortBy = (col) => {
    if (sort.col === col) {
      setSort({col, dir: sort.dir === 'asc' ? 'desc' : 'asc'});
    } else {
      setSort({col, dir: 'asc'});
    }
  };

  const alertCount = rows.filter(r =>
    r.presenca === 'SEM RETORNO' || r.onboarding === 'NÃO INICIADO'
    || (r.onboarding && r.onboarding.includes('PENDENTE'))
    || r.contrato === 'NÃO' || r.typeform === 'NÃO PREENCHEU'
  ).length;

  return (
    <div style={{padding:'18px 24px'}} data-screen-label="Gestão">
      {/* Filter toolbar */}
      <div className="toolbar" style={{marginBottom:12}}>
        <div className="search">
          <Icon n="search"/>
          <input value={search} onChange={(e)=>setSearch(e.target.value)}
            placeholder="Buscar por nome, CPF, e-mail, empresa..."/>
          {search && (
            <button onClick={()=>setSearch('')} style={{color:'var(--muted)'}}>
              <Icon n="x" sz={14}/>
            </button>
          )}
        </div>
        <div className="toolbar-divider"/>
        <FilterPill label="Atenção" count={alertCount} on={alertOnly} onClick={()=>setAlertOnly(!alertOnly)}/>
        <FilterPill label="Confirmado" count={(presCounts['BR CONFIRMADO']||0)+(presCounts['BR + US CONFIRMAOD']||0)}
          on={presFilter.has('BR CONFIRMADO')||presFilter.has('BR + US CONFIRMAOD')}
          onClick={() => {
            const s = new Set(presFilter);
            const all = s.has('BR CONFIRMADO');
            if (all){ s.delete('BR CONFIRMADO'); s.delete('BR + US CONFIRMAOD'); }
            else { s.add('BR CONFIRMADO'); s.add('BR + US CONFIRMAOD'); }
            setPresFilter(s);
          }}/>
        <FilterPill label="Sem retorno" count={presCounts['SEM RETORNO']||0}
          on={presFilter.has('SEM RETORNO')}
          onClick={()=>toggleSet(presFilter,'SEM RETORNO',setPresFilter)}/>
        <FilterPill label="Próx. turma" count={presCounts['PROXIMA TURMA']||0}
          on={presFilter.has('PROXIMA TURMA')}
          onClick={()=>toggleSet(presFilter,'PROXIMA TURMA',setPresFilter)}/>
        <FilterPill label="Onb. realizado" count={onbCounts['REALIZADO']||0}
          on={onbFilter.has('REALIZADO')}
          onClick={()=>toggleSet(onbFilter,'REALIZADO',setOnbFilter)}/>
        <FilterPill label="Onb. pendente"
          count={(onbCounts['INICIADO - PENDENTE ACOMPANHATE']||0)+(onbCounts['NÃO INICIADO']||0)}
          on={onbFilter.has('NÃO INICIADO')||onbFilter.has('INICIADO - PENDENTE ACOMPANHATE')}
          onClick={() => {
            const s = new Set(onbFilter);
            const all = s.has('NÃO INICIADO');
            if (all){ s.delete('NÃO INICIADO'); s.delete('INICIADO - PENDENTE ACOMPANHATE'); }
            else { s.add('NÃO INICIADO'); s.add('INICIADO - PENDENTE ACOMPANHATE'); }
            setOnbFilter(s);
          }}/>
        <div style={{flex:1}}/>
        <span style={{fontSize:11,color:'var(--muted)'}}>
          {filtered.length} de {rows.length}
        </span>
        {(presFilter.size||onbFilter.size||tipoFilter.size||alertOnly||search) ? (
          <button className="btn ghost sm" onClick={()=>{
            setPresFilter(new Set()); setOnbFilter(new Set()); setTipoFilter(new Set());
            setAlertOnly(false); setSearch('');
          }}>
            <Icon n="x" sz={12}/> Limpar
          </button>
        ) : null}
      </div>

      {/* Table */}
      <div className="tbl-wrap">
        <div className="tbl-scroll">
          <table className="gestao">
            <colgroup>
              {COLUMNS.map(c => <col key={c.id} style={{width:c.w}}/>)}
            </colgroup>
            <thead>
              <tr>
                {COLUMNS.map(c => (
                  <th key={c.id} className={c.pin||''}
                    onClick={c.sortable!==false ? ()=>setSortBy(c.id) : undefined}>
                    {c.id === 'sel' ? (
                      <CheckBox on={selected.size>0 && selected.size === filtered.length}
                        onChange={toggleAllSel}/>
                    ) : (
                      <>
                        <span className={c.sortable!==false ? 'sortable':''}>{c.label}</span>
                        {sort.col === c.id && (
                          <Icon n={sort.dir==='asc'?'arrowU':'arrowD'} sz={10} sw={2.5}/>
                        )}
                      </>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={COLUMNS.length}>
                  <div className="empty">
                    <div className="empty-i"><Icon n="search" sz={20}/></div>
                    <div className="empty-t">Nenhum aluno encontrado</div>
                    <div className="empty-s">Tente ajustar os filtros ou a busca.</div>
                  </div>
                </td></tr>
              ) : filtered.map(r => {
                const isSel = selected.has(r.id);
                return (
                  <tr key={r.id} className={isSel?'selected':''} onClick={()=>onOpenDrawer(r)}>
                    <td className="pin-l" onClick={(e)=>e.stopPropagation()}>
                      <CheckBox on={isSel} onChange={()=>toggleSel(r.id)}/>
                    </td>
                    <td className="pin-l2 nome" title={r.nome}>{r.nome}</td>
                    <td className="muted" style={{fontSize:11}}>{r.tipo||'—'}</td>
                    <td className="muted" style={{fontSize:11}}>
                      <span className={`badge ${r.registro==='REGISTRADO'?'ok':r.registro==='DUPLICADO'?'warn':'muted'}`}>
                        {r.registro||'—'}
                      </span>
                    </td>
                    <td className="muted" style={{fontSize:11}}>{r.evento||'—'}</td>
                    <td onClick={(e)=>e.stopPropagation()}>
                      <StatusCell value={r.presenca} options={PRESENCA_OPTS}
                        render={presencaBadge}
                        onChange={(v)=>updateRow(r.id, {presenca:v})}/>
                    </td>
                    <td className="muted" style={{fontSize:11}} title={r.nomePref}>{r.nomePref||'—'}</td>
                    <td className="empresa" title={r.empresa}>{r.empresa||'—'}</td>
                    <td className="cpf">{r.cpf||'—'}</td>
                    <td className="muted">{r.telefone||'—'}</td>
                    <td className="muted" style={{fontSize:11}} title={r.email}>{r.email||'—'}</td>
                    <td onClick={(e)=>e.stopPropagation()}>
                      <StatusCell value={r.onboarding} options={ONB_OPTS}
                        render={onbBadge}
                        onChange={(v)=>updateRow(r.id, {onboarding:v})}/>
                    </td>
                    <td onClick={(e)=>e.stopPropagation()}>
                      <CheckBox on={r.whats === 'SIM'}
                        onChange={(v)=>updateRow(r.id, {whats: v?'SIM':'NÃO'})}/>
                    </td>
                    <td className="muted" style={{fontSize:11}}>{r.dataEntrada||'—'}</td>
                    <td onClick={(e)=>e.stopPropagation()}>
                      <StatusCell value={r.typeform} options={TYPEFORM_OPTS}
                        render={yesNo}
                        onChange={(v)=>updateRow(r.id, {typeform:v})}/>
                    </td>
                    <td onClick={(e)=>e.stopPropagation()}>
                      <StatusCell value={r.contrato} options={CONTRATO_OPTS}
                        render={yesNo}
                        onChange={(v)=>updateRow(r.id, {contrato:v})}/>
                    </td>
                    <td onClick={(e)=>e.stopPropagation()}>
                      <CheckBox on={r.grupoBR === 'SIM'}
                        onChange={(v)=>updateRow(r.id, {grupoBR: v?'SIM':'NÃO'})}/>
                    </td>
                    <td className="muted" style={{fontSize:11}} title={r.perfilComp}>{r.perfilComp||'—'}</td>
                    <td className="muted" style={{fontSize:11}}>{r.perfil||'—'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="bulk-bar">
          <span className="bulk-count">{selected.size}</span>
          <span style={{color:'var(--cream)'}}>selecionados</span>
          <div style={{flex:1}}/>
          <button className="btn sm">
            <Icon n="check" sz={12}/> Marcar onb. realizado
          </button>
          <button className="btn ghost sm">
            <Icon n="msg" sz={12}/> Adicionar ao WhatsApp
          </button>
          <button className="btn ghost sm">
            <Icon n="download" sz={12}/> Exportar selecionados
          </button>
          <button className="btn danger sm" onClick={()=>setSelected(new Set())}>
            <Icon n="x" sz={12}/> Limpar
          </button>
        </div>
      )}
    </div>
  );
}

Object.assign(window, { GestaoPage });
