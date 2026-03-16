import Link from "next/link";

export default function AboutSection() {
  return (
    <section className="bg-primary px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Placeholder visuel */}
        <div className="aspect-[4/3] rounded-sm bg-primary-light lg:aspect-square">
          <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 rounded-full border border-white/20" />
              <p className="mt-4 text-sm text-white/30">Photo du restaurant</p>
            </div>
          </div>
        </div>

        {/* Texte */}
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-secondary">
            Depuis 2024
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold text-white md:text-5xl">
            Notre Histoire
          </h2>
          <div className="mt-6 space-y-4 text-base leading-relaxed text-white/70">
            <p>
              Nichee au coeur du Port La Pecherie, La Belle Assiette celebre la
              richesse de la gastronomie algerienne dans un cadre raffine, face a
              la Mediterranee.
            </p>
            <p>
              Notre chef revisite les grands classiques de la cuisine algerienne avec
              des produits frais et locaux, dans le respect des saveurs authentiques
              qui font la noblesse de notre patrimoine culinaire.
            </p>
            <p>
              Chaque soiree est une invitation a decouvrir l&apos;art de vivre
              algerois : une cuisine genereuse, une ambiance musicale chaleureuse et
              un panorama exceptionnel sur la baie d&apos;Alger.
            </p>
          </div>
          <Link
            href="/restaurant"
            className="mt-8 inline-block border-b border-secondary pb-1 text-sm font-medium tracking-wide text-secondary transition-colors hover:border-secondary-light hover:text-secondary-light"
          >
            Decouvrir le restaurant
          </Link>
        </div>
      </div>
    </section>
  );
}
