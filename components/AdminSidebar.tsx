"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/admin", label: "Oversikt", exact: true },
  { href: "/admin/produkter", label: "Produkter" },
  { href: "/admin/ordre", label: "Ordrer" },
  { href: "/admin/kunder", label: "Kunder" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/admin/logg-inn");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col justify-between border-r border-navy-800 bg-navy-900">
      <div>
        <div className="px-6 py-6">
          <span className="text-lg font-bold tracking-tight text-white">
            GUNDI <span className="text-gold-500">ADMIN</span>
          </span>
        </div>
        <nav className="space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  active
                    ? "bg-navy-800 text-white"
                    : "text-gray-300 hover:bg-navy-800 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="px-3 pb-6">
        <button
          onClick={handleLogout}
          className="block w-full rounded-md px-3 py-2 text-left text-sm font-medium text-gray-300 hover:bg-navy-800 hover:text-white"
        >
          Logg ut
        </button>
      </div>
    </aside>
  );
}
