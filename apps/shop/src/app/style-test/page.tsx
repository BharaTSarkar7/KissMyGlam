import React from "react";
import { Button, SectionHeading, CategoryTile, ProductCard } from "@kissmyglam/ui";

export default function StyleTestPage() {
  return (
    <main className="max-w-[var(--container-max-width)] mx-auto px-6 py-12 flex flex-col gap-16">
      
      {/* Section Heading */}
      <section>
        <SectionHeading eyebrow="New Collection" title="Elevate Your Everyday Style" />
      </section>

      {/* Buttons */}
      <section className="flex gap-4 items-center">
        <Button variant="primary">Shop The Sale &rarr;</Button>
        <Button variant="ghost">View All Categories</Button>
      </section>

      {/* Category Tile */}
      <section className="max-w-xs">
        <CategoryTile
          name="Dresses"
          slug="dresses"
          imageUrl="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"
        />
      </section>

      {/* Product Card */}
      <section className="max-w-[280px]">
        <ProductCard
          name="Linen Blend Blazer"
          price="$89.99"
          slug="linen-blend-blazer"
          imageUrl="https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=800&auto=format&fit=crop"
        />
      </section>
      
    </main>
  );
}
