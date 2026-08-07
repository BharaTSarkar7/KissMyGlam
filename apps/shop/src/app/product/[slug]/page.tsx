import { prisma } from "@kissmyglam/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { SectionHeading } from "@kissmyglam/ui/src/SectionHeading";
import { ProductCard } from "@kissmyglam/ui/src/ProductCard";
import { Button } from "@kissmyglam/ui/src/Button";
import Link from "next/link";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      subtype: true,
      images: {
        orderBy: [{ isPrimary: "desc" }, { sortOrder: "asc" }],
      },
    },
  });

  if (!product || !product.isActive) {
    notFound();
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      id: { not: product.id },
    },
    include: {
      images: { where: { isPrimary: true }, take: 1 },
    },
    take: 4,
  });

  return (
    <main className="min-h-screen pb-20">
      {/* Product Details Section */}
      <section className="max-w-7xl mx-auto px-6 py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          {product.images.length > 0 ? (
            <>
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-bg-alt">
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].altText || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {product.images.slice(1).map((image) => (
                    <div key={image.id} className="relative aspect-[3/4] w-full rounded-xl overflow-hidden bg-bg-alt">
                      <Image
                        src={image.url}
                        alt={image.altText || product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-bg-alt flex items-center justify-center">
              <span className="text-ink-soft">No image available</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <div className="mb-2">
            <Link href={`/category/${product.category.slug}`} className="text-sm text-ink-soft hover:text-ink transition-colors uppercase tracking-wider font-medium">
              {product.category.name}
            </Link>
          </div>
          <h1 className="font-serif text-4xl lg:text-5xl font-medium text-ink mb-4">
            {product.name}
          </h1>
          <p className="font-sans text-xl text-ink mb-8">
            ${product.price.toString()}
          </p>
          
          <div className="prose prose-sm text-ink-soft mb-10 leading-relaxed">
            <p>{product.description}</p>
          </div>

          {/* Sizes */}
          {product.sizes.length > 0 && (
            <div className="mb-8">
              <h3 className="text-sm font-medium uppercase tracking-wider text-ink mb-4">Size</h3>
              <div className="flex gap-3 flex-wrap">
                {product.sizes.map((size) => (
                  <button key={size} className="w-12 h-12 flex items-center justify-center border border-ink/20 rounded-full text-sm font-medium text-ink hover:border-ink transition-colors">
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colours */}
          {product.colours.length > 0 && (
            <div className="mb-10">
              <h3 className="text-sm font-medium uppercase tracking-wider text-ink mb-4">Colour</h3>
              <div className="flex gap-3 flex-wrap">
                {product.colours.map((colour) => (
                  <button key={colour} className="px-4 h-10 flex items-center justify-center border border-ink/20 rounded-full text-sm font-medium text-ink hover:border-ink transition-colors">
                    {colour}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Buy on Instagram Placeholder */}
          <div className="p-6 border-2 border-dashed border-ink/20 rounded-2xl bg-bg-alt flex flex-col items-center justify-center text-center gap-3">
            <span className="text-sm font-medium text-ink-soft uppercase tracking-wider">[ Placeholder: Buy on Instagram Button ]</span>
            <p className="text-xs text-ink-soft/70 max-w-[200px]">This area is reserved for the Instagram integration in Phase 4.</p>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-6 py-20 border-t border-ink/10">
          <SectionHeading 
            title="You Might Also Like" 
            subtitle={`More from our ${product.category.name} collection.`} 
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12">
            {relatedProducts.map((related) => (
              <ProductCard
                key={related.id}
                name={related.name}
                price={`$${related.price.toString()}`}
                slug={related.slug}
                imageUrl={related.images[0]?.url || ''}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
