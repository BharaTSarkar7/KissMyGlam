"use client";

import React, { useState } from "react";
import { BuyOnInstagramButton } from "@kissmyglam/ui/src/BuyOnInstagramButton";

interface ProductActionsProps {
  name: string;
  price: string;
  sizes: string[];
  colours: string[];
  productUrl: string;
}

export const ProductActions: React.FC<ProductActionsProps> = ({
  name,
  price,
  sizes,
  colours,
  productUrl,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColour, setSelectedColour] = useState<string>("");

  // Button should be disabled if there are sizes but none is selected
  const hasSizes = sizes && sizes.length > 0;
  const isBuyDisabled = hasSizes && !selectedSize;

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
