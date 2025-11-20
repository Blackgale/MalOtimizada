import { useState } from "react";
export default function ProductCarousel({images,title}:{images:string[];title:string}){
  const [i,setI]=useState(0);
  return (
    <div className="space-y-3">
      <img src={images[i]||images[0]} alt={title} className="w-full aspect-square object-cover rounded-2xl border-8 border-gray-400 shadow-heavy"/>
      <div className="grid grid-cols-5 gap-2">
        {images.map((src,idx)=>(
          <button key={src+idx} onClick={()=>setI(idx)} className={"rounded-xl overflow-hidden border-4 "+(i===idx?"border-green-600":"border-gray-300")}>
            <img src={src} alt="" className="w-full aspect-square object-cover"/>
          </button>
        ))}
      </div>
    </div>
  );
}
