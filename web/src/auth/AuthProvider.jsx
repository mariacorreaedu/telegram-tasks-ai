import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

// Pedido já agora para não precisar de um segundo consentimento na Fase 11.
const ESCOPO_CALENDARIO = 'https://www.googleapis.com/auth/calendar.events';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [sessao, setSessao] = useState(null); //login
  const [usuario, setUsuario] = useState(null); // linha de public.users, ou null se não vinculada
  const [carregando, setCarregando] = useState(true); //tela de espera

  const carregarUsuario = useCallback(async (s) => {
    if (!s) {
      setUsuario(null);
      return;
    }
    // Sem filtro no where: o RLS já limita à própria linha.
    // Vazio significa que esta conta Google ainda não foi vinculada.
    const { data } = await supabase
      .from('users')
      .select('id, first_name, setor')
      .maybeSingle();
    setUsuario(data ?? null);
  }, []);

   useEffect(() => {
    let ativo = true;

    supabase.auth.getSession().then(async ({ data }) => {
      if (!ativo) return;
      setSessao(data.session);
      await carregarUsuario(data.session);
      setCarregando(false);
    });

    // Dispara no login, no logout e a cada renovação silenciosa do token.
    const { data: inscricao } = supabase.auth.onAuthStateChange(async (_evento, s) => {
      setSessao(s);
      await carregarUsuario(s);
    });

    return () => {
      ativo = false;
      inscricao.subscription.unsubscribe();
    };
  }, [carregarUsuario]);

  const entrar = () =>
    supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        scopes: ESCOPO_CALENDARIO,
        redirectTo: window.location.origin,
        // offline + consent fazem o Google devolver refresh_token — sem ele,
        // a Fase 11 pediria login de novo a cada expiração.
        queryParams: { access_type: 'offline', prompt: 'consent' },
      },
    });

  const sair = () => supabase.auth.signOut();

  return (
    <AuthContext.Provider
      value={{
        sessao,
        usuario,
        carregando,
        entrar,
        sair,
        recarregar: () => carregarUsuario(sessao),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}