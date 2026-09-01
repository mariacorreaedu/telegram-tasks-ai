import { useDraggable } from '@dnd-kit/core';
import { CalendarCheck, CalendarPlus, Clock, Ellipsis } from 'lucide-react';
import { CATEGORIA_CORES, SYNC, TIPOS, fmtData, icone } from '../dados/constantes';

export default function Card({ entrada, aoAbrir, aoAgendar }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: entrada.id,
    data: { coluna: entrada.coluna },
  });

  const Icone = icone(TIPOS, entrada.tipo);
  const chip = CATEGORIA_CORES[entrada.categoria] ?? CATEGORIA_CORES.outros;
  const sincronizado = entrada.google_sync === 'enviado';
  const semArrastar = (e) => e.stopPropagation();

  const abrirAgenda = (e) => {
    e.stopPropagation();
    aoAgendar(entrada);
  };

  return (
    <article
      ref={setNodeRef}
      className={`card-entrada ${isDragging ? 'arrastando' : ''}`}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
      {...listeners}
      {...attributes}
    >
      <div className="card-header">
        <span className="chip" style={{ backgroundColor: chip.bg, color: chip.cor }}>
          <Icone size={12} strokeWidth={2.25} aria-hidden="true" />
          {entrada.categoria ?? 'sem categoria'}
        </span>
        <button
          type="button"
          className="btn btn-ghost btn-sm btn-icone"
          onPointerDown={semArrastar}
          onClick={() => aoAbrir(entrada)}
          title="Abrir"
        >
          <Ellipsis size={16} aria-hidden="true" />
        </button>
      </div>

      <h4 className="card-titulo">{entrada.titulo}</h4>

      {entrada.inicio && (
        <div className="card-meta">
          <span className="meta-data">
            <Clock size={12} aria-hidden="true" /> {fmtData(entrada.inicio)}
          </span>
        </div>
      )}

      {entrada.inicio &&
        (sincronizado ? (
          <span className={`selo ${SYNC.enviado.classe}`}>
            <CalendarCheck size={12} aria-hidden="true" /> {SYNC.enviado.rotulo}
          </span>
        ) : (
          <button
            type="button"
            className="btn-agenda"
            onPointerDown={semArrastar}
            onClick={abrirAgenda}
            title="Adicionar ao Google Agenda"
          >
            <CalendarPlus size={13} aria-hidden="true" /> Google Agenda
          </button>
        ))}
    </article>
  );
}
