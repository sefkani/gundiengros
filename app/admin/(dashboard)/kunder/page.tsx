import { createClient } from "@/lib/supabase/server";
import { CustomerApprovalTable } from "@/components/CustomerApprovalTable";
import type { Profile } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: customers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-navy-900">Kunder</h1>
      <CustomerApprovalTable customers={(customers ?? []) as Profile[]} />
    </div>
  );
}
