import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Betingelser",
  description:
    "Salgsbetingelser, leveringsvilkår, retur og personvernerklæring for Gundi Engros AS' engrosportal.",
  alternates: { canonical: "/betingelser" },
};

const SECTIONS = [
  {
    title: "Salgsbetingelser",
    body: "Alle priser i katalogen er oppgitt eksklusive merverdiavgift. Bestillinger er bindende når de er sendt inn gjennom portalen. Minimum bestillingsantall kan gjelde per produkt, og fremgår av produktkortet i katalogen. Betalingsbetingelser avtales individuelt med hver kunde ved godkjenning av konto.",
  },
  {
    title: "Levering",
    body: "Standard leveringstid er 24–48 timer fra bekreftet bestilling, avhengig av leveringssted og produkttilgjengelighet. Ønsket leveringsdato kan angis i handlekurven, og vi tar kontakt dersom denne ikke kan overholdes.",
  },
  {
    title: "Retur",
    body: "Reklamasjoner på feilleverte eller skadde varer må meldes innen 24 timer etter mottak. Ta kontakt med kundeservice for å avtale retur eller kreditering.",
  },
  {
    title: "Personvernerklæring",
    body: "Gundi Engros AS behandler personopplysninger i tråd med gjeldende personvernlovgivning (GDPR). Opplysninger som samles inn ved registrering brukes utelukkende til å administrere kundeforholdet, herunder godkjenning av konto, ordrebehandling og fakturering.",
  },
  {
    title: "Cookie-innstillinger",
    body: "Nettsiden benytter nødvendige informasjonskapsler for innlogging og handlekurv. Vi bruker ikke tredjeparts sporings- eller markedsføringscookies.",
  },
];

export default function BetingelserPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="text-3xl font-bold text-navy-900">Betingelser</h1>
      <p className="mt-4 text-gray-600">
        Her finner du våre salgsbetingelser, leveringsvilkår og
        personverninformasjon.
      </p>

      <div className="mt-10 space-y-10">
        {SECTIONS.map((section) => (
          <div key={section.title}>
            <h2 className="text-xl font-semibold text-navy-900">{section.title}</h2>
            <p className="mt-3 text-gray-600">{section.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
