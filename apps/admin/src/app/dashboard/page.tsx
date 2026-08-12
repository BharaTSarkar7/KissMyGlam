import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@kissmyglam/ui/src/Button";
import { prisma } from "@kissmyglam/db";
import { ProductList } from "./ProductList";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

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
    <main className="min-h-screen p-6 md:p-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
        <div>
          <h1 className="font-serif text-4xl font-medium text-ink mb-1">
            Dashboard
          </h1>
          <p className="text-ink-soft text-sm">
            Welcome back, {session.user.name || "Admin"}.
          </p>
        </div>
        
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}
        >
          <Button type="submit" variant="ghost" className="text-sm">
            Log Out
          </Button>
        </form>
      </div>

      <ProductList products={formattedProducts} />
    </main>
  );
}
