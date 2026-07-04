"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";

export function OrderStatusSelect({
  orderId,
  status,
}: {
  orderId: string;
  status: OrderStatus;
}) {
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleChange(newStatus: OrderStatus) {
    setValue(newStatus);
    setSaving(true);
    await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    setSaving(false);
    router.refresh();
  }

  return (
    <select
      value={value}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      disabled={saving}
      className="input-field w-auto"
    >
      {Object.entries(ORDER_STATUS_LABELS).map(([key, label]) => (
        <option key={key} value={key}>
          {label}
        </option>
      ))}
    </select>
  );
}
