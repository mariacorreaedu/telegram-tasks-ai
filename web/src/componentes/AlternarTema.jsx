import { useEffect, useState } from 'react';
import { Monitor, Moon, Sun } from 'lucide-react';

const CICLO = ['sistema', 'claro', 'escuro'];
const ICONE = { sistema: Monitor, claro: Sun, escuro: Moon };
const ROTULO = { sistema: 'Tema do sistema', claro: 'Tema claro', escuro: 'Tema escuro' };

export default function AlternarTema() {
  const [tema, setTema] = useState(() => localStorage.getItem('tema') ?? 'sistema');

  useEffect(() => {
    const raiz = document.documentElement;
    // Sem marca no root, o CSS cai no prefers-color-scheme do aparelho.
    if (tema === 'sistema') raiz.removeAttribute('data-theme');
    else raiz.setAttribute('data-theme', tema);
    localStorage.setItem('tema', tema);
  }, [tema]);

  const proximo = () => setTema(CICLO[(CICLO.indexOf(tema) + 1) % CICLO.length]);
  const Icone = ICONE[tema];

  return (
    <button className="tema" onClick={proximo} title={ROTULO[tema]} aria-label={ROTULO[tema]}>
      <Icone size={16} strokeWidth={2.25} aria-hidden="true" />
    </button>
  );
}