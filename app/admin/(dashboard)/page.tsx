import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUS_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [{ count: productCount }, { count: pendingOrders }, { count: pendingCustomers }, { data: recentOrders }] =
    await Promise.all([
      supabase.from("products").select("*", { count: "exact", head: true }),
      supabase
        .from("orders")
        .select("*", { count: "exact", head: true })
        .eq("status", "mottatt"),
      supabase
        .from("profiles")
        .select("*", { count: "exact", head: true })
        .eq("approved", false)
        .eq("role", "customer"),
      supabase
        .from("orders")
        .select("*, profiles(company_name)")
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Oversikt</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Produkter i katalog" value={productCount ?? 0} />
        <StatCard label="Nye bestillinger" value={pendingOrders ?? 0} accent />
        <StatCard label="Kunder som venter godkjenning" value={pendingCustomers ?? 0} />
      </div>

      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold text-navy-900">Siste bestillinger</h2>
          <Link href="/admin/ordre" className="text-sm text-navy-700 hover:underline">
            Se alle
          </Link>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 text-xs uppercase tracking-wide text-gray-500">
              <th className="py-2 font-medium">Kunde</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium">Beløp</th>
              <th className="py-2 font-medium">Dato</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(recentOrders ?? []).map((order: any) => (
              <tr key={order.id}>
                <td className="py-3">
                  <Link href={`/admin/ordre/${order.id}`} className="hover:underline">
                    {order.profiles?.company_name ?? "Ukjent kunde"}
                  </Link>
                </td>
                <td className="py-3">{ORDER_STATUS_LABELS[order.status as keyof typeof ORDER_STATUS_LABELS]}</td>
                <td className="py-3">
                  {order.total_amount.toLocaleString("nb-NO", {
                    style: "currency",
                    currency: "NOK",
                  })}
                </td>
                <td className="py-3 text-gray-500">
                  {new Date(order.created_at).toLocaleDateString("nb-NO")}
                </td>
              </tr>
            ))}
            {(recentOrders ?? []).length === 0 && (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  Ingen bestillinger ennå.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="card p-6">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`mt-2 text-3xl font-bold ${accent ? "text-gold-500" : "text-navy-900"}`}>
        {value}
      </div>
    </div>
  );
}
