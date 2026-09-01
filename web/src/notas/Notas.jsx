import { CATEGORIA_CORES, TIPOS, fmtData, icone } from '../dados/constantes';

export default function Notas({ entradas, aoAbrir }) {
  return (
    <section className="notas">
      <header className="notas-topo">
        <span>📝 Notas</span>
        <span className="coluna-contador">{entradas.length}</span>
      </header>

      <div className="notas-grade">
        {entradas.map((e) => {
          const chip = CATEGORIA_CORES[e.categoria] ?? CATEGORIA_CORES.outros;
          return (
            <button
              key={e.id}
              type="button"
              className="card-entrada card-nota"
              onClick={() => aoAbrir(e)}
            >
              <span className="chip" style={{ backgroundColor: chip.bg, color: chip.cor }}>
                {icone(TIPOS, e.tipo)} {e.categoria ?? 'sem categoria'}
              </span>
              <h4 className="card-titulo">{e.titulo}</h4>
              {e.conteudo && <p className="card-conteudo">{e.conteudo}</p>}
              {e.inicio && (
                <div className="card-meta">
                  <span className="meta-data">🕒 {fmtData(e.inicio)}</span>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}
