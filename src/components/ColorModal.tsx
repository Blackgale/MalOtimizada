// src/components/ColorModal.tsx
import { useState } from "react";
import ConfirmModal from "./ConfirmModal";

const COLORS = [
  {
    k: "red",
    n: "Vermelho",
    c: "bg-red-600",
    label: "Comprar agora",
  },
  {
    k: "green",
    n: "Verde",
    c: "bg-green-600",
    label: "Economizar pra comprar",
  },
  {
    k: "blue",
    n: "Azul",
    c: "bg-blue-800",
    label: "Comprar em breve",
  },
  {
    k: "yellow",
    n: "Amarelo",
    c: "bg-yellow-500",
    label: "Procurar parecidos",
  },
  {
    k: "purple",
    n: "Roxo",
    c: "bg-purple-600",
    label: "Ver avaliações",
  },
  {
    k: "cyan",
    n: "Ciano",
    c: "bg-cyan-600",
    label: "Ver em outro lugar",
  },
] as const;

type ColorKey = (typeof COLORS)[number]["k"];

export default function ColorModal({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (k: ColorKey) => void;
}) {
  const [pending, setPending] = useState<ColorKey | null>(null);

  if (!open) return null;

  const selected = COLORS.find((c) => c.k === pending);

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="card w-full max-w-md">
          <h3 className="text-xl font-extrabold mb-3">
            Selecione uma cor
          </h3>

          <div className="grid grid-cols-1 gap-2">
            {COLORS.map((c) => (
              <button
                key={c.k}
                className="flex items-center gap-3 border-2 border-gray-400 rounded-xl p-3 hover:bg-gray-50 text-left"
                onClick={() => setPending(c.k)}
              >
                <span
                  className={`w-8 h-8 rounded-lg ${c.c} border-4 border-gray-800`}
                ></span>

                <div className="flex flex-col">
                  <span className="font-bold">{c.n}</span>
                  <span className="text-xs opacity-70">{c.label}</span>
                </div>

                <div className="ml-auto text-xs opacity-70">
                  Adicionar nesta cor
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 flex justify-end">
            <button className="btn-secondary" onClick={onClose}>
              Fechar
            </button>
          </div>
        </div>
      </div>

      <ConfirmModal
        open={!!pending}
        title="Confirmar cor"
        desc={
          selected
            ? `Deseja adicionar na categoria "${selected.label}" (cor ${selected.n})?`
            : "Deseja adicionar na lista?"
        }
        confirmText="Sim, adicionar"
        cancelText="Cancelar"
        onConfirm={() => {
          if (pending) {
            onPick(pending);
          }
          setPending(null);
        }}
        onClose={() => setPending(null)}
      />
    </div>
  );
}
