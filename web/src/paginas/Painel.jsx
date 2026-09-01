import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useEntradas } from '../dados/useEntradas';
import Quadro from '../quadro/Quadro';
import Calendario from '../calendario/Calendario';
import ModalEdicao from '../quadro/ModalEdicao';
import AlternarTema from '../componentes/AlternarTema';

export default function Painel() {
  const { usuario, sair } = useAuth();
  const [aba, setAba] = useState('quadro');
  const [selecionada, setSelecionada] = useState(null);

  const { entradas, carregando, aviso, setAviso, mover, salvar, concluir, excluir, enviarAoGoogle } =
    useEntradas();

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
          <h2>📥 Caixa</h2>
          {usuario?.first_name && <p className="sidebar-usuario">Olá, {usuario.first_name}</p>}
        </div>

        <nav className="sidebar-nav">
          <button
            className={`nav-item ${aba === 'quadro' ? 'ativo' : ''}`}
            onClick={() => setAba('quadro')}
          >
            📋 Tarefas
            <span className="nav-contador">{entradas.length}</span>
          </button>
          <button
            className={`nav-item ${aba === 'calendario' ? 'ativo' : ''}`}
            onClick={() => setAba('calendario')}
          >
            📅 Calendário
          </button>
        </nav>

        <div className="sidebar-footer">
          <AlternarTema />
          <button className="btn btn-ghost" onClick={sair}>
            Sair
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
        ) : entradas.length === 0 ? (
          <div className="estado-vazio">
            <p className="estado-vazio-titulo">Nada por aqui ainda.</p>
            <p className="estado-vazio-dica">
              Manda uma mensagem pro bot no Telegram — texto ou áudio — que ela aparece aqui.
            </p>
          </div>
        ) : aba === 'quadro' ? (
          <Quadro entradas={entradas} mover={mover} enviarAoGoogle={enviarAoGoogle} aoAbrir={setSelecionada} />
        ) : (
          <Calendario entradas={entradas} aoAbrir={setSelecionada} />
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
