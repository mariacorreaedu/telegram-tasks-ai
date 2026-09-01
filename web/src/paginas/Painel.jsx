import { useState } from 'react';
import { CalendarDays, Inbox, ListTodo, LogOut, StickyNote } from 'lucide-react';
import { useAuth } from '../auth/AuthProvider';
import { useEntradas } from '../dados/useEntradas';
import { SO_FILA } from '../dados/constantes';
import Quadro from '../quadro/Quadro';
import Calendario from '../calendario/Calendario';
import Notas from '../notas/Notas';
import ModalEdicao from '../quadro/ModalEdicao';
import AlternarTema from '../componentes/AlternarTema';

export default function Painel() {
  const { usuario, sair } = useAuth();
  const [aba, setAba] = useState('quadro');
  const [selecionada, setSelecionada] = useState(null);

  const { entradas, carregando, aviso, setAviso, mover, salvar, criar, concluir, excluir, enviarAoGoogle } =
    useEntradas(usuario?.id);

  // notas saem do quadro: vivem no menu Notas, nao na Fila de espera
  const entradasNotas = entradas.filter((e) => SO_FILA.includes(e.tipo));
  const entradasQuadro = entradas.filter((e) => !SO_FILA.includes(e.tipo));

  const fecharModal = () => setSelecionada(null);

  const aoConcluir = async (id) => {
    await concluir(id);
    fecharModal();
  };

  const aoExcluir = async (id) => {
    await excluir(id);
    fecharModal();
  };

  return (
    <div className="painel-container">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>
            <Inbox size={18} strokeWidth={2.25} aria-hidden="true" /> Caixa
          </h2>
          {usuario?.first_name && <p className="sidebar-usuario">Olá, {usuario.first_name}</p>}
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${aba === 'quadro' ? 'ativo' : ''}`}
            onClick={() => setAba('quadro')}
          >
            <span className="nav-rotulo">
              <ListTodo size={16} strokeWidth={2.25} aria-hidden="true" />
              Tarefas
            </span>
            <span className="nav-contador">{entradasQuadro.length}</span>
          </button>
          <button
            className={`nav-item ${aba === 'calendario' ? 'ativo' : ''}`}
            onClick={() => setAba('calendario')}
          >
            <span className="nav-rotulo">
              <CalendarDays size={16} strokeWidth={2.25} aria-hidden="true" />
              Calendário
            </span>
          </button>
          <button
            className={`nav-item ${aba === 'notas' ? 'ativo' : ''}`}
            onClick={() => setAba('notas')}
          >
            <span className="nav-rotulo">
              <StickyNote size={16} strokeWidth={2.25} aria-hidden="true" />
              Notas
            </span>
            <span className="nav-contador">{entradasNotas.length}</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <AlternarTema />
          <button className="btn btn-ghost" onClick={sair}>
            <LogOut size={15} strokeWidth={2.25} aria-hidden="true" /> Sair
          </button>
        </div>
      </aside>

      <main className="painel-main">
        {aviso && (
          <div className="aviso" role="alert">
            <span>{aviso}</span>
            <button className="link" onClick={() => setAviso(null)}>
              Fechar
            </button>
          </div>
        )}

        {carregando ? (
          <p className="estado-carregando">Carregando suas entradas…</p>
        ) : aba === 'quadro' ? (
          <Quadro
            entradas={entradasQuadro}
            mover={mover}
            criar={criar}
            excluir={excluir}
            enviarAoGoogle={enviarAoGoogle}
            aoAbrir={setSelecionada}
          />
        ) : aba === 'calendario' ? (
          <Calendario entradas={entradasQuadro} aoAbrir={setSelecionada} />
        ) : (
          <Notas entradas={entradasNotas} aoAbrir={setSelecionada} criar={criar} excluir={excluir} />
        )}
      </main>

      {selecionada && (
        <ModalEdicao
          entrada={selecionada}
          aoSalvar={salvar}
          aoConcluir={aoConcluir}
          aoExcluir={aoExcluir}
          aoFechar={fecharModal}
        />
      )}
    </div>
  );
}
