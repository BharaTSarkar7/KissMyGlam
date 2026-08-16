"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@kissmyglam/ui/src/Button";
import { deleteProduct, permanentlyDeleteProduct } from "../products/actions";

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
  saleRecord: {
    payment: "PAID" | "UNPAID";
    boughtFor: number | null;
    soldFor: number | null;
  } | null;
};

export function ProductList({
  products,
  activeCategory,
}: {
  products: Product[];
  activeCategory?: { name: string; slug: string } | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const [softDeleteTarget, setSoftDeleteTarget] = useState<Product | null>(null);
  const [softDeleteError, setSoftDeleteError] = useState<string | null>(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<Product | null>(null);
  const [confirmNameInput, setConfirmNameInput] = useState("");
  const [deleteError, setDeleteError] = useState<string | null>(null);

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
      router.push(`/products?${params.toString()}`);
    });
  };

  const handleClearCategory = () => {
    startTransition(() => {
      const params = new URLSearchParams(searchParams);
      params.delete("category");
      router.push(`/products?${params.toString()}`);
    });
  };

  const handleConfirmSoftDelete = async () => {
    if (!softDeleteTarget) return;

    startTransition(async () => {
      try {
        await deleteProduct(softDeleteTarget.id);
        setSoftDeleteTarget(null);
        setSoftDeleteError(null);
      } catch (error: unknown) {
        console.error("Failed to delete product", error);
        setSoftDeleteError(error instanceof Error ? error.message : "Failed to delete product.");
      }
    });
  };

  const handleConfirmPermanentDelete = async () => {
    if (!permanentDeleteTarget) return;
    if (confirmNameInput.trim() !== permanentDeleteTarget.name.trim()) return;

    startTransition(async () => {
      try {
        await permanentlyDeleteProduct(permanentDeleteTarget.id);
        setPermanentDeleteTarget(null);
        setConfirmNameInput("");
        setDeleteError(null);
      } catch (error: unknown) {
        console.error("Failed to permanently delete product", error);
        setDeleteError(error instanceof Error ? error.message : "Failed to permanently delete product.");
      }
    });
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full sm:w-72 px-4 py-2 border-none shadow-sm rounded-[14px] bg-white focus:outline-none"
          />
          {activeCategory && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ink text-white text-xs font-medium shadow-sm">
              <span>Category: {activeCategory.name}</span>
              <button
                type="button"
                onClick={handleClearCategory}
                className="hover:text-red-300 transition-colors ml-1 font-bold text-sm leading-none"
                title="Clear category filter"
              >
                ×
              </button>
            </div>
          )}
        </div>
        <Link href="/products/new">
          <Button variant="primary">Add Product</Button>
        </Link>
      </div>

      <div className="overflow-x-auto bg-white rounded-[24px] shadow-sm border border-line/50">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-ink text-white border-b-0">
              <th className="p-4 font-medium text-sm text-white/90">Image</th>
              <th className="p-4 font-medium text-sm text-white/90">Name</th>
              <th className="p-4 font-medium text-sm text-white/90">Category</th>
              <th className="p-4 font-medium text-sm text-white/90">Price</th>
              <th className="p-4 font-medium text-sm text-white/90">Status</th>
              <th className="p-4 font-medium text-sm text-white/90 text-right">Actions</th>
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
                      {product.isActive ? (
                        <Button 
                          variant="ghost" 
                          className="!px-3 !py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setSoftDeleteTarget(product);
                            setSoftDeleteError(null);
                          }}
                          disabled={isPending}
                        >
                          Delete
                        </Button>
                      ) : (
                        <Button 
                          variant="ghost" 
                          className="!px-3 !py-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 font-medium whitespace-nowrap"
                          onClick={() => {
                            setPermanentDeleteTarget(product);
                            setConfirmNameInput("");
                            setDeleteError(null);
                          }}
                          disabled={isPending}
                        >
                          Permanently Delete
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

      {/* Soft Delete Modal */}
      {softDeleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-xl border border-line/60 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-medium text-ink">
                Deactivate Product
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                Are you sure you want to soft-delete <strong className="text-ink font-semibold">&ldquo;{softDeleteTarget.name}&rdquo;</strong>? It will be marked Inactive and hidden from the public shop.
              </p>
            </div>

            {softDeleteError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                {softDeleteError}
              </div>
            )}

            <div className="p-4 bg-bg-alt/70 border border-line/50 rounded-xl text-xs text-ink-soft space-y-1">
              <p>
                ℹ️ You can still view this item in the admin list or permanently delete it later once it is Inactive.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setSoftDeleteTarget(null);
                  setSoftDeleteError(null);
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                className="!bg-red-600 hover:!bg-red-700 disabled:!opacity-40"
                onClick={handleConfirmSoftDelete}
                disabled={isPending}
              >
                {isPending ? "Deactivating..." : "Deactivate Product"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Typed Confirmation Modal for Permanent Delete */}
      {permanentDeleteTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-lg w-full p-6 shadow-xl border border-line/60 space-y-5">
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-medium text-red-600">
                Permanently Delete Product
              </h3>
              <p className="text-sm text-ink-soft leading-relaxed">
                This cannot be undone. The product, its images, and any sales record will be permanently deleted.
              </p>
            </div>

            {deleteError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-medium">
                {deleteError}
              </div>
            )}

            {/* Extra Warning for Financial History */}
            {permanentDeleteTarget.saleRecord &&
              (permanentDeleteTarget.saleRecord.payment === "PAID" ||
                permanentDeleteTarget.saleRecord.boughtFor !== null ||
                permanentDeleteTarget.saleRecord.soldFor !== null) && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs space-y-1">
                  <div className="font-bold flex items-center gap-1 text-amber-800">
                    ⚠️ Warning: Sales & Financial Records Attached
                  </div>
                  <p className="leading-relaxed">
                    This product has sales/financial records attached (Status:{" "}
                    <strong>{permanentDeleteTarget.saleRecord.payment}</strong>
                    {permanentDeleteTarget.saleRecord.soldFor !== null && (
                      <>, Sold: <strong>₹{permanentDeleteTarget.saleRecord.soldFor}</strong></>
                    )}
                    {permanentDeleteTarget.saleRecord.boughtFor !== null && (
                      <>, Bought: <strong>₹{permanentDeleteTarget.saleRecord.boughtFor}</strong></>
                    )}
                    ). Permanently deleting it will also erase that history.
                  </p>
                </div>
              )}

            <div className="space-y-2">
              <label className="block text-xs font-medium text-ink-soft">
                To confirm, type <span className="font-bold text-ink select-all">&ldquo;{permanentDeleteTarget.name}&rdquo;</span> below:
              </label>
              <input
                type="text"
                value={confirmNameInput}
                onChange={(e) => setConfirmNameInput(e.target.value)}
                placeholder={permanentDeleteTarget.name}
                className="w-full px-4 py-2 border border-line rounded-[14px] bg-bg focus:ring-1 focus:ring-red-500 text-sm font-medium text-ink"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setPermanentDeleteTarget(null);
                  setConfirmNameInput("");
                  setDeleteError(null);
                }}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="primary"
                className="!bg-red-600 hover:!bg-red-700 disabled:!opacity-40"
                onClick={handleConfirmPermanentDelete}
                disabled={
                  confirmNameInput.trim() !== permanentDeleteTarget.name.trim() ||
                  isPending
                }
              >
                {isPending ? "Deleting..." : "Permanently Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
