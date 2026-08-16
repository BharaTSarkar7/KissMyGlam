"use server";

import { auth } from "@/auth";
import { prisma } from "@kissmyglam/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { saleRecordUpdateSchema, totalExpenseSchema, SaleRecordUpdateValues } from "@/lib/validations/analytics";

const idSchema = z.string().min(1, "ID is required");

export async function updateSaleRecord(id: string, data: SaleRecordUpdateValues) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const validatedId = idSchema.parse(id);
  const validatedData = saleRecordUpdateSchema.parse(data);

  await prisma.saleRecord.update({
    where: { id: validatedId },
    data: {
      boughtFor: validatedData.boughtFor,
      soldFor: validatedData.soldFor,
      dateSold: validatedData.dateSold ? new Date(validatedData.dateSold) : validatedData.dateSold === null ? null : undefined,
      dateInStock: validatedData.dateInStock ? new Date(validatedData.dateInStock) : undefined,
      payment: validatedData.payment,
    },
  });

  revalidatePath("/analytics");
  return { success: true };
}

export async function updateTotalExpense(value: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const validated = totalExpenseSchema.parse({ value });

  await prisma.adminSettings.upsert({
    where: { key: "total_expense" },
    update: { value: validated.value },
    create: { key: "total_expense", value: validated.value },
  });

  revalidatePath("/analytics");
  return { success: true };
}
