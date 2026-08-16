import { prisma } from "@kissmyglam/db";
import { CategoriesManager } from "./CategoriesManager";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { products: true } },
      subtypes: {
        include: { _count: { select: { products: true } } },
        orderBy: { sortOrder: "asc" },
      },
    },
    orderBy: { sortOrder: "asc" },
  });

  return (
    <div className="w-full">
      <h1 className="font-serif text-4xl font-medium text-ink mb-10">Categories</h1>
      <CategoriesManager initialCategories={categories} />
    </div>
  );
}
