import Link from "next/link";

export default function EventBanner() {
  return (
    <section className="bg-secondary px-5 py-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-white/70">
            Evenement a venir
          </p>
          <h2 className="mt-1 font-heading text-2xl font-bold text-white md:text-3xl">
            Soiree Chaabi &mdash; Vendredi 28 Mars
          </h2>
        </div>
        <Link
          href="/reservation"
          className="shrink-0 rounded-sm bg-white px-6 py-2.5 text-sm font-semibold text-secondary-dark transition-colors hover:bg-background"
        >
          Reserver pour cet evenement
        </Link>
      </div>
    </section>
  );
}
