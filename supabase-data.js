// ============================================================
// PCE Onboarding — Camada de dados Supabase
// ============================================================
// Substitui o data-t14.js mock. Lê/escreve alunos no banco real,
// expõe Realtime para sincronização entre múltiplos usuários.
// ============================================================

(function () {
  if (!window.PCE || !window.PCE.supabase) {
    console.error('[PCE Data] supabase-client.js precisa carregar antes deste arquivo.');
    return;
  }

  const sb = window.PCE.supabase;

  // Mapeamento Supabase row → formato do app (igual ao data-t14.js mock)
  function rowToAluno(row) {
    return {
      id: row.id,
      turma: row.turma_id,
      tipo: row.tipo_matricula || '',
      registro: row.registratus || '',
      evento: row.evento || '',
      nome: row.nome || '',
      presenca: row.presenca || '',
      nomePref: row.nome_pref || '',
      empresa: row.empresa || '',
      cpf: row.cpf || '',
      telefone: row.telefone || '',
      email: row.email || '',
      onboarding: row.onboarding || 'NÃO INICIADO',
      whats: row.whats || 'NÃO',
      dataEntrada: row.data_entrada || '',
      typeform: row.typeform || 'NÃO PREENCHEU',
      contrato: row.contrato || '',
      grupoBR: row.grupo_br || 'NÃO',
      perfilComp: row.perfil_comp || '',
      perfil: row.perfil || '',
      consumidorVaga: row.consumidor_vaga || '',
      conjugeSocio: row.conjuge_socio || '',
      salesforce: row.salesforce || '',
      localVenda: row.local_venda || '',
      promocao: row.promocao || '',
    };
  }

  // Mapeamento app → colunas do banco (camelCase → snake_case)
  const FIELD_MAP = {
    tipo: 'tipo_matricula',
    registro: 'registratus',
    evento: 'evento',
    nome: 'nome',
    presenca: 'presenca',
    nomePref: 'nome_pref',
    empresa: 'empresa',
    cpf: 'cpf',
    telefone: 'telefone',
    email: 'email',
    onboarding: 'onboarding',
    whats: 'whats',
    dataEntrada: 'data_entrada',
    typeform: 'typeform',
    contrato: 'contrato',
    grupoBR: 'grupo_br',
    perfilComp: 'perfil_comp',
    perfil: 'perfil',
    consumidorVaga: 'consumidor_vaga',
    conjugeSocio: 'conjuge_socio',
    salesforce: 'salesforce',
    localVenda: 'local_venda',
    promocao: 'promocao',
  };

  async function loadAlunos(turmaId = 'T14') {
    const { data, error } = await sb
      .from('alunos')
      .select('*')
      .eq('turma_id', turmaId)
      .order('nome');
    if (error) {
      console.error('[PCE] Erro ao carregar alunos:', error);
      throw error;
    }
    return data.map(rowToAluno);
  }

  async function updateAluno(id, campo, valor) {
    const dbField = FIELD_MAP[campo];
    if (!dbField) {
      console.error('[PCE] Campo desconhecido:', campo);
      return { error: 'unknown_field' };
    }
    const valorFinal = (valor === '' || valor === undefined) ? null : valor;
    const { data, error } = await sb
      .from('alunos')
      .update({ [dbField]: valorFinal })
      .eq('id', id)
      .select()
      .single();
    if (error) {
      console.error('[PCE] Erro ao atualizar:', error);
      return { error };
    }
    return { data: rowToAluno(data) };
  }

  async function addAluno(turmaId, dados) {
    const row = { turma_id: turmaId };
    for (const [k, v] of Object.entries(dados)) {
      const dbField = FIELD_MAP[k];
      if (dbField) row[dbField] = v || null;
    }
    const { data, error } = await sb
      .from('alunos')
      .insert(row)
      .select()
      .single();
    if (error) {
      console.error('[PCE] Erro ao adicionar:', error);
      return { error };
    }
    return { data: rowToAluno(data) };
  }

  async function deleteAluno(id) {
    const { error } = await sb.from('alunos').delete().eq('id', id);
    return { error };
  }

  // Realtime: callback recebe (event, alunoNovo) onde event ∈ {INSERT, UPDATE, DELETE}
  function subscribeAlunos(turmaId, callback) {
    const channel = sb
      .channel(`alunos_${turmaId}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'alunos', filter: `turma_id=eq.${turmaId}` },
        (payload) => {
          const row = payload.new || payload.old;
          callback(payload.eventType, row ? rowToAluno(row) : null, payload.old?.id);
        }
      )
      .subscribe();
    return () => sb.removeChannel(channel);
  }

  // Sync functions (chamam as RPCs SQL)
  async function syncDossie(turmaId = 'T14') {
    const { data, error } = await sb.rpc('sync_dossie_para_alunos', { p_turma_id: turmaId });
    return { data, error };
  }

  async function syncFrases(turmaId = 'T14') {
    const { data, error } = await sb.rpc('sync_frases', { p_turma_id: turmaId });
    return { data, error };
  }

  async function syncCartas(turmaId = 'T14') {
    const { data, error } = await sb.rpc('sync_cartas', { p_turma_id: turmaId });
    return { data, error };
  }

  window.PCE.data = {
    loadAlunos,
    updateAluno,
    addAluno,
    deleteAluno,
    subscribeAlunos,
    syncDossie,
    syncFrases,
    syncCartas,
  };

  console.log('[PCE Data] Camada de dados Supabase pronta.');
})();
