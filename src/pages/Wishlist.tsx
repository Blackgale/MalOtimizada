// src/pages/Wishlist.tsx
import data from "../data/products.json";
import { useWishlist } from "../store/useWishlist";
import ConfirmModal from "../components/ConfirmModal";
import ColorModal from "../components/ColorModal";
import { useState } from "react";

type Product = {
  id: string;
  title: string;
  price: number;
  tag?: string;
  image?: string;
  images?: string[];
};

export default function Wishlist() {
  const { items, remove, reclassify } = useWishlist();

  // edição de cor com confirmação
  const [editId, setEditId] = useState<string | null>(null);
  const [pendingColor, setPendingColor] = useState<string | null>(null);
  const [confirmSave, setConfirmSave] = useState(false);

  // confirmação de remoção
  const [confirmRemove, setConfirmRemove] = useState<string | null>(null);

  // junta desejos com produtos (e tira os que não existem)
  const list = items
    .map((w) => ({
      wish: w,
      product: (data as Product[]).find((p) => p.id === w.productId),
    }))
    .filter((x) => !!x.product) as { wish: typeof items[number]; product: Product }[];

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <h1 className="text-3xl font-extrabold">Lista de desejos (carregada)</h1>

      <div className="space-y-4">
        {list.length === 0 && (
          <div className="card border-4 border-gray-400">
            Nada salvo ainda. Vá em <b>Produtos</b> e adicione MUITO conteúdo!
          </div>
        )}

        {list.map(({ wish, product }) => {
          const cover = product.image || product.images?.[0];
          return (
            <div className="card border-4 border-gray-400" key={wish.productId}>
              <div className="flex items-center gap-4">
                {/* imagem carrega automaticamente (modo pesado) */}
                <a className="w-28 shrink-0" href={`/product/${product.id}`}>
                  <img
                    src={cover}
                    alt={product.title}
                    loading="eager"
                    className="w-full aspect-square object-cover rounded-2xl border-8 border-gray-400 shadow-heavy"
                  />
                </a>

                <div className="flex-1">
                  <a
                    href={`/product/${product.id}`}
                    className="text-lg font-extrabold underline"
                    title="Ir para detalhes"
                  >
                    {product.title}
                  </a>
                  <div className="text-sm">
                    Preço: <b>${product.price.toFixed(2)}</b>
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

                <div className="badge border-4 border-green-600 text-green-700 text-base font-extrabold">
                  COR: {wish.color.toUpperCase()}
                </div>
              </div>

              {/* blocos redundantes para deixar a página mais pesada */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
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

      {/* Modal de escolha de cor (abre ao clicar em “Editar categoria”) */}
      <ColorModal
        open={!!editId}
        onClose={() => {
          setEditId(null);
          setPendingColor(null);
        }}
        onPick={(k) => {
          setPendingColor(k);
          setConfirmSave(true); // pergunta “Deseja salvar?”
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
