import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Gundi Engros AS — Vi forenkler din hverdag",
  description:
    "Gundi Engros AS leverer tørrvarer, frysevarer, kjøttprodukter, meieri, olje og emballasje til restaurant- og fastfoodbransjen i vårt distrikt.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no" className={inter.variable}>
      <body className="font-sans">
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
