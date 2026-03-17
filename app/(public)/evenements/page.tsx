import Link from "next/link";

const upcoming = [
  { title: "Soiree Gnawa", date: "Samedi 12 Avril 2026", time: "21h00" },
  { title: "Nuit du Malouf", date: "Vendredi 25 Avril 2026", time: "20h30" },
];

export default function EventsPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-primary pt-32 pb-20 px-6 text-center">
        <span className="eyebrow text-accent mb-4 block">EVENEMENT A VENIR</span>
        <h1 className="heading-hero text-white text-4xl md:text-6xl lg:text-7xl mb-4">
          Soiree Andalouse
        </h1>
        <p className="text-white/60 text-lg mb-2">
          Samedi 5 Avril 2026 — 21h00
        </p>
        <Link href="/reservation" className="btn-gold mt-8 inline-block">
          Reserver votre table
        </Link>
      </section>

      {/* Description */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="heading-section mb-8">A propos de l&apos;evenement</h2>
        <div className="space-y-5 body-text text-text-muted">
          <p>
            Plongez dans l&apos;univers envoutant de la musique andalouse lors d&apos;une
            soiree exceptionnelle au coeur de La Belle Assiette. Nos musiciens vous
            transporteront a travers les melodies intemporelles du patrimoine musical
            algerien.
          </p>
          <p>
            Un menu special sera propose pour l&apos;occasion, melant les saveurs
            raffinees de notre cuisine aux rythmes de la musique traditionnelle. Une
            experience sensorielle complete.
          </p>
          <p>
            Places limitees. Reservation fortement recommandee pour garantir votre
            table lors de cette soiree unique.
          </p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="bg-primary/5 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="eyebrow text-accent mb-3 block">PROCHAINEMENT</span>
          <h2 className="heading-section mb-10">Evenements a venir</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcoming.map((e) => (
              <div key={e.title} className="card-elevated p-8">
                <h3 className="font-serif text-2xl mb-2">{e.title}</h3>
                <p className="text-sm text-text-muted mb-1">{e.date}</p>
                <p className="text-sm text-text-muted mb-6">{e.time}</p>
                <Link
                  href="/reservation"
                  className="text-sm font-medium text-primary hover:text-accent transition-colors"
                >
                  Reserver →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
