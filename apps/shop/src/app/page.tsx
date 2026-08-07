import { prisma } from "@kissmyglam/db";
import { Button } from "@kissmyglam/ui/src/Button";
import { SectionHeading } from "@kissmyglam/ui/src/SectionHeading";
import { CategoryTile } from "@kissmyglam/ui/src/CategoryTile";
import { ProductCard } from "@kissmyglam/ui/src/ProductCard";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  let bestSellers = await prisma.product.findMany({
    where: { isFeatured: true, isActive: true },
    include: { images: { where: { isPrimary: true }, take: 1 } },
    take: 4,
  });

  if (bestSellers.length === 0) {
    bestSellers = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
      include: { images: { where: { isPrimary: true }, take: 1 } },
      take: 4,
    });
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] w-full bg-[#E5E0DA] flex items-center justify-center overflow-hidden">
        <Image 
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="Hero Fashion"
          fill
          className="object-cover opacity-50 mix-blend-multiply"
          priority
        />
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto flex flex-col items-center">
          <h1 className="font-serif text-5xl md:text-7xl font-bold text-ink mb-4 leading-tight">
            Redefine Your Everyday Style
          </h1>
          <p className="font-sans text-lg text-ink-soft mb-8 max-w-md">
            Discover the new collection. Premium materials, effortless silhouettes, and timeless designs for the modern wardrobe.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
            <Link href="/category/dresses" className="w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto">Shop The Sale</Button>
            </Link>
            <Link href="#categories" className="w-full sm:w-auto">
              <Button variant="outline" className="w-full sm:w-auto">View All Categories</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Shop By Category Section */}
      <section id="categories" className="py-20 px-6 max-w-7xl mx-auto w-full">
        <SectionHeading 
          title="Shop By Category" 
          subtitle="Explore our carefully curated collections for every occasion." 
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {categories.map((category) => (
            <CategoryTile
              key={category.id}
              name={category.name}
              slug={category.slug}
              imageUrl={category.imageUrl}
            />
          ))}
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-20 px-6 max-w-7xl mx-auto w-full">
        <SectionHeading 
          title="Best Sellers" 
          subtitle="Our most loved pieces, hand-picked for you." 
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-12">
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={`$${product.price.toString()}`}
              slug={product.slug}
              imageUrl={product.images[0]?.url || ''}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
