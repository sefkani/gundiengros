"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, ShoppingCart, User } from "lucide-react";
import { useCart } from "@/components/CartProvider";
import { createClient } from "@/lib/supabase/client";

const NAV_LINKS = [
  { href: "/katalog", label: "Produkter" },
  { href: "/om-oss", label: "Om Oss" },
  { href: "/betingelser", label: "Betingelser" },
];

export function SiteHeader() {
  const { totalItems } = useCart();
  const [companyName, setCompanyName] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    let active = true;

    async function loadSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!active) return;

      if (!user) {
        setCompanyName(null);
        setCheckingSession(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("company_name")
        .eq("id", user.id)
        .single();

      if (active) {
        setCompanyName(profile?.company_name ?? user.email ?? "Min konto");
        setCheckingSession(false);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => loadSession());

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    router.push("/logg-inn");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-900/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight text-white">
            GUNDI <span className="text-gold-500">ENGROS</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-300 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href="/handlekurv"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-md border border-white/10 text-gray-200 hover:bg-white/10"
            aria-label="Handlekurv"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold-500 px-1 text-xs font-semibold text-white">
                {totalItems}
              </span>
            )}
          </Link>

          {checkingSession ? null : companyName ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm font-medium text-white hover:bg-white/10"
              >
                <User size={16} />
                <span className="hidden max-w-[140px] truncate sm:inline">
                  Logget inn som {companyName}
                </span>
                <ChevronDown size={14} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
                  <div className="border-b border-gray-100 px-4 py-3 text-sm">
                    <div className="text-gray-500">Logget inn som</div>
                    <div className="truncate font-medium text-navy-900">
                      {companyName}
                    </div>
                  </div>
                  <Link
                    href="/katalog"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-navy-900 hover:bg-gray-50"
                  >
                    Katalog
                  </Link>
                  <Link
                    href="/handlekurv"
                    onClick={() => setMenuOpen(false)}
                    className="block px-4 py-2 text-sm text-navy-900 hover:bg-gray-50"
                  >
                    Handlekurv
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                  >
                    Logg ut
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/logg-inn"
                className="text-sm font-medium text-gray-300 hover:text-white"
              >
                Logg inn
              </Link>
              <Link href="/logg-inn?modus=registrer" className="btn-accent px-4 py-2">
                Bli kunde
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
