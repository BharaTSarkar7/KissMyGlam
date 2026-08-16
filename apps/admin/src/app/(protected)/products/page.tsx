import { prisma } from "@kissmyglam/db";
import { ProductList } from "./ProductList";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string }>;
}) {
  const { q, category } = await searchParams;

  const whereClause: Record<string, any> = {};
  if (q) {
    whereClause.name = {
      contains: q,
      mode: "insensitive",
    };
  }
  if (category) {
    whereClause.category = {
      slug: category,
    };
  }

  const [products, activeCategory] = await Promise.all([
    prisma.product.findMany({
      where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { name: true, slug: true } },
        subtype: { select: { name: true } },
        images: { where: { isPrimary: true }, take: 1, select: { url: true } },
        saleRecord: {
          select: {
            payment: true,
            boughtFor: true,
            soldFor: true,
          },
        },
      },
    }),
    category
      ? prisma.category.findUnique({
          where: { slug: category },
          select: { name: true, slug: true },
        })
      : null,
  ]);

  const formattedProducts = products.map((p) => ({
    ...p,
    price: Number(p.price),
    saleRecord: p.saleRecord
      ? {
          payment: p.saleRecord.payment,
          boughtFor: p.saleRecord.boughtFor ? Number(p.saleRecord.boughtFor) : null,
          soldFor: p.saleRecord.soldFor ? Number(p.saleRecord.soldFor) : null,
        }
      : null,
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

      <ProductList
        products={formattedProducts}
        activeCategory={activeCategory}
      />
    </div>
  );
}
