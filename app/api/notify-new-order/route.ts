import { NextResponse } from "next/server";
import { getResend, NOTIFY_EMAIL, NOTIFY_FROM } from "@/lib/resend";

interface NotifyOrderItem {
  name: string;
  quantity: number;
  lineTotal: number;
}

export async function POST(request: Request) {
  const { orderId, companyName, contactPerson, items, totalAmount } = await request.json();

  const itemLines = (items as NotifyOrderItem[])
    .map(
      (item) =>
        `  ${item.quantity}x ${item.name} — ${item.lineTotal.toLocaleString("nb-NO", {
          style: "currency",
          currency: "NOK",
        })}`
    )
    .join("\n");

  try {
    await getResend().emails.send({
      from: NOTIFY_FROM,
      to: NOTIFY_EMAIL,
      subject: `Ny bestilling fra ${companyName}`,
      text: [
        `Ny bestilling mottatt.`,
        ``,
        `Kunde: ${companyName}`,
        `Kontaktperson: ${contactPerson || "—"}`,
        ``,
        `Varer:`,
        itemLines,
        ``,
        `Totalt: ${Number(totalAmount).toLocaleString("nb-NO", {
          style: "currency",
          currency: "NOK",
        })}`,
        ``,
        `Se bestillingen her: https://gundiengros.no/admin/ordre/${orderId}`,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Failed to send new-order notification email:", error);
  }

  return NextResponse.json({ ok: true });
}
