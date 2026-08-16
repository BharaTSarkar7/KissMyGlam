import { prisma } from "@kissmyglam/db";
import Link from "next/link";
import Image from "next/image";
import { Package, ArrowRight, Image as ImageIcon } from "lucide-react";

export default async function InventoryPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: {
        select: {
          products: {
            where: {
              isActive: true,
              isSold: false,
            },
          },
        },
      },
      subtypes: {
        orderBy: { sortOrder: "asc" },
        include: {
          _count: {
            select: {
              products: {
                where: {
                  isActive: true,
                  isSold: false,
                },
              },
            },
          },
        },
      },
    },
  });

  const totalAvailable = categories.reduce(
    (sum, cat) => sum + cat._count.products,
    0
  );

  return (
    <div className="w-full space-y-10 pb-12">
      {/* Header */}
      <div>
        <h1 className="font-serif text-4xl font-medium text-ink mb-1">
          Inventory
        </h1>
        <p className="text-ink-soft text-sm">
          Live sellable stock breakdown across categories and subtypes.
        </p>
      </div>

      {/* Top Summary Card */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-[24px] border border-line/50 shadow-sm flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-widest text-ink-soft font-medium">
              Total Available Stock
            </span>
            <div className="w-8 h-8 rounded-full bg-bg-alt flex items-center justify-center text-ink-soft">
              <Package className="w-4 h-4 text-ink" />
            </div>
          </div>
          <span className="text-3xl font-serif font-medium text-ink">
            {totalAvailable}
          </span>
          <span className="text-xs text-ink-soft">
            Currently active & unsold items
          </span>
        </div>
      </section>

      {/* Per-Category Breakdown */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-2xl font-medium text-ink">
            Categories Breakdown
          </h2>
          <span className="text-xs text-ink-soft font-medium">
            Click any category to view its products
          </span>
        </div>

        {categories.length === 0 ? (
          <div className="p-12 text-center text-ink-soft bg-white rounded-[24px] border border-line/50">
            No categories found.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const availableCount = cat._count.products;
              const availableSubtypes = cat.subtypes.filter(
                (s) => s._count.products > 0
              );
              const isOutOfStock = availableCount === 0;

              return (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.slug}`}
                  className="group bg-white rounded-[24px] border border-line/50 p-6 shadow-sm hover:shadow-md hover:border-ink/20 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Top Row: Thumbnail + Category Name & Count */}
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3.5">
                        <div className="w-14 h-14 relative rounded-xl overflow-hidden bg-bg-alt border border-line flex-shrink-0 flex items-center justify-center">
                          {cat.imageUrl ? (
                            <Image
                              src={cat.imageUrl}
                              alt={cat.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-ink-soft" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-serif text-xl font-medium text-ink group-hover:text-ink/80 transition-colors">
                            {cat.name}
                          </h3>
                          <span className="text-xs text-ink-soft font-normal">
                            /{cat.slug}
                          </span>
                        </div>
                      </div>

                      {/* Stock Count Pill */}
                      <span
                        className={`text-xs px-3 py-1 rounded-full font-medium whitespace-nowrap ${
                          isOutOfStock
                            ? "bg-red-50 text-red-700 border border-red-200/60"
                            : "bg-green-50 text-green-800 border border-green-200/60"
                        }`}
                      >
                        {availableCount} available
                      </span>
                    </div>

                    {/* Subtype Breakdown List */}
                    <div className="pt-3 border-t border-line/40">
                      <span className="text-[11px] uppercase tracking-wider text-ink-soft font-medium block mb-2">
                        Subtypes
                      </span>
                      {availableSubtypes.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {availableSubtypes.map((sub) => (
                            <span
                              key={sub.id}
                              className="text-xs px-2.5 py-1 rounded-lg bg-bg-alt text-ink font-medium border border-line/50"
                            >
                              {sub.name}:{" "}
                              <span className="font-semibold text-ink">
                                {sub._count.products}
                              </span>
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-ink-soft italic">
                          {isOutOfStock
                            ? "0 available in stock"
                            : "No subtypes with stock"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Prompt */}
                  <div className="mt-5 pt-3 border-t border-line/30 flex items-center justify-end text-xs font-medium text-ink-soft group-hover:text-ink transition-colors gap-1">
                    <span>View products</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
