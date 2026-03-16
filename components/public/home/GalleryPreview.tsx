import Link from "next/link";

const placeholders = [
  { id: 1, span: "row-span-2", aspect: "aspect-[3/4]", label: "Interieur du restaurant" },
  { id: 2, span: "", aspect: "aspect-square", label: "Plat signature" },
  { id: 3, span: "", aspect: "aspect-square", label: "Ambiance soiree" },
  { id: 4, span: "row-span-2", aspect: "aspect-[3/4]", label: "Vue sur la baie" },
  { id: 5, span: "", aspect: "aspect-square", label: "Le chef en cuisine" },
  { id: 6, span: "", aspect: "aspect-square", label: "Terrasse" },
];

export default function GalleryPreview() {
  return (
    <section className="px-5 py-16 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-secondary">
            En images
          </p>
          <h2 className="mt-3 font-heading text-3xl font-bold md:text-5xl">
            Notre Galerie
          </h2>
        </div>

        {/* Grille masonry-like avec CSS grid */}
        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {placeholders.map((item) => (
            <div
              key={item.id}
              className={`${item.span} overflow-hidden rounded-sm bg-primary/5 ${item.aspect}`}
            >
              <div className="flex h-full w-full items-center justify-center p-4">
                <p className="text-center text-xs text-text-muted">{item.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/galerie"
            className="inline-block border-b border-secondary pb-1 text-sm font-medium tracking-wide text-secondary transition-colors hover:border-secondary-dark hover:text-secondary-dark"
          >
            Voir toute la galerie
          </Link>
        </div>
      </div>
    </section>
  );
}
