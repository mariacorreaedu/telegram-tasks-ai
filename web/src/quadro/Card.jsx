import { useDraggable } from '@dnd-kit/core';
import { PRIORIDADES, SYNC, TIPOS, fmtData, icone } from '../dados/constantes';

export default function Card({ entrada, aoAbrir, aoAgendar }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: entrada.id,
    data: { coluna: entrada.coluna },
  });

  const cor = PRIORIDADES.find((p) => p.chave === entrada.prioridade)?.cor ?? '#888';
  const selo = SYNC[entrada.google_sync];

  // so oferece o botao se ha data e ainda nao foi para o Google
  const podeAgendar = Boolean(entrada.inicio) && entrada.google_sync !== 'sincronizado';

  // impede que o clique no botao vire inicio de arraste
  const semArrastar = (e) => e.stopPropagation();

  return (
    <article
      ref={setNodeRef}
      className={`card${isDragging ? ' arrastando' : ''}`}
      style={{
        '--cor-prio': cor,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
      }}
      {...listeners}
      {...attributes}
    >
      <div className="card-linha">
        <span className="card-numero">{entrada.numero}</span>
        <span className="card-tipo">{icone(TIPOS, entrada.tipo)}</span>
        {entrada.origem === 'audio' && (
          <span className="card-tipo" title="Capturado por audio">🎙</span>
        )}
        <span className="card-espaco" />

        {podeAgendar && (
          <button
            type="button"
            className="card-acao"
            onPointerDown={semArrastar}
            onClick={(e) => { e.stopPropagation(); aoAgendar(entrada); }}
            title="Adicionar ao Google Agenda"
          >
            📆
          </button>
        )}

        <button
          type="button"
          className="card-acao"
          onPointerDown={semArrastar}
          onClick={() => aoAbrir(entrada)}
          title="Abrir"
        >
          ⋯
        </button>
      </div>

      <p className="card-titulo">{entrada.titulo}</p>

      {(entrada.inicio || selo) && (
        <div className="card-linha card-meta">
          {entrada.inicio && <time>{fmtData(entrada.inicio)}</time>}
          {selo && <span className={`selo ${selo.classe}`}>{selo.rotulo}</span>}
        </div>
      )}
    </article>
  );
}