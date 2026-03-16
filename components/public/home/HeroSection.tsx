import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative -mt-[72px] flex min-h-[100svh] flex-col items-center justify-center px-5 pt-[72px] text-center">
      <Image
        src="/images/portrait/photo-01.jpeg"
        alt="La Belle Assiette - Restaurant gastronomique a Alger"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-secondary">
          Port La Pecherie &mdash; Alger
        </p>
        <h1 className="mt-6 font-heading text-5xl font-bold leading-tight text-white md:text-7xl lg:text-8xl">
          La Belle Assiette
        </h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-white/70 md:text-xl">
          Gastronomie algerienne au coeur d&apos;Alger
        </p>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/reservation"
            className="rounded-sm bg-secondary px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-secondary-dark"
          >
            Reserver une table
          </Link>
          <Link
            href="/menu"
            className="rounded-sm border border-white/30 px-8 py-3.5 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:border-white hover:bg-white/10"
          >
            Voir la carte
          </Link>
        </div>
      </div>
    </section>
  );
}
