import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../auth/AuthProvider';

const MOTIVOS = {
  codigo_invalido_ou_expirado:
    'Código inválido ou expirado. Peça outro no bot: Configurações → Vincular.',
  conta_google_ja_vinculada: 'Esta conta Google já está ligada a outro Telegram.',
  sem_sessao: 'Sua sessão expirou. Entre de novo.',
};

export default function Vincular() {
  const { recarregar, sair } = useAuth();
  const [codigo, setCodigo] = useState('');
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  async function enviar(evento) {
    evento.preventDefault();
    setErro(null);
    setEnviando(true);

    // O uid NÃO vai como parâmetro: a função lê auth.uid() do token.
    const { data, error } = await supabase.rpc('validar_codigo_vinculo', {
      p_codigo: codigo.trim(),
    });

    setEnviando(false);

    if (error) return setErro('Não consegui falar com o servidor. Tente de novo.');
    if (!data?.ok) return setErro(MOTIVOS[data?.motivo] ?? 'Não deu certo.');

    await recarregar();
  }

  return (
    <main className="centro">
      <h1>Conectar sua conta</h1>
      <p>
        No Telegram, toque em <strong>⚙️ Configurações → 🔐 Vincular</strong>. Cole aqui o código
        de seis dígitos — ele vale por 10 minutos e serve uma vez só.
      </p>

      <form onSubmit={enviar}>
        <input
          className="codigo"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.replace(/\D/g, '').slice(0, 6))}
          inputMode="numeric"
          autoComplete="one-time-code"
          placeholder="000000"
          aria-label="Código de vínculo"
        />
        <button className="botao" disabled={codigo.length !== 6 || enviando}>
          {enviando ? 'Verificando…' : 'Conectar'}
        </button>
      </form>

      {erro && <p className="erro" role="alert">{erro}</p>}

      <button className="link" onClick={sair}>Entrar com outra conta</button>
    </main>
  );
}