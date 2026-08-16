"use server";

import { auth } from "@/auth";
import { prisma } from "@kissmyglam/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { categorySchema, CategoryFormValues, subtypeSchema, SubtypeFormValues } from "@/lib/validations/category";

const idSchema = z.string().min(1, "ID is required");

export async function upsertCategory(data: CategoryFormValues, id?: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const validated = categorySchema.parse(data);
  const validatedId = id ? idSchema.parse(id) : undefined;

  if (validatedId) {
    await prisma.category.update({
      where: { id: validatedId },
      data: validated,
    });
  } else {
    await prisma.category.create({
      data: validated,
    });
  }

  revalidatePath("/categories");
  return { success: true };
}

export async function deleteCategory(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const validatedId = idSchema.parse(id);

  const category = await prisma.category.findUnique({
    where: { id: validatedId },
    include: {
      _count: { select: { products: true } },
      subtypes: {
        include: { _count: { select: { products: true } } },
      },
    },
  });

  if (!category) throw new Error("Category not found");

  if (category._count.products > 0) {
    throw new Error("Cannot delete category: it still has products assigned.");
  }

  const subtypesWithProducts = category.subtypes.filter((s) => s._count.products > 0);
  if (subtypesWithProducts.length > 0) {
    throw new Error("Cannot delete category: one or more subtypes still have products assigned.");
  }

  // Delete all subtypes first, then category
  await prisma.$transaction([
    prisma.subtype.deleteMany({ where: { categoryId: validatedId } }),
    prisma.category.delete({ where: { id: validatedId } }),
  ]);

  revalidatePath("/categories");
  return { success: true };
}

export async function upsertSubtype(data: SubtypeFormValues, id?: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const validated = subtypeSchema.parse(data);
  const validatedId = id ? idSchema.parse(id) : undefined;

  if (validatedId) {
    await prisma.subtype.update({
      where: { id: validatedId },
      data: validated,
    });
  } else {
    await prisma.subtype.create({
      data: validated,
    });
  }

  revalidatePath("/categories");
  return { success: true };
}

export async function deleteSubtype(id: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const validatedId = idSchema.parse(id);

  const subtype = await prisma.subtype.findUnique({
    where: { id: validatedId },
    include: { _count: { select: { products: true } } },
  });

  if (!subtype) throw new Error("Subtype not found");

  if (subtype._count.products > 0) {
    throw new Error("Cannot delete subtype: it still has products assigned.");
  }

  await prisma.subtype.delete({
    where: { id: validatedId },
  });

  revalidatePath("/categories");
  return { success: true };
}
