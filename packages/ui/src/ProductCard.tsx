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
    <Link href={`/product/${slug}`} className="group block w-full">
      <div className="relative aspect-[1/1.2] rounded-[14px] overflow-hidden bg-bg-alt mb-3">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <button
          className="absolute top-3 right-3 p-1.5 bg-white shadow-sm rounded-full text-ink hover:scale-110 transition-transform cursor-pointer border-none outline-none"
          onClick={(e) => e.preventDefault()}
        >
          <Heart size={16} className="stroke-[1.5]" />
        </button>
      </div>
      <div>
        <h3 className="font-serif text-lg font-medium text-ink truncate">{name}</h3>
        <p className="font-sans text-sm text-ink-soft mt-1">{price}</p>
      </div>
    </Link>
  );
};
