import Link from "next/link";
import prisma from "@/lib/prisma";

async function getEvents() {
  try {
    return await prisma.event.findMany({
      orderBy: { date: "asc" },
    });
  } catch {
    return [];
  }
}

function formatDateFr(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function EventsPage() {
  const events = await getEvents();

  const activeEvent = events.find((e) => e.isActive);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const upcoming = events.filter(
    (e) => !e.isActive && e.date >= now
  );

  if (events.length === 0) {
    return (
      <>
        <section className="bg-primary pt-32 pb-20 px-6 text-center">
          <h1 className="heading-hero text-white text-4xl md:text-6xl">
            Evenements
          </h1>
        </section>
        <section className="max-w-3xl mx-auto px-6 py-20 text-center">
          <p className="font-serif text-lg text-text-muted italic">
            Restez connectes pour nos prochaines soirees.
          </p>
        </section>
      </>
    );
  }

  return (
    <>
      {/* Hero — événement actif */}
      {activeEvent ? (
        <>
          <section className="bg-primary pt-32 pb-20 px-6 text-center">
            <span className="eyebrow text-accent mb-4 block">EVENEMENT A VENIR</span>
            <h1 className="heading-hero text-white text-4xl md:text-6xl lg:text-7xl mb-4">
              {activeEvent.title}
            </h1>
            <p className="text-white/60 text-lg mb-2">
              {formatDateFr(activeEvent.date)}
              {activeEvent.time ? ` — ${activeEvent.time}` : ""}
            </p>
            <Link href="/reservation" className="btn-gold mt-8 inline-block">
              {activeEvent.ctaLabel}
            </Link>
          </section>

          {activeEvent.description && (
            <section className="max-w-3xl mx-auto px-6 py-20">
              <h2 className="heading-section mb-8">A propos de l&apos;evenement</h2>
              <div className="space-y-5 body-text text-text-muted">
                <p>{activeEvent.description}</p>
              </div>
            </section>
          )}
        </>
      ) : (
        <section className="bg-primary pt-32 pb-20 px-6 text-center">
          <h1 className="heading-hero text-white text-4xl md:text-6xl">
            Evenements
          </h1>
          <p className="text-white/60 text-lg mt-4">
            Restez connectes pour nos prochaines soirees.
          </p>
        </section>
      )}

      {/* Événements à venir */}
      {upcoming.length > 0 && (
        <section className="bg-primary/5 py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <span className="eyebrow text-accent mb-3 block">PROCHAINEMENT</span>
            <h2 className="heading-section mb-10">Evenements a venir</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcoming.map((e) => (
                <div key={e.id} className="card-elevated p-8">
                  <h3 className="font-serif text-2xl mb-2">{e.title}</h3>
                  <p className="text-sm text-text-muted mb-1">
                    {formatDateFr(e.date)}
                  </p>
                  {e.time && (
                    <p className="text-sm text-text-muted mb-6">{e.time}</p>
                  )}
                  {e.description && (
                    <p className="text-sm text-text-muted mb-6">{e.description}</p>
                  )}
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
      )}
    </>
  );
}
