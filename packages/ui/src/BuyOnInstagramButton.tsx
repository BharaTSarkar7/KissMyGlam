"use client";

import React, { useState } from "react";
import { INSTAGRAM_HANDLE } from "@kissmyglam/config";
import { Button } from "./Button";

interface BuyOnInstagramButtonProps {
  name: string;
  price: string;
  selectedSize?: string;
  productUrl: string;
  disabled?: boolean;
}

export const BuyOnInstagramButton: React.FC<BuyOnInstagramButtonProps> = ({
  name,
  price,
  selectedSize,
  productUrl,
  disabled = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copyStatus, setCopyStatus] = useState<"idle" | "copied" | "failed">("idle");
  const [summaryText, setSummaryText] = useState("");

  const handleOpen = () => {
    if (disabled) return;
    setIsModalOpen(true);
    setCopyStatus("idle");
    
    // Build summary text
    let sizeText = "";
    if (selectedSize) {
      sizeText = ` — Size ${selectedSize}`;
    }
    const text = `${name} — ${price}${sizeText}\n${productUrl}`;
    setSummaryText(text);
  };

  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleContinue = async () => {
    // 1. Copy to clipboard
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(summaryText);
        setCopyStatus("copied");
        // Show brief toast
        setTimeout(() => setCopyStatus("idle"), 3000);
      } else {
        throw new Error("Clipboard API not available");
      }
    } catch (err) {
      console.warn("Failed to copy to clipboard automatically", err);
      setCopyStatus("failed");
      // Don't open window if they need to copy manually first
      return; 
    }

    // 2. Open Instagram if copy succeeded
    openInstagram();
  };

  const openInstagram = () => {
    const url = new URL(`https://ig.me/m/${INSTAGRAM_HANDLE}`);
    // Defensive check
    if (url.hostname === "ig.me") {
      window.open(url.toString(), "_blank", "noopener,noreferrer");
    }
    handleClose();
  };

  return (
    <>
      <Button 
        variant="primary" 
        onClick={handleOpen} 
        disabled={disabled}
        className="w-full"
      >
        Buy on Instagram
      </Button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-bg w-full max-w-sm rounded-[24px] p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h3 className="font-serif text-2xl font-medium text-ink mb-3 text-center">
              Almost there!
            </h3>
            
            <p className="text-ink-soft text-center mb-6 leading-relaxed">
              You're about to leave KissMyGlam to open Instagram. We'll copy this product's details to your clipboard so you can paste them into the DM.
            </p>

            {copyStatus === "copied" && (
              <div className="mb-6 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl text-center font-medium">
                Copied! Paste it into the DM.
              </div>
            )}

            {copyStatus === "failed" && (
              <div className="mb-6 flex flex-col gap-2">
                <p className="text-sm text-red-600 font-medium">Auto-copy failed. Please copy manually:</p>
                <textarea 
                  readOnly 
                  value={summaryText}
                  className="w-full p-3 rounded-xl border border-ink/20 bg-bg-alt text-sm focus:outline-none focus:ring-2 focus:ring-ink"
                  rows={3}
                  onClick={(e) => (e.target as HTMLTextAreaElement).select()}
                />
                <Button variant="primary" onClick={openInstagram} className="mt-2">
                  I've copied it, open Instagram
                </Button>
              </div>
            )}

            {copyStatus !== "failed" && (
              <div className="flex flex-col gap-3">
                <Button variant="primary" onClick={handleContinue}>
                  Continue
                </Button>
                <Button variant="ghost" onClick={handleClose}>
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
