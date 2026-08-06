import React from "react";
import Image from "next/image";
import Link from "next/link";

interface CategoryTileProps {
  name: string;
  imageUrl: string;
  slug: string;
}

export const CategoryTile: React.FC<CategoryTileProps> = ({ name, imageUrl, slug }) => {
  return (
    <Link href={`/category/${slug}`} className="group block w-full relative aspect-[4/5] rounded-card overflow-hidden bg-bg-alt">
      <Image
        src={imageUrl}
        alt={name}
        fill
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      <div className="absolute bottom-6 left-6 text-white font-sans">
        <h3 className="text-xl font-medium mb-1 font-serif">{name}</h3>
        <p className="text-sm opacity-90 flex items-center gap-1 group-hover:gap-2 transition-all">
          Explore Now <span>&rarr;</span>
        </p>
      </div>
    </Link>
  );
};
