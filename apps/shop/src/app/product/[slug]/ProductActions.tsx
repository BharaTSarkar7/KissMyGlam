"use client";

import React, { useState } from "react";
import { BuyOnInstagramButton } from "@kissmyglam/ui/src/BuyOnInstagramButton";

interface ProductActionsProps {
  name: string;
  price: string;
  sizes: string[];
  colours: string[];
  productUrl: string;
  sizeDetails?: Record<string, { label: string; value: string }[]>;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  name,
  price,
  sizes,
  colours,
  productUrl,
  sizeDetails = {},
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColour, setSelectedColour] = useState<string>("");

  // Button should be disabled if there are sizes but none is selected
  const hasSizes = sizes && sizes.length > 0;
  const isBuyDisabled = hasSizes && !selectedSize;

  const currentSizeMeasurements = selectedSize ? sizeDetails[selectedSize] || [] : [];

  const formatMeasurementValue = (val: string): string => {
    if (!val) return "";
    const trimmed = val.trim();
    if (/(?:cm|in|inch|inches|mm|m)$/i.test(trimmed)) {
      return trimmed;
    }
    return `${trimmed} cm`;
  };

  return (
    <div className="flex flex-col">
      {/* Sizes */}
      {hasSizes && (
        <div className="mb-8">
          <h3 className="text-sm font-medium uppercase tracking-wider text-ink mb-4 flex items-center justify-between">
            <span>Size</span>
            {!selectedSize && (
              <span className="text-xs text-red-500 normal-case tracking-normal font-normal">
                Please select a size
              </span>
            )}
          </h3>
          <div className="flex gap-3 flex-wrap">
            {sizes.map((size) => (
              <button 
                key={size} 
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 flex items-center justify-center border rounded-full text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? "bg-ink border-ink text-white"
                    : "border-ink/20 text-ink hover:border-ink"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Selected Size Measurements Panel */}
          {currentSizeMeasurements.length > 0 && (
            <div className="mt-4 p-4 bg-bg-alt/50 rounded-[16px] border border-line/60 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center gap-2 mb-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-ink-soft"
                >
                  <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wider text-ink">
                  Size {selectedSize} Measurements
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 px-1">
                {currentSizeMeasurements.map((m, idx) => (
                  <div key={idx}>
                    <p className="text-xs text-ink-soft mb-0.5">{m.label}</p>
                    <p className="text-sm font-medium text-ink break-words">{formatMeasurementValue(m.value)}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Colours */}
      {colours && colours.length > 0 && (
        <div className="mb-10">
          <h3 className="text-sm font-medium uppercase tracking-wider text-ink mb-4">Colour</h3>
          <div className="flex gap-3 flex-wrap">
            {colours.map((colour) => (
              <button 
                key={colour} 
                onClick={() => setSelectedColour(colour)}
                className={`px-4 h-10 flex items-center justify-center border rounded-full text-sm font-medium transition-colors ${
                  selectedColour === colour
                    ? "bg-ink border-ink text-white"
                    : "border-ink/20 text-ink hover:border-ink"
                }`}
              >
                {colour}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Buy Button */}
      <BuyOnInstagramButton
        name={name}
        price={price}
        selectedSize={selectedSize}
        productUrl={productUrl}
        disabled={isBuyDisabled}
      />
    </div>
  );
};
