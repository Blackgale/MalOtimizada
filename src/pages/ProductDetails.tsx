// src/pages/ProductDetails.tsx
import { Link, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

import ProductCarousel from "../components/ProductCarousel";
import ColorModal from "../components/ColorModal";
import ConfirmModal from "../components/ConfirmModal";
import { useWishlist } from "../store/useWishlist";

type ApiProductDetails = {
  id: string;
  name: string;
  description: string;
  carousel: { baseUrl: string; isMainImage: boolean }[];
  details: { productDetail: string }[];
  price?: number;
};

type Product = {
  id: string;
  title: string;
  price: number | null;
  tag?: string;
  image?: string;
  images?: string[];
};

type ApiReview = {
  id: string;
  author: string;
  rating: number;
  text: string;
  createdAt: string;
  likes?: number;
  replies?: number;
};

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [reviews, setReviews] = useState<ApiReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const { add } = useWishlist();

  const [openColor, setOpenColor] = useState(false);
  const [askConfirm, setAskConfirm] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [showAllDesc, setShowAllDesc] = useState(false);

  // buscar produto na API
  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Falha ao buscar produto");
        const data: ApiProductDetails = await res.json();

        const mapped: Product = {
          id: data.id,
          title: data.name,
          price: data.price ?? null,
          images: data.carousel?.map((c) => c.baseUrl) ?? [],
        };

        setProduct(mapped);
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? "Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  // buscar reviews na API
  useEffect(() => {
    if (!id) return;

    async function fetchReviews() {
      try {
        const res = await fetch(`/api/products/${id}/reviews`);
        if (!res.ok) {
          // se a rota ainda não existir, só não quebra a página
          setReviews([]);
          return;
        }
        const data: ApiReview[] = await res.json();
        setReviews(data);
      } catch (e) {
        console.error(e);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    }

    fetchReviews();
  }, [id]);

  const images = useMemo(
    () =>
      product?.images && product.images.length
        ? product.images
        : product?.image
        ? [product.image]
        : [],
    [product]
  );

  const longDescription = useMemo(() => {
    if (!product) return [""];
    return [
      `O ${product.title} foi criado para entregar conforto imediato e um visual versátil que funciona tanto em rotinas aceleradas quanto em momentos de descanso. A construção prioriza toque suave e durabilidade, mantendo um caimento que abraça o corpo sem apertar. A proposta é ser aquele item que você veste sem pensar, porque combina com quase tudo e te acompanha o dia inteiro.`,
      `Nos detalhes, o ${product.title} recebe acabamentos pensados para uso intenso: costuras reforçadas, materiais que resistem a lavagens frequentes e uma estrutura que não perde a forma. O resultado é um equilíbrio entre praticidade e estética — fácil de combinar, agradável de usar e com aparência sempre presenteável.`,
      `Para compor looks, a peça conversa bem com jeans, calças leves e sobreposições. Funciona no escritório, na correria do mercado, em viagens curtas e em encontros casuais. A intenção é simplificar a escolha diária e manter um padrão de conforto que te acompanha do início ao fim do dia.`,
      `Se você valoriza itens funcionais, que realmente entram na sua rotação semanal, o ${product.title} é uma escolha segura. É aquele tipo de compra que rende, porque resolve rápido o “o que vestir” com um toque de estilo sem esforço.`,
    ];
  }, [product]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-6">Carregando produto...</div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        Produto não encontrado.
      </div>
    );
  }

  const onPickColor = (c: string) => {
    setPicked(c);
    setOpenColor(false);
    setAskConfirm(true);
  };

  const confirmAdd = () => {
    add({
      productId: product.id,
      color: picked || "red",
      addedAt: Date.now(),
    });
    setPicked(null);
  };

  return (
    <div className="mx-auto max-w-6xl p-4 sm:p-6 space-y-6">
      {/* voltar */}
      <div>
        <Link to="/" className="btn-secondary">
          ← Voltar
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* imagem grande / carrossel com bordas */}
        <div>
          <ProductCarousel
            images={images.length ? images : ["/img1.svg"]}
            title={product.title}
          />
        </div>

        {/* lado direito: título, preço, chips e CTA */}
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold">{product.title}</h1>
          {product.price != null && (
            <div className="text-xl opacity-90">
              R$ {product.price.toFixed(2).replace(".", ",")}
            </div>
          )}

          {/* chips “especificações” só para compor a UI pesada */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-xl px-4 py-3 border-2 border-white/10 bg-white/5 dark:bg-white/5">
              Conectividade: Bluetooth 5.0
            </div>
            <div className="rounded-xl px-4 py-3 border-2 border-white/10 bg-white/5 dark:bg-white/5">
              Peso: 250g
            </div>
            <div className="rounded-xl px-4 py-3 border-2 border-white/10 bg-white/5 dark:bg-white/5">
              Bateria: 45 horas
            </div>
            <div className="rounded-xl px-4 py-3 border-2 border-white/10 bg-white/5 dark:bg-white/5">
              Cor: Midnight Black
            </div>
          </div>

          <button className="btn" onClick={() => setOpenColor(true)}>
            Salvar na lista de desejos
          </button>
        </div>
      </div>

      {/* DESCRIÇÃO LONGA (com “ver mais”) */}
      <div className="card space-y-4">
        <h2 className="text-xl font-extrabold">Descrição</h2>
        <p className="leading-7 opacity-90">{longDescription[0]}</p>
        <p
          className={`leading-7 opacity-90 ${
            showAllDesc ? "" : "hidden sm:block line-clamp-5"
          }`}
        >
          {longDescription[1]}
        </p>
        <p
          className={`leading-7 opacity-90 ${
            showAllDesc ? "" : "hidden sm:block line-clamp-5"
          }`}
        >
          {longDescription[2]}
        </p>
        <p
          className={`leading-7 opacity-90 ${
            showAllDesc ? "" : "hidden sm:block line-clamp-5"
          }`}
        >
          {longDescription[3]}
        </p>

        <div className="flex gap-2">
          <button
            className="btn-secondary"
            onClick={() => setShowAllDesc((v) => !v)}
          >
            {showAllDesc ? "Mostrar menos" : "Ler mais"}
          </button>
          <Link to="/wishlist" className="btn-secondary">
            Ver minha lista
          </Link>
        </div>
      </div>

      {/* SEÇÃO BENEFÍCIOS */}
      <div className="card space-y-3">
        <h2 className="text-xl font-extrabold">Benefícios</h2>
        <ul className="list-disc pl-6 space-y-2 opacity-90 leading-7">
          <li>
            Conforto consistente para uso prolongado em diferentes
            temperaturas e ambientes.
          </li>
          <li>
            Materiais e costuras reforçadas pensados para manter o formato
            após várias lavagens.
          </li>
          <li>
            Combina com looks casuais e arrumados, reduzindo o tempo de
            decisão no dia a dia.
          </li>
          <li>
            Design funcional: fácil de vestir, de cuidar e de transportar em
            viagens.
          </li>
          <li>
            Peça curinga que entra na rotação semanal, elevando o
            aproveitamento do guarda-roupa.
          </li>
        </ul>
      </div>

      {/* SEÇÃO CUIDADOS */}
      <div className="card space-y-2">
        <h2 className="text-xl font-extrabold">Cuidados</h2>
        <p className="opacity-90 leading-7">
          Lave com cores similares, seque à sombra e evite temperaturas muito
          altas para preservar o toque e o caimento. Não utilize alvejante e,
          se possível, lave do avesso para maior durabilidade.
        </p>
      </div>

      {/* SEÇÃO REVIEWS (API) */}
      <div className="card space-y-3">
        <h2 className="text-xl font-extrabold">Avaliações</h2>
        {loadingReviews ? (
          <p className="opacity-80 text-sm">Carregando avaliações...</p>
        ) : reviews.length === 0 ? (
          <p className="opacity-80 text-sm">
            Ainda não há avaliações para este produto.
          </p>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="rounded-xl border border-white/10 bg-white/5 p-3 space-y-1 text-sm"
              >
                <div className="flex justify-between">
                  <span className="font-semibold">{r.author}</span>
                  <span className="opacity-60 text-xs">
                    {r.createdAt?.slice(0, 10)}
                  </span>
                </div>
                <div className="text-xs">
                  {"★".repeat(r.rating)}
                  {"☆".repeat(Math.max(0, 5 - r.rating))}
                </div>
                <p className="opacity-90">{r.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* modais */}
      <ColorModal
        open={openColor}
        onClose={() => setOpenColor(false)}
        onPick={onPickColor}
      />
      <ConfirmModal
        open={askConfirm}
        onClose={() => setAskConfirm(false)}
        title="Confirmar adição"
        desc={`Deseja adicionar na lista na cor ${
          picked || "vermelha"
        }?`}
        confirmText="Sim, adicionar"
        cancelText="Cancelar"
        onConfirm={confirmAdd}
      />
    </div>
  );
}
