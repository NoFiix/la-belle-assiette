import Link from "next/link";

export default function Footer() {
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
            {["Instagram", "Facebook", "TikTok"].map((s) => (
              <span
                key={s}
                className="text-xs text-white/40 uppercase tracking-wider hover:text-white/70 transition-colors cursor-pointer"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Col 2 — Contact */}
        <div>
          <h4 className="eyebrow text-white/50 mb-4">Contact</h4>
          <div className="space-y-3 text-sm text-white/70">
            <p>Port La Pecherie, Alger</p>
            <a href="tel:+213054247224" className="block hover:text-white transition-colors">
              +213 054 247 224
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
            <div className="flex justify-between"><span>Lundi</span><span>11h — 23h</span></div>
            <div className="flex justify-between"><span>Mardi</span><span>11h — 23h</span></div>
            <div className="flex justify-between"><span>Mercredi</span><span>11h — 23h</span></div>
            <div className="flex justify-between"><span>Jeudi</span><span>11h — 23h</span></div>
            <div className="flex justify-between"><span>Vendredi</span><span>17h — 23h</span></div>
            <div className="flex justify-between"><span>Samedi</span><span>11h — 23h</span></div>
            <div className="flex justify-between"><span>Dimanche</span><span className="text-white/40">Ferme</span></div>
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
