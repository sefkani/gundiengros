"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/components/CartProvider";
import { createClient } from "@/lib/supabase/client";

export default function HandlekurvPage() {
  const { lines, setQuantity, removeLine, clearCart, totalExVat, totalVat, totalIncVat } =
    useCart();
  const [note, setNote] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function handleSubmit() {
    if (lines.length === 0) return;
    setSubmitting(true);
    setError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Du må være logget inn for å sende en bestilling.");
      setSubmitting(false);
      return;
    }

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        note: note || null,
        delivery_date: deliveryDate || null,
        total_amount: totalIncVat,
      })
      .select()
      .single();

    if (orderError || !order) {
      setError("Noe gikk galt ved oppretting av bestillingen. Prøv igjen.");
      setSubmitting(false);
      return;
    }

    const items = lines.map((l) => ({
      order_id: order.id,
      product_id: l.product.id,
      product_name: l.product.name,
      package_size: l.product.package_size,
      unit_price: l.product.price_ex_vat,
      quantity: l.quantity,
      line_total: l.quantity * l.product.price_ex_vat,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(items);

    if (itemsError) {
      setError("Bestillingen ble opprettet, men varelinjene feilet. Kontakt oss.");
      setSubmitting(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("company_name, contact_person")
      .eq("id", user.id)
      .single();

    fetch("/api/notify-new-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        orderId: order.id,
        companyName: profile?.company_name ?? "Ukjent kunde",
        contactPerson: profile?.contact_person,
        totalAmount: totalIncVat,
        items: lines.map((l) => ({
          name: l.product.name,
          quantity: l.quantity,
          lineTotal: l.quantity * l.product.price_ex_vat,
        })),
      }),
    }).catch(() => {
      // Best-effort notification — order already succeeded regardless.
    });

    clearCart();
    router.push(`/ordre-bekreftet/${order.id}`);
  }

  return (
    <div>
      <main className="mx-auto max-w-5xl px-6 py-8">
        <h1 className="mb-6 text-2xl font-bold text-navy-900">Handlekurv</h1>

        {lines.length === 0 ? (
          <div className="card flex flex-col items-center gap-4 p-12 text-center">
            <p className="text-gray-500">Handlekurven din er tom.</p>
            <Link href="/katalog" className="btn-primary">
              Gå til produktkatalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="card overflow-x-auto lg:col-span-2">
              <table className="w-full min-w-[600px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                    <th className="px-4 py-3 font-medium">Produkt</th>
                    <th className="px-4 py-3 font-medium">Antall</th>
                    <th className="px-4 py-3 font-medium">Linjesum</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {lines.map((line) => (
                    <tr key={line.product.id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-navy-900">
                          {line.product.name}
                        </div>
                        {line.product.package_size && (
                          <div className="text-xs text-gray-500">
                            {line.product.package_size}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          min={0}
                          value={line.quantity}
                          onChange={(e) =>
                            setQuantity(line.product, parseInt(e.target.value, 10) || 0)
                          }
                          className="h-8 w-16 rounded-md border border-gray-300 text-center text-sm"
                        />
                      </td>
                      <td className="px-4 py-3 font-medium text-navy-900">
                        {(line.quantity * line.product.price_ex_vat).toLocaleString(
                          "nb-NO",
                          { style: "currency", currency: "NOK" }
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => removeLine(line.product.id)}
                          className="text-sm text-red-600 hover:underline"
                        >
                          Fjern
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card flex h-fit flex-col gap-4 p-6">
              <h2 className="font-semibold text-navy-900">Oppsummering</h2>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Sum eks. mva</span>
                  <span>
                    {totalExVat.toLocaleString("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Mva</span>
                  <span>
                    {totalVat.toLocaleString("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                    })}
                  </span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-2 font-semibold text-navy-900">
                  <span>Totalt</span>
                  <span>
                    {totalIncVat.toLocaleString("nb-NO", {
                      style: "currency",
                      currency: "NOK",
                    })}
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  Ønsket leveringsdato
                </label>
                <input
                  type="date"
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  className="input-field"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  Merknad til bestillingen
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="F.eks. ønsket leveringstidspunkt, spesielle instruksjoner…"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-accent w-full"
              >
                {submitting ? "Sender bestilling…" : "Send bestilling"}
              </button>
              <Link
                href="/katalog"
                className="text-center text-sm text-gray-500 hover:underline"
              >
                Fortsett å handle
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
