import { supabase } from '../lib/supabase';

const API = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
const FUSO = 'America/Sao_Paulo';
const TIMEOUT_MS = 10000;

// Erro com causa identificável, para a interface reagir diferente por motivo.
export class ErroGoogle extends Error {
  constructor(causa, mensagem) {
    super(mensagem);
    this.causa = causa; // 'sem_token' | 'permissao' | 'http' | 'rede'
  }
}

// pega o otoken do google que estpa armazenado na sesssao atual do supabase 
async function tokenDoGoogle() {
  const { data } = await supabase.auth.getSession();
  const t = data.session?.provider_token;
  if (!t) {
    throw new ErroGoogle('sem_token', 'Sessão do Google expirou. Entre novamente para reconectar.');
  }
  return t;
}

// fetch com prazo: sem isso, um Google lento trava a interface para sempre
//a ideia aqui é se demorar mais de 10s cancela o fetch
async function comTimeout(url, opcoes) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
   //faz a requisição
    return await fetch(url, { ...opcoes, signal: ctrl.signal });
  } catch (e) {
    throw new ErroGoogle('rede', e.name === 'AbortError' ? 'O Google não respondeu a tempo.' : 'Falha de rede.');
  } finally {
   //independe se der certo ou não chega no finnalu para limpar timer
    clearTimeout(t);
  }
}

// Cria o evento na agenda principal do usuário. Devolve { id, htmlLink }.
export async function criarEvento({ titulo, conteudo, inicio, fim }) {
   //aqui pegamos o token que retorna na prmeira função caso ela retorne o token do acesso atual
  const token = await tokenDoGoogle();

//chama api do google -> API aqui é a variavel na linha 3 
  const r = await comTimeout(API, {
    method: 'POST', //metodo
    headers: { 
      Authorization: `Bearer ${token}`, 
      'Content-Type': 'application/json' 
   },
    body: JSON.stringify({
      summary: titulo,
      description: conteudo ?? '',
      start: { dateTime: inicio, timeZone: FUSO },
      end: { dateTime: fim, timeZone: FUSO },
    }),
  });

  if (r.status === 401 || r.status === 403) {
    throw new ErroGoogle('permissao', 'O Google recusou o acesso. Entre novamente para reautorizar.');
  }
  if (!r.ok) {
    const corpo = await r.json().catch(() => ({}));
    throw new ErroGoogle('http', corpo?.error?.message ?? `Google respondeu ${r.status}.`);
  }
  return r.json();
}