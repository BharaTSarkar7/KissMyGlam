"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  imageUrl: string;
  slug: string;
}

export const ProductCard: React.FC<ProductCardProps> = ({ name, price, imageUrl, slug }) => {
  return (
    <Link href={`/product/${slug}`} className="group block bg-white rounded-card overflow-hidden p-3 border border-transparent hover:border-line transition-colors">
      <div className="relative aspect-[1/1.2] rounded-card overflow-hidden bg-bg-alt mb-4">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white text-ink transition-colors cursor-pointer" onClick={(e) => e.preventDefault()}>
          <Heart size={18} className="stroke-[1.5]" />
        </button>
      </div>
      <div className="px-1 pb-1">
        <h3 className="font-serif text-lg font-medium text-ink truncate">{name}</h3>
        <p className="font-sans text-sm text-ink-soft mt-1">{price}</p>
      </div>
    </Link>
  );
};
