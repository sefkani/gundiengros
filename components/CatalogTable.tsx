"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart } from "lucide-react";
import { useMemo, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { createClient } from "@/lib/supabase/client";
import { STOCK_STATUS_LABELS, type Category, type Product } from "@/lib/types";

export function CatalogTable({
  categories,
  products,
  canSeePrices,
  userId,
  favoriteProductIds = [],
  onlyFavorites = false,
}: {
  categories: Category[];
  products: Product[];
  canSeePrices: boolean;
  userId?: string | null;
  favoriteProductIds?: string[];
  onlyFavorites?: boolean;
}) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<string | "alle">("alle");
  const [pendingQty, setPendingQty] = useState<Record<string, number>>({});
  const [favoriteIds, setFavoriteIds] = useState<Set<string>>(
    new Set(favoriteProductIds)
  );
  const { lines, setQuantity } = useCart();
  const supabase = createClient();

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (onlyFavorites && !favoriteIds.has(p.id)) return false;
      const matchesCategory =
        activeCategory === "alle" || p.category_id === activeCategory;
      const matchesSearch =
        !search.trim() ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        (p.sku ?? "").toLowerCase().includes(search.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [products, search, activeCategory, onlyFavorites, favoriteIds]);

  function qtyInCart(productId: string) {
    return lines.find((l) => l.product.id === productId)?.quantity ?? 0;
  }

  function getPendingQty(product: Product) {
    return pendingQty[product.id] ?? qtyInCart(product.id) ?? product.min_order_qty;
  }

  function updatePending(productId: string, qty: number) {
    setPendingQty((prev) => ({ ...prev, [productId]: Math.max(0, qty) }));
  }

  function addToCart(product: Product) {
    const qty = getPendingQty(product);
    if (qty <= 0) return;
    setQuantity(product, qty);
  }

  async function toggleFavorite(product: Product) {
    if (!userId) return;
    const isFavorite = favoriteIds.has(product.id);

    setFavoriteIds((prev) => {
      const next = new Set(prev);
      if (isFavorite) next.delete(product.id);
      else next.add(product.id);
      return next;
    });

    if (isFavorite) {
      await supabase
        .from("customer_favorites")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", product.id);
    } else {
      await supabase
        .from("customer_favorites")
        .insert({ user_id: userId, product_id: product.id });
    }
  }

  return (
    <div>
      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory("alle")}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
              activeCategory === "alle"
                ? "bg-navy-900 text-white"
                : "bg-white text-navy-900 border border-gray-300 hover:bg-gray-100"
            }`}
          >
            Alle varer
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === c.id
                  ? "bg-navy-900 text-white"
                  : "bg-white text-navy-900 border border-gray-300 hover:bg-gray-100"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Søk produkt eller varenummer…"
          className="input-field sm:max-w-xs"
        />
      </div>

      {/* Table */}
      <div className="card overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-medium">Produkt</th>
              <th className="px-4 py-3 font-medium">Enhet</th>
              <th className="px-4 py-3 font-medium">Pris eks. mva</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Antall</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((product) => {
              const inCart = qtyInCart(product.id);
              const outOfStock = product.stock_status === "utsolgt";
              const isFavorite = favoriteIds.has(product.id);
              return (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md bg-gray-100">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">
                            Bilde
                          </div>
                        )}
                      </div>
                      <div className="flex items-start gap-2">
                        {canSeePrices && userId && (
                          <button
                            type="button"
                            onClick={() => toggleFavorite(product)}
                            className="mt-0.5 shrink-0 text-gray-300 hover:text-gold-500"
                            aria-label={
                              isFavorite ? "Fjern fra min liste" : "Legg til i min liste"
                            }
                          >
                            <Heart
                              size={18}
                              className={isFavorite ? "fill-gold-500 text-gold-500" : ""}
                            />
                          </button>
                        )}
                        <div>
                          <div className="font-medium text-navy-900">{product.name}</div>
                          {product.package_size && (
                            <div className="text-xs text-gray-500">
                              {product.package_size}
                            </div>
                          )}
                          {product.sku && (
                            <div className="text-xs text-gray-400">
                              Varenr: {product.sku}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{product.unit}</td>
                  <td className="px-4 py-3 font-medium text-navy-900">
                    {canSeePrices ? (
                      product.price_ex_vat.toLocaleString("nb-NO", {
                        style: "currency",
                        currency: "NOK",
                      })
                    ) : (
                      <Link
                        href="/logg-inn"
                        className="whitespace-nowrap text-sm font-medium text-navy-700 hover:underline"
                      >
                        Logg inn for å se priser
                      </Link>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <StockBadge status={product.stock_status} />
                  </td>
                  {canSeePrices ? (
                    <>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() =>
                              updatePending(product.id, getPendingQty(product) - 1)
                            }
                            disabled={outOfStock}
                            className="h-8 w-8 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                          >
                            −
                          </button>
                          <input
                            type="number"
                            min={0}
                            value={getPendingQty(product)}
                            disabled={outOfStock}
                            onChange={(e) =>
                              updatePending(product.id, parseInt(e.target.value, 10) || 0)
                            }
                            className="h-8 w-14 rounded-md border border-gray-300 text-center text-sm disabled:bg-gray-100"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              updatePending(product.id, getPendingQty(product) + 1)
                            }
                            disabled={outOfStock}
                            className="h-8 w-8 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-40"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          type="button"
                          onClick={() => addToCart(product)}
                          disabled={outOfStock}
                          className="btn-accent whitespace-nowrap disabled:bg-gray-300"
                        >
                          {inCart > 0 ? `I kurv (${inCart})` : "Legg i kurv"}
                        </button>
                      </td>
                    </>
                  ) : (
                    <td className="px-4 py-3" colSpan={2}>
                      <Link href="/logg-inn" className="btn-secondary whitespace-nowrap">
                        Logg inn for å bestille
                      </Link>
                    </td>
                  )}
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                  {onlyFavorites
                    ? "Du har ingen varer i listen din enda. Gå til katalogen og trykk på hjertet for å legge til varer."
                    : "Ingen produkter matcher søket ditt."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StockBadge({ status }: { status: Product["stock_status"] }) {
  const styles: Record<Product["stock_status"], string> = {
    på_lager: "bg-green-50 text-green-700",
    lav_beholdning: "bg-amber-50 text-amber-700",
    utsolgt: "bg-red-50 text-red-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {STOCK_STATUS_LABELS[status]}
    </span>
  );
}
