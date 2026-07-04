import { Resend } from "resend";

export const NOTIFY_EMAIL = "info@gundiengros.no";

// Resend's shared sending domain — works without verifying your own domain.
// Once gundiengros.no is verified in Resend, switch this to something like
// "Gundi Engros <bestilling@gundiengros.no>".
export const NOTIFY_FROM = "Gundi Engros <onboarding@resend.dev>";

// Lazily constructed so a missing RESEND_API_KEY only fails the specific
// email send at request time, instead of crashing the whole build (the
// Resend SDK throws immediately if the key is empty at construction time).
export function getResend() {
  return new Resend(process.env.RESEND_API_KEY || "re_missing_api_key");
}
