import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminShell } from "./AdminShell";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
