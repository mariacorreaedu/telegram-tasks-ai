import { useState } from 'react';
import { deInputLocal } from '../dados/constantes';

export default function ModalNovaTarefa({ coluna, aoCriar, aoFechar }) {
  const [tipo, setTipo] = useState('tarefa');
  const [titulo, setTitulo] = useState('');
  const [inicio, setInicio] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function enviar(e) {
    e.preventDefault();
    if (tipo === 'evento' && !inicio) {
      setErro('Evento precisa de data e hora.');
      return;
    }
    setEnviando(true);
    setErro(null);

    const inicioIso = deInputLocal(inicio);
    const ok = await aoCriar({
      tipo,
      titulo: titulo.trim().slice(0, 200),
      coluna: coluna.chave,
      inicio: inicioIso,
      // Sem fim explícito, uma hora de duração é o padrão que o bot já usa.
      fim: inicioIso ? new Date(new Date(inicioIso).getTime() + 3600000).toISOString() : null,
    });

    setEnviando(false);
    if (ok) aoFechar();
    else setErro('Não deu para criar. Tenta de novo.');
  }

  return (
    <div className="modal-fundo" onClick={aoFechar}>
      <div className="modal" role="dialog" aria-label="Nova entrada" onClick={(e) => e.stopPropagation()}>
        <header className="modal-topo">
          <h3>Nova entrada em {coluna.rotulo}</h3>
          <button type="button" className="link" onClick={aoFechar}>
            Fechar
          </button>
        </header>

        <form onSubmit={enviar}>
          <label>
            Título
            <input
              autoFocus
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              maxLength={200}
              required
              placeholder="O que precisa ser feito?"
            />
          </label>

          <div className="linha">
            <label>
              Tipo
              <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
                <option value="tarefa">Tarefa</option>
                <option value="evento">Evento</option>
              </select>
            </label>

            {tipo === 'evento' && (
              <label>
                Data e hora
                <input
                  type="datetime-local"
                  value={inicio}
                  onChange={(e) => setInicio(e.target.value)}
                  required
                />
              </label>
            )}
          </div>

          {erro && <p className="modal-erro">{erro}</p>}

          <div className="modal-acoes">
            <button className="botao" disabled={enviando || !titulo.trim()}>
              {enviando ? 'Criando…' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
