import { useState } from 'react';

export default function Painel({ usuario, sair }) {
   const [aba, setAba] = useState('quadro');
 
   return (
     <div className="painel-container">
       <aside className="sidebar">
         <div className="sidebar-header">
           <h2>📥 Caixa</h2>
         </div>
 
         <nav className="sidebar-nav">
           <button
             className={`nav-item ${aba === 'quadro' ? 'ativo' : ''}`}
             onClick={() => setAba('quadro')}
           >
             📋 Tarefas
           </button>
           <button
             className={`nav-item ${aba === 'calendario' ? 'ativo' : ''}`}
             onClick={() => setAba('calendario')}
           >
             📅 Calendário
           </button>
           <button className="nav-item">
             🗓️ Google Agenda
           </button>
         </nav>
 
         <div className="sidebar-footer">
           <button className="btn btn-ghost" onClick={sair}>
             Sair
           </button>
         </div>
       </aside>
 
       <main className="painel-main">
         {aba === 'quadro' && <div>📋 Quadro em desenvolvimento</div>}
         {aba === 'calendario' && <div>📅 Calendário em desenvolvimento</div>}
       </main>
     </div>
   );
 }