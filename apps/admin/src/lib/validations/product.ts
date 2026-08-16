import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid slug format"),
  description: z.string().optional(), // DEPRECATED — kept for backward compat but unused
  details: z.array(z.object({
    label: z.string().min(1, "Label is required"),
    value: z.string().min(1, "Value is required"),
  })).default([]),
  sizeDetails: z.record(
    z.string(),
    z.array(
      z.object({
        label: z.string().min(1, "Label is required"),
        value: z.string().min(1, "Value is required"),
      })
    )
  ).default({}),
  price: z
    .string()
    .min(1, "Price is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid price format"),
  categoryId: z.string().min(1, "Category is required"),
  subtypeId: z.string().nullable().optional(),
  sizes: z.array(z.string()).default([]),
  colours: z.array(z.string()).default([]),
  isFeatured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isSold: z.boolean().default(false),
  images: z
    .array(
      z.object({
        id: z.string().optional(), // Existing images have IDs
        url: z.string().url("Invalid image URL"),
        altText: z.string().default(""),
        isPrimary: z.boolean().default(false),
        sortOrder: z.number().int().default(0),
      })
    )
    .min(1, "At least one image is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;
