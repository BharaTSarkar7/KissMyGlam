"use client";

import React, { useState } from "react";

interface DetailItem {
  label: string;
  value: string;
}

interface ProductDetailsAccordionProps {
  details: DetailItem[];
}

export function ProductDetailsAccordion({ details }: ProductDetailsAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (!details || details.length === 0) return null;

  return (
    <div className="border-t border-b border-ink/10">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 px-1 group"
      >
        <div className="flex items-center gap-3">
          {/* Shirt/Hanger icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
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
          <span className="text-sm font-semibold uppercase tracking-wider text-ink">
            About This Product
          </span>
        </div>
        {/* Chevron that rotates */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-ink-soft transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Collapsible content */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-[2000px] opacity-100 pb-6" : "max-h-0 opacity-0"
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-1">
          {details.map((detail, idx) => (
            <div key={idx}>
              <p className="text-xs text-ink-soft mb-1">{detail.label}</p>
              <p className="text-sm font-medium text-ink break-words">{detail.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
