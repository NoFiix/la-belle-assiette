import Image from "next/image";
import Link from "next/link";

const dishes = [
  { name: "Bourek aux Crevettes", desc: "Feuilles croustillantes farcies de crevettes epicees, menthe fraiche", price: "1 800 DA", badge: "CHEF" as const },
  { name: "Epaule d'Agneau Confite", desc: "Agneau confit aux pruneaux et amandes torrefiees", price: "3 200 DA", badge: null },
  { name: "Couscous Royal", desc: "Couscous signature aux legumes, merguez, poulet fermier", price: "2 800 DA", badge: "NOUVEAU" as const },
  { name: "Baklawa aux Pistaches", desc: "Fines feuilles dorees au miel de montagne", price: "900 DA", badge: null },
];

const galleryPhotos = [
  { src: "/images/restau-06.jpeg", alt: "Salle du restaurant", h: "h-64" },
  { src: "/images/restau-10.jpeg", alt: "Ambiance interieure", h: "h-80" },
  { src: "/images/restau-14.jpeg", alt: "Decoration murale", h: "h-56" },
  { src: "/images/restau-17.jpeg", alt: "Espace lounge", h: "h-72" },
  { src: "/images/restau-20.jpeg", alt: "Detail deco", h: "h-60" },
  { src: "/images/restau-24.jpeg", alt: "Vue de la salle", h: "h-48" },
];

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

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="min-h-svh bg-primary flex flex-col items-center justify-center text-center px-4 relative overflow-hidden">
        <Image
          src="/images/restau-01.jpg"
          alt="La Belle Assiette"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10">
          <span className="stagger-1 eyebrow text-accent block mb-6">
            PORT LA PECHERIE — ALGER
          </span>
          <h1 className="stagger-2 heading-hero text-white mb-6">
            La Belle Assiette
          </h1>
          <p className="stagger-3 text-white/70 text-lg md:text-xl max-w-md mx-auto mb-10 font-sans">
            Gastronomie algerienne au coeur d&apos;Alger
          </p>
          <div className="stagger-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/reservation" className="btn-gold">
              Reserver une table
            </Link>
            <Link href="/menu" className="btn-outline-white">
              Voir la carte
            </Link>
          </div>
        </div>

        <div className="stagger-5 absolute bottom-8">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/30 animate-bounce">
            <path d="M12 5v14M19 12l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Event Banner */}
      <section className="bg-accent py-3.5 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-6 text-center">
          <span className="text-[13px] font-medium text-white">
            🎵 Soiree Chaabi — Vendredi 28 Mars a 21h
          </span>
          <Link
            href="/reservation"
            className="text-[13px] font-medium text-white underline underline-offset-4"
          >
            Reserver
          </Link>
        </div>
      </section>

      {/* Menu Preview */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <span className="eyebrow text-accent mb-3 block">A LA CARTE</span>
          <h2 className="heading-section">Notre Carte</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          {dishes.map((dish) => (
            <div key={dish.name} className="card-elevated p-6">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-serif text-xl">{dish.name}</h3>
                <span className="font-sans text-sm tabular-nums whitespace-nowrap ml-4">
                  {dish.price}
                </span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed">{dish.desc}</p>
              {dish.badge && (
                <span
                  className={`inline-block mt-3 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    dish.badge === "CHEF"
                      ? "bg-primary/10 text-primary"
                      : "bg-accent/20 text-accent"
                  }`}
                >
                  {dish.badge}
                </span>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/menu"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors"
          >
            Voir la carte complete
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* About */}
      <section className="bg-primary text-white py-20 md:py-28 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
            <Image
              src="/images/restau-03.jpg"
              alt="Interieur du restaurant"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div>
            <span className="eyebrow text-accent mb-3 block">DEPUIS 2024</span>
            <h2 className="heading-section text-white mb-8">Notre Histoire</h2>
            <div className="space-y-5 text-white/70 body-text">
              <p>
                Nichee au coeur du Port La Pecherie d&apos;Alger, La Belle Assiette est
                nee d&apos;une passion pour la gastronomie algerienne et d&apos;un desir
                de la sublimer dans un cadre raffine.
              </p>
              <p>
                Notre cuisine puise dans les traditions culinaires seculaires de
                l&apos;Algerie, de la Kabylie aux oasis du sud, pour creer des plats
                qui racontent une histoire.
              </p>
              <p>
                Chaque assiette est une celebration du terroir algerien, preparee avec
                des ingredients locaux et un savoir-faire transmis de generation en
                generation.
              </p>
            </div>
            <Link
              href="/restaurant"
              className="inline-flex items-center gap-2 text-sm font-medium text-accent mt-8 hover:text-white transition-colors"
            >
              Decouvrir le restaurant
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Nos Valeurs */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-5xl mx-auto text-center mb-14">
          <span className="eyebrow text-accent mb-3 block">CE QUI NOUS ANIME</span>
          <h2 className="heading-section">Nos Valeurs</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((v) => (
            <div key={v.title} className="text-center">
              {v.icon}
              <h3 className="font-serif text-xl mb-3">{v.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 md:py-28 px-6 bg-primary/5">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <span className="eyebrow text-accent mb-3 block">EN IMAGES</span>
          <h2 className="heading-section">Notre Galerie</h2>
        </div>
        <div className="max-w-6xl mx-auto columns-2 md:columns-3 gap-4 space-y-4">
          {galleryPhotos.map((photo) => (
            <div
              key={photo.src}
              className={`${photo.h} relative rounded-lg overflow-hidden break-inside-avoid`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/galerie"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-accent transition-colors"
          >
            Voir toute la galerie
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>
    </>
  );
}
