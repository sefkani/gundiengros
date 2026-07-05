import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CatalogTable } from "@/components/CatalogTable";
import type { Category, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MinListePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center gap-4 px-6 py-24 text-center">
        <h1 className="text-xl font-semibold text-navy-900">Logg inn for å se listen din</h1>
        <p className="text-gray-600">
          Min liste lar deg samle varene du bestiller oftest, slik at du slipper å lete
          gjennom hele katalogen hver gang.
        </p>
        <Link href="/logg-inn" className="btn-primary">
          Logg inn
        </Link>
      </div>
    );
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile?.approved) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-xl font-semibold text-navy-900">
          Kontoen din venter på godkjenning
        </h1>
        <p className="mt-3 text-gray-600">
          Du får tilgang til Min liste så snart kontoen din er godkjent av Gundi Engros.
        </p>
      </div>
    );
  }

  const { data: favorites } = await supabase
    .from("customer_favorites")
    .select("product_id")
    .eq("user_id", user.id);

  const favoriteProductIds = (favorites ?? []).map((f) => f.product_id);

  const [{ data: categories }, { data: products }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    favoriteProductIds.length > 0
      ? supabase
          .from("products")
          .select("*")
          .in("id", favoriteProductIds)
          .eq("active", true)
          .order("name")
      : Promise.resolve({ data: [] as Product[] }),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Min liste</h1>
        <p className="mt-1 text-sm text-gray-500">
          Varene du bruker mest — trykk på hjertet i katalogen for å legge til flere.
        </p>
      </div>
      <CatalogTable
        categories={(categories ?? []) as Category[]}
        products={(products ?? []) as Product[]}
        canSeePrices={true}
        userId={user.id}
        favoriteProductIds={favoriteProductIds}
        onlyFavorites={true}
      />
    </main>
  );
}
