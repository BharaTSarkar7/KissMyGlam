"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { Plus, Edit2, Trash2, ChevronDown, ChevronUp, Image as ImageIcon } from "lucide-react";
import { Button } from "@kissmyglam/ui/src/Button";
import { upsertCategory, deleteCategory, upsertSubtype, deleteSubtype } from "./actions";

type SubtypeData = {
  id: string;
  categoryId: string;
  name: string;
  slug: string;
  sortOrder: number;
  _count: { products: number };
};

type CategoryData = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  sortOrder: number;
  _count: { products: number };
  subtypes: SubtypeData[];
};

export function CategoriesManager({ initialCategories }: { initialCategories: CategoryData[] }) {
  const [isPending, startTransition] = useTransition();
  const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);

  const [editingCategory, setEditingCategory] = useState<Partial<CategoryData> | null>(null);
  const [editingSubtype, setEditingSubtype] = useState<Partial<SubtypeData> | null>(null);

  const toggleExpand = (id: string) => {
    const newSet = new Set(expandedCats);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedCats(newSet);
  };

  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory) return;
    setError(null);
    startTransition(async () => {
      try {
        await upsertCategory({
          name: editingCategory.name || "",
          slug: editingCategory.slug || "",
          imageUrl: editingCategory.imageUrl || "",
          sortOrder: Number(editingCategory.sortOrder) || 0,
        }, editingCategory.id);
        setEditingCategory(null);
      } catch (err: any) {
        setError(err.message || "Failed to save category");
      }
    });
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteCategory(id);
      } catch (err: any) {
        setError(err.message || "Failed to delete category");
      }
    });
  };

  const handleSaveSubtype = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSubtype || !editingSubtype.categoryId) return;
    setError(null);
    startTransition(async () => {
      try {
        await upsertSubtype({
          categoryId: editingSubtype.categoryId!,
          name: editingSubtype.name || "",
          slug: editingSubtype.slug || "",
          sortOrder: Number(editingSubtype.sortOrder) || 0,
        }, editingSubtype.id);
        setEditingSubtype(null);
      } catch (err: any) {
        setError(err.message || "Failed to save subtype");
      }
    });
  };

  const handleDeleteSubtype = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subtype?")) return;
    setError(null);
    startTransition(async () => {
      try {
        await deleteSubtype(id);
      } catch (err: any) {
        setError(err.message || "Failed to delete subtype");
      }
    });
  };

  const renderCategoryForm = (isNew: boolean) => (
    <form onSubmit={handleSaveCategory} className="bg-bg-alt/30 p-6 border-b border-line/50 flex flex-col gap-4">
      <h3 className="font-medium text-ink">{isNew ? "Add New Category" : "Edit Category"}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
        <div className="flex flex-col gap-1 lg:col-span-1">
          <label className="text-xs font-medium text-ink-soft uppercase">Name</label>
          <input
            type="text"
            required
            value={editingCategory?.name || ""}
            onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value, slug: isNew ? autoSlug(e.target.value) : editingCategory?.slug })}
            className="w-full px-3 py-2 rounded-lg border border-line bg-white text-sm"
          />
        </div>
        <div className="flex flex-col gap-1 lg:col-span-1">
          <label className="text-xs font-medium text-ink-soft uppercase">Slug</label>
          <input
            type="text"
            required
            value={editingCategory?.slug || ""}
            onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-line bg-white text-sm"
          />
        </div>
        <div className="flex flex-col gap-1 lg:col-span-2">
          <label className="text-xs font-medium text-ink-soft uppercase">Image URL</label>
          <input
            type="url"
            value={editingCategory?.imageUrl || ""}
            onChange={(e) => setEditingCategory({ ...editingCategory, imageUrl: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-line bg-white text-sm"
          />
        </div>
        <div className="flex flex-col gap-1 lg:col-span-1">
          <label className="text-xs font-medium text-ink-soft uppercase">Sort Order</label>
          <input
            type="number"
            required
            value={editingCategory?.sortOrder ?? 0}
            onChange={(e) => setEditingCategory({ ...editingCategory, sortOrder: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg border border-line bg-white text-sm"
          />
        </div>
      </div>
      <div className="flex gap-2 justify-end mt-2">
        <Button variant="ghost" type="button" onClick={() => setEditingCategory(null)} disabled={isPending}>Cancel</Button>
        <Button variant="primary" type="submit" disabled={isPending}>Save Category</Button>
      </div>
    </form>
  );

  const renderSubtypeForm = (categoryId: string, isNew: boolean) => (
    <form onSubmit={handleSaveSubtype} className="bg-white p-4 rounded-xl border border-line flex flex-col gap-4 my-2 shadow-sm">
      <h4 className="font-medium text-sm text-ink">{isNew ? "Add New Subtype" : "Edit Subtype"}</h4>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-soft uppercase">Name</label>
          <input
            type="text"
            required
            value={editingSubtype?.name || ""}
            onChange={(e) => setEditingSubtype({ ...editingSubtype, name: e.target.value, slug: isNew ? autoSlug(e.target.value) : editingSubtype?.slug })}
            className="w-full px-3 py-2 rounded-lg border border-line bg-white text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-soft uppercase">Slug</label>
          <input
            type="text"
            required
            value={editingSubtype?.slug || ""}
            onChange={(e) => setEditingSubtype({ ...editingSubtype, slug: e.target.value })}
            className="w-full px-3 py-2 rounded-lg border border-line bg-white text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-ink-soft uppercase">Sort Order</label>
          <input
            type="number"
            required
            value={editingSubtype?.sortOrder ?? 0}
            onChange={(e) => setEditingSubtype({ ...editingSubtype, sortOrder: Number(e.target.value) })}
            className="w-full px-3 py-2 rounded-lg border border-line bg-white text-sm"
          />
        </div>
        <div className="flex gap-2 items-end justify-end h-full pt-4">
          <Button variant="ghost" type="button" onClick={() => setEditingSubtype(null)} disabled={isPending}>Cancel</Button>
          <Button variant="primary" type="submit" disabled={isPending}>Save</Button>
        </div>
      </div>
    </form>
  );

  return (
    <div className="w-full space-y-6 pb-10">
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="flex justify-between items-center bg-white p-6 rounded-[24px] shadow-sm border border-line/50">
        <div>
          <h2 className="font-serif text-2xl font-medium text-ink">Categories</h2>
          <p className="text-sm text-ink-soft">Manage product categories and nested subtypes.</p>
        </div>
        {!editingCategory && (
          <Button variant="primary" onClick={() => setEditingCategory({ sortOrder: 0 })} disabled={isPending}>
            <Plus className="w-4 h-4 mr-2" /> Add Category
          </Button>
        )}
      </div>

      <div className="bg-white rounded-[24px] shadow-sm border border-line/50 overflow-hidden">
        {editingCategory && !editingCategory.id && renderCategoryForm(true)}

        {initialCategories.length === 0 && !editingCategory ? (
          <div className="p-10 text-center text-ink-soft">No categories found.</div>
        ) : (
          initialCategories.map((cat) => {
            const isEditingThis = editingCategory?.id === cat.id;
            const isExpanded = expandedCats.has(cat.id);

            return (
              <div key={cat.id} className="border-b border-line last:border-b-0">
                {isEditingThis ? (
                  renderCategoryForm(false)
                ) : (
                  <div className="p-4 hover:bg-bg-alt/30 transition-colors flex items-center justify-between group">
                    <div className="flex items-center gap-4 flex-1 cursor-pointer" onClick={() => toggleExpand(cat.id)}>
                      <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-bg-alt border border-line flex items-center justify-center flex-shrink-0">
                        {cat.imageUrl ? (
                          <Image src={cat.imageUrl} alt={cat.name} fill className="object-cover" />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-ink-soft" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-ink">{cat.name}</h3>
                          <span className="text-xs bg-bg-alt px-2 py-0.5 rounded-full text-ink-soft border border-line/50">
                            Order: {cat.sortOrder}
                          </span>
                        </div>
                        <p className="text-xs text-ink-soft mt-0.5">
                          /{cat.slug} • {cat._count.products} Products • {cat.subtypes.length} Subtypes
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mr-4">
                      <button
                        onClick={() => setEditingCategory({ ...cat })}
                        disabled={isPending}
                        className="p-2 text-ink-soft hover:text-ink hover:bg-bg-alt rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(cat.id)}
                        disabled={isPending}
                        className="p-2 text-ink-soft hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => toggleExpand(cat.id)} className="p-2 text-ink-soft">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                )}

                {/* Subtypes Section */}
                {isExpanded && !isEditingThis && (
                  <div className="bg-bg-alt/30 px-6 py-4 border-t border-line/50 shadow-inner">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-sm font-medium text-ink-soft uppercase tracking-wider">Subtypes</h4>
                      {editingSubtype?.categoryId !== cat.id && (
                        <Button variant="ghost" onClick={() => setEditingSubtype({ categoryId: cat.id, sortOrder: 0 })} disabled={isPending}>
                          <Plus className="w-3 h-3 mr-1" /> Add Subtype
                        </Button>
                      )}
                    </div>
                    
                    {editingSubtype && !editingSubtype.id && editingSubtype.categoryId === cat.id && renderSubtypeForm(cat.id, true)}

                    <div className="flex flex-col gap-2">
                      {cat.subtypes.length === 0 && (!editingSubtype || editingSubtype.categoryId !== cat.id) ? (
                        <p className="text-sm text-ink-soft italic py-2">No subtypes configured.</p>
                      ) : (
                        cat.subtypes.map((sub) => {
                          const isEditingThisSub = editingSubtype?.id === sub.id;
                          if (isEditingThisSub) return <div key={sub.id}>{renderSubtypeForm(cat.id, false)}</div>;
                          return (
                            <div key={sub.id} className="bg-white p-3 rounded-xl border border-line flex items-center justify-between group shadow-sm">
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm text-ink">{sub.name}</span>
                                  <span className="text-[10px] bg-bg-alt px-1.5 py-0.5 rounded text-ink-soft">Order: {sub.sortOrder}</span>
                                </div>
                                <span className="text-xs text-ink-soft">/{sub.slug} • {sub._count.products} Products</span>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  onClick={() => setEditingSubtype({ ...sub })}
                                  disabled={isPending}
                                  className="p-1.5 text-ink-soft hover:text-ink hover:bg-bg-alt rounded transition-colors"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubtype(sub.id)}
                                  disabled={isPending}
                                  className="p-1.5 text-ink-soft hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
