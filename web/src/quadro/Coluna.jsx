import { useEffect, useRef, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import Card from './Card';

export default function Coluna({ coluna, entradas, aoAbrir, aoAgendar }) {
  const { setNodeRef, isOver } = useDroppable({ id: coluna.chave });
  const corpoRef = useRef(null);
  const [temMais, setTemMais] = useState(false);

  const verificarScroll = () => {
    const el = corpoRef.current;
    if (!el) return;
    setTemMais(el.scrollHeight - el.scrollTop - el.clientHeight > 4);
  };

  useEffect(() => {
    verificarScroll();
    window.addEventListener('resize', verificarScroll);
    return () => window.removeEventListener('resize', verificarScroll);
  }, [entradas]);

  return (
    <section ref={setNodeRef} className={`coluna${isOver ? ' sobre' : ''}`}>
      <header className="coluna-topo">
        <span className="coluna-titulo">
          <span className="icone-badge" style={{ backgroundColor: `${coluna.cor}22`, color: coluna.cor }}>
            <coluna.Icone size={14} strokeWidth={2.25} aria-hidden="true" />
          </span>
          {coluna.rotulo}
        </span>
        <span className="coluna-contador">{entradas.length}</span>
      </header>

      <div className="coluna-corpo" ref={corpoRef} onScroll={verificarScroll}>
        {entradas.length === 0 && <p className="coluna-vazia">Nada aqui.</p>}
        {entradas.map((e) => (
          <Card key={e.id} entrada={e} aoAbrir={aoAbrir} aoAgendar={aoAgendar} />
        ))}
      </div>

      {temMais && <div className="coluna-mais" aria-hidden="true">↓</div>}
    </section>
  );
}
