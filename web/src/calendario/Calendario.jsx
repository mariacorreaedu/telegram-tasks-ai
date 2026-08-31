import { useMemo, useState } from 'react';
import { SYNC, TIPOS, fmtHora, icone } from '../dados/constantes';

const DIAS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

// Chave local YYYY-MM-DD: comparar datas por string evita erro de fuso.
const chaveDia = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export default function Calendario({ entradas, aoAbrir }) {
  const [mes, setMes] = useState(() => {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  });

  const porDia = useMemo(() => {
    const mapa = {};
    for (const e of entradas) {
      if (!e.inicio) continue;
      (mapa[chaveDia(new Date(e.inicio))] ??= []).push(e);
    }
    return mapa;
  }, [entradas]);

  const celulas = useMemo(() => {
    const primeiro = new Date(mes.getFullYear(), mes.getMonth(), 1);
    const total = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
    const vazias = primeiro.getDay();
    return [
      ...Array.from({ length: vazias }, () => null),
      ...Array.from({ length: total }, (_, i) => new Date(mes.getFullYear(), mes.getMonth(), i + 1)),
    ];
  }, [mes]);

  const hoje = chaveDia(new Date());
  const mover = (n) => setMes(new Date(mes.getFullYear(), mes.getMonth() + n, 1));

  return (
    <section className="calendario">
      <header className="cal-topo">
        <button className="link" onClick={() => mover(-1)}>← anterior</button>
        <h2>{mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</h2>
        <button className="link" onClick={() => mover(1)}>próximo →</button>
      </header>

      <div className="cal-grade">
        {DIAS.map((d) => <div key={d} className="cal-cabecalho">{d}</div>)}

        {celulas.map((dia, i) => {
          if (!dia) return <div key={`v${i}`} className="cal-dia vazio" />;
          const chave = chaveDia(dia);
          const doDia = porDia[chave] ?? [];

          return (
            <div key={chave} className={`cal-dia${chave === hoje ? ' hoje' : ''}`}>
              <span className="cal-numero">{dia.getDate()}</span>
              {doDia.map((e) => (
                <button
                  key={e.id}
                  className={`cal-item${e.google_sync === 'enviado' ? ' na-agenda' : ''}`}
                  onClick={() => aoAbrir(e)}
                  title={SYNC[e.google_sync]?.rotulo ?? 'Só aqui'}
                >
                  {icone(TIPOS, e.tipo)} {fmtHora(e.inicio)} {e.titulo}
                </button>
              ))}
            </div>
          );
        })}
      </div>

      <p className="cal-legenda">
        <span className="ponto na-agenda" /> já está no Google Agenda ·
        <span className="ponto" /> só aqui
      </p>
    </section>
  );
}