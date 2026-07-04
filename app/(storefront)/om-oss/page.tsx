import { Boxes, ShieldCheck, Truck } from "lucide-react";

export default function OmOssPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <span className="text-sm font-medium uppercase tracking-wide text-gold-600">
        Om Gundi Engros
      </span>
      <h1 className="mt-3 text-3xl font-bold text-navy-900 sm:text-4xl">
        Din engrospartner for bulkvarer
      </h1>
      <p className="mt-3 text-lg font-medium text-gold-600">
        Vi forenkler din hverdag.
      </p>
      <p className="mt-4 text-lg text-gray-600">
        Gundi Engros AS er en norsk engrosleverandør som spesialiserer seg på
        bulkvarer til restaurant- og fastfoodbransjen. Vi leverer tørrvarer,
        frysevarer, kjøttprodukter, meieri, olje og emballasje direkte til
        profesjonelle kjøkken, med fokus på pålitelig levering og
        konkurransedyktige priser.
      </p>
      <p className="mt-4 text-gray-600">
        Som en ren B2B-aktør har vi bygget hele driften vår rundt behovene til
        restauranter og fastfoodkjeder — store volum, faste avtaler og en
        digital bestillingsprosess som sparer deg for tid.
      </p>

      <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="card p-6">
          <Truck className="text-gold-600" size={28} />
          <h3 className="mt-4 font-semibold text-navy-900">Rask, lokal levering</h3>
          <p className="mt-2 text-sm text-gray-600">
            Vi leverer til kjøkken i vårt distrikt med faste ruter og korte
            ledetider.
          </p>
        </div>
        <div className="card p-6">
          <Boxes className="text-gold-600" size={28} />
          <h3 className="mt-4 font-semibold text-navy-900">Bredt sortiment</h3>
          <p className="mt-2 text-sm text-gray-600">
            Over 2000 produkter innen tørrvarer, frysevarer, kjøttprodukter,
            meieri, olje og emballasje.
          </p>
        </div>
        <div className="card p-6">
          <ShieldCheck className="text-gold-600" size={28} />
          <h3 className="mt-4 font-semibold text-navy-900">Kvalitetssikret</h3>
          <p className="mt-2 text-sm text-gray-600">
            Alle leverandører kvalitetssikres for å møte kravene i
            næringsmiddelbransjen.
          </p>
        </div>
      </div>
    </div>
  );
}
