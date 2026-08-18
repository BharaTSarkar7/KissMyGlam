import { prisma, Prisma } from "@kissmyglam/db";
import { ProductCard } from "@kissmyglam/ui/src/ProductCard";
import Link from "next/link";
import { Tag } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "On Sale | KissMyGlam",
  description: "Explore our limited-time markdowns and special offers on curated chic fashion.",
};

type RawSaleProduct = Prisma.ProductGetPayload<{
  include: {
    images: { where: { isPrimary: true }; take: 1 };
  };
}>;

export default async function SalePage() {
  const [rawProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isOnSale: true,
        isActive: true,
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
      },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      select: { id: true, name: true, slug: true },
    }),
  ]);

  const products = rawProducts.map((p: RawSaleProduct) => ({
    ...p,
    price: p.price.toString(),
  }));

  return (
    <main className="min-h-screen py-16 px-6 max-w-7xl mx-auto w-full">
      {/* Header */}
      <div className="mb-12 text-center md:text-left">
        <span className="text-xs font-semibold tracking-widest text-accent uppercase mb-2 inline-block">
          Special Offers
        </span>
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-ink mb-4">
          On Sale
        </h1>
        <p className="text-ink-soft max-w-2xl">
          Discover exclusive markdowns and special prices on our most coveted pieces.
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
            <Tag className="w-6 h-6 text-accent" />
          </div>
          <h2 className="font-serif text-2xl font-medium text-ink">
            No items on sale right now
          </h2>
          <p className="text-ink-soft text-sm">
            We don&apos;t have any items on sale at the moment. Check back soon for upcoming promotions, or explore our collections below.
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
