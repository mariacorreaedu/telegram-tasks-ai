import { useDroppable } from '@dnd-kit/core';
import Card from './Card';

export default function Coluna({ coluna, entradas, aoAbrir }) {
  const { setNodeRef, isOver } = useDroppable({ id: coluna.chave });

  // Dentro da coluna, agrupar por categoria: é o recorte que ajuda a decidir.
  const grupos = entradas.reduce((acc, e) => {
    (acc[e.categoria ?? 'outros'] ??= []).push(e);
    return acc;
  }, {});
  const categorias = Object.keys(grupos).sort();

  return (
    <section ref={setNodeRef} className={`coluna${isOver ? ' sobre' : ''}`}>
      <h2 className="coluna-titulo">
        {coluna.icone} {coluna.rotulo}
        <span className="coluna-contagem">{entradas.length}</span>
      </h2>

      {entradas.length === 0 ? (
        <p className="coluna-vazia">Nada aqui.</p>
      ) : (
        categorias.map((cat) => (
          <div key={cat} className="grupo">
            <h3 className="grupo-titulo">{cat}</h3>
            {grupos[cat].map((e) => (
              <Card key={e.id} entrada={e} aoAbrir={aoAbrir} />
            ))}
          </div>
        ))
      )}
    </section>
  );
}