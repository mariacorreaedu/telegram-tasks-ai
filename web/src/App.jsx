import { useAuth } from './auth/AuthProvider';
import Login from './paginas/Login';
import Vincular from './paginas/Vincular';
import Painel from './paginas/Painel';

export default function App() {
  const { sessao, usuario, carregando } = useAuth();

  if (carregando) return <main className="centro"><p>Carregando…</p></main>;
  if (!sessao) return <Login />;      // não entrou
  if (!usuario) return <Vincular />;  // entrou, mas a conta Google não está ligada a um Telegram
  return <Painel />;                  // tudo pronto
}