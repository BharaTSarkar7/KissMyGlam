import { prisma, Prisma } from "@kissmyglam/db";
import { notFound } from "next/navigation";
import { CategoryProductView } from "./CategoryProductView";
import { Suspense } from "react";

type RawProduct = Prisma.ProductGetPayload<{
  include: {
    subtype: { select: { slug: true } };
    images: { where: { isPrimary: true }; take: 1 };
  };
}>;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) {
    notFound();
  }

  const [subtypes, rawProducts] = await Promise.all([
    prisma.subtype.findMany({
      where: { categoryId: category.id },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findMany({
      where: { categoryId: category.id, isActive: true },
      include: {
        subtype: { select: { slug: true } },
        images: { where: { isPrimary: true }, take: 1 },
      },
    })
  ]);

  const products = rawProducts.map((p: RawProduct) => ({
    ...p,
    price: p.price.toString(),
  }));

  return (
    <main className="min-h-screen py-16 px-6 max-w-7xl mx-auto w-full">
      <div className="mb-12 text-center md:text-left">
        <h1 className="font-serif text-4xl md:text-5xl font-medium text-ink mb-4">
          {category.name}
        </h1>
        <p className="text-ink-soft max-w-2xl">
          Explore our collection of {category.name.toLowerCase()}, designed for effortless style and everyday comfort.
        </p>
      </div>

      <Suspense fallback={<div className="h-20 animate-pulse bg-bg-alt rounded-full mb-8"></div>}>
        <CategoryProductView products={products} subtypes={subtypes} />
      </Suspense>
    </main>
  );
}
