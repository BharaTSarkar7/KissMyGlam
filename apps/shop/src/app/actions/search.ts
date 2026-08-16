"use server";

import { prisma } from "@kissmyglam/db";

export async function searchLiveProducts(query: string) {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const cleanQuery = query.trim();

  const products = await prisma.product.findMany({
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
    take: 6,
    orderBy: [{ isSold: "asc" }, { createdAt: "desc" }],
    include: {
      category: { select: { name: true } },
      images: {
        where: { isPrimary: true },
        take: 1,
        select: { url: true },
      },
    },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: `₹${p.price.toString()}`,
    categoryName: p.category.name,
    imageUrl: p.images[0]?.url || "",
    isSold: p.isSold,
  }));
}
