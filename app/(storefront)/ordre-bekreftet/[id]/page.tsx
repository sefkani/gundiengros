import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function OrdreBekreftetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  return (
    <div>
      <main className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl text-green-700">
          ✓
        </div>
        <h1 className="text-2xl font-bold text-navy-900">Bestillingen er mottatt</h1>
        <p className="mt-2 text-gray-600">
          Takk for din bestilling. Ordrenummer{" "}
          <span className="font-mono text-navy-900">{id.slice(0, 8)}</span> er
          registrert, og vi tar kontakt for å bekrefte levering.
        </p>

        {order && (
          <div className="card mt-8 p-6 text-left">
            <h2 className="mb-3 font-semibold text-navy-900">Ordrelinjer</h2>
            <ul className="divide-y divide-gray-100 text-sm">
              {order.order_items.map((item: any) => (
                <li key={item.id} className="flex justify-between py-2">
                  <span>
                    {item.product_name} × {item.quantity}
                  </span>
                  <span className="font-medium">
                    {item.line_total.toLocaleString("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                    })}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <Link href="/katalog" className="btn-primary mt-8 inline-flex">
          Tilbake til katalogen
        </Link>
      </main>
    </div>
  );
}
