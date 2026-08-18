import { prisma, Prisma } from "@kissmyglam/db";
import { ProductCard } from "@kissmyglam/ui/src/ProductCard";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New-Ins | KissMyGlam",
  description: "Discover our newest drops, seasonal statement pieces, and fresh additions to the collection.",
};

type RawFeaturedProduct = Prisma.ProductGetPayload<{
  include: {
    images: { where: { isPrimary: true }; take: 1 };
  };
}>;

export default async function NewInsPage() {
  const [rawProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isFeatured: true,
        isActive: true,
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  const products = rawProducts.map((p: RawFeaturedProduct) => ({
    ...p,
    price: p.price.toString(),
  }));

  return (
    <main className="min-h-screen py-16 px-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-2 inline-block">
          Fresh Arrivals
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-ink mb-4">
          New-Ins
        </h1>
        <p className="text-ink-soft max-w-2xl">
          Discover our newest drops, trend-forward silhouettes, and handpicked additions to our boutique.
        </p>
      </div>

      {/* Product Grid or Empty State */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={`₹${product.price}`}
              slug={product.slug}
              imageUrl={product.images[0]?.url || ""}
              isSold={product.isSold}
            />
          ))}
        </div>
      ) : (
        <div className="py-16 px-6 bg-bg-alt/40 border border-line rounded-[24px] text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-bg flex items-center justify-center mx-auto text-ink-soft">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
          <h2 className="font-serif text-2xl font-medium text-ink">
            No new-in items yet
          </h2>
          <p className="text-ink-soft text-sm">
            We&apos;re constantly curating fresh looks. Explore our current collections below.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="px-4 py-2 rounded-full bg-white border border-line/80 text-ink text-xs font-medium hover:border-ink transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
