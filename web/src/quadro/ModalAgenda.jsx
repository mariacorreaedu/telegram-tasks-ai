import { useState } from 'react';
import { deInputLocal, paraInputLocal } from '../dados/constantes';

const UMA_HORA = 3600000;

export default function ModalAgenda({ entrada, aoEnviar, aoFechar }) {
  // Sem fim definido, propõe uma hora — o Google exige um fim.
  const fimPadrao = entrada.fim ?? new Date(new Date(entrada.inicio).getTime() + UMA_HORA).toISOString();

  const [inicio, setInicio] = useState(paraInputLocal(entrada.inicio));
  const [fim, setFim] = useState(paraInputLocal(fimPadrao));
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState(null);

  const enviar = async () => {
    if (new Date(fim) <= new Date(inicio)) {
      setErro('O fim tem que ser depois do início.');
      return;
    }
    setEnviando(true);
    setErro(null);
    try {
      await aoEnviar({ inicio: deInputLocal(inicio), fim: deInputLocal(fim) });
      aoFechar();
    } catch (e) {
      setErro(e.message);
      setEnviando(false);
    }
  };

  return (
    <div className="modal-fundo" onClick={aoFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Adicionar ao Google Agenda</h3>
        <p className="modal-titulo-entrada">{entrada.titulo}</p>

        <label>
          Início
          <input type="datetime-local" value={inicio} onChange={(e) => setInicio(e.target.value)} />
        </label>

        <label>
          Fim
          <input type="datetime-local" value={fim} onChange={(e) => setFim(e.target.value)} />
        </label>

        {erro && <p className="modal-erro">{erro}</p>}

        <div className="modal-acoes">
          <button type="button" className="btn-secundario" onClick={aoFechar} disabled={enviando}>
            Cancelar
          </button>
          <button type="button" className="btn-primario" onClick={enviar} disabled={enviando}>
            {enviando ? 'Enviando…' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}