import { X } from "lucide-react";
export default function ConfirmModal({open,title,desc,confirmText="Confirmar",cancelText="Cancelar",onConfirm,onClose}:{open:boolean;title:string;desc?:string;confirmText?:string;cancelText?:string;onConfirm:()=>void;onClose:()=>void}){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg card bg-white relative">
          <button className="absolute right-3 top-3 btn-secondary" onClick={onClose}><X size={16}/></button>
          <h3 className="text-xl font-extrabold mb-2">{title}</h3>
          {desc && <p className="mb-4 leading-relaxed">{desc}</p>}
          <div className="flex gap-3 justify-end">
            <button className="btn-secondary" onClick={onClose}>{cancelText}</button>
            <button className="btn" onClick={()=>{onConfirm(); onClose();}}>{confirmText}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
