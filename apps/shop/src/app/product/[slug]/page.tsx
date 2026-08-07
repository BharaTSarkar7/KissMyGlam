import { prisma } from "@kissmyglam/db";
import { notFound } from "next/navigation";
import Image from "next/image";
import { SectionHeading } from "@kissmyglam/ui/src/SectionHeading";
import { ProductCard } from "@kissmyglam/ui/src/ProductCard";
import Link from "next/link";
import { ProductActions } from "./ProductActions";

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
              <div className="relative aspect-[4/5] w-full max-h-[80vh] rounded-[14px] overflow-hidden bg-bg-alt">
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
                    <div key={image.id} className="relative aspect-[4/5] w-full rounded-[14px] overflow-hidden bg-bg-alt">
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
            <div className="relative aspect-[4/5] w-full max-h-[80vh] rounded-[14px] overflow-hidden bg-bg-alt flex items-center justify-center">
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

          <ProductActions 
            name={product.name}
            price={`$${product.price.toString()}`}
            sizes={product.sizes}
            colours={product.colours}
            productUrl={`https://kissmyglam.com/product/${product.slug}`}
          />
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
