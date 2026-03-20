"use client";

import { useState } from "react";

const heures = Array.from({ length: 22 }, (_, i) => {
  const totalMinutes = 12 * 60 + i * 30;
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
});

const occasions = [
  "Anniversaire",
  "Diner romantique",
  "Repas d'affaires",
  "Autre",
];

type FormData = {
  name: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  occasion: string;
  message: string;
};

export default function ReservationPage() {
  const [form, setForm] = useState<FormData>({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "",
    guests: 2,
    occasion: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const today = new Date().toISOString().split("T")[0];

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Une erreur est survenue");
      }

      setStatus("success");
      setForm({
        name: "",
        phone: "",
        email: "",
        date: "",
        time: "",
        guests: 2,
        occasion: "",
        message: "",
      });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue");
    }
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-[#2D4A35] pt-32 pb-16 px-6 text-center">
        <h1 className="font-serif text-4xl md:text-6xl text-white">Reservation</h1>
      </section>

      {/* Content */}
      <section className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form — 2/3 */}
        <div className="lg:col-span-2">
          {status === "success" ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-[#2D4A35]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-[#2D4A35]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="font-serif text-2xl md:text-3xl text-[#2D4A35] mb-4">Reservation envoyee !</h2>
              <p className="text-[#2D4A35]/60 mb-8 max-w-md mx-auto">
                Merci pour votre reservation. Nous vous contacterons rapidement pour confirmer votre table.
              </p>
              <button
                onClick={() => setStatus("idle")}
                className="inline-block px-8 py-3 bg-[#C9A96E] text-white font-medium rounded-full hover:bg-[#b8954f] transition-colors"
              >
                Faire une nouvelle reservation
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nom */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D4A35]/50 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border border-[#2D4A35]/10 rounded-lg px-4 py-3 bg-transparent text-sm focus:ring-1 focus:ring-[#C9A96E] focus:border-[#C9A96E] outline-none transition-all"
                  placeholder="Votre nom"
                />
              </div>

              {/* Telephone + Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D4A35]/50 mb-2">
                    Telephone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={form.phone}
                    onChange={handleChange}
                    className="w-full border border-[#2D4A35]/10 rounded-lg px-4 py-3 bg-transparent text-sm focus:ring-1 focus:ring-[#C9A96E] focus:border-[#C9A96E] outline-none transition-all"
                    placeholder="+213 0XX XX XX XX"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D4A35]/50 mb-2">
                    Email <span className="normal-case tracking-normal text-[#2D4A35]/30">(optionnel)</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full border border-[#2D4A35]/10 rounded-lg px-4 py-3 bg-transparent text-sm focus:ring-1 focus:ring-[#C9A96E] focus:border-[#C9A96E] outline-none transition-all"
                    placeholder="email@exemple.com"
                  />
                </div>
              </div>

              {/* Date + Heure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D4A35]/50 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    required
                    min={today}
                    value={form.date}
                    onChange={handleChange}
                    className="w-full border border-[#2D4A35]/10 rounded-lg px-4 py-3 bg-transparent text-sm focus:ring-1 focus:ring-[#C9A96E] focus:border-[#C9A96E] outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D4A35]/50 mb-2">
                    Heure *
                  </label>
                  <select
                    name="time"
                    required
                    value={form.time}
                    onChange={handleChange}
                    className="w-full border border-[#2D4A35]/10 rounded-lg px-4 py-3 bg-transparent text-sm focus:ring-1 focus:ring-[#C9A96E] focus:border-[#C9A96E] outline-none transition-all"
                  >
                    <option value="">Choisir une heure</option>
                    {heures.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Couverts */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D4A35]/50 mb-2">
                  Nombre de couverts *
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, guests: Math.max(1, prev.guests - 1) }))}
                    className="w-10 h-10 rounded-full border border-[#2D4A35]/10 flex items-center justify-center hover:bg-[#F9F6F0] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                    </svg>
                  </button>
                  <span className="text-lg font-medium w-8 text-center tabular-nums">{form.guests}</span>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, guests: Math.min(20, prev.guests + 1) }))}
                    className="w-10 h-10 rounded-full border border-[#2D4A35]/10 flex items-center justify-center hover:bg-[#F9F6F0] transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Occasion */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D4A35]/50 mb-2">
                  Occasion speciale
                </label>
                <select
                  name="occasion"
                  value={form.occasion}
                  onChange={handleChange}
                  className="w-full border border-[#2D4A35]/10 rounded-lg px-4 py-3 bg-transparent text-sm focus:ring-1 focus:ring-[#C9A96E] focus:border-[#C9A96E] outline-none transition-all"
                >
                  <option value="">— Selectionner —</option>
                  {occasions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#2D4A35]/50 mb-2">
                  Message <span className="normal-case tracking-normal text-[#2D4A35]/30">(optionnel)</span>
                </label>
                <textarea
                  name="message"
                  rows={4}
                  value={form.message}
                  onChange={handleChange}
                  className="w-full border border-[#2D4A35]/10 rounded-lg px-4 py-3 bg-transparent text-sm focus:ring-1 focus:ring-[#C9A96E] focus:border-[#C9A96E] outline-none transition-all resize-none"
                  placeholder="Allergies, demandes speciales..."
                />
              </div>

              {/* Error */}
              {status === "error" && (
                <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {errorMsg}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full py-4 bg-[#C9A96E] text-white font-medium rounded-full text-[15px] hover:bg-[#b8954f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? "Envoi en cours..." : "Confirmer ma reservation"}
              </button>

              {/* WhatsApp alternative */}
              <p className="text-center text-sm text-[#2D4A35]/50">
                Ou{" "}
                <a
                  href="https://wa.me/2130542472248"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#2D4A35] underline underline-offset-4 hover:text-[#C9A96E] transition-colors"
                >
                  reserver via WhatsApp &rarr;
                </a>
              </p>
            </form>
          )}
        </div>

        {/* Info card — 1/3 */}
        <div className="bg-[#2D4A35] text-white rounded-xl overflow-hidden h-fit sticky top-28">
          {/* Google Maps embed */}
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=Port+La+P%C3%AAcherie+62+Quai+Sud+Alger"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3197.1!2d3.0575!3d36.786!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fb2b0!2sPort+La+P%C3%AAcherie%2C+62+Quai+Sud+Alger%2C+Casbah+16000!5e0!3m2!1sfr!2sdz!4v1"
              width="100%"
              height="180"
              style={{ border: 0 }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="pointer-events-none"
              title="La Belle Assiette — Port La Pecherie, Alger"
            />
          </a>

          <div className="p-8">
            <h3 className="font-serif text-xl mb-4">Informations</h3>

            <div className="space-y-3 text-sm text-white/70">
              <p>Port La Pecherie, 62 Quai Sud Alger, Alger</p>
              <a href="tel:+2130542472248" className="block hover:text-white transition-colors">
                +213 0542 47 22 48
              </a>
              <a href="tel:+2130560531677" className="block hover:text-white transition-colors">
                +213 0560 53 16 77
              </a>
            </div>

            {/* Horaires jour par jour */}
            <div className="mt-6 pt-6 border-t border-white/10 space-y-2 text-sm text-white/70">
              <div className="flex justify-between"><span>Lundi</span><span>11h — 23h</span></div>
              <div className="flex justify-between"><span>Mardi</span><span>11h — 23h</span></div>
              <div className="flex justify-between"><span>Mercredi</span><span>11h — 23h</span></div>
              <div className="flex justify-between"><span>Jeudi</span><span>11h — 23h</span></div>
              <div className="flex justify-between"><span>Vendredi</span><span>17h — 23h</span></div>
              <div className="flex justify-between"><span>Samedi</span><span>11h — 23h</span></div>
              <div className="flex justify-between"><span>Dimanche</span><span className="text-white/40">Ferme</span></div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
