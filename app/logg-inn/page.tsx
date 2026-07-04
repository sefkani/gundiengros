"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { translateAuthError } from "@/lib/authErrors";

export default function LoggInnPage() {
  return (
    <Suspense fallback={null}>
      <LoggInnForm />
    </Suspense>
  );
}

function LoggInnForm() {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<"logg-inn" | "registrer">(
    searchParams.get("modus") === "registrer" ? "registrer" : "logg-inn"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [orgNumber, setOrgNumber] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) {
      setError(translateAuthError(error.message));
      return;
    }
    router.push("/katalog");
    router.refresh();
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          company_name: companyName,
          org_number: orgNumber,
          contact_person: contactPerson,
          phone,
        },
      },
    });

    setLoading(false);
    if (error) {
      setError(translateAuthError(error.message));
      return;
    }

    fetch("/api/notify-new-customer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        companyName,
        orgNumber,
        contactPerson,
        phone,
        email,
      }),
    }).catch(() => {
      // Best-effort notification — registration already succeeded regardless.
    });

    setInfo(
      "Takk for registreringen! Kontoen din må godkjennes av Gundi Engros før du kan bestille. Vi tar kontakt så snart som mulig."
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-white">
            GUNDI <span className="text-gold-500">ENGROS</span>
          </h1>
          <p className="mt-2 text-sm text-gray-400">
            Engrosportal for restaurant- og fastfoodbransjen
          </p>
        </div>

        <div className="card p-8">
          <div className="mb-6 flex rounded-md bg-gray-100 p-1">
            <button
              onClick={() => setMode("logg-inn")}
              className={`flex-1 rounded py-2 text-sm font-medium transition-colors ${
                mode === "logg-inn" ? "bg-white shadow-sm text-navy-900" : "text-gray-500"
              }`}
            >
              Logg inn
            </button>
            <button
              onClick={() => setMode("registrer")}
              className={`flex-1 rounded py-2 text-sm font-medium transition-colors ${
                mode === "registrer" ? "bg-white shadow-sm text-navy-900" : "text-gray-500"
              }`}
            >
              Registrer bedrift
            </button>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}
          {info && (
            <div className="mb-4 rounded-md bg-green-50 px-4 py-3 text-sm text-green-700">
              {info}
            </div>
          )}

          {mode === "logg-inn" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  E-post
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="post@dinbedrift.no"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  Passord
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full">
                {loading ? "Logger inn…" : "Logg inn"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  Bedriftsnavn
                </label>
                <input
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="input-field"
                  placeholder="Din Restaurant AS"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  Organisasjonsnummer
                </label>
                <input
                  value={orgNumber}
                  onChange={(e) => setOrgNumber(e.target.value)}
                  className="input-field"
                  placeholder="123 456 789"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  Kontaktperson
                </label>
                <input
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="input-field"
                  placeholder="Ola Nordmann"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  Telefon
                </label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="input-field"
                  placeholder="+47 000 00 000"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  E-post
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  placeholder="post@dinbedrift.no"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-navy-900">
                  Passord
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  placeholder="Minst 6 tegn"
                />
              </div>
              <button type="submit" disabled={loading} className="btn-accent w-full">
                {loading ? "Sender…" : "Send registrering"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
