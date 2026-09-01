import {
  Calendar,
  CalendarClock,
  FileText,
  Inbox,
  Lightbulb,
  Mail,
  SquareCheck,
  Zap,
} from 'lucide-react';

// Fonte unica de dominio do front. Os valores das chaves espelham
// exatamente os ENUMs do Postgres (migration 004) — se divergir, o insert falha.

export const COLUNAS = [
  { chave: 'com_prazo', rotulo: 'Com prazo', Icone: CalendarClock, cor: '#3b82f6' },
  { chave: 'sem_prazo', rotulo: 'Sem prazo', Icone: Inbox, cor: '#64748b' },
  { chave: 'fazer_hoje', rotulo: 'Fazer hoje', Icone: Zap, cor: '#f43f5e' },
  { chave: 'fila_espera', rotulo: 'Fila de espera', Icone: Mail, cor: '#f59e0b' },
];

export const TIPOS = [
  { chave: 'tarefa', rotulo: 'Tarefa', Icone: SquareCheck },
  { chave: 'evento', rotulo: 'Evento', Icone: Calendar },
  { chave: 'nota', rotulo: 'Anotação', Icone: FileText },
  { chave: 'ideia', rotulo: 'Ideia', Icone: Lightbulb },
];

export const PRIORIDADES = [
  { chave: 'baixa', rotulo: 'Baixa', cor: '#22c55e' },
  { chave: 'media', rotulo: 'Média', cor: '#eab308' },
  { chave: 'alta', rotulo: 'Alta', cor: '#f97316' },
  { chave: 'urgente', rotulo: 'Urgente', cor: '#ef4444' },
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
// no front, esses tipos saem da coluna Fila de espera do quadro e vao para o menu Notas
export const SO_FILA = ['nota', 'ideia'];

// cor do chip de categoria no card (fundo + texto)
export const CATEGORIA_CORES = {
  trabalho: { bg: '#dbeafe', cor: '#1d4ed8' },
  pessoal: { bg: '#ede9fe', cor: '#7c3aed' },
  estudo: { bg: '#fef3c7', cor: '#b45309' },
  saude: { bg: '#d1fae5', cor: '#047857' },
  financeiro: { bg: '#fee2e2', cor: '#b91c1c' },
  casa: { bg: '#ffe4e6', cor: '#be123c' },
  outros: { bg: '#e5e7eb', cor: '#374151' },
};

// estados de sincronizacao com o Google (ENUM google_sync_status)
export const SYNC = {
  enviado: { rotulo: 'no Google', classe: 'selo-ok' },
  dessincronizado: { rotulo: 'dessincronizado', classe: 'selo-alerta' },
  erro: { rotulo: 'falhou', classe: 'selo-erro' },
  // 'nao_enviado' fica sem selo de proposito: e o estado normal
};

// devolve o componente de icone de uma lista de dominio a partir da chave
export const icone = (lista, chave) =>
  lista.find((i) => i.chave === chave)?.Icone ?? Calendar;

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
