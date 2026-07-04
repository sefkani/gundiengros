"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Category, Product, StockStatus } from "@/lib/types";

interface ProductFormProps {
  categories: Category[];
  product?: Product;
}

const EMPTY: Omit<Product, "id" | "created_at"> = {
  category_id: null,
  name: "",
  sku: "",
  description: "",
  unit: "kg",
  package_size: "",
  price_ex_vat: 0,
  vat_rate: 15,
  stock_status: "på_lager",
  image_url: "",
  active: true,
  min_order_qty: 1,
};

export function ProductForm({ categories, product }: ProductFormProps) {
  const [form, setForm] = useState(product ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      category_id: form.category_id || null,
      name: form.name,
      sku: form.sku || null,
      description: form.description || null,
      unit: form.unit,
      package_size: form.package_size || null,
      price_ex_vat: Number(form.price_ex_vat),
      vat_rate: Number(form.vat_rate),
      stock_status: form.stock_status,
      image_url: form.image_url || null,
      active: form.active,
      min_order_qty: Number(form.min_order_qty) || 1,
    };

    const query = product
      ? supabase.from("products").update(payload).eq("id", product.id)
      : supabase.from("products").insert(payload);

    const { error } = await query;

    setSaving(false);
    if (error) {
      setError("Kunne ikke lagre produktet: " + error.message);
      return;
    }
    router.push("/admin/produkter");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-3xl space-y-5 p-6">
      {error && (
        <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-navy-900">
            Produktnavn *
          </label>
          <input
            required
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            className="input-field"
            placeholder="F.eks. Hvetemel type 405"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-navy-900">
            Varenummer (SKU)
          </label>
          <input
            value={form.sku ?? ""}
            onChange={(e) => update("sku", e.target.value)}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-navy-900">
            Kategori
          </label>
          <select
            value={form.category_id ?? ""}
            onChange={(e) => update("category_id", e.target.value || null)}
            className="input-field"
          >
            <option value="">Ingen kategori</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-navy-900">Enhet</label>
          <select
            value={form.unit}
            onChange={(e) => update("unit", e.target.value)}
            className="input-field"
          >
            <option value="kg">kg</option>
            <option value="stk">stk</option>
            <option value="kolli">kolli</option>
            <option value="sekk">sekk</option>
            <option value="liter">liter</option>
            <option value="kartong">kartong</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-navy-900">
            Pakningsstørrelse
          </label>
          <input
            value={form.package_size ?? ""}
            onChange={(e) => update("package_size", e.target.value)}
            className="input-field"
            placeholder="F.eks. 18 kg sekk"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-navy-900">
            Pris eks. mva (NOK) *
          </label>
          <input
            required
            type="number"
            step="0.01"
            min={0}
            value={form.price_ex_vat}
            onChange={(e) => update("price_ex_vat", Number(e.target.value) as any)}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-navy-900">
            Mva-sats (%)
          </label>
          <input
            type="number"
            step="0.01"
            min={0}
            value={form.vat_rate}
            onChange={(e) => update("vat_rate", Number(e.target.value) as any)}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-navy-900">
            Min. bestillingsantall
          </label>
          <input
            type="number"
            min={1}
            value={form.min_order_qty}
            onChange={(e) => update("min_order_qty", Number(e.target.value) as any)}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-navy-900">
            Lagerstatus
          </label>
          <select
            value={form.stock_status}
            onChange={(e) => update("stock_status", e.target.value as StockStatus)}
            className="input-field"
          >
            <option value="på_lager">På lager</option>
            <option value="lav_beholdning">Lav beholdning</option>
            <option value="utsolgt">Utsolgt</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-navy-900">
            Bilde-URL
          </label>
          <input
            value={form.image_url ?? ""}
            onChange={(e) => update("image_url", e.target.value)}
            className="input-field"
            placeholder="https://…"
          />
          <p className="mt-1 text-xs text-gray-500">
            Lim inn lenken til produktbildet (last opp bildet i Supabase Storage og lim
            inn den offentlige URL-en her).
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-navy-900">
            Beskrivelse
          </label>
          <textarea
            rows={3}
            value={form.description ?? ""}
            onChange={(e) => update("description", e.target.value)}
            className="input-field"
          />
        </div>

        <div className="flex items-center gap-2 sm:col-span-2">
          <input
            id="active"
            type="checkbox"
            checked={form.active}
            onChange={(e) => update("active", e.target.checked)}
            className="h-4 w-4 rounded border-gray-300"
          />
          <label htmlFor="active" className="text-sm text-navy-900">
            Synlig i katalogen for kunder
          </label>
        </div>
      </div>

      <div className="flex gap-3 border-t border-gray-100 pt-5">
        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Lagrer…" : product ? "Lagre endringer" : "Opprett produkt"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/produkter")}
          className="btn-secondary"
        >
          Avbryt
        </button>
      </div>
    </form>
  );
}
