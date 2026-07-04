import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { OrderStatusSelect } from "@/components/OrderStatusSelect";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, profiles(*), order_items(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-navy-900">
            Ordre #{order.id.slice(0, 8)}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Mottatt {new Date(order.created_at).toLocaleString("nb-NO")}
          </p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} />
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="card p-5">
          <h2 className="mb-2 text-sm font-semibold text-gray-500">Kunde</h2>
          <p className="font-medium text-navy-900">{order.profiles?.company_name}</p>
          <p className="text-sm text-gray-600">{order.profiles?.contact_person}</p>
          <p className="text-sm text-gray-600">{order.profiles?.phone}</p>
          <p className="text-sm text-gray-600">Org.nr: {order.profiles?.org_number}</p>
        </div>
        <div className="card p-5">
          <h2 className="mb-2 text-sm font-semibold text-gray-500">Leveringsdetaljer</h2>
          <p className="text-sm text-gray-600">
            Ønsket levering:{" "}
            {order.delivery_date
              ? new Date(order.delivery_date).toLocaleDateString("nb-NO")
              : "Ikke spesifisert"}
          </p>
          {order.note && (
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-medium text-navy-900">Merknad: </span>
              {order.note}
            </p>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <th className="px-4 py-3 font-medium">Produkt</th>
              <th className="px-4 py-3 font-medium">Antall</th>
              <th className="px-4 py-3 font-medium">Enhetspris</th>
              <th className="px-4 py-3 font-medium">Linjesum</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {order.order_items.map((item: any) => (
              <tr key={item.id}>
                <td className="px-4 py-3">
                  <div className="font-medium text-navy-900">{item.product_name}</div>
                  {item.package_size && (
                    <div className="text-xs text-gray-500">{item.package_size}</div>
                  )}
                </td>
                <td className="px-4 py-3">{item.quantity}</td>
                <td className="px-4 py-3">
                  {item.unit_price.toLocaleString("nb-NO", {
                    style: "currency",
                    currency: "NOK",
                  })}
                </td>
                <td className="px-4 py-3 font-medium text-navy-900">
                  {item.line_total.toLocaleString("nb-NO", {
                    style: "currency",
                    currency: "NOK",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-gray-200">
              <td colSpan={3} className="px-4 py-3 text-right font-semibold text-navy-900">
                Totalt (inkl. mva)
              </td>
              <td className="px-4 py-3 font-semibold text-navy-900">
                {order.total_amount.toLocaleString("nb-NO", {
                  style: "currency",
                  currency: "NOK",
                })}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
