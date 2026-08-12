import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@kissmyglam/ui/src/Button";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="font-serif text-4xl font-medium text-ink mb-2">
          Dashboard
        </h1>
        <p className="text-ink-soft mb-10">
          Welcome back, {session.user.name || "Admin"}.
        </p>

        <div className="bg-white p-8 rounded-[24px] shadow-lg border border-line/50">
          <p className="text-ink-soft text-sm mb-6">
            This is a placeholder dashboard. Product and category management
            will be added in Phase 6.
          </p>

          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <Button type="submit" variant="ghost" className="w-full">
              Log Out
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
