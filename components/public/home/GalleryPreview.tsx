import Image from "next/image";
import Link from "next/link";

const photos = [
  { src: "/images/portrait/photo-03.jpeg", alt: "Interieur du restaurant", span: "row-span-2" },
  { src: "/images/portrait/photo-04.jpeg", alt: "Plat signature", span: "" },
  { src: "/images/portrait/photo-05.jpeg", alt: "Ambiance soiree", span: "" },
  { src: "/images/portrait/photo-06.jpeg", alt: "Vue sur la baie", span: "row-span-2" },
  { src: "/images/portrait/photo-07.jpeg", alt: "Le chef en cuisine", span: "" },
  { src: "/images/portrait/photo-08.jpeg", alt: "Terrasse", span: "" },
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

        <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {photos.map((photo) => (
            <div
              key={photo.src}
              className={`${photo.span} relative overflow-hidden rounded-sm ${
                photo.span ? "aspect-[3/4]" : "aspect-square"
              }`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                className="object-cover transition-transform duration-500 hover:scale-105"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
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
