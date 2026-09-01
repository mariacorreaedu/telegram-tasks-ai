import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SO_FILA } from './constantes';
import { criarEvento } from './googleAgenda';

const CAMPOS =
  'id, numero, tipo, titulo, conteudo, categoria, prioridade, coluna, inicio, fim, origem, google_sync, google_event_id';

export function useEntradas() {
  const [entradas, setEntradas] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aviso, setAviso] = useState(null);

  // Guarda o estado atual para poder reverter sem depender do closure.
  const anterior = useRef([]);
  useEffect(() => {
    anterior.current = entradas;
  }, [entradas]);

  const carregar = useCallback(async () => {
    const { data, error } = await supabase
      .from('entries')
      .select(CAMPOS)
      .eq('status', 'pendente')
      .order('numero');

    if (error) setAviso('Não consegui carregar suas entradas.');
    else setEntradas(data ?? []);
    setCarregando(false);
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  // Atualização otimista: a tela muda primeiro, o banco confirma depois.
  // Se o banco recusar, volta ao estado exato de antes.
  const aplicar = async (id, campos, erroMsg) => {
    const antes = anterior.current;
    setAviso(null);
    setEntradas((atual) => atual.map((e) => (e.id === id ? { ...e, ...campos } : e)));

    const { error } = await supabase.from('entries').update(campos).eq('id', id);
    if (error) {
      setEntradas(antes);
      setAviso(erroMsg ?? 'Não deu para salvar. O quadro voltou ao que estava.');
      return false;
    }
    return true;
  };

  const mover = async (id, novaColuna) => {
    const alvo = anterior.current.find((e) => e.id === id);
    if (!alvo || alvo.coluna === novaColuna) return;

    // O banco recusaria com CHECK. Avisar antes é mais honesto que deixar falhar.
    if (SO_FILA.includes(alvo.tipo) && novaColuna !== 'fila_espera') {
      setAviso('Anotações e ideias ficam na Fila de espera. Mude o tipo primeiro.');
      return;
    }
    await aplicar(id, { coluna: novaColuna }, 'Não consegui mover. O card voltou.');
  };

  const salvar = async (id, campos) => {
    if (campos.tipo === 'evento' && !campos.inicio) {
      setAviso('Evento precisa de data e hora.');
      return false;
    }
    // Tipo e coluna são o mesmo assunto: mudar um pode obrigar a mudar o outro.
    const ajustado = SO_FILA.includes(campos.tipo)
      ? { ...campos, coluna: 'fila_espera' }
      : campos;

    return aplicar(id, ajustado, 'Não consegui salvar a edição.');
  };

  const concluir = async (id) => {
    const antes = anterior.current;
    setEntradas((atual) => atual.filter((e) => e.id !== id));

    // numero volta para o bolo: rótulo de item fechado não serve para nada.
    const { error } = await supabase
      .from('entries')
      .update({ status: 'concluida', numero: null })
      .eq('id', id);

    if (error) {
      setEntradas(antes);
      setAviso('Não consegui concluir.');
    }
  };

  const excluir = async (id) => {
    const antes = anterior.current;
    setEntradas((atual) => atual.filter((e) => e.id !== id));

    const { error } = await supabase.from('entries').delete().eq('id', id);
    if (error) {
      setEntradas(antes);
      setAviso('Não consegui excluir.');
    }
  };

  const enviarAoGoogle = async (entrada, { inicio, fim }) => {
   const evento = await criarEvento({
     titulo: entrada.titulo,
     conteudo: entrada.conteudo,
     inicio,
     fim,
   });

   const alteracoes = {
      inicio,
      fim,
      google_event_id: evento.id,
      google_sync: 'enviado',                        // valor real do enum
      google_sync_em: new Date().toISOString(),
    };

    // nota e ideia sao obrigadas a ficar na fila (CHECK entries_nota_na_fila)
    if (!SO_FILA.includes(entrada.tipo)) alteracoes.coluna = 'com_prazo';

    const { data, error } = await supabase
      .from('entries')
      .update(alteracoes)
      .eq('id', entrada.id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    setEntradas((l) => l.map((e) => (e.id === data.id ? data : e)));
    return evento;
  };

  return { entradas, carregando, aviso, setAviso, carregar, mover, salvar, concluir, excluir, enviarAoGoogle  };
}