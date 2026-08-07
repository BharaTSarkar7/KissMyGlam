"use client";

import React, { useMemo } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ProductCard } from "@kissmyglam/ui/src/ProductCard";

interface Product {
  id: string;
  name: string;
  price: any;
  slug: string;
  subtype: { slug: string } | null;
  images: { url: string }[];
}

interface Subtype {
  name: string;
  slug: string;
}

interface CategoryProductViewProps {
  products: Product[];
  subtypes: Subtype[];
}

// Fisher-Yates shuffle algorithm
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export const CategoryProductView: React.FC<CategoryProductViewProps> = ({ products, subtypes }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  
  const currentSubtype = searchParams.get("subtype");

  // Shuffle products only once on mount (client-side) as requested by user
  const shuffledProducts = useMemo(() => {
    return shuffleArray(products);
  }, [products]);

  const filteredProducts = useMemo(() => {
    if (!currentSubtype) return shuffledProducts;
    return shuffledProducts.filter((p) => p.subtype?.slug === currentSubtype);
  }, [shuffledProducts, currentSubtype]);

  const handleSubtypeClick = (slug: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (currentSubtype === slug) {
      params.delete("subtype"); // Toggle off
    } else {
      params.set("subtype", slug);
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="w-full">
      {/* Subtype Slider */}
      {subtypes.length > 0 && (
        <div className="flex overflow-x-auto gap-3 pb-4 mb-8 scrollbar-hide">
          <button
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString());
              params.delete("subtype");
              router.push(`${pathname}?${params.toString()}`, { scroll: false });
            }}
            className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
              !currentSubtype 
                ? "bg-ink text-white" 
                : "bg-bg-alt text-ink hover:bg-black/5"
            }`}
          >
            All
          </button>
          {subtypes.map((subtype) => (
            <button
              key={subtype.slug}
              onClick={() => handleSubtypeClick(subtype.slug)}
              className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                currentSubtype === subtype.slug 
                  ? "bg-ink text-white" 
                  : "bg-bg-alt text-ink hover:bg-black/5"
              }`}
            >
              {subtype.name}
            </button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={`$${product.price.toString()}`}
              slug={product.slug}
              imageUrl={product.images[0]?.url || ''}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center flex flex-col items-center">
          <h3 className="font-serif text-2xl font-medium text-ink mb-2">No products found</h3>
          <p className="text-ink-soft">Try selecting a different category or subtype.</p>
        </div>
      )}
    </div>
  );
};
