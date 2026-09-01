// Fonte unica de dominio do front. Os valores das chaves espelham
// exatamente os ENUMs do Postgres (migration 004) — se divergir, o insert falha.

export const COLUNAS = [
  { chave: 'com_prazo', rotulo: 'Com prazo', icone: '📅' },
  { chave: 'sem_prazo', rotulo: 'Sem prazo', icone: '📥' },
  { chave: 'fazer_hoje', rotulo: 'Fazer hoje', icone: '🔥' },
  { chave: 'fila_espera', rotulo: 'Fila de espera', icone: '💡' },
];

export const TIPOS = [
  { chave: 'tarefa', rotulo: 'Tarefa', icone: '✅' },
  { chave: 'evento', rotulo: 'Evento', icone: '📆' },
  { chave: 'nota', rotulo: 'Anotação', icone: '📝' },
  { chave: 'ideia', rotulo: 'Ideia', icone: '💡' },
];

export const PRIORIDADES = [
  { chave: 'baixa', rotulo: 'Baixa', icone: '🟢', cor: '#22c55e' },
  { chave: 'media', rotulo: 'Média', icone: '🟡', cor: '#eab308' },
  { chave: 'alta', rotulo: 'Alta', icone: '🟠', cor: '#f97316' },
  { chave: 'urgente', rotulo: 'Urgente', icone: '🔴', cor: '#ef4444' },
];

export const CATEGORIAS = [
  'trabalho',
  'pessoal',
  'estudo',
  'saude',
  'financeiro',
  'casa',
  'outros',
];

// tipos que so podem viver na fila de espera (CHECK entries_nota_na_fila)
export const SO_FILA = ['nota', 'ideia'];

// estados de sincronizacao com o Google (ENUM google_sync_status)
export const SYNC = {
  sincronizado: { rotulo: 'no Google', classe: 'selo-ok' },
  dessincronizado: { rotulo: 'dessincronizado', classe: 'selo-erro' },
  // 'nao_enviado' fica sem selo de proposito: e o estado normal
};

// devolve o icone de uma lista de dominio a partir da chave
export const icone = (lista, chave) =>
  lista.find((i) => i.chave === chave)?.icone ?? '•';

// devolve o rotulo de uma lista de dominio a partir da chave
export const rotulo = (lista, chave) =>
  lista.find((i) => i.chave === chave)?.rotulo ?? chave;

// ---- datas ----------------------------------------------------------------

// ISO do banco -> valor aceito por <input type="datetime-local">
export const paraInputLocal = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

// valor do <input type="datetime-local"> -> ISO com offset local
export const deInputLocal = (valor) => (valor ? new Date(valor).toISOString() : null);

export const fmtData = (iso) =>
  iso
    ? new Date(iso).toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';

export const fmtHora = (iso) =>
  iso
    ? new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    : '';

// ---- Google Agenda --------------------------------------------------------

export const AGENDA_GOOGLE = 'https://calendar.google.com/calendar/r';

// monta o link de criacao rapida de evento; null quando a entrada nao tem data
export const linkGoogleAgenda = (e) => {
  if (!e?.inicio) return null;
  const compacto = (iso) => new Date(iso).toISOString().replace(/[-:]|\.\d{3}/g, '');
  const fim = e.fim ?? new Date(new Date(e.inicio).getTime() + 3600000).toISOString();
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: e.titulo ?? '',
    dates: `${compacto(e.inicio)}/${compacto(fim)}`,
    details: e.conteudo ?? '',
  });
  return `https://calendar.google.com/calendar/render?${p}`;
};
