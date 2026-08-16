import { prisma } from "@kissmyglam/db";
import { ProductCard } from "@kissmyglam/ui/src/ProductCard";
import Link from "next/link";
import { Search } from "lucide-react";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const cleanQuery = q.trim();

  const products = cleanQuery
    ? await prisma.product.findMany({
        where: {
          isActive: true,
          OR: [
            {
              name: {
                contains: cleanQuery,
                mode: "insensitive",
              },
            },
            {
              category: {
                name: {
                  contains: cleanQuery,
                  mode: "insensitive",
                },
              },
            },
            {
              subtype: {
                name: {
                  contains: cleanQuery,
                  mode: "insensitive",
                },
              },
            },
          ],
        },
        orderBy: [{ isSold: "asc" }, { createdAt: "desc" }],
        include: {
          category: true,
          images: {
            where: { isPrimary: true },
            take: 1,
          },
        },
      })
    : [];

  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    take: 6,
  });

  return (
    <main className="min-h-screen py-12 lg:py-16 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-serif text-3xl md:text-4xl font-medium text-ink mb-2">
          {cleanQuery ? `Search Results for "${cleanQuery}"` : "Search Products"}
        </h1>
        <p className="text-ink-soft text-sm">
          {cleanQuery
            ? `Found ${products.length} product${products.length === 1 ? "" : "s"}`
            : "Search by product name, category, or style"}
        </p>
      </div>

      {cleanQuery && products.length === 0 ? (
        <div className="py-16 px-6 bg-bg-alt/40 border border-line rounded-[24px] text-center max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-bg flex items-center justify-center mx-auto text-ink-soft">
            <Search className="w-6 h-6 text-ink" />
          </div>
          <h2 className="font-serif text-2xl font-medium text-ink">
            No products found
          </h2>
          <p className="text-ink-soft text-sm">
            We couldn't find any matches for "{cleanQuery}". Try checking for spelling mistakes or browse our categories below.
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
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={`₹${product.price.toString()}`}
              slug={product.slug}
              imageUrl={product.images[0]?.url || ""}
              isSold={product.isSold}
            />
          ))}
        </div>
      )}
    </main>
  );
}
