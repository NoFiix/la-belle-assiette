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
  guests: string;
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
    guests: "",
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
        body: JSON.stringify({
          ...form,
          guests: parseInt(form.guests, 10),
        }),
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
        guests: "",
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
      <section className="bg-primary pt-32 pb-16 px-6 text-center">
        <h1 className="heading-hero text-white text-4xl md:text-6xl">Reservation</h1>
        <p className="text-white/70 mt-4 text-lg max-w-xl mx-auto">
          Reservez votre table en quelques clics
        </p>
      </section>

      <section className="max-w-2xl mx-auto px-6 py-16">
        {status === "success" ? (
          <div className="text-center py-12 animate-fade-in">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="heading-section mb-4">Reservation envoyee !</h2>
            <p className="body-text text-text-muted mb-8">
              Merci pour votre reservation. Nous vous contacterons rapidement pour confirmer votre table.
            </p>
            <button
              onClick={() => setStatus("idle")}
              className="btn-gold"
            >
              Faire une nouvelle reservation
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nom */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-text mb-2">
                Nom complet <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white text-text focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                placeholder="Votre nom"
              />
            </div>

            {/* Telephone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-text mb-2">
                Telephone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={form.phone}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white text-text focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                placeholder="0XX XX XX XX XX"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                Email <span className="text-text-muted text-xs">(optionnel)</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white text-text focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                placeholder="votre@email.com"
              />
            </div>

            {/* Date + Heure */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-text mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  min={today}
                  value={form.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white text-text focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                />
              </div>
              <div>
                <label htmlFor="time" className="block text-sm font-medium text-text mb-2">
                  Heure <span className="text-red-500">*</span>
                </label>
                <select
                  id="time"
                  name="time"
                  required
                  value={form.time}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white text-text focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                >
                  <option value="">Choisir une heure</option>
                  {heures.map((h) => (
                    <option key={h} value={h}>{h}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Couverts + Occasion */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="guests" className="block text-sm font-medium text-text mb-2">
                  Nombre de couverts <span className="text-red-500">*</span>
                </label>
                <select
                  id="guests"
                  name="guests"
                  required
                  value={form.guests}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white text-text focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                >
                  <option value="">Combien ?</option>
                  {Array.from({ length: 20 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? "personne" : "personnes"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="occasion" className="block text-sm font-medium text-text mb-2">
                  Occasion <span className="text-text-muted text-xs">(optionnel)</span>
                </label>
                <select
                  id="occasion"
                  name="occasion"
                  value={form.occasion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white text-text focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors"
                >
                  <option value="">Aucune</option>
                  {occasions.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-text mb-2">
                Message <span className="text-text-muted text-xs">(optionnel)</span>
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={form.message}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-black/10 bg-white text-text focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-colors resize-none"
                placeholder="Allergies, demandes particulieres..."
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
              className="btn-gold w-full text-center disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === "loading" ? "Envoi en cours..." : "Confirmer ma reservation"}
            </button>

            {/* WhatsApp alternative */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-background px-4 text-text-muted">ou</span>
              </div>
            </div>

            <a
              href="https://wa.me/213054247224"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full py-3 px-6 rounded-full border-2 border-[#25D366] text-[#25D366] font-medium hover:bg-[#25D366] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Ou reserver via WhatsApp
            </a>
          </form>
        )}
      </section>
    </>
  );
}
