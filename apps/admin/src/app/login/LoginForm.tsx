"use client";

import React, { useActionState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@kissmyglam/ui/src/Button";
import { loginAction } from "./actions";

export function LoginForm() {
  const router = useRouter();

  const [state, formAction, isPending] = useActionState(
    async (
      prevState: { error?: string; retryAfter?: number } | null,
      formData: FormData
    ) => {
      const result = await loginAction(prevState, formData);
      if (result === null) {
        // Login successful — redirect to dashboard
        router.push("/dashboard");
        return null;
      }
      return result;
    },
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.error === "invalid-credentials" && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center font-medium">
          Invalid email or password.
        </div>
      )}

      {state?.error === "too-many-attempts" && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-sm text-center font-medium">
          Too many login attempts. Please try again
          {state.retryAfter
            ? ` in ${Math.ceil(state.retryAfter / 60)} minute${Math.ceil(state.retryAfter / 60) !== 1 ? "s" : ""}`
            : " later"}
          .
        </div>
      )}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-medium uppercase tracking-wider text-ink"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="w-full px-4 py-3 rounded-xl border border-line bg-bg text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent transition-shadow"
          placeholder="you@example.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="password"
          className="text-sm font-medium uppercase tracking-wider text-ink"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full px-4 py-3 rounded-xl border border-line bg-bg text-ink placeholder:text-ink-soft/50 focus:outline-none focus:ring-2 focus:ring-ink focus:border-transparent transition-shadow"
          placeholder="••••••••"
        />
      </div>

      <Button
        type="submit"
        variant="primary"
        disabled={isPending}
        className="w-full mt-2"
      >
        {isPending ? "Signing in…" : "Sign In"}
      </Button>
    </form>
  );
}
