import { useState } from 'react';
import { Clock, Plus, StickyNote } from 'lucide-react';
import { CATEGORIA_CORES, TIPOS, fmtData, icone } from '../dados/constantes';
import ModalNovaNota from './ModalNovaNota';

const COR_NOTAS = '#7c3aed';

export default function Notas({ entradas, aoAbrir, criar }) {
  const [criando, setCriando] = useState(false);

  return (
    <section className="notas">
      <header className="notas-topo">
        <span className="icone-badge" style={{ backgroundColor: `${COR_NOTAS}22`, color: COR_NOTAS }}>
          <StickyNote size={14} strokeWidth={2.25} aria-hidden="true" />
        </span>
        Notas
        <span className="coluna-contador">{entradas.length}</span>
      </header>

      <div className="notas-grade">
        <button type="button" className="card-nova-nota" onClick={() => setCriando(true)}>
          <Plus size={22} strokeWidth={3} aria-hidden="true" />
          Nova anotação
        </button>

        {entradas.map((e) => {
          const chip = CATEGORIA_CORES[e.categoria] ?? CATEGORIA_CORES.outros;
          const Icone = icone(TIPOS, e.tipo);
          return (
            <button
              key={e.id}
              type="button"
              className="card-entrada card-nota"
              onClick={() => aoAbrir(e)}
            >
              <span className="chip" style={{ backgroundColor: chip.bg, color: chip.cor }}>
                <Icone size={12} strokeWidth={2.25} aria-hidden="true" />
                {e.categoria ?? 'sem categoria'}
              </span>
              <h4 className="card-titulo">{e.titulo}</h4>
              {e.conteudo && <p className="card-conteudo">{e.conteudo}</p>}
              {e.inicio && (
                <div className="card-meta">
                  <span className="meta-data">
                    <Clock size={12} aria-hidden="true" /> {fmtData(e.inicio)}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {criando && <ModalNovaNota aoCriar={criar} aoFechar={() => setCriando(false)} />}
    </section>
  );
}
