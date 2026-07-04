"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { STOCK_STATUS_LABELS, type Product } from "@/lib/types";

type ProductRow = Product & { categories?: { name: string } | null };

export function ProductListTable({ products }: { products: ProductRow[] }) {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Slette "${name}" permanent fra katalogen?`)) return;
    setDeletingId(id);
    await supabase.from("products").delete().eq("id", id);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3 font-medium">Produkt</th>
            <th className="px-4 py-3 font-medium">Kategori</th>
            <th className="px-4 py-3 font-medium">Pris eks. mva</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Synlig</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="font-medium text-navy-900">{product.name}</div>
                {product.package_size && (
                  <div className="text-xs text-gray-500">{product.package_size}</div>
                )}
              </td>
              <td className="px-4 py-3 text-gray-600">
                {product.categories?.name ?? "—"}
              </td>
              <td className="px-4 py-3 font-medium text-navy-900">
                {product.price_ex_vat.toLocaleString("nb-NO", {
                  style: "currency",
                  currency: "NOK",
                })}
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700">
                  {STOCK_STATUS_LABELS[product.stock_status]}
                </span>
              </td>
              <td className="px-4 py-3">{product.active ? "Ja" : "Nei"}</td>
              <td className="px-4 py-3 text-right">
                <div className="flex justify-end gap-3">
                  <Link
                    href={`/admin/produkter/${product.id}`}
                    className="text-sm text-navy-700 hover:underline"
                  >
                    Rediger
                  </Link>
                  <button
                    onClick={() => handleDelete(product.id, product.name)}
                    disabled={deletingId === product.id}
                    className="text-sm text-red-600 hover:underline disabled:opacity-50"
                  >
                    Slett
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                Ingen produkter enda. Klikk &quot;+ Nytt produkt&quot; for å legge til
                det første.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
