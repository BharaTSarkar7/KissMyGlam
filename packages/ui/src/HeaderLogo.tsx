"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export function HeaderLogo() {
  const pathname = usePathname();
  const router = useRouter();

  const isDeepPage =
    pathname.startsWith("/category/") || pathname.startsWith("/product/");

  const handleBack = () => {
    if (
      typeof window !== "undefined" &&
      window.history.length > 1 &&
      document.referrer &&
      document.referrer.includes(window.location.host)
    ) {
      router.back();
    } else if (typeof window !== "undefined" && window.history.length > 2) {
      router.back();
    } else {
      router.push("/");
    }
  };

  return (
    <>
      {/* Mobile view: Back arrow on category/product pages, logo otherwise */}
      <div className="md:hidden flex items-center">
        {isDeepPage ? (
          <button
            type="button"
            onClick={handleBack}
            aria-label="Go back"
            className="p-2 -ml-2 text-ink hover:opacity-70 transition-opacity flex items-center justify-center rounded-full active:scale-95"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        ) : (
          <Link
            href="/"
            className="font-sans font-bold tracking-[0.2em] text-ink uppercase text-sm"
          >
            Kiss<span className="text-[#fd5f88] font-bold">My</span>Glam
          </Link>
        )}
      </div>

      {/* Desktop / Tablet view: Always show logo */}
      <Link
        href="/"
        className="hidden md:block font-sans font-bold tracking-[0.2em] text-ink uppercase text-sm"
      >
        Kiss<span className="text-[#fd5f88] font-bold">My</span>Glam
      </Link>
    </>
  );
}
