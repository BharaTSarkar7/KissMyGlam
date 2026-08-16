"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, X, ArrowRight } from "lucide-react";

interface SearchResult {
  id: string;
  name: string;
  slug: string;
  price: string;
  categoryName: string;
  imageUrl: string;
  isSold: boolean;
}

interface HeaderSearchProps {
  onLiveSearch?: (query: string) => Promise<SearchResult[]>;
}

export function HeaderSearch({ onLiveSearch }: HeaderSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [, startTransition] = useTransition();

  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Auto-focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery("");
      setResults([]);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Live search debounced
  useEffect(() => {
    if (!query.trim() || !onLiveSearch) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const data = await onLiveSearch(query);
        setResults(data);
      } catch (err) {
        console.error("Live search failed", err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, onLiveSearch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsOpen(false);
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    });
  };

  const handleSelectProduct = (slug: string) => {
    setIsOpen(false);
    startTransition(() => {
      router.push(`/product/${slug}`);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Search products"
        className="p-2 -mr-2 text-ink hover:opacity-70 transition-opacity flex items-center justify-center rounded-full"
      >
        <Search className="w-5 h-5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 md:pt-24 px-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div
            ref={modalRef}
            className="bg-bg w-full max-w-2xl rounded-[24px] shadow-2xl border border-line/60 overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col"
          >
            {/* Search Input Bar */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-3 p-4 md:p-5 border-b border-line bg-white"
            >
              <Search className="w-5 h-5 text-ink-soft flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search for dresses, tops, bottoms..."
                className="flex-1 bg-transparent text-ink placeholder:text-ink-soft/60 text-base md:text-lg focus:outline-none font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="p-1 text-ink-soft hover:text-ink transition-colors"
                  title="Clear"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="px-3 py-1.5 text-xs font-medium text-ink-soft hover:text-ink bg-bg-alt rounded-lg transition-colors"
              >
                Esc
              </button>
            </form>

            {/* Results or Suggestions */}
            <div className="p-4 md:p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {isLoading && (
                <p className="text-xs text-ink-soft text-center py-4">
                  Searching...
                </p>
              )}

              {!isLoading && results.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft px-2 block">
                    Matching Products
                  </span>
                  <div className="space-y-1">
                    {results.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectProduct(item.slug)}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-bg-alt/70 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-12 rounded-lg bg-bg-alt relative overflow-hidden flex-shrink-0 border border-line/40">
                            {item.imageUrl && (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-ink group-hover:text-ink/80 truncate">
                              {item.name}
                            </p>
                            <span className="text-xs text-ink-soft">
                              {item.categoryName}
                            </span>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-2">
                          <span className="text-sm font-sans font-medium text-ink">
                            {item.price}
                          </span>
                          <ArrowRight className="w-4 h-4 text-ink-soft group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="w-full text-center py-2.5 mt-2 text-xs font-semibold text-ink hover:underline border-t border-line/40 block"
                  >
                    View all results for "{query}" →
                  </button>
                </div>
              )}

              {!isLoading && query.trim() && results.length === 0 && (
                <div className="text-center py-8 text-ink-soft space-y-2">
                  <p className="text-sm">No instant matches found.</p>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    className="text-xs font-medium text-ink hover:underline inline-flex items-center gap-1"
                  >
                    <span>Press Enter to search all products for "{query}"</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              )}

              {!query.trim() && (
                <div className="space-y-3">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-ink-soft px-1 block">
                    Quick Categories
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {["Dresses", "Tops", "Bottomwear", "Winterwear"].map(
                      (cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => {
                            setIsOpen(false);
                            startTransition(() => {
                              router.push(
                                `/category/${cat.toLowerCase().replace(/\s+/g, "-")}`
                              );
                            });
                          }}
                          className="px-3.5 py-1.5 rounded-full bg-white border border-line text-xs font-medium text-ink hover:border-ink hover:bg-bg-alt transition-colors"
                        >
                          {cat}
                        </button>
                      )
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
