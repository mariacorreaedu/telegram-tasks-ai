import { useDroppable } from '@dnd-kit/core';
import Card from './Card';

// agrupa os cards por categoria, mantendo a ordem de chegada
function porCategoria(entradas) {
  const mapa = new Map();
  for (const e of entradas) {
    const chave = e.categoria ?? 'sem categoria';
    if (!mapa.has(chave)) mapa.set(chave, []);
    mapa.get(chave).push(e);
  }
  return [...mapa.entries()];
}

export default function Coluna({ coluna, entradas, aoAbrir, aoAgendar }) {
  const { setNodeRef, isOver } = useDroppable({ id: coluna.chave });
  const grupos = porCategoria(entradas);

  return (
    <section ref={setNodeRef} className={`coluna${isOver ? ' sobre' : ''}`}>
      <header className="coluna-topo">
        <span>{coluna.icone} {coluna.rotulo}</span>
        <span className="coluna-contador">{entradas.length}</span>
      </header>

      <div className="coluna-corpo">
        {grupos.length === 0 && <p className="coluna-vazia">Nada aqui.</p>}

        {grupos.map(([categoria, itens]) => (
          <div key={categoria} className="grupo">
            <h4 className="grupo-titulo">{categoria}</h4>
            {itens.map((e) => (
              <Card key={e.id} entrada={e} aoAbrir={aoAbrir} aoAgendar={aoAgendar} />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}