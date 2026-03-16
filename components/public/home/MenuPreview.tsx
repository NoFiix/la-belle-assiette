import Link from "next/link";

const dishes = [
  {
    name: "Bourek aux Crevettes",
    description:
      "Feuilles croustillantes farcies de crevettes fraiches, coriandre et epices douces, servies avec une reduction de citron confit.",
    price: "1 800 DA",
    badge: "Chef",
  },
  {
    name: "Epaule d'Agneau Confite",
    description:
      "Agneau lentement confit aux pruneaux et amandes, parfume au ras el hanout, accompagne d'une semoule fine doree au beurre.",
    price: "3 200 DA",
    badge: null,
  },
  {
    name: "Couscous Royal",
    description:
      "Notre couscous signature aux legumes de saison, merguez maison, poulet fermier et agneau tendre, bouillon aux epices.",
    price: "2 800 DA",
    badge: "Nouveau",
  },
  {
    name: "Baklawa aux Pistaches",
    description:
      "Fines feuilles dorees au miel de montagne et pistaches torrefies. Une douceur raffinee pour clore le repas.",
    price: "900 DA",
    badge: null,
  },
];

export default function MenuPreview() {
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-secondary">
            A la carte
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold md:text-5xl">
            Notre Carte
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {dishes.map((dish) => (
            <article
              key={dish.name}
              className="group rounded-sm border border-primary/8 bg-white p-6 transition-colors hover:border-secondary/20 lg:p-8"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-heading text-xl font-semibold text-primary lg:text-2xl">
                      {dish.name}
                    </h3>
                    {dish.badge && (
                      <span className="shrink-0 rounded-full bg-secondary/10 px-2.5 py-0.5 text-xs font-semibold text-secondary-dark">
                        {dish.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-text-muted">
                    {dish.description}
                  </p>
                </div>
                <p className="shrink-0 font-heading text-lg font-bold text-secondary">
                  {dish.price}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/menu"
            className="inline-block border-b border-secondary pb-1 text-sm font-medium tracking-wide text-secondary transition-colors hover:border-secondary-dark hover:text-secondary-dark"
          >
            Voir la carte complete
          </Link>
        </div>
      </div>
    </section>
  );
}
