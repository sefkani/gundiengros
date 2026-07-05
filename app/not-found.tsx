import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-6 text-center">
      <span className="text-lg font-bold tracking-tight text-white">
        GUNDI <span className="text-gold-500">ENGROS</span>
      </span>
      <h1 className="mt-8 text-3xl font-bold text-white">Siden finnes ikke</h1>
      <p className="mt-3 max-w-md text-gray-400">
        Siden du leter etter finnes ikke, eller har blitt flyttet.
      </p>
      <Link href="/" className="btn-accent mt-8">
        Tilbake til forsiden
      </Link>
    </div>
  );
}
