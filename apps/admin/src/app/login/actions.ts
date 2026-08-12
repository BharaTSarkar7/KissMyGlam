"use server";

import { signIn } from "@/auth";
import { headers } from "next/headers";
import {
  checkRateLimit,
  recordFailedAttempt,
  clearRateLimit,
} from "@/lib/rate-limit";
import { AuthError } from "next-auth";

export async function loginAction(
  _prevState: { error?: string; retryAfter?: number } | null,
  formData: FormData
): Promise<{ error?: string; retryAfter?: number } | null> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "invalid-credentials" };
  }

  // Get client IP for rate limiting
  const headersList = await headers();
  const ip =
    headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headersList.get("x-real-ip") ||
    "unknown";

  // Check rate limit
  const rateCheck = checkRateLimit(ip);
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
    clearRateLimit(ip);
    return null;
  } catch (error) {
    if (error instanceof AuthError) {
      // Record the failed attempt
      recordFailedAttempt(ip);
      return { error: "invalid-credentials" };
    }
    throw error;
  }
}
