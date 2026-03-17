import Image from "next/image";

export default function RestaurantPage() {
  return (
    <>
      {/* Hero image */}
      <section className="bg-primary pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src="/images/restau-01.jpg"
              alt="Vue panoramique du restaurant"
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          </div>
        </div>
      </section>

      {/* Notre Histoire */}
      <section className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <span className="eyebrow text-accent mb-3 block">NOTRE HISTOIRE</span>
          <h2 className="heading-section mb-8">Un heritage culinaire</h2>
          <div className="space-y-5 body-text text-text-muted">
            <p>
              Fondee en 2024, La Belle Assiette est le fruit d&apos;une vision :
              offrir a Alger un lieu ou la gastronomie algerienne est celebree avec
              l&apos;elegance qu&apos;elle merite.
            </p>
            <p>
              Notre cuisine s&apos;inspire des quatre coins de l&apos;Algerie — de la
              cote mediterraneenne aux oasis du Sahara — pour creer une carte qui
              raconte l&apos;histoire d&apos;un pays a travers ses saveurs.
            </p>
            <p>
              Chaque plat est concu comme une oeuvre, alliant tradition et modernite
              dans le respect des recettes ancestrales.
            </p>
          </div>
        </div>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
          <Image
            src="/images/restau-04.jpg"
            alt="Interieur du restaurant"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* Chef */}
      <section className="bg-primary/5 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="w-40 h-40 rounded-full image-placeholder mx-auto mb-8" />
          <span className="eyebrow text-accent mb-2 block">CHEF EXECUTIF</span>
          <h2 className="font-serif text-3xl mb-4">Karim Benali</h2>
          <p className="body-text text-text-muted max-w-xl mx-auto mb-4">
            Forme dans les plus grandes maisons de Paris et d&apos;Alger, le Chef
            Karim Benali sublime les saveurs algeriennes depuis plus de quinze ans.
            Sa cuisine est un pont entre heritage et innovation.
          </p>
          <p className="font-serif text-xl italic text-primary/60">
            — Chef K. Benali
          </p>
        </div>
      </section>

      {/* Soirees Musicales */}
      <section className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <Image
            src="/images/restau-11.jpeg"
            alt="Ambiance musicale"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
        <div>
          <span className="eyebrow text-accent mb-3 block">CHAQUE SEMAINE</span>
          <h2 className="heading-section mb-6">Les Soirees Musicales</h2>
          <div className="space-y-5 body-text text-text-muted">
            <p>
              Chaque semaine, La Belle Assiette s&apos;anime au son des musiques
              traditionnelles algeriennes. Chaabi, andalou, gnawa — nos soirees sont
              une invitation au voyage.
            </p>
            <p>
              Decouvrez notre programmation et laissez-vous emporter par
              l&apos;ambiance unique de nos evenements.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
