"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@kissmyglam/ui/src/Button";
import { ProductFormValues } from "@/lib/validations/product";
import { uploadImage, upsertProduct } from "./actions";

type Category = {
  id: string;
  name: string;
};

type Subtype = {
  id: string;
  categoryId: string;
  name: string;
};

type Props = {
  initialData?: Partial<ProductFormValues> & { id?: string };
  categories: Category[];
  subtypes: Subtype[];
};

export function ProductForm({ initialData, categories, subtypes }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [details, setDetails] = useState<{ label: string; value: string }[]>(initialData?.details || []);
  const [sizeDetails, setSizeDetails] = useState<Record<string, { label: string; value: string }[]>>(
    (initialData?.sizeDetails as Record<string, { label: string; value: string }[]>) || {}
  );
  const [price, setPrice] = useState(initialData?.price || "");
  const [categoryId, setCategoryId] = useState(initialData?.categoryId || "");
  const [subtypeId, setSubtypeId] = useState(initialData?.subtypeId || "");
  const [sizes, setSizes] = useState<string[]>(initialData?.sizes || []);
  const [colours, setColours] = useState<string[]>(initialData?.colours || []);
  const [isFeatured, setIsFeatured] = useState(initialData?.isFeatured || false);
  const [isActive, setIsActive] = useState(initialData?.isActive ?? true);
  const [isSold, setIsSold] = useState(initialData?.isSold ?? false);
  const [images, setImages] = useState<ProductFormValues["images"]>(initialData?.images || []);

  // Tag inputs state
  const [sizeInput, setSizeInput] = useState("");
  const [colourInput, setColourInput] = useState("");

  const [uploading, setUploading] = useState(false);

  // Filter subtypes
  const availableSubtypes = subtypes.filter((s) => s.categoryId === categoryId);

  // Auto-generate slug
  const handleNameChange = (val: string) => {
    setName(val);
    if (!initialData?.id) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "")
      );
    }
  };

  const handleAddTag = (
    val: string,
    setVal: React.Dispatch<React.SetStateAction<string>>,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (val.trim() && !list.includes(val.trim())) {
      setList([...list, val.trim()]);
    }
    setVal("");
  };

  const handleRemoveTag = (
    tag: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setList(list.filter((t) => t !== tag));
  };

  const handleRemoveSizeTag = (sizeToRemove: string) => {
    setSizes(sizes.filter((s) => s !== sizeToRemove));
    setSizeDetails((prev) => {
      const next = { ...prev };
      delete next[sizeToRemove];
      return next;
    });
  };

  const handleAddSizeDetailRow = (size: string) => {
    setSizeDetails((prev) => ({
      ...prev,
      [size]: [...(prev[size] || []), { label: "", value: "" }],
    }));
  };

  const handleUpdateSizeDetailRow = (
    size: string,
    index: number,
    field: "label" | "value",
    val: string
  ) => {
    setSizeDetails((prev) => {
      const list = [...(prev[size] || [])];
      list[index] = { ...list[index], [field]: val };
      return { ...prev, [size]: list };
    });
  };

  const handleRemoveSizeDetailRow = (size: string, index: number) => {
    setSizeDetails((prev) => {
      const list = (prev[size] || []).filter((_, i) => i !== index);
      return { ...prev, [size]: list };
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError(null);

    try {
      const newImages = [...images];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const { url } = await uploadImage(formData);
        newImages.push({
          url,
          altText: "",
          isPrimary: newImages.length === 0, // Make first image primary
          sortOrder: newImages.length,
        });
      }
      setImages(newImages);
    } catch (err) {
      console.error(err);
      if (err instanceof Error) {
        setError(err.message || "Failed to upload image");
      } else {
        setError("Failed to upload image");
      }
    } finally {
      setUploading(false);
      // Reset input
      e.target.value = "";
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    // If we removed the primary, make the first remaining one primary
    if (images[index].isPrimary && newImages.length > 0) {
      newImages[0].isPrimary = true;
    }
    // Update sortOrder
    setImages(newImages.map((img, i) => ({ ...img, sortOrder: i })));
  };

  const handleMakePrimary = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        isPrimary: i === index,
      }))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanedSizeDetails: Record<string, { label: string; value: string }[]> = {};
    for (const s of sizes) {
      const rows = (sizeDetails[s] || []).filter(
        (r) => r.label.trim() && r.value.trim()
      );
      if (rows.length > 0) {
        cleanedSizeDetails[s] = rows;
      }
    }

    const payload: ProductFormValues = {
      name,
      slug,
      details: details.filter(d => d.label.trim() && d.value.trim()),
      sizeDetails: cleanedSizeDetails,
      price,
      categoryId,
      subtypeId: subtypeId || null,
      sizes,
      colours,
      isFeatured,
      isActive,
      isSold,
      images,
    };

    startTransition(async () => {
      try {
        await upsertProduct(payload, initialData?.id);
        router.push("/dashboard");
      } catch (err) {
        console.error(err);
        setError("Failed to save product. Check the inputs and try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-8 bg-white p-8 rounded-[24px] border border-line/50 shadow-sm">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-[14px] border border-red-200">
          {error}
        </div>
      )}

      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl text-ink">Basic Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Name *</label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full px-4 py-2 border border-line rounded-[14px] bg-bg focus:ring-1 focus:ring-ink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Slug *</label>
            <input
              required
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full px-4 py-2 border border-line rounded-[14px] bg-bg focus:ring-1 focus:ring-ink"
            />
          </div>
        </div>

        {/* Product Details - Dynamic Label/Value List */}
        <div className="space-y-4 pt-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl text-ink">Product Details</h3>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDetails([...details, { label: "", value: "" }])}
            >
              + Add Detail
            </Button>
          </div>
          {details.length === 0 && (
            <p className="text-sm text-ink-soft italic">No details added yet. Click &quot;+ Add Detail&quot; to begin.</p>
          )}
          {details.map((detail, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <div className="flex-1">
                <label className="block text-xs font-medium text-ink-soft mb-1">Label</label>
                <input
                  type="text"
                  placeholder="e.g. Fabric"
                  value={detail.label}
                  onChange={(e) => {
                    const updated = [...details];
                    updated[idx] = { ...updated[idx], label: e.target.value };
                    setDetails(updated);
                  }}
                  className="w-full px-4 py-2 border border-line rounded-[14px] bg-bg focus:ring-1 focus:ring-ink text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-medium text-ink-soft mb-1">Value</label>
                <input
                  type="text"
                  placeholder="e.g. Cotton"
                  value={detail.value}
                  onChange={(e) => {
                    const updated = [...details];
                    updated[idx] = { ...updated[idx], value: e.target.value };
                    setDetails(updated);
                  }}
                  className="w-full px-4 py-2 border border-line rounded-[14px] bg-bg focus:ring-1 focus:ring-ink text-sm"
                />
              </div>
              <button
                type="button"
                onClick={() => setDetails(details.filter((_, i) => i !== idx))}
                className="mt-6 p-2 text-ink-soft hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="w-full md:w-1/2">
          <label className="block text-sm font-medium text-ink-soft mb-1">Price *</label>
          <input
            required
            type="number"
            step="0.01"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full px-4 py-2 border border-line rounded-[14px] bg-bg focus:ring-1 focus:ring-ink"
          />
        </div>
      </div>

      {/* Classification */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl text-ink border-t border-line pt-6">Classification</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Category *</label>
            <select
              required
              value={categoryId}
              onChange={(e) => {
                setCategoryId(e.target.value);
                setSubtypeId(""); // Reset subtype
              }}
              className="w-full px-4 py-2 border border-line rounded-[14px] bg-bg focus:ring-1 focus:ring-ink"
            >
              <option value="" disabled>Select a category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Subtype</label>
            <select
              value={subtypeId}
              onChange={(e) => setSubtypeId(e.target.value)}
              className="w-full px-4 py-2 border border-line rounded-[14px] bg-bg focus:ring-1 focus:ring-ink"
              disabled={!categoryId || availableSubtypes.length === 0}
            >
              <option value="">None</option>
              {availableSubtypes.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl text-ink border-t border-line pt-6">Variants</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Sizes</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={sizeInput}
                onChange={(e) => setSizeInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag(sizeInput, setSizeInput, sizes, setSizes))}
                placeholder="e.g. S, M, L"
                className="flex-1 px-4 py-2 border border-line rounded-[14px] bg-bg focus:ring-1 focus:ring-ink"
              />
              <Button type="button" variant="ghost" onClick={() => handleAddTag(sizeInput, setSizeInput, sizes, setSizes)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <span key={s} className="px-3 py-1 bg-bg-alt rounded-full text-sm flex items-center gap-1 font-medium">
                  {s}
                  <button type="button" onClick={() => handleRemoveSizeTag(s)} className="text-ink-soft hover:text-ink">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Colours */}
          <div>
            <label className="block text-sm font-medium text-ink-soft mb-1">Colours</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={colourInput}
                onChange={(e) => setColourInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag(colourInput, setColourInput, colours, setColours))}
                placeholder="e.g. Black, White"
                className="flex-1 px-4 py-2 border border-line rounded-[14px] bg-bg focus:ring-1 focus:ring-ink"
              />
              <Button type="button" variant="ghost" onClick={() => handleAddTag(colourInput, setColourInput, colours, setColours)}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {colours.map((c) => (
                <span key={c} className="px-3 py-1 bg-bg-alt rounded-full text-sm flex items-center gap-1 font-medium">
                  {c}
                  <button type="button" onClick={() => handleRemoveTag(c, colours, setColours)} className="text-ink-soft hover:text-ink">×</button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Per-Size Measurements Section */}
        {sizes.length > 0 && (
          <div className="mt-6 pt-4 border-t border-line/40 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-ink uppercase tracking-wider">
                Per-Size Measurements
              </h4>
              <span className="text-xs text-ink-soft">
                Optional measurements per size (e.g. Bust, Length, Waist)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sizes.map((size) => {
                const rows = sizeDetails[size] || [];
                return (
                  <div
                    key={size}
                    className="p-4 bg-bg-alt/40 rounded-[18px] border border-line/60 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-ink flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-ink text-white text-xs flex items-center justify-center font-sans font-medium">
                          {size}
                        </span>
                        Size {size} Details
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        className="!py-1 !px-2.5 !text-xs"
                        onClick={() => handleAddSizeDetailRow(size)}
                      >
                        + Add Detail
                      </Button>
                    </div>

                    {rows.length === 0 ? (
                      <p className="text-xs text-ink-soft italic">
                        No measurements for size {size}.
                      </p>
                    ) : (
                      <div className="space-y-2">
                        {rows.map((row, idx) => (
                          <div key={idx} className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="e.g. Bust"
                              value={row.label}
                              onChange={(e) =>
                                handleUpdateSizeDetailRow(size, idx, "label", e.target.value)
                              }
                              className="flex-1 px-3 py-1.5 border border-line rounded-[10px] bg-bg focus:ring-1 focus:ring-ink text-xs font-medium"
                            />
                            <input
                              type="text"
                              placeholder="e.g. 88 (cm added auto)"
                              value={row.value}
                              onChange={(e) =>
                                handleUpdateSizeDetailRow(size, idx, "value", e.target.value)
                              }
                              className="flex-1 px-3 py-1.5 border border-line rounded-[10px] bg-bg focus:ring-1 focus:ring-ink text-xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleRemoveSizeDetailRow(size, idx)}
                              className="p-1.5 text-ink-soft hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                              title="Remove measurement"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Images */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl text-ink border-t border-line pt-6">Images *</h3>
        
        <div className="border-2 border-dashed border-line rounded-[14px] p-8 text-center bg-bg-alt/30 hover:bg-bg-alt/50 transition-colors relative">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageUpload}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />
          {uploading ? (
            <p className="text-ink-soft">Uploading...</p>
          ) : (
            <div>
              <p className="text-ink-soft font-medium mb-1">Drag & drop images here or click to browse</p>
              <p className="text-xs text-ink-soft/70">JPG, PNG, WEBP (Max 5MB each)</p>
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
            {images.map((img, idx) => (
              <div key={idx} className={`relative group aspect-[4/5] rounded-[14px] overflow-hidden border-2 ${img.isPrimary ? 'border-ink' : 'border-transparent'}`}>
                <Image src={img.url} alt="Preview" fill className="object-cover" />
                
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                  <div className="flex justify-between">
                    {!img.isPrimary && (
                      <button type="button" onClick={() => handleMakePrimary(idx)} className="bg-white text-ink text-xs px-2 py-1 rounded">Primary</button>
                    )}
                    <button type="button" onClick={() => handleRemoveImage(idx)} className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-auto">Remove</button>
                  </div>
                </div>

                {img.isPrimary && (
                  <div className="absolute bottom-2 left-2 bg-ink text-white text-xs px-2 py-1 rounded">
                    Primary
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h3 className="font-serif text-2xl text-ink border-t border-line pt-6">Settings</h3>
        <div className="flex flex-col gap-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4 text-ink rounded border-line focus:ring-ink"
            />
            <span className="text-sm font-medium text-ink">Active (Visible on shop)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="w-4 h-4 text-ink rounded border-line focus:ring-ink"
            />
            <span className="text-sm font-medium text-ink">Featured (Shows on homepage)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={isSold}
              onChange={(e) => setIsSold(e.target.checked)}
              className="w-4 h-4 text-ink rounded border-line focus:ring-ink"
            />
            <span className="text-sm font-medium text-ink">Sold / Out of Stock</span>
          </label>
        </div>
      </div>

      <div className="pt-6 border-t border-line flex justify-end gap-4">
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push("/dashboard")}
          disabled={isPending || uploading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isPending || uploading || images.length === 0}
        >
          {isPending ? "Saving..." : initialData?.id ? "Update Product" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
