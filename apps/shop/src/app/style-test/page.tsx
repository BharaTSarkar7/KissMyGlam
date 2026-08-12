import React from "react";
import { Button, SectionHeading, CategoryTile, ProductCard } from "@kissmyglam/ui";

const RowLabel = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs uppercase tracking-wider text-ink-soft mb-4 font-sans font-medium border-b border-line pb-2">
    {children}
  </div>
);

export default function StyleTestPage() {
  return (
    <main className="max-w-[1280px] mx-auto px-6 py-12 flex flex-col gap-12 w-full">

      {/* Row 1 */}
      <section>
        <RowLabel>Button — primary / ghost</RowLabel>
        <div className="flex gap-4 items-center">
          <Button variant="primary">Shop The Sale &rarr;</Button>
          <Button variant="ghost">View All Categories</Button>
        </div>
      </section>

      {/* Row 2 */}
      <section>
        <RowLabel>Section Heading</RowLabel>
        <SectionHeading subtitle="New Collection" title="Elevate Your Everyday Style" />
      </section>

      {/* Row 3 */}
      <section>
        <RowLabel>Category Tiles (Grid)</RowLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <CategoryTile
            name="Dresses"
            slug="dresses"
            imageUrl="https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop"
          />
          <CategoryTile
            name="Tops & Blouses"
            slug="tops"
            imageUrl="https://images.unsplash.com/photo-1550639525-c97d455acf70?q=80&w=800&auto=format&fit=crop"
          />
          <CategoryTile
            name="Outerwear"
            slug="outerwear"
            imageUrl="https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=800&auto=format&fit=crop"
          />
          <CategoryTile
            name="Bottomwear"
            slug="bottomwear"
            imageUrl="https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=800&auto=format&fit=crop"
          />
        </div>
      </section>

      {/* Row 4 */}
      <section>
        <RowLabel>Product Cards (Grid)</RowLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <ProductCard
            name="Linen Blend Blazer"
            price="₹89.99"
            slug="linen-blend-blazer"
            imageUrl="https://images.unsplash.com/photo-1591369822096-ffd140ec948f?q=80&w=800&auto=format&fit=crop"
          />
          <ProductCard
            name="Silk Midi Dress"
            price="$129.00"
            slug="silk-midi-dress"
            imageUrl="https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop"
          />
          <ProductCard
            name="High-Waisted Trousers"
            price="$75.50"
            slug="high-waisted-trousers"
            imageUrl="https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?q=80&w=800&auto=format&fit=crop"
          />
        </div>
      </section>

    </main>
  );
}
