"use server";

import { auth } from "@/auth";
import { prisma } from "@kissmyglam/db";
import { revalidatePath } from "next/cache";

export async function updateSaleRecord(id: string, data: { boughtFor?: number | null; soldFor?: number | null; dateSold?: string | null; dateInStock?: string | null; payment?: "PAID" | "UNPAID" }) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.saleRecord.update({
    where: { id },
    data: {
      boughtFor: data.boughtFor,
      soldFor: data.soldFor,
      dateSold: data.dateSold ? new Date(data.dateSold) : data.dateSold === null ? null : undefined,
      dateInStock: data.dateInStock ? new Date(data.dateInStock) : undefined,
      payment: data.payment,
    },
  });

  revalidatePath("/analytics");
  return { success: true };
}

export async function updateTotalExpense(value: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  await prisma.adminSettings.upsert({
    where: { key: "total_expense" },
    update: { value },
    create: { key: "total_expense", value },
  });

  revalidatePath("/analytics");
  return { success: true };
}
