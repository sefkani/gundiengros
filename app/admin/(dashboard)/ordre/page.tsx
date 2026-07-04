import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ORDER_STATUS_LABELS } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(company_name, contact_person)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Ordrer</h1>

      <div className="card overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-medium">Kunde</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Beløp</th>
              <th className="px-4 py-3 font-medium">Levering</th>
              <th className="px-4 py-3 font-medium">Mottatt</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {(orders ?? []).map((order: any) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <Link href={`/admin/ordre/${order.id}`} className="font-medium text-navy-900 hover:underline">
                    {order.profiles?.company_name ?? "Ukjent kunde"}
                  </Link>
                  <div className="text-xs text-gray-500">
                    {order.profiles?.contact_person}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={order.status} />
                </td>
                <td className="px-4 py-3 font-medium text-navy-900">
                  {order.total_amount.toLocaleString("nb-NO", {
                    style: "currency",
                    currency: "NOK",
                  })}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {order.delivery_date
                    ? new Date(order.delivery_date).toLocaleDateString("nb-NO")
                    : "—"}
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(order.created_at).toLocaleDateString("nb-NO")}
                </td>
              </tr>
            ))}
            {(orders ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-gray-400">
                  Ingen bestillinger enda.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: keyof typeof ORDER_STATUS_LABELS }) {
  const styles: Record<string, string> = {
    mottatt: "bg-blue-50 text-blue-700",
    bekreftet: "bg-indigo-50 text-indigo-700",
    under_pakking: "bg-amber-50 text-amber-700",
    sendt: "bg-purple-50 text-purple-700",
    levert: "bg-green-50 text-green-700",
    kansellert: "bg-red-50 text-red-700",
  };
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
