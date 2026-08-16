"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Package, LayoutDashboard, BarChart3, LogOut, Menu, X, Tags } from "lucide-react";
import { Button } from "@kissmyglam/ui/src/Button";
import { logoutAction } from "@/app/actions/auth";

const navItems = [
  { name: "Inventory", href: "/inventory", icon: Package },
  { name: "Products", href: "/products", icon: LayoutDashboard },
  { name: "Categories", href: "/categories", icon: Tags },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-line shadow-sm z-50">
        <Link href="/inventory" className="font-serif font-medium text-xl text-ink">KissMyGlam</Link>
        <div className="flex items-center gap-4">
          <form action={logoutAction}>
            <button type="submit" className="text-ink-soft hover:text-ink">
              <LogOut className="w-5 h-5" />
            </button>
          </form>
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-ink">
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-line px-4 py-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? "bg-ink text-white" : "text-ink hover:bg-bg-alt"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-white border-r border-line flex-col h-screen sticky top-0">
        <div className="p-8">
          <h1 className="font-serif text-2xl font-medium text-ink">KissMyGlam</h1>
          <p className="text-xs text-ink-soft uppercase tracking-widest mt-1">Admin Panel</p>
        </div>
        
        <nav className="flex-1 px-4 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                  isActive ? "bg-ink text-white" : "text-ink hover:bg-bg-alt"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-line">
          <form action={logoutAction}>
            <Button type="submit" variant="ghost" className="w-full justify-start gap-3">
              <LogOut className="w-5 h-5" />
              Log Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full overflow-x-hidden p-6 md:p-12 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  );
}
