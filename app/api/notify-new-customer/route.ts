import { NextResponse } from "next/server";
import { getResend, NOTIFY_EMAIL, NOTIFY_FROM } from "@/lib/resend";

export async function POST(request: Request) {
  const { companyName, orgNumber, contactPerson, phone, email } = await request.json();

  try {
    await getResend().emails.send({
      from: NOTIFY_FROM,
      to: NOTIFY_EMAIL,
      subject: `Ny engroskunde registrert: ${companyName}`,
      text: [
        `En ny bedrift har registrert seg og venter på godkjenning.`,
        ``,
        `Bedrift: ${companyName}`,
        `Org.nr: ${orgNumber || "—"}`,
        `Kontaktperson: ${contactPerson || "—"}`,
        `Telefon: ${phone || "—"}`,
        `E-post: ${email}`,
        ``,
        `Godkjenn kunden her: https://gundiengros.no/admin/kunder`,
      ].join("\n"),
    });
  } catch (error) {
    console.error("Failed to send new-customer notification email:", error);
  }

  return NextResponse.json({ ok: true });
}
