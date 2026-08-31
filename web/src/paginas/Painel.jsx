import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthProvider';

const ROTULO_COLUNA = {
  fazer_hoje: 'Fazer hoje',
  com_prazo: 'Com prazo',
  sem_prazo: 'Sem prazo',
  fila_espera: 'Fila de espera',
};

// Provisório: prova que o RLS deixa passar o que é seu, e só.
// O Kanban de quatro colunas é a Fase 10.
export default function Painel() {
  const { usuario, sair } = useAuth();
  const [entradas, setEntradas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    // status pendente também garante numero não nulo: a migration 008
    // devolve o rótulo ao concluir.
    supabase
      .from('entries')
      .select('id, numero, tipo, titulo, coluna, prioridade, inicio, origem')
      .eq('status', 'pendente')
      .order('numero')
      .then(({ data }) => {
        setEntradas(data ?? []);
        setCarregando(false);
      });
  }, []);

  return (
    <main>
      <header className="topo">
        <h1>Olá, {usuario.first_name}</h1>
        <button className="link" onClick={sair}>Sair</button>
      </header>

      {carregando ? (
        <p>Carregando…</p>
      ) : entradas.length === 0 ? (
        <p>Nada em aberto. Fale com o bot no Telegram para capturar algo.</p>
      ) : (
        <ul className="lista">
          {entradas.map((e) => (
            <li key={e.id}>
              <strong>{e.numero}</strong> · {e.titulo}
              {e.origem === 'audio' && <span title="Capturado por áudio"> 🎙</span>}
              <small>
                {e.tipo} · {ROTULO_COLUNA[e.coluna] ?? e.coluna} · {e.prioridade}
              </small>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}