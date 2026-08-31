import { useDraggable } from '@dnd-kit/core';
import { PRIORIDADES, SYNC, TIPOS, fmtData, icone } from '../dados/constantes';

export default function Card({ entrada, aoAbrir }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: entrada.id,
    data: { coluna: entrada.coluna },
  });

  const cor = PRIORIDADES.find((p) => p.chave === entrada.prioridade)?.cor ?? '#888';
  const selo = SYNC[entrada.google_sync];

  return (
    <article
      ref={setNodeRef}
      className={`card${isDragging ? ' arrastando' : ''}`}
      style={{
        borderLeftColor: cor,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
      {...listeners}
      {...attributes}
    >
      <header className="card-topo">
        <span className="card-numero">{entrada.numero}</span>
        <span>{icone(TIPOS, entrada.tipo)}</span>
        {entrada.origem === 'audio' && <span title="Capturado por áudio">🎙</span>}
        <button
          className="card-abrir"
          onClick={() => aoAbrir(entrada)}
          onPointerDown={(e) => e.stopPropagation()} // não iniciar arraste ao clicar
          aria-label={`Abrir ${entrada.titulo}`}
        >
          ⋯
        </button>
      </header>

      <p className="card-titulo">{entrada.titulo}</p>

      <footer className="card-rodape">
        {entrada.inicio && <time>{fmtData(entrada.inicio)}</time>}
        {selo && <span className={`selo ${selo.classe}`}>{selo.rotulo}</span>}
      </footer>
    </article>
  );
}