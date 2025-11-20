import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import ConfirmModal from "../components/ConfirmModal";

export default function SignUp() { // <-- export default aqui
  const { signUp } = useAuth();
  const nav = useNavigate();
  const [name,setName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [dob,setDob] = useState("");
  const [ask,setAsk] = useState(false);
  const [error,setError] = useState<string|null>(null);

  const doSignUp = async () => {
    try {
      const id = crypto.randomUUID();
      await signUp({ id, name, email, password, dob } as any);
      nav("/");
    } catch (e:any) { setError(e.message || "Erro ao cadastrar"); }
  };

  return (
    <div className="mx-auto max-w-md p-6 space-y-3">
      <h1 className="text-2xl font-bold">Criar conta</h1>
      <input className="input" placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
      <input className="input" placeholder="E-mail" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="input" type="password" placeholder="Senha" value={password} onChange={e=>setPassword(e.target.value)} />
      <input className="input" type="date" placeholder="Data de nascimento" value={dob} onChange={e=>setDob(e.target.value)} />
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button className="btn w-full" onClick={()=>setAsk(true)}>Criar conta</button>
      <div className="text-sm">Já tem? <Link to="/signin" className="underline">Voltar ao login</Link></div>
      <ConfirmModal open={ask} onClose={()=>setAsk(false)} title="Deseja realmente criar conta?" confirmText="Sim, criar" onConfirm={doSignUp}/>
    </div>
  );
}
