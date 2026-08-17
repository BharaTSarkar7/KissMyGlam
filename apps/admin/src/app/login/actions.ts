"use server";

import { signIn } from "@/auth";
import { headers } from "next/headers";
import {
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
} from "@/lib/rate-limit";
import { AuthError } from "next-auth";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function loginAction(
  _prevState: { error?: string; retryAfter?: number } | null,
  formData: FormData
): Promise<{ error?: string; retryAfter?: number } | null> {
  const rawEmail = formData.get("email");
  const rawPassword = formData.get("password");

  const parsed = loginSchema.safeParse({ email: rawEmail, password: rawPassword });
  if (!parsed.success) {
    return { error: "invalid-credentials" };
  }

  const { email, password } = parsed.data;

  // Get client IP for rate limiting
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  // Check rate limit
  const rateCheck = await checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return {
      error: "too-many-attempts",
      retryAfter: rateCheck.retryAfterSeconds,
    };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    // Success — clear rate limit for this IP
    await clearRateLimit(ip);
    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      // Record the failed attempt
      await recordFailedAttempt(ip);
      return { error: "invalid-credentials" };
    }
    throw error;
  }
}
