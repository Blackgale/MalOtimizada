import { Link } from "react-router-dom";
import { useState } from "react";
import ColorModal from "./ColorModal";
import ConfirmModal from "./ConfirmModal";
import { useWishlist } from "../store/useWishlist";
import { limit } from "../utils/text";

// descrição base (curta) e depois aplicamos limit(…, 100)
function descricaoCurta(title: string) {
  const base =
    `Peça versátil para o dia a dia. ${title} une conforto e estilo com acabamento durável.`;
  return limit(base, 100);
}

export default function ProductCard({ p }: { p: any }) {
  const { items, add, remove } = useWishlist();
  const saved = items.find((i) => i.productId === p.id);
  const [open, setOpen] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const cover = p.images?.[0] || p.image;

  return (
    <div className="card space-y-3">
      <div className="flex gap-4">
        {/* IMAGEM CLICÁVEL */}
        <Link to={`/product/${p.id}`} className="w-28 shrink-0">
          <img
            src={cover}
            alt={p.title}
            loading="eager"
            className="w-full aspect-square object-cover rounded-2xl border-8 border-gray-400 shadow-heavy"
          />
        </Link>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            {/* TÍTULO CLICÁVEL */}
            <Link
              to={`/product/${p.id}`}
              className="text-lg font-extrabold leading-tight underline"
              title="Ver detalhes"
            >
              {p.title}
            </Link>
            {p.tag && <span className="badge">Tag: {p.tag}</span>}
          </div>

          <div className="text-sm mt-1">Preço <b>${p.price.toFixed(2)}</b></div>

          {/* DESCRIÇÃO <= 100 caracteres */}
          <p className="text-sm mt-2">{descricaoCurta(p.title)}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {!saved ? (
              <>
                <button className="btn" onClick={() => setOpen(true)}>
                  Adicionar à lista (com confirmação)
                </button>
                <Link to={`/product/${p.id}`} className="btn-secondary">
                  Ver detalhes
                </Link>
              </>
            ) : (
              <>
                <div className="badge border-4 border-green-600 text-green-700 text-base font-extrabold">
                  SALVO NA COR {saved.color.toUpperCase()}
                </div>
                <button
                  className="btn-secondary"
                  onClick={() => setConfirmRemove(true)}
                >
                  Remover (confirmar)
                </button>
                <Link to={`/product/${p.id}`} className="btn-secondary">
                  Ver detalhes
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* modais */}
      <ColorModal
        open={open}
        onClose={() => setOpen(false)}
        onPick={(k) => add({ productId: p.id, color: k, addedAt: Date.now() })}
      />
      <ConfirmModal
        open={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        title="Remover produto"
        desc="Tem certeza que deseja remover este item da sua lista de desejos?"
        confirmText="Sim, remover"
        cancelText="Cancelar"
        onConfirm={() => remove(p.id)}
      />
    </div>
  );
}
