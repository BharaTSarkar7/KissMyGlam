"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@kissmyglam/ui/src/Button";
import { deleteProduct } from "../products/actions";

type Product = {
  id: string;
  name: string;
  slug: string;
  price: number;
  isActive: boolean;
  isSold: boolean;
  category: { name: string };
  subtype: { name: string } | null;
  images: { url: string }[];
};

export function ProductList({ products }: { products: Product[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");

  // Debounced search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("q", term);
      } else {
        params.delete("q");
      }
      router.push(`/dashboard?${params.toString()}`);
    });
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to soft-delete "${name}"? It will be hidden from the public shop.`)) {
      startTransition(async () => {
        try {
          await deleteProduct(id);
        } catch (error) {
          console.error("Failed to delete product", error);
          alert("Failed to delete product.");
        }
      });
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
        <input
          type="text"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full sm:max-w-sm px-4 py-2 border border-line rounded-[14px] bg-bg focus:outline-none focus:ring-1 focus:ring-ink"
        />
        <Link href="/products/new">
          <Button variant="primary">Add Product</Button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-[24px] shadow-sm border border-line/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-line bg-bg-alt/50">
              <th className="p-4 font-medium text-sm text-ink-soft">Image</th>
              <th className="p-4 font-medium text-sm text-ink-soft">Name</th>
              <th className="p-4 font-medium text-sm text-ink-soft">Category</th>
              <th className="p-4 font-medium text-sm text-ink-soft">Price</th>
              <th className="p-4 font-medium text-sm text-ink-soft">Status</th>
              <th className="p-4 font-medium text-sm text-ink-soft text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-ink-soft">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id} className="border-b border-line last:border-b-0 hover:bg-bg-alt/30 transition-colors">
                  <td className="p-4">
                    <div className="w-12 h-16 relative rounded-md overflow-hidden bg-bg-alt">
                      {product.images[0]?.url ? (
                        <Image src={product.images[0].url} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] text-ink-soft">No img</div>
                      )}
                    </div>
                  </td>
                  <td className="p-4 font-medium text-ink">
                    {product.name}
                    <div className="text-xs text-ink-soft font-normal">{product.slug}</div>
                  </td>
                  <td className="p-4 text-sm text-ink-soft">
                    {product.category.name}
                    {product.subtype && <span className="text-xs ml-1 opacity-70">({product.subtype.name})</span>}
                  </td>
                  <td className="p-4 text-sm text-ink">₹{product.price.toString()}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                      {product.isSold && (
                        <span className="text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800">
                          Sold
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/products/${product.id}/edit`}>
                        <Button variant="ghost" className="!px-3 !py-1 text-xs">Edit</Button>
                      </Link>
                      {product.isActive && (
                        <Button 
                          variant="ghost" 
                          className="!px-3 !py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={isPending}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
