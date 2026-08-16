import { prisma } from "@kissmyglam/db";
import { notFound } from "next/navigation";
import { SectionHeading } from "@kissmyglam/ui/src/SectionHeading";
import { ProductCard } from "@kissmyglam/ui/src/ProductCard";
import { ProductImageGallery } from "@kissmyglam/ui/src/ProductImageGallery";
import { ProductDetailsAccordion } from "@kissmyglam/ui/src/ProductDetailsAccordion";
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
        <div className="w-full">
          <ProductImageGallery images={product.images} productName={product.name} />
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
            ₹{product.price.toString()} {product.isSold && <span className="font-bold ml-2">SOLD</span>}
          </p>
          
          {/* Product Details Accordion */}
          <div className="mb-10">
            <ProductDetailsAccordion details={(product.details as { label: string; value: string }[]) || []} />
          </div>

          {product.isSold ? (
            <div className="py-6 px-4 bg-bg-alt/50 rounded-[14px] border border-line text-center">
              <span className="font-serif text-xl text-ink">Out of Stock</span>
              <p className="text-sm text-ink-soft mt-1">This item has been sold.</p>
            </div>
          ) : (
            <ProductActions 
              name={product.name}
              price={`₹${product.price.toString()}`}
              sizes={product.sizes}
              colours={product.colours}
              productUrl={`https://kissmyglam.com/product/${product.slug}`}
              sizeDetails={(product.sizeDetails as Record<string, { label: string; value: string }[]>) || {}}
            />
          )}
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
                price={`₹${related.price.toString()}`}
                slug={related.slug}
                imageUrl={related.images[0]?.url || ''}
                isSold={related.isSold}
              />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
