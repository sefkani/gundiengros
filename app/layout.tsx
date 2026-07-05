import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const SITE_URL = "https://gundiengros.no";
const SITE_NAME = "Gundi Engros AS";
const SITE_DESCRIPTION =
  "Gundi Engros AS leverer tørrvarer, frysevarer, kjøttprodukter, meieri, olje og emballasje til restaurant- og fastfoodbransjen i vårt distrikt.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} — Vi forenkler din hverdag`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "engros",
    "engrossalg",
    "restaurant engros",
    "fastfood engros",
    "grossist Dokka",
    "grossist Oppland",
    "Gundi Engros",
  ],
  authors: [{ name: SITE_NAME }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "nb_NO",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: `${SITE_NAME} — Vi forenkler din hverdag`,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: `${SITE_NAME} — Vi forenkler din hverdag`,
    description: SITE_DESCRIPTION,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  telephone: "+4745429199",
  email: "info@gundiengros.no",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Storgata 20",
    postalCode: "2870",
    addressLocality: "Dokka",
    addressCountry: "NO",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className={inter.variable}>
      <body className="font-sans">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
