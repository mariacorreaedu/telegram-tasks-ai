import { useDraggable } from '@dnd-kit/core';
import { fmtData, icone, linkGoogleAgenda } from '../dados/constantes';

export default function Card({ entrada, aoAbrir }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: entrada.id,
    data: { coluna: entrada.coluna },
  });

  const link = linkGoogleAgenda(entrada);
  const semArrastar = (e) => e.stopPropagation();

  const abrirAgenda = (e) => {
    e.stopPropagation();
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <article
      ref={setNodeRef}
      className={`card card-entrada ${isDragging ? 'arrastando' : ''}`}
      style={{
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
      {...listeners}
      {...attributes}
    >
      <div className="card-header">
        <h4 className="card-titulo">{entrada.titulo}</h4>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onPointerDown={semArrastar}
          onClick={() => aoAbrir(entrada)}
          title="Abrir"
        >
          ⋯
        </button>
      </div>

      {entrada.inicio && (
        <div className="card-meta">
          <span className="meta-data">📅 {fmtData(entrada.inicio)}</span>
        </div>
      )}

      {link && (
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onPointerDown={semArrastar}
          onClick={abrirAgenda}
          title="Adicionar ao Google Agenda"
        >
          Adicionar ao Google
        </button>
      )}
    </article>
  );
}