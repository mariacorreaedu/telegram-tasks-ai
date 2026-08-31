import {
   DndContext,
   PointerSensor,
   TouchSensor,
   useSensor,
   useSensors,
 } from '@dnd-kit/core';
 import Coluna from './Coluna';
 import { COLUNAS } from '../dados/constantes';
 
 export default function Quadro({ entradas, aoMover, aoAbrir }) {
   const sensores = useSensors(
     // Distância mínima evita que um clique vire arraste.
     useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
     // No toque, o atraso preserva a rolagem da página.
     useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
   );
 
   function aoSoltar({ active, over }) {
     if (!over) return;
     if (active.data.current?.coluna === over.id) return;
     aoMover(active.id, over.id);
   }
 
   return (
     <DndContext sensors={sensores} onDragEnd={aoSoltar}>
       <div className="quadro">
         {COLUNAS.map((c) => (
           <Coluna
             key={c.chave}
             coluna={c}
             entradas={entradas.filter((e) => e.coluna === c.chave)}
             aoAbrir={aoAbrir}
           />
         ))}
       </div>
     </DndContext>
   );
 }