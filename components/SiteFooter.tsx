import Link from "next/link";
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="border-t border-navy-800 bg-navy-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="text-lg font-bold tracking-tight text-white">
              GUNDI <span className="text-gold-500">ENGROS</span>
            </span>
            <p className="mt-2 text-sm font-medium text-gold-500">
              Vi forenkler din hverdag
            </p>
            <p className="mt-3 max-w-xs text-sm text-gray-400">
              Engrosleverandør av tørrvarer, frysevarer, kjøttprodukter, meieri,
              olje og emballasje til restaurant- og fastfoodbransjen i vårt distrikt.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={16} className="mt-0.5 shrink-0 text-gray-500" />
                <span>Storgata 20, 2870 Dokka</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={16} className="shrink-0 text-gray-500" />
                <a href="mailto:info@gundiengros.no" className="hover:text-white">
                  info@gundiengros.no
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="shrink-0 text-gray-500" />
                <a href="tel:+4745429199" className="hover:text-white">
                  454 29 199
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Kundeservice
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/logg-inn" className="hover:text-white">
                  Min konto
                </Link>
              </li>
              <li>
                <Link href="/betingelser" className="hover:text-white">
                  Levering
                </Link>
              </li>
              <li>
                <Link href="/betingelser" className="hover:text-white">
                  Retur
                </Link>
              </li>
              <li>
                <Link href="/om-oss" className="hover:text-white">
                  Kontakt oss
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Juridisk
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/betingelser" className="hover:text-white">
                  Personvernerklæring
                </Link>
              </li>
              <li>
                <Link href="/betingelser" className="hover:text-white">
                  Salgsbetingelser
                </Link>
              </li>
              <li>
                <Link href="/betingelser" className="hover:text-white">
                  Cookie-innstillinger
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-white">
              Bedriften
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link href="/om-oss" className="hover:text-white">
                  Om oss
                </Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-white">
                  Produktkatalog
                </Link>
              </li>
              <li>
                <Link href="/logg-inn?modus=registrer" className="hover:text-white">
                  Bli kunde
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-navy-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-gray-500 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Gundi Engros AS. Alle rettigheter reservert.</p>
          <div className="flex items-center gap-4">
            <a href="#" aria-label="Facebook" className="hover:text-white">
              <Facebook size={18} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-white">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="LinkedIn" className="hover:text-white">
              <Linkedin size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
