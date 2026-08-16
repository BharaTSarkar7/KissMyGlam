import Link from "next/link";
import { HeaderLogo } from "./HeaderLogo";
import { HeaderSearch } from "./HeaderSearch";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface HeaderProps {
  categories?: Category[];
  onLiveSearch?: (query: string) => Promise<any[]>;
}

export function Header({ categories = [], onLiveSearch }: HeaderProps) {
  return (
    <header className="w-full py-6 px-6 max-w-7xl mx-auto flex items-center justify-between">
      <div className="flex items-center gap-8">
        <HeaderLogo />
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
        <HeaderSearch onLiveSearch={onLiveSearch} />
      </div>
    </header>
  );
}
