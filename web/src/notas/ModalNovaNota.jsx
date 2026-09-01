import { useState } from 'react';

export default function ModalNovaNota({ aoCriar, aoFechar }) {
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  async function enviar(e) {
    e.preventDefault();
    setEnviando(true);
    setErro(null);

    const ok = await aoCriar({
      tipo: 'nota',
      titulo: texto.trim().slice(0, 200),
      coluna: 'fila_espera',
    });

    setEnviando(false);
    if (ok) aoFechar();
    else setErro('Não deu para salvar. Tenta de novo.');
  }

  return (
    <div className="modal-fundo" onClick={aoFechar}>
      <div className="modal" role="dialog" aria-label="Nova anotação" onClick={(e) => e.stopPropagation()}>
        <header className="modal-topo">
          <h3>Nova anotação</h3>
          <button type="button" className="link" onClick={aoFechar}>
            Fechar
          </button>
        </header>

        <form onSubmit={enviar}>
          <label>
            <textarea
              autoFocus
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              maxLength={200}
              rows={4}
              required
              placeholder="Escreva sua anotação…"
            />
          </label>

          {erro && <p className="modal-erro">{erro}</p>}

          <div className="modal-acoes">
            <button className="botao" disabled={enviando || !texto.trim()}>
              {enviando ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
