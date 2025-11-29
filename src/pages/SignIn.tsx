import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../store/useAuth';
import ConfirmModal from '../components/ConfirmModal';

export default function SignIn() {
  const { signIn } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState('myca2@gmail.com');
  const [password, setPassword] = useState('myca2');
  const [error, setError] = useState<string|null>(null);
  const [ask, setAsk] = useState(false);

  const doLogin = async () => {
    try { await signIn(email, password); nav('/'); }
    catch (e:any) { setError(e.message || 'Erro ao entrar'); }
  };

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-3xl font-extrabold">Entrar</h1>

      {/* Formulário simples (poderia ter mais campos, mas a confirmação já pesa) */}
      <div className="grid sm:grid-cols-2 gap-3">
        <input className="input" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} />
      </div>

      {error && <div className="text-sm text-red-600">{error}</div>}
      <button className="btn w-full sm:w-auto" onClick={()=>setAsk(true)}>Entrar</button>
      <div className="text-sm">Não tem conta? <Link to="/signup" className="underline">Criar conta</Link></div>

      <ConfirmModal open={ask} onClose={()=>setAsk(false)} title="Deseja entrar?" desc="Confirmar para prosseguir." confirmText="Sim, entrar" onConfirm={doLogin}/>
      <div className="card border-4 border-gray-400">
        <h3 className="font-extrabold mb-2">Conteúdo desnecessário</h3>
        <p className="text-sm leading-8">{"Este texto está aqui apenas para adicionar peso à página. ".repeat(180)}</p>
      </div>
    </div>
  );
}
