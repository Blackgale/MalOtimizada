// src/components/ProductCard.tsx
import { Link, useNavigate } from "react-router-dom";
import { MouseEvent, useState } from "react";
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

// mesmas cores usadas no restante da app
const COLOR_BADGE_CLASSES: Record<string, string> = {
  red: "border-red-600 text-red-700",
  green: "border-green-600 text-green-700",
  blue: "border-blue-600 text-blue-700",
  yellow: "border-yellow-500 text-yellow-700",
  purple: "border-purple-600 text-purple-700",
  cyan: "border-cyan-600 text-cyan-700",
};

export default function ProductCard({ p }: { p: any }) {
  const navigate = useNavigate();
  const { items, add, remove } = useWishlist();

  const saved = items.find((i) => i.productId === p.id);

  const [open, setOpen] = useState(false); // escolher cor
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [pickedColor, setPickedColor] = useState<string | null>(null);
  const [confirmAdd, setConfirmAdd] = useState(false); // confirmar adição

  const cover = p.images?.[0] || p.image;

  const handleAddClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const handleRemoveClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    remove(p.id);  // Remover o item sem redirecionar
  };

  const handleConfirmAdd = () => {
    const color = pickedColor || "red";

    add({
      productId: p.id,
      color,
      addedAt: Date.now(),
    });

    setPickedColor(null);
    setConfirmAdd(false);
  };

  const badgeClass =
    saved && COLOR_BADGE_CLASSES[saved.color]
      ? COLOR_BADGE_CLASSES[saved.color]
      : "border-green-600 text-green-700";

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

          <div className="text-sm mt-1">
            Preço <b>${p.price.toFixed(2)}</b>
          </div>

          {/* DESCRIÇÃO <= 100 caracteres */}
          <p className="text-sm mt-2">{descricaoCurta(p.title)}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            {!saved ? (
              <>
                <button
                  type="button"
                  className="btn"
                  onClick={handleAddClick}
                >
                  Adicionar à lista (com confirmação)
                </button>
                <Link to={`/product/${p.id}`} className="btn-secondary">
                  Ver detalhes
                </Link>
              </>
            ) : (
              <>
                <div
                  className={`badge border-4 text-base font-extrabold ${badgeClass}`}
                >
                  SALVO NA COR {saved.color.toUpperCase()}
                </div>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleRemoveClick}
                >
                  Remover da lista de desejos
                </button>
                <Link to={`/product/${p.id}`} className="btn-secondary">
                  Ver detalhes
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* modal de escolha de cor */}
      <ColorModal
        open={open}
        onClose={() => setOpen(false)}
        onPick={(k) => {
          setPickedColor(k);
          setOpen(false);
          setConfirmAdd(true);
        }}
      />

      {/* confirmação para adicionar na wishlist */}
      <ConfirmModal
        open={confirmAdd}
        onClose={() => setConfirmAdd(false)}
        title="Confirmar adição"
        desc={`Deseja adicionar na lista na cor ${
          pickedColor || "vermelha"
        }?`}
        confirmText="Sim, adicionar"
        cancelText="Cancelar"
        onConfirm={handleConfirmAdd}
      />

      {/* confirmação para remover da wishlist */}
      <ConfirmModal
        open={confirmRemove}
        onClose={() => setConfirmRemove(false)}
        title="Remover produto"
        desc="Tem certeza que deseja remover este item da sua lista de desejos?"
        confirmText="Sim, remover"
        cancelText="Cancelar"
        onConfirm={handleRemoveClick}
      />
    </div>
  );
}
