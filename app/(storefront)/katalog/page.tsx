import { createClient } from "@/lib/supabase/server";
import { CatalogTable } from "@/components/CatalogTable";
import type { Category, Product } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function KatalogPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile = null;
  if (user) {
    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    profile = data;
  }

  // Logged-in customers still need admin approval before they get full access.
  // Anonymous visitors skip this — they can browse, just without prices.
  if (user && !profile?.approved) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-xl font-semibold text-navy-900">
          Kontoen din venter på godkjenning
        </h1>
        <p className="mt-3 text-gray-600">
          Takk for at du registrerte {profile?.company_name ?? "bedriften din"} hos Gundi
          Engros AS. En av våre medarbeidere godkjenner nye engroskunder manuelt — du får
          tilgang til katalogen og prisene så snart kontoen er godkjent.
        </p>
      </div>
    );
  }

  const canSeePrices = !!user && !!profile?.approved;

  const [{ data: categories }, { data: products }, { data: favorites }] = await Promise.all([
    supabase.from("categories").select("*").order("sort_order"),
    supabase.from("products").select("*").eq("active", true).order("name"),
    canSeePrices && user
      ? supabase.from("customer_favorites").select("product_id").eq("user_id", user.id)
      : Promise.resolve({ data: [] as { product_id: string }[] }),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-navy-900">Produktkatalog</h1>
        <p className="mt-1 text-sm text-gray-500">
          {canSeePrices
            ? "Velg antall og legg direkte i handlekurven — ingen behov for å åpne enkeltprodukter."
            : "Logg inn som engroskunde for å se priser og legge varer i handlekurven."}
        </p>
      </div>
      <CatalogTable
        categories={(categories ?? []) as Category[]}
        products={(products ?? []) as Product[]}
        canSeePrices={canSeePrices}
        userId={user?.id ?? null}
        favoriteProductIds={(favorites ?? []).map((f) => f.product_id)}
      />
    </main>
  );
}
