import Image from "next/image";

const values = [
  {
    title: "Authenticite",
    desc: "Des recettes traditionnelles transmises de generation en generation, preparees avec respect.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent mx-auto mb-4">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: "Excellence",
    desc: "Des ingredients selectionnes avec soin, un savoir-faire culinaire rigoureux, une presentation soignee.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent mx-auto mb-4">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "Convivialite",
    desc: "Un lieu de partage et de rencontre ou chaque convive est accueilli comme un membre de la famille.",
    icon: (
      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-accent mx-auto mb-4">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export default function RestaurantPage() {
  return (
    <>
      {/* Hero image */}
      <section className="bg-primary pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src="/images/portrait/photo-12.jpeg"
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
            src="/images/portrait/photo-09.jpeg"
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
            src="/images/portrait/photo-20.jpeg"
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

      {/* Valeurs */}
      <section className="bg-primary text-white py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <span className="eyebrow text-accent mb-3 block">CE QUI NOUS ANIME</span>
          <h2 className="heading-section text-white">Nos Valeurs</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v) => (
            <div key={v.title} className="text-center">
              {v.icon}
              <h3 className="font-serif text-xl mb-3">{v.title}</h3>
              <p className="text-sm text-white/60 leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
