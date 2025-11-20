// src/components/HeavyJunk.tsx
export default function HeavyJunk({ blocks = 6 }: { blocks?: number }) {
  const text = 'Este bloco existe apenas para carregar a página e não agrega nada. ';
  return (
    <div className="space-y-6">
      {Array.from({ length: blocks }).map((_, i) => (
        <div key={i} className="card border-4 border-gray-400">
          <h3 className="text-lg font-extrabold mb-2">Mais conteúdo desnecessário #{i + 1}</h3>
          <p className="text-sm leading-8">{text.repeat(160)}</p>
        </div>
      ))}
    </div>
  );
}
