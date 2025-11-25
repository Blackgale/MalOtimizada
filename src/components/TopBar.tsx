import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../store/useAuth";
import { preloadAllAssets } from "../utils/preload";

export default function TopBar(){
  const { user, signOut } = useAuth(); const loc = useLocation();
  return (
    <header className="bg-white border-b-4 border-gray-300 sticky top-0 z-40">
      <div className="mx-auto max-w-7xl px-6 py-4 flex items-center gap-4">
        <Link to={user?"/":"/signin"} className="text-2xl font-extrabold tracking-widest">MYCAELLI SUPER STORE</Link>
        {user && <Link to="/wishlist" className="badge">Lista de desejos pesada</Link>}

    
        <div className="ml-auto flex gap-2">
          {!user && loc.pathname!=="/signin" && <Link to="/signin" className="btn-secondary">Entrar</Link>}
          {!user && loc.pathname!=="/signup" && <Link to="/signup" className="btn">Criar conta</Link>}
          {user && <><span className="badge">Olá {user.name}</span><button className="btn-secondary" onClick={()=>signOut()}>Sair</button></>}
        </div>
      </div>
    </header>
  );
}
