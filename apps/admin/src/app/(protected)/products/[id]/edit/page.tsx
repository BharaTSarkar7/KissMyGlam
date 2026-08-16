import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@kissmyglam/db";
import { ProductForm } from "../../ProductForm";
import Link from "next/link";
import { ProductFormValues } from "@/lib/validations/product";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;

  const [categories, subtypes, product] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true } }),
    prisma.subtype.findMany({ select: { id: true, categoryId: true, name: true } }),
    prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { sortOrder: "asc" },
        },
      },
    }),
  ]);

  if (!product) {
    notFound();
  }

  const initialData: Partial<ProductFormValues> & { id: string } = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    details: (product.details as { label: string; value: string }[]) || [],
    price: product.price.toString(),
    categoryId: product.categoryId,
    subtypeId: product.subtypeId || undefined,
    sizes: product.sizes,
    colours: product.colours,
    isFeatured: product.isFeatured,
    isActive: product.isActive,
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
      isPrimary: img.isPrimary,
      sortOrder: img.sortOrder,
    })),
  };

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <div className="mb-10">
        <Link href="/dashboard" className="text-sm text-ink-soft hover:text-ink flex items-center gap-1 mb-4">
          ← Back to Dashboard
        </Link>
        <h1 className="font-serif text-4xl font-medium text-ink">
          Edit Product
        </h1>
      </div>

      <ProductForm initialData={initialData} categories={categories} subtypes={subtypes} />
    </main>
  );
}
