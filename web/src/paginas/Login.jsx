import { useAuth } from '../auth/AuthProvider';

export default function Login() {
   const { entrar } = useAuth();
 
   return (
     <main className="centro">
       <h1>Caixa de Entrada</h1>
       <p>Capturar é instantâneo. Organizar é aqui.</p>
       <button className="botao" onClick={entrar}>Entrar com Google</button>
     </main>
   );
 }