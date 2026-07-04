import Link from "next/link";
import {
  ArrowRight,
  Beef,
  Boxes,
  Carrot,
  Croissant,
  CupSoda,
  Droplet,
  LayoutDashboard,
  Milk,
  Package,
  Snowflake,
  SprayCan,
  Tag,
  Truck,
  Wheat,
} from "lucide-react";

const VALUE_PROPS = [
  {
    icon: Truck,
    title: "Sømløs Logistikk",
    description:
      "Faste leveringsruter til restaurant- og fastfoodkjøkken i vårt distrikt, med rask og forutsigbar levering.",
  },
  {
    icon: Tag,
    title: "Konkurransedyktige Priser",
    description:
      "Store volumer gir bedre innkjøpspriser — vi fører prisfordelen videre til din bedrift.",
  },
  {
    icon: LayoutDashboard,
    title: "Moderne B2B Portal",
    description:
      "Bestill hele sortimentet fra én oversiktlig katalog, uten telefonordre eller papirskjemaer.",
  },
];

const CATEGORIES = [
  { name: "Frukt & Grønt", icon: Carrot, gradient: "from-green-500 to-emerald-700" },
  { name: "Kjøtt & Sjømat", icon: Beef, gradient: "from-red-500 to-rose-700" },
  { name: "Meieriprodukter & Egg", icon: Milk, gradient: "from-indigo-400 to-navy-700" },
  { name: "Frysevarer", icon: Snowflake, gradient: "from-sky-500 to-blue-700" },
  { name: "Saus, Dressing & Olje", icon: Droplet, gradient: "from-yellow-500 to-amber-600" },
  { name: "Krydder & Tørrvarer", icon: Wheat, gradient: "from-amber-500 to-orange-600" },
  { name: "Bakerivarer", icon: Croissant, gradient: "from-orange-400 to-amber-700" },
  { name: "Drikke", icon: CupSoda, gradient: "from-cyan-500 to-blue-600" },
  { name: "Rengjøring & Hygiene", icon: SprayCan, gradient: "from-teal-500 to-cyan-700" },
  { name: "Emballasje & Utstyr", icon: Package, gradient: "from-slate-500 to-navy-700" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy-950">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <span className="inline-block rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1 text-xs font-medium tracking-wide text-gold-400">
              B2B ENGROS FOR SERVERINGSBRANSJEN
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Kvalitet i bulk for norske serveringssteder.
            </h1>
            <p className="mt-4 text-xl font-medium text-gold-400">
              Vi forenkler din hverdag.
            </p>
            <p className="mt-6 max-w-lg text-lg text-gray-400">
              Gundi Engros AS leverer tørrvarer, frysevarer, kjøttprodukter,
              meieri, olje og emballasje direkte til restauranter og
              fastfoodkjeder — til priser og volum tilpasset profesjonelt
              kjøkkendrift.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/katalog" className="btn-accent px-6 py-3 text-base">
                Se Katalog
                <ArrowRight size={18} className="ml-2" />
              </Link>
              <Link
                href="/logg-inn?modus=registrer"
                className="inline-flex items-center justify-center rounded-md border border-white/20 px-6 py-3 text-base font-medium text-white hover:bg-white/10"
              >
                Bli Kunde
              </Link>
            </div>
          </div>

          {/* Decorative hero visual — swap for real product photography when available */}
          <div className="relative">
            <div className="absolute -inset-6 rounded-3xl bg-gold-500/10 blur-3xl" />
            <div className="relative grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-navy-900 p-6">
              {[Wheat, Droplet, Boxes, Package].map((Icon, i) => (
                <div
                  key={i}
                  className="flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl bg-gradient-to-br from-navy-800 to-navy-700 text-gold-400"
                >
                  <Icon size={40} strokeWidth={1.5} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats / trust bar */}
      <section className="border-y border-navy-800 bg-navy-900">
        <div className="mx-auto grid max-w-5xl grid-cols-1 divide-y divide-white/10 px-6 py-8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {[
            { value: "2000+", label: "Produkter" },
            { value: "Rask", label: "Levering" },
            { value: "100%", label: "B2B Fokus" },
          ].map((stat) => (
            <div key={stat.label} className="py-4 text-center sm:py-0">
              <div className="text-3xl font-bold text-gold-500">{stat.value}</div>
              <div className="mt-1 text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Value propositions */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {VALUE_PROPS.map((prop) => (
            <div key={prop.title} className="card p-8">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy-900 text-gold-500">
                <prop.icon size={24} />
              </div>
              <h3 className="mt-5 text-lg font-semibold text-navy-900">
                {prop.title}
              </h3>
              <p className="mt-2 text-sm text-gray-600">{prop.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured categories */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">
                Utforsk kategoriene våre
              </h2>
              <p className="mt-2 text-gray-600">
                Et utvalg av sortimentet vi leverer til kjøkken over hele landet.
              </p>
            </div>
            <Link
              href="/katalog"
              className="hidden items-center text-sm font-medium text-navy-700 hover:underline sm:flex"
            >
              Se hele katalogen
              <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((category) => (
              <Link
                key={category.name}
                href="/katalog"
                className="group relative overflow-hidden rounded-2xl"
              >
                <div
                  className={`flex aspect-[4/3] flex-col items-center justify-center gap-4 bg-gradient-to-br ${category.gradient} transition-transform duration-300 group-hover:scale-105`}
                >
                  <category.icon size={48} className="text-white/90" strokeWidth={1.5} />
                  <span className="text-lg font-semibold text-white">
                    {category.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
