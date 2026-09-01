import { useDraggable } from '@dnd-kit/core';
import { CalendarCheck, CalendarPlus, Clock, Ellipsis, Trash2 } from 'lucide-react';
import { CATEGORIA_CORES, PRIORIDADES, SYNC, TIPOS, fmtData, icone } from '../dados/constantes';

export default function Card({ entrada, aoAbrir, aoAgendar, excluir }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: entrada.id,
    data: { coluna: entrada.coluna },
  });

  const Icone = icone(TIPOS, entrada.tipo);
  const chip = CATEGORIA_CORES[entrada.categoria] ?? CATEGORIA_CORES.outros;
  const prioridade = PRIORIDADES.find((p) => p.chave === entrada.prioridade) ?? PRIORIDADES[1];
  const sincronizado = entrada.google_sync === 'enviado';
  const atrasado = entrada.tipo === 'evento' && entrada.inicio && new Date(entrada.inicio) < new Date();
  const semArrastar = (e) => e.stopPropagation();

  const abrirAgenda = (e) => {
    e.stopPropagation();
    aoAgendar(entrada);
  };

  const remover = (e) => {
    e.stopPropagation();
    if (window.confirm(`Excluir "${entrada.titulo}"?`)) excluir(entrada.id);
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

        <div className="card-acoes">
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-icone"
            onPointerDown={semArrastar}
            onClick={() => aoAbrir(entrada)}
            title="Abrir"
          >
            <Ellipsis size={16} aria-hidden="true" />
          </button>
          <button
            type="button"
            className="btn btn-ghost btn-sm btn-icone btn-perigo"
            onPointerDown={semArrastar}
            onClick={remover}
            title="Excluir"
          >
            <Trash2 size={15} aria-hidden="true" />
          </button>
        </div>
      </div>

      <h4 className="card-titulo">{entrada.titulo}</h4>

      <div className="card-meta">
        {entrada.inicio && (
          <span className={`meta-data${atrasado ? ' atrasado' : ''}`}>
            <Clock size={12} aria-hidden="true" /> {fmtData(entrada.inicio)}
          </span>
        )}
        <span className="tag-prioridade" style={{ color: prioridade.cor }}>
          <span className="ponto-prioridade" style={{ backgroundColor: prioridade.cor }} aria-hidden="true" />
          {prioridade.rotulo}
        </span>
      </div>

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
