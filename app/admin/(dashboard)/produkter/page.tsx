import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductListTable } from "@/components/ProductListTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, categories(name)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">Produkter</h1>
          <p className="mt-1 text-sm text-gray-500">
            Legg til nye varer, oppdater priser og lagerstatus.
          </p>
        </div>
        <Link href="/admin/produkter/ny" className="btn-accent">
          + Nytt produkt
        </Link>
      </div>

      <ProductListTable products={(products ?? []) as any} />
    </div>
  );
}
