import Link from "next/link";
import { Search } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface HeaderProps {
  categories?: Category[];
}

export function Header({ categories = [] }: HeaderProps) {
  return (
    <header className="w-full py-6 px-6 max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-8">
        <Link href="/" className="font-sans font-bold tracking-[0.2em] text-ink uppercase text-sm">
          KissMyGlam
        </Link>
        {categories.length > 0 && (
          <nav className="hidden md:flex items-center gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="text-ink-soft hover:text-ink transition-colors font-sans text-sm"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        )}
      </div>
      <div>
        <button aria-label="Search" className="text-ink hover:opacity-70 transition-opacity">
          <Search className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
