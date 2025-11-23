import { useState } from "react";
import { useLocation } from "react-router-dom";
import data from "../data/products.json";
import { useWishlist } from "../store/useWishlist";
import ConfirmModal from "../components/ConfirmModal";
import ColorModal from "../components/ColorModal";

type Product = {
  id: string;
  title: string;
  price: number;
  tag?: string;
  image?: string;
  images?: string[];
};

const COLOR_STYLES: Record<string, string> = {
  red: "border-red-600 text-red-700",
  green: "border-green-600 text-green-700",
  blue: "border-blue-600 text-blue-700",
  yellow: "border-yellow-500 text-yellow-700",
  purple: "border-purple-600 text-purple-700",
  cyan: "border-cyan-600 text-cyan-700",
};

export default function Wishlist() {
  const { items, remove, reclassify } = useWishlist();

  const location = useLocation() as {
    state?: {
      justAdded?: { id: string; title: string; color: string };
    };
  };
  const justAdded = location.state?.justAdded;

  const [editId, setEditId] = useState<string | null>(null);
  const [pendingColor, setPendingColor] = useState<string | null>(null);
  const [confirmSave, setConfirmSave] = useState(false);

  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  // junta desejos com produtos (sem descartar se não achar no JSON)
  const list = items.map((w) => ({
    wish: w,
    product: (data as Product[]).find((p) => p.id === w.productId) || null,
  }));

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <h1 className="text-3xl font-extrabold">Lista de desejos (carregada)</h1>

      {justAdded && (
        <div className="card border-4 border-green-500 bg-green-50 text-green-800">
          Produto <b>{justAdded.title}</b> salvo na cor{" "}
          <b>{justAdded.color.toUpperCase()}</b>.
        </div>
      )}

      <div className="space-y-4">
        {items.length === 0 && (
          <div className="card border-4 border-gray-400">
            Nada salvo ainda. Vá em <b>Produtos</b> e adicione MUITO conteúdo!
          </div>
        )}

        {list.map(({ wish, product }) => {
          const cover =
            product?.image || product?.images?.[0] || "/img-placeholder.svg";

          const colorClass =
            COLOR_STYLES[wish.color] ||
            "border-green-600 text-green-700"; /* fallback */

          return (
            <div
              className="card border-4 border-gray-400"
              key={wish.productId}
            >
              <div className="flex items-center gap-4">
                {/* imagem carrega automaticamente (modo pesado) */}
                <a className="w-28 shrink-0" href={`/product/${wish.productId}`}>
                  <img
                    src={cover}
                    alt={product?.title || wish.productId}
                    loading="eager"
                    className="w-full aspect-square object-cover rounded-2xl border-8 border-gray-400 shadow-heavy"
                  />
                </a>

                <div className="flex-1">
                  <a
                    href={`/product/${wish.productId}`}
                    className="text-lg font-extrabold underline"
                    title="Ir para detalhes"
                  >
                    {product?.title || `Produto ${wish.productId}`}
                  </a>
                  <div className="text-sm">
                    Preço:{" "}
                    <b>
                      {product
                        ? `$${product.price.toFixed(2)}`
                        : "ver detalhes"}
                    </b>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-2">
                    <button
                      className="btn-secondary"
                      onClick={() => setEditId(wish.productId)}
                    >
                      Editar categoria (com confirmação)
                    </button>

                    <button
                      className="btn-secondary"
                      onClick={() => setConfirmRemove(wish.productId)}
                    >
                      Remover (confirmar)
                    </button>

                    {/* botões extras para “pesar” */}
                    <button className="btn-secondary">Botão a mais</button>
                    <button className="btn-secondary">Outro botão</button>
                  </div>
                </div>

                <div
                  className={`badge text-base font-extrabold ${colorClass}`}
                >
                  COR: {wish.color.toUpperCase()}
                </div>
              </div>

              {/* blocos extras para deixar pesado */}
              <div className="mt-4 grid grid-cols-1 sm-grid-cols-3 sm:grid-cols-3 gap-3">
                <div className="card border-4 border-gray-300">
                  Bloco extra 1 com texto inútil. {("x ").repeat(200)}
                </div>
                <div className="card border-4 border-gray-300">
                  Bloco extra 2 com texto inútil. {("x ").repeat(200)}
                </div>
                <div className="card border-4 border-gray-300">
                  Bloco extra 3 com texto inútil. {("x ").repeat(200)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal de escolha de cor */}
      <ColorModal
        open={!!editId}
        onClose={() => {
          setEditId(null);
          setPendingColor(null);
        }}
        onPick={(k) => {
          setPendingColor(k);
          setConfirmSave(true);
        }}
      />

      {/* Confirma salvar a categoria */}
      <ConfirmModal
        open={confirmSave}
        onClose={() => setConfirmSave(false)}
        title="Salvar categoria?"
        desc={
          pendingColor
            ? `Deseja realmente salvar a nova categoria na cor ${pendingColor}?`
            : "Deseja realmente salvar a nova categoria?"
        }
        confirmText="Salvar"
        cancelText="Cancelar"
        onConfirm={() => {
          if (editId && pendingColor) {
            reclassify(editId, pendingColor);
          }
          setEditId(null);
          setPendingColor(null);
          setConfirmSave(false);
        }}
      />

      {/* Confirma remover item */}
      <ConfirmModal
        open={!!confirmRemove}
        onClose={() => setConfirmRemove(null)}
        title="Remover item?"
        desc="Tem certeza que deseja remover este item da lista?"
        confirmText="Remover"
        cancelText="Cancelar"
        onConfirm={() => {
          if (confirmRemove) remove(confirmRemove);
          setConfirmRemove(null);
        }}
      />
    </div>
  );
}
