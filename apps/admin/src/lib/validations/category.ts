import * as z from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  imageUrl: z.string().url("Must be a valid URL").or(z.literal("")),
  sortOrder: z.coerce.number().int().default(0),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export const subtypeSchema = z.object({
  categoryId: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  sortOrder: z.coerce.number().int().default(0),
});

export type SubtypeFormValues = z.infer<typeof subtypeSchema>;
