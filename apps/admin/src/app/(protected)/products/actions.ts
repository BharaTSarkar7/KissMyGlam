"use server";

import { auth } from "@/auth";
import { prisma } from "@kissmyglam/db";
import { createClient } from "@supabase/supabase-js";
import { productSchema, ProductFormValues } from "@/lib/validations/product";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

// Initialize Supabase client with Service Role Key (Server-only)
const supabaseUrl = process.env.SUPABASE_URL?.trim()!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()!;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET?.trim().replace(/^"|"$/g, '') || "product-images";

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

/**
 * Uploads an image to Supabase Storage securely using the Service Role Key.
 * Only callable by authenticated admins.
 */
export async function uploadImage(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const file = formData.get("file") as File | null;
  if (!file) {
    throw new Error("No file provided");
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error("Invalid file type. Only JPG, PNG, and WEBP are allowed.");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File is too large. Max size is 5MB.");
  }

  // Generate a unique filename
  const extension = file.name.split(".").pop();
  const uniqueId = crypto.randomUUID();
  const filename = `${uniqueId}.${extension}`;

  // Read file as ArrayBuffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucketName)
    .upload(filename, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Supabase upload error:", error);
    throw new Error("Failed to upload image");
  }

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucketName).getPublicUrl(data.path);

  return { url: publicUrl };
}

/**
 * Creates or updates a product.
 * @param data The validated product form data
 * @param id The product ID (if updating)
 */
export async function upsertProduct(data: ProductFormValues, id?: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // Validate the data on the server
  const validated = productSchema.parse(data);

  // Prisma transaction to handle product and its images
  await prisma.$transaction(async (tx) => {
    let productId = id;

    if (id) {
      // Update existing
      await tx.product.update({
        where: { id },
        data: {
          name: validated.name,
          slug: validated.slug,
          details: validated.details,
          price: validated.price,
          categoryId: validated.categoryId,
          subtypeId: validated.subtypeId || null,
          sizes: validated.sizes,
          colours: validated.colours,
          isFeatured: validated.isFeatured,
          isActive: validated.isActive,
          isSold: validated.isSold,
        },
      });

      // Simple strategy for images: delete existing and re-insert
      // In a real large app, you might diff them, but this is fine since it's just metadata
      await tx.productImage.deleteMany({
        where: { productId: id },
      });
    } else {
      // Create new
      const newProduct = await tx.product.create({
        data: {
          name: validated.name,
          slug: validated.slug,
          details: validated.details,
          price: validated.price,
          categoryId: validated.categoryId,
          subtypeId: validated.subtypeId || null,
          sizes: validated.sizes,
          colours: validated.colours,
          isFeatured: validated.isFeatured,
          isActive: validated.isActive,
          isSold: validated.isSold,
        },
      });
      productId = newProduct.id;
    }

    // Insert images
    if (productId && validated.images.length > 0) {
      await tx.productImage.createMany({
        data: validated.images.map((img) => ({
          productId: productId!,
          url: img.url,
          altText: img.altText,
          isPrimary: img.isPrimary,
          sortOrder: img.sortOrder,
        })),
      });
    }

    // Auto-create/update SaleRecord if isSold is true
    if (productId && validated.isSold) {
      const primaryImage = validated.images.find((img) => img.isPrimary) || validated.images[0];
      const imageUrl = primaryImage?.url || "";

      await tx.saleRecord.upsert({
        where: { productId: productId as string },
        update: {
          productName: validated.name,
          imageUrl: imageUrl,
        },
        create: {
          productId: productId as string,
          productName: validated.name,
          imageUrl: imageUrl,
          dateSold: new Date(),
          payment: "UNPAID",
        },
      });
    }
  });

  revalidatePath("/dashboard");
  revalidatePath("/products");
  return { success: true };
}

/**
 * Soft deletes a product by setting isActive to false.
 */
export async function deleteProduct(id: string) {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });

  revalidatePath("/dashboard");
  return { success: true };
}
