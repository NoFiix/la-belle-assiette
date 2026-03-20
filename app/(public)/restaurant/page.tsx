import Image from "next/image";
import { getSettings, s } from "@/lib/settings";

const LIEU_FALLBACK = "Niché au cœur du Port La Pêcherie, face à la Méditerranée, La Belle Assiette vous accueille dans un cadre d'exception avec vue imprenable sur la baie d'Alger.";

export default async function RestaurantPage() {
  const settings = await getSettings();

  const heroImg = s(settings, "image_restaurant_hero", "/images/restau-01.jpg");
  const histoireImg = s(settings, "image_restaurant_histoire", "/images/restau-04.jpg");
  const lieuImg = s(settings, "image_restaurant_lieu", "/images/restau-04.jpg");
  const soireesImg = s(settings, "image_restaurant_soirees", "/images/restau-11.jpeg");
  const desc = s(settings, "restaurant_desc");
  const lieuText = s(settings, "restaurant_lieu_text", LIEU_FALLBACK);
  const showLieu = s(settings, "show_restaurant_lieu", "true") !== "false";

  return (
    <>
      {/* Hero image */}
      <section className="bg-primary pt-32 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="relative aspect-video rounded-xl overflow-hidden">
            <Image
              src={heroImg}
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
            {desc ? (
              <p>{desc}</p>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden">
          <Image
            src={histoireImg}
            alt="Interieur du restaurant"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>
      </section>

      {/* Notre Lieu (replaces Chef section) */}
      {showLieu && (
        <section className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative aspect-[3/4] rounded-xl overflow-hidden lg:order-1">
            <Image
              src={lieuImg}
              alt="Notre Lieu"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          <div className="lg:order-2">
            <span className="eyebrow text-accent mb-3 block">LE CADRE</span>
            <h2 className="heading-section mb-8">Notre Lieu</h2>
            <div className="space-y-5 body-text text-text-muted">
              <p>{lieuText}</p>
            </div>
          </div>
        </section>
      )}

      {/* Soirees Musicales */}
      <section className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative aspect-video rounded-xl overflow-hidden">
          <Image
            src={soireesImg}
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
