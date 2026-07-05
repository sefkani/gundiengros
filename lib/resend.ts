import { Resend } from "resend";

export const NOTIFY_EMAIL = "info@gundiengros.no";

// mail.gundiengros.no is verified in Resend — sending from Resend's shared
// onboarding@resend.dev address gets rejected with 403 once a domain is
// verified (it's a testing-only address, restricted to your own inbox).
export const NOTIFY_FROM = "Gundi Engros <bestilling@mail.gundiengros.no>";

// Lazily constructed so a missing RESEND_API_KEY only fails the specific
// email send at request time, instead of crashing the whole build (the
// Resend SDK throws immediately if the key is empty at construction time).
export function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "re_missing_api_key");
}
