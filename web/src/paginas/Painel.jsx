import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useEntradas } from '../dados/useEntradas';
import { AGENDA_GOOGLE, COLUNAS } from '../dados/constantes';
import AlternarTema from '../componentes/AlternarTema';
import Quadro from '../quadro/Quadro';
import ModalEdicao from '../quadro/ModalEdicao';
import Calendario from '../calendario/Calendario';

export default function Painel() {
  const { usuario, sair } = useAuth();
  const { entradas, carregando, aviso, setAviso, mover, salvar, concluir, excluir, enviarAoGoogle } = useEntradas();
  const [aberta, setAberta] = useState(null);
  const [vista, setVista] = useState('quadro');

  const total = (chave) => entradas.filter((e) => e.coluna === chave).length;

  return (
    <div className="app">
      <aside className="lateral">
        <div className="marca">
          <span className="marca-icone">📥</span>
          <div>
            <strong>Caixa de Entrada</strong>
            <small>capturar agora, organizar depois</small>
          </div>
        </div>

        <nav className="nav">
          <button
            className={`nav-item${vista === 'quadro' ? ' ativo' : ''}`}
            onClick={() => setVista('quadro')}
          >
            🗂 Quadro <span className="nav-contagem">{entradas.length}</span>
          </button>
          <button
            className={`nav-item${vista === 'calendario' ? ' ativo' : ''}`}
            onClick={() => setVista('calendario')}
          >
            📅 Calendário
          </button>
          <a className="nav-item" href={AGENDA_GOOGLE} target="_blank" rel="noopener noreferrer">
            📆 Google Agenda ↗
          </a>
        </nav>

        <ul className="resumo">
          {COLUNAS.map((c) => (
            <li key={c.chave}>
              <span>{c.icone} {c.rotulo}</span>
              <b>{total(c.chave)}</b>
            </li>
          ))}
        </ul>

        <footer className="lateral-rodape">
          <div className="usuario">
            <span className="avatar">{usuario.first_name?.[0] ?? '?'}</span>
            <div>
              <strong>{usuario.first_name}</strong>
              <button className="link" onClick={sair}>Sair</button>
            </div>
          </div>
        </footer>
      </aside>

      <main className="conteudo">
        <header className="cabecalho">
          <div>
            <h1>Olá, {usuario.first_name}</h1>
            <p className="sub">
              {carregando ? 'Carregando…' : `${entradas.length} em aberto`}
            </p>
          </div>
          <AlternarTema />
        </header>

        {aviso && (
          <p className="aviso" role="alert">
            {aviso}
            <button className="link" onClick={() => setAviso(null)}>ok</button>
          </p>
        )}

        {!carregando && vista === 'quadro' && (
          <Quadro
            entradas={entradas}
            mover={mover}
            enviarAoGoogle={enviarAoGoogle}
            aoAbrir={setAberta}
         />
        )}
        {!carregando && vista === 'calendario' && (
          <Calendario entradas={entradas} aoAbrir={setAberta} />
        )}
      </main>

      {aberta && (
        <ModalEdicao
          entrada={aberta}
          aoSalvar={salvar}
          aoConcluir={async (id) => { await concluir(id); setAberta(null); }}
          aoExcluir={async (id) => { await excluir(id); setAberta(null); }}
          aoFechar={() => setAberta(null)}
        />
      )}
    </div>
  );
}