import ConfirmModal from "./ConfirmModal";
import { useState } from "react";
const COLORS = [
  {k:"red",n:"Vermelho",c:"bg-red-600"},
  {k:"green",n:"Verde",c:"bg-green-600"},
  {k:"blue",n:"Azul",c:"bg-blue-600"},
  {k:"yellow",n:"Amarelo",c:"bg-yellow-500"},
  {k:"purple",n:"Roxo",c:"bg-purple-600"},
  {k:"cyan",n:"Ciano",c:"bg-cyan-600"}
];
export default function ColorModal({open,onClose,onPick}:{open:boolean;onClose:()=>void;onPick:(k:string)=>void}){
  const [pending,setPending]=useState<string|null>(null);
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="card w-full max-w-md">
          <h3 className="text-xl font-extrabold mb-3">Escolha uma cor para favoritar</h3>
          <div className="grid grid-cols-1 gap-2">
            {COLORS.map(c=>(
              <button key={c.k} className="flex items-center gap-3 border-2 border-gray-400 rounded-xl p-3 hover:bg-gray-50"
                onClick={()=>setPending(c.k)}>
                <span className={`w-8 h-8 rounded-lg ${c.c} border-4 border-gray-800`}></span>
                <div className="font-bold">{c.n}</div>
                <div className="ml-auto text-xs opacity-70">Adicionar nesta cor</div>
              </button>
            ))}
          </div>
          <div className="mt-4 flex justify-end"><button className="btn-secondary" onClick={onClose}>Fechar</button></div>
        </div>
      </div>
      <ConfirmModal open={!!pending} title="Confirmar cor" desc={`Deseja adicionar na lista ${pending==="red"?"vermelha":pending}?`} confirmText="Sim, adicionar" cancelText="Cancelar" onConfirm={()=>{ if(pending) onPick(pending)}} onClose={()=>setPending(null)}/>
    </div>
  );
}
