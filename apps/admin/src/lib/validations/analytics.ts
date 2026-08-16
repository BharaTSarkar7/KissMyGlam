import { z } from "zod";

export const saleRecordUpdateSchema = z.object({
  boughtFor: z.number().nullable().optional(),
  soldFor: z.number().nullable().optional(),
  dateSold: z.string().nullable().optional(),
  dateInStock: z.string().nullable().optional(),
  payment: z.enum(["PAID", "UNPAID"]).optional(),
});

export const totalExpenseSchema = z.object({
  value: z
    .string()
    .min(1, "Total expense is required")
    .regex(/^\d+(\.\d{1,2})?$/, "Invalid total expense format. Must be a valid number (e.g. 1000 or 1000.50)."),
});

export type SaleRecordUpdateValues = z.infer<typeof saleRecordUpdateSchema>;
