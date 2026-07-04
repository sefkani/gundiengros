"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/lib/types";

export function CustomerApprovalTable({ customers }: { customers: Profile[] }) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  async function setApproved(id: string, approved: boolean) {
    setBusyId(id);
    await supabase.from("profiles").update({ approved }).eq("id", id);
    setBusyId(null);
    router.refresh();
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[700px] text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <th className="px-4 py-3 font-medium">Bedrift</th>
            <th className="px-4 py-3 font-medium">Kontaktperson</th>
            <th className="px-4 py-3 font-medium">Org.nr</th>
            <th className="px-4 py-3 font-medium">Telefon</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {customers.map((c) => (
            <tr key={c.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-navy-900">{c.company_name}</td>
              <td className="px-4 py-3 text-gray-600">{c.contact_person}</td>
              <td className="px-4 py-3 text-gray-600">{c.org_number}</td>
              <td className="px-4 py-3 text-gray-600">{c.phone}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    c.approved
                      ? "bg-green-50 text-green-700"
                      : "bg-amber-50 text-amber-700"
                  }`}
                >
                  {c.approved ? "Godkjent" : "Venter godkjenning"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => setApproved(c.id, !c.approved)}
                  disabled={busyId === c.id}
                  className={c.approved ? "text-sm text-red-600 hover:underline" : "text-sm text-navy-700 hover:underline"}
                >
                  {c.approved ? "Trekk tilbake" : "Godkjenn"}
                </button>
              </td>
            </tr>
          ))}
          {customers.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-10 text-center text-gray-400">
                Ingen kunder registrert enda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
