"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ImageProps {
  id: string;
  url: string;
  altText?: string | null;
}

interface ProductImageGalleryProps {
  images: ImageProps[];
  productName: string;
}

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="relative aspect-[4/5] w-full max-h-[80vh] rounded-[14px] overflow-hidden bg-bg-alt flex items-center justify-center">
        <span className="text-ink-soft">No image available</span>
      </div>
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-[4/5] w-full max-h-[80vh] rounded-[14px] overflow-hidden bg-bg-alt">
        <Image
          src={images[0].url}
          alt={images[0].altText || productName}
          fill
          className="object-cover"
          priority
        />
      </div>
    );
  }

  const nextImage = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  let touchStartX = 0;
  let touchEndX = 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX = e.changedTouches[0].screenX;
    if (touchStartX - touchEndX > 50) nextImage();
    if (touchStartX - touchEndX < -50) prevImage();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div 
        className="group relative aspect-[4/5] w-full max-h-[80vh] rounded-[14px] overflow-hidden bg-bg-alt"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <Image
          src={images[currentIndex].url}
          alt={images[currentIndex].altText || productName}
          fill
          className="object-cover transition-opacity duration-300"
          priority
        />
        
        {/* Navigation Arrows */}
        <button 
          onClick={prevImage}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-ink shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 focus:opacity-100"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextImage}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 hover:bg-white rounded-full flex items-center justify-center text-ink shadow-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0 focus:opacity-100"
          aria-label="Next image"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-5 sm:grid-cols-6 gap-3">
        {images.map((image, idx) => (
          <button
            key={image.id}
            onClick={() => setCurrentIndex(idx)}
            className={`relative aspect-[4/5] w-full rounded-[8px] overflow-hidden bg-bg-alt transition-all ${
              currentIndex === idx ? "ring-2 ring-ink ring-offset-1" : "opacity-60 hover:opacity-100"
            }`}
          >
            <Image
              src={image.url}
              alt={image.altText || productName}
              fill
              className="object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
