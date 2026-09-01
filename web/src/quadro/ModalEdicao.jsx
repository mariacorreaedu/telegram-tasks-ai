import { useState } from 'react';
import {
  CATEGORIAS,
  COLUNAS,
  PRIORIDADES,
  SO_FILA,
  TIPOS,
  deInputLocal,
  paraInputLocal,
} from '../dados/constantes';

export default function ModalEdicao({ entrada, aoSalvar, aoConcluir, aoExcluir, aoFechar }) {
  const [form, setForm] = useState({
    tipo: entrada.tipo,
    titulo: entrada.titulo,
    conteudo: entrada.conteudo ?? '',
    categoria: entrada.categoria ?? 'outros',
    prioridade: entrada.prioridade ?? 'media',
    coluna: entrada.coluna,
    inicio: paraInputLocal(entrada.inicio),
  });
  const [confirmando, setConfirmando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const campo = (nome) => (e) => setForm({ ...form, [nome]: e.target.value });
  const soFila = SO_FILA.includes(form.tipo);

  async function enviar(e) {
    e.preventDefault();
    setSalvando(true);
    const inicio = deInputLocal(form.inicio);
    const ok = await aoSalvar(entrada.id, {
      tipo: form.tipo,
      titulo: form.titulo.trim().slice(0, 200),
      conteudo: form.conteudo.trim() || null,
      categoria: form.categoria,
      prioridade: form.prioridade,
      coluna: soFila ? 'fila_espera' : form.coluna,
      inicio,
      // Sem fim explícito, uma hora de duração é o padrão que o bot já usa.
      fim: inicio ? new Date(new Date(inicio).getTime() + 3600000).toISOString() : null,
    });
    setSalvando(false);
    if (ok) aoFechar();
  }

  return (
    <div className="modal-fundo" onClick={aoFechar}>
      <div className="modal" role="dialog" aria-label="Editar entrada" onClick={(e) => e.stopPropagation()}>
        <header className="modal-topo">
          <h2>Entrada {entrada.numero}</h2>
          <button className="link" onClick={aoFechar}>Fechar</button>
        </header>

        <form onSubmit={enviar}>
          <label>
            Título
            <input value={form.titulo} onChange={campo('titulo')} maxLength={200} required />
          </label>

          <label>
            Detalhes
            <textarea value={form.conteudo} onChange={campo('conteudo')} rows={3} />
          </label>

          <div className="linha">
            <label>
              Tipo
              <select value={form.tipo} onChange={campo('tipo')}>
                {TIPOS.map((t) => (
                  <option key={t.chave} value={t.chave}>{t.rotulo}</option>
                ))}
              </select>
            </label>

            <label>
              Coluna
              <select value={soFila ? 'fila_espera' : form.coluna} onChange={campo('coluna')} disabled={soFila}>
                {COLUNAS.map((c) => (
                  <option key={c.chave} value={c.chave}>{c.rotulo}</option>
                ))}
              </select>
            </label>
          </div>

          {soFila && <p className="dica">Anotações e ideias ficam sempre na Fila de espera.</p>}

          <div className="linha">
            <label>
              Categoria
              <select value={form.categoria} onChange={campo('categoria')}>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>

            <label>
              Prioridade
              <select value={form.prioridade} onChange={campo('prioridade')}>
                {PRIORIDADES.map((p) => (
                  <option key={p.chave} value={p.chave}>{p.rotulo}</option>
                ))}
              </select>
            </label>
          </div>

          <label>
            Data e hora
            <input type="datetime-local" value={form.inicio} onChange={campo('inicio')} />
          </label>
          {form.tipo === 'evento' && !form.inicio && (
            <p className="dica alerta">Evento precisa de data e hora.</p>
          )}

          <div className="modal-acoes">
            <button className="botao" disabled={salvando}>
              {salvando ? 'Salvando…' : 'Salvar'}
            </button>
            <button type="button" className="botao secundario" onClick={() => aoConcluir(entrada.id)}>
              Concluir
            </button>

            {confirmando ? (
              <span className="confirmar">
                Excluir mesmo?
                <button type="button" className="botao perigo" onClick={() => aoExcluir(entrada.id)}>
                  Sim, excluir
                </button>
                <button type="button" className="link" onClick={() => setConfirmando(false)}>
                  Cancelar
                </button>
              </span>
            ) : (
              <button type="button" className="link perigo" onClick={() => setConfirmando(true)}>
                Excluir
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}