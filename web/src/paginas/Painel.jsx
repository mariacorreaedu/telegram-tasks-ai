import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { useEntradas } from '../dados/useEntradas';
import Quadro from '../quadro/Quadro';
import ModalEdicao from '../quadro/ModalEdicao';
import Calendario from '../calendario/Calendario';

export default function Painel() {
  const { usuario, sair } = useAuth();
  const { entradas, carregando, aviso, setAviso, mover, salvar, concluir, excluir } = useEntradas();
  const [aberta, setAberta] = useState(null);

  const fechar = () => setAberta(null);

  return (
    <div className="painel">
      <header className="topo">
        <h1>Olá, {usuario.first_name}</h1>
        <button className="link" onClick={sair}>Sair</button>
      </header>

      {aviso && (
        <p className="aviso" role="alert">
          {aviso}
          <button className="link" onClick={() => setAviso(null)}>ok</button>
        </p>
      )}

      {carregando ? (
        <p>Carregando…</p>
      ) : (
        <>
          <Quadro entradas={entradas} aoMover={mover} aoAbrir={setAberta} />
          <Calendario entradas={entradas} aoAbrir={setAberta} />
        </>
      )}

      {aberta && (
        <ModalEdicao
          entrada={aberta}
          aoSalvar={salvar}
          aoConcluir={async (id) => { await concluir(id); fechar(); }}
          aoExcluir={async (id) => { await excluir(id); fechar(); }}
          aoFechar={fechar}
        />
      )}
    </div>
  );
}