// src/pages/Products.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

type ApiProduct = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

type Product = {
  id: string;
  title: string;
  price: number;
  tag?: string;
  image?: string;
  images?: string[];
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Falha ao buscar produtos");
        const data: ApiProduct[] = await res.json();

        const mapped: Product[] = data.map((p) => ({
          id: p.id,
          title: p.name,
          price: p.price,
          image: p.imageUrl,
        }));

        setProducts(mapped);
      } catch (e: any) {
        console.error(e);
        setError(e.message ?? "Erro ao carregar produtos");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl p-6">Carregando produtos...</div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl p-6 text-red-400">
        Erro: {error}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6 space-y-6">
      <h1 className="text-3xl font-extrabold">Produtos</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p) => (
          <Link key={p.id} to={`/product/${p.id}`} className="block">
            <ProductCard p={p} />
          </Link>
        ))}
      </div>
    </div>
  );
}
