import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";
import { Header } from "@kissmyglam/ui/src/Header";
import { prisma } from "@kissmyglam/db";
import { searchLiveProducts } from "./actions/search";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "500",
});

export const metadata: Metadata = {
  title: "KissMyGlam Shop",
  description: "Elevate Your Everyday Style",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
  });

  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${fraunces.variable} font-sans antialiased bg-bg`}>
        <Header categories={categories} onLiveSearch={searchLiveProducts} />
        {children}
      </body>
    </html>
  );
}
