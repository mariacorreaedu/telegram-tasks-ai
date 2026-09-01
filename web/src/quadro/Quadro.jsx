import { useState } from 'react';
import { DndContext, PointerSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { COLUNAS, SO_FILA } from '../dados/constantes';
import Coluna from './Coluna';
import ModalAgenda from './ModalAgenda';

export default function Quadro({ entradas, mover, enviarAoGoogle, aoAbrir }) {
  // qual entrada está com o modal do Google aberto (null = fechado)
  const [aAgendar, setAAgendar] = useState(null);

  // distância mínima: um toque curto no celular é clique, não arraste
  const sensores = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 6 } }),
  );

  const aoSoltar = ({ active, over }) => {
    if (!over) return;
    const destino = over.id;
    const entrada = entradas.find((e) => e.id === active.id);
    if (!entrada || entrada.coluna === destino) return;

    // espelha o CHECK entries_nota_na_fila: bloqueia antes de chamar o banco
    if (SO_FILA.includes(entrada.tipo) && destino !== 'fila_espera') return;

    mover(entrada.id, destino);
  };

  return (
    <DndContext sensors={sensores} onDragEnd={aoSoltar}>
      <div className="quadro">
        {COLUNAS.map((c) => (
          <Coluna
            key={c.chave}
            coluna={c}
            entradas={entradas.filter((e) => e.coluna === c.chave)}
            aoAbrir={aoAbrir}
            aoAgendar={setAAgendar}
          />
        ))}
      </div>

      {aAgendar && (
        <ModalAgenda
          entrada={aAgendar}
          aoFechar={() => setAAgendar(null)}
          aoEnviar={(datas) => enviarAoGoogle(aAgendar, datas)}
        />
      )}
    </DndContext>
  );
}