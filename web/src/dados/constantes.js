// Página do Google Calendar já preenchida. Não cria evento pela API — quem
// confirma é a usuária, na tela do Google. Vira chamada real na Fase 11.
export const linkGoogleAgenda = (e) => {
  if (!e.inicio) return null;

  // O Google espera UTC compacto: 20260904T203800Z
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

export const AGENDA_GOOGLE = 'https://calendar.google.com/calendar/r';