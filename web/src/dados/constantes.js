// Os quatro eixos de exibição num lugar só: quadro, cards e calendário leem daqui.
export const COLUNAS = [
  { chave: 'fazer_hoje', rotulo: 'Fazer hoje', icone: '🔥' },
  { chave: 'com_prazo', rotulo: 'Com prazo', icone: '📅' },
  { chave: 'sem_prazo', rotulo: 'Sem prazo', icone: '📌' },
  { chave: 'fila_espera', rotulo: 'Fila de espera', icone: '💭' },
];

export const TIPOS = [
  { chave: 'tarefa', rotulo: 'Tarefa', icone: '📌' },
  { chave: 'evento', rotulo: 'Evento', icone: '📅' },
  { chave: 'nota', rotulo: 'Anotação', icone: '📝' },
  { chave: 'ideia', rotulo: 'Ideia', icone: '💡' },
];

export const PRIORIDADES = [
  { chave: 'urgente', rotulo: 'Urgente', cor: '#9E3B2E' },
  { chave: 'alta', rotulo: 'Alta', cor: '#B4682B' },
  { chave: 'media', rotulo: 'Média', cor: '#8A7B2E' },
  { chave: 'baixa', rotulo: 'Baixa', cor: '#4C6B8A' },
];

export const CATEGORIAS = [
  'trabalho', 'pessoal', 'estudos', 'saude', 'financeiro', 'casa', 'outros',
];

// Só nota e ideia têm restrição de coluna — é o CHECK entries_nota_na_fila.
export const SO_FILA = ['nota', 'ideia'];

export const SYNC = {
  nao_enviado: null,
  enviado: { rotulo: 'Na agenda', classe: 'sync-ok' },
  dessincronizado: { rotulo: 'Data mudou', classe: 'sync-alerta' },
  erro: { rotulo: 'Falhou', classe: 'sync-erro' },
};

export const icone = (lista, chave) =>
  lista.find((i) => i.chave === chave)?.icone ?? '';

export const rotulo = (lista, chave) =>
  lista.find((i) => i.chave === chave)?.rotulo ?? chave;

// O input datetime-local fala no fuso do navegador, que aqui é o de São Paulo.
export const paraInputLocal = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};

export const deInputLocal = (valor) => (valor ? new Date(valor).toISOString() : null);

export const fmtData = (iso) =>
  new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });

export const fmtHora = (iso) =>
  new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });