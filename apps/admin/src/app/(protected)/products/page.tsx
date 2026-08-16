import { prisma } from "@kissmyglam/db";
import { ProductList } from "./ProductList";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;

  const products = await prisma.product.findMany({
    where: q
      ? {
          name: {
            contains: q,
            mode: "insensitive",
          },
        }
      : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      subtype: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1, select: { url: true } },
    },
  });

  const formattedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
  }));

  return (
    <div className="w-full">
      <div className="mb-10">
        <h1 className="font-serif text-4xl font-medium text-ink mb-1">
          Products
        </h1>
        <p className="text-ink-soft text-sm">
          Manage your inventory and store listings.
        </p>
      </div>

      <ProductList products={formattedProducts} />
    </div>
  );
}
