import Link from "next/link";

interface FooterProps {
  schedule: { day: string; hours: string }[];
  whatsapp: string;
  instagram: string;
  facebook: string;
  tiktok: string;
}

export default function Footer({ schedule, whatsapp, instagram, facebook, tiktok }: FooterProps) {
  const socials = [
    { name: "Instagram", url: instagram },
    { name: "Facebook", url: facebook },
    { name: "TikTok", url: tiktok },
  ];

  return (
    <footer className="bg-primary text-white/90 py-16 md:py-20 px-6 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Col 1 — Brand */}
        <div>
          <h3 className="font-serif text-2xl text-white mb-4">La Belle Assiette</h3>
          <p className="text-sm text-white/60 leading-relaxed mb-6">
            Restaurant gastronomique au coeur d&apos;Alger. Cuisine algerienne
            raffinee dans un cadre exceptionnel.
          </p>
          <div className="flex gap-4">
            {socials.map((s) => (
              s.url ? (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/40 uppercase tracking-wider hover:text-white/70 transition-colors"
                >
                  {s.name}
                </a>
              ) : (
                <span
                  key={s.name}
                  className="text-xs text-white/40 uppercase tracking-wider"
                >
                  {s.name}
                </span>
              )
            ))}
          </div>
        </div>

        {/* Col 2 — Contact */}
        <div>
          <h4 className="eyebrow text-white/50 mb-4">Contact</h4>
          <div className="space-y-3 text-sm text-white/70">
            <p>Port La Pecherie, Alger</p>
            <a href={`tel:${whatsapp}`} className="block hover:text-white transition-colors">
              {whatsapp}
            </a>
            <a href="mailto:contact@labelleassiette.com" className="block hover:text-white transition-colors">
              contact@labelleassiette.com
            </a>
          </div>
        </div>

        {/* Col 3 — Horaires */}
        <div>
          <h4 className="eyebrow text-white/50 mb-4">Horaires</h4>
          <div className="space-y-2 text-sm text-white/70">
            {schedule.map((s) => (
              <div key={s.day} className="flex justify-between">
                <span>{s.day}</span>
                <span className={!s.hours || s.hours.toLowerCase() === 'fermé' ? 'text-white/40' : ''}>
                  {s.hours || '—'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Col 4 — Liens */}
        <div>
          <h4 className="eyebrow text-white/50 mb-4">Liens rapides</h4>
          <div className="space-y-3 text-sm">
            {[
              { label: "Menu", path: "/menu" },
              { label: "Evenements", path: "/evenements" },
              { label: "Galerie", path: "/galerie" },
              { label: "Reservation", path: "/reservation" },
              { label: "Contact", path: "/contact" },
            ].map((l) => (
              <Link
                key={l.path}
                href={l.path}
                className="block text-white/60 hover:text-white transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/10 text-center text-xs text-white/30">
        &copy; {new Date().getFullYear()} La Belle Assiette. Tous droits reserves.
      </div>
    </footer>
  );
}
