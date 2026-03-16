export default function ContactPage() {
  return (
    <>
      <section className="bg-primary pt-32 pb-16 px-6 text-center">
        <h1 className="heading-hero text-white text-4xl md:text-6xl">Contact</h1>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info */}
        <div>
          <h2 className="heading-section mb-8">Nous trouver</h2>
          <div className="space-y-6">
            {/* Adresse */}
            <div className="flex gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent shrink-0 mt-1">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <div>
                <p className="font-medium mb-1">Adresse</p>
                <p className="text-sm text-text-muted">
                  62 Quai Sud Alger, Port La Pecherie,
                  <br />
                  Casbah 16000, Algerie
                </p>
              </div>
            </div>

            {/* Telephone */}
            <div className="flex gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent shrink-0 mt-1">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
              <div>
                <p className="font-medium mb-1">Telephone</p>
                <a href="tel:+213054247224" className="text-sm text-text-muted hover:text-text transition-colors block">
                  +213 054 247 224
                </a>
              </div>
            </div>

            {/* Email */}
            <div className="flex gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent shrink-0 mt-1">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                <polyline points="22,6 12,13 2,6" />
              </svg>
              <div>
                <p className="font-medium mb-1">Email</p>
                <a href="mailto:contact@labelleassiette.com" className="text-sm text-text-muted hover:text-text transition-colors">
                  contact@labelleassiette.com
                </a>
              </div>
            </div>

            {/* Horaires */}
            <div className="flex gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-accent shrink-0 mt-1">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <div>
                <p className="font-medium mb-3">Horaires</p>
                <table className="text-sm text-text-muted">
                  <tbody>
                    <tr>
                      <td className="pr-8 py-1">Lundi — Samedi</td>
                      <td>11h — 23h</td>
                    </tr>
                    <tr>
                      <td className="pr-8 py-1">Vendredi</td>
                      <td>17h — 23h</td>
                    </tr>
                    <tr>
                      <td className="pr-8 py-1">Dimanche</td>
                      <td className="text-text-muted/50">Ferme</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <a
              href="https://wa.me/213054247224"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold text-center"
            >
              Contacter via WhatsApp
            </a>
          </div>

          <div className="flex gap-4 mt-8">
            {["Instagram", "Facebook", "TikTok"].map((s) => (
              <span
                key={s}
                className="text-xs uppercase tracking-wider text-text-muted hover:text-text transition-colors cursor-pointer"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Google Maps */}
        <div className="space-y-4">
          <div className="aspect-square rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.2!2d3.0594!3d36.7866!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb262e1e1e1e1%3A0x1!2s62+Quai+Sud%2C+Casbah+16000%2C+Alger!5e0!3m2!1sfr!2sdz!4v1"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="La Belle Assiette - Google Maps"
            />
          </div>
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=62+Quai+Sud+Alger,+Casbah+16000,+Algerie"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold text-center block"
          >
            Obtenir l&apos;itineraire
          </a>
        </div>
      </section>
    </>
  );
}
