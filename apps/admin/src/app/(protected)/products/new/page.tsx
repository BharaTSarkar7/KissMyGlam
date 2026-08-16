import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "@kissmyglam/db";
import { ProductForm } from "../ProductForm";
import Link from "next/link";

export default async function NewProductPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const [categories, subtypes] = await Promise.all([
    prisma.category.findMany({ select: { id: true, name: true } }),
    prisma.subtype.findMany({ select: { id: true, categoryId: true, name: true } }),
  ]);

  return (
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <div className="mb-10">
        <Link href="/dashboard" className="text-sm text-ink-soft hover:text-ink flex items-center gap-1 mb-4">
          ← Back to Dashboard
        </Link>
        <h1 className="font-serif text-4xl font-medium text-ink">
          New Product
        </h1>
      </div>

      <ProductForm categories={categories} subtypes={subtypes} />
    </main>
  );
}
