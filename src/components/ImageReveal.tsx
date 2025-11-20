import { useState } from "react";
export default function ImageReveal({src,alt,className,auto}:{src:string;alt?:string;className?:string;auto?:boolean}){
  const [show,setShow]=useState(!!auto);
  return (
    <div className={className}>
      {!show?(
        <button className="w-full aspect-square bg-gray-100 border-4 border-gray-400 rounded-2xl text-xs" onClick={()=>setShow(true)}>CARREGAR IMAGEM</button>
      ):(
        <img src={src} alt={alt||""} loading="eager" className="w-full h-full object-cover rounded-2xl border-8 border-gray-400 shadow-heavy"/>
      )}
    </div>
  );
}
