import Link from "next/link";

export default function ReservationPage() {
  return (
    <>
      <section className="bg-primary pt-32 pb-16 px-6 text-center">
        <h1 className="heading-hero text-white text-4xl md:text-6xl">Reservation</h1>
      </section>

      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="body-text text-text-muted mb-8">
          Le formulaire de reservation sera bientot disponible.
          En attendant, contactez-nous directement.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="https://wa.me/213054247224"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
          >
            Reserver via WhatsApp
          </a>
          <a href="tel:+213054247224" className="btn-outline">
            Appeler le restaurant
          </a>
        </div>
      </section>
    </>
  );
}
