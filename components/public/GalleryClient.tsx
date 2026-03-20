'use client'

import { useState } from 'react'
import Image from 'next/image'

interface GalleryPhoto {
  id: number
  url: string
  alt: string | null
}

const heights = [280, 340, 300, 260, 320, 280, 300, 360, 250, 290, 310, 270]

export default function GalleryClient({ photos }: { photos: GalleryPhoto[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  if (photos.length === 0) {
    return (
      <>
        <section className="bg-primary pt-32 pb-16 px-6 text-center">
          <h1 className="heading-hero text-white text-4xl md:text-6xl">
            Notre Galerie
          </h1>
        </section>
        <section className="max-w-3xl mx-auto px-6 py-16 text-center">
          <p className="font-serif text-lg text-text-muted italic">
            Notre galerie est en cours de préparation. Revenez bientôt.
          </p>
        </section>
      </>
    )
  }

  return (
    <>
      <section className="bg-primary pt-32 pb-16 px-6 text-center">
        <h1 className="heading-hero text-white text-4xl md:text-6xl">
          Notre Galerie
        </h1>
      </section>

      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className="break-inside-avoid rounded-lg overflow-hidden cursor-pointer group relative"
              style={{ height: heights[i % heights.length] }}
              onClick={() => setLightbox(i)}
            >
              <Image
                src={photo.url}
                alt={photo.alt || 'Photo du restaurant'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
                <svg
                  width="24" height="24" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  className="text-white opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <polyline points="15 3 21 3 21 9" />
                  <polyline points="9 21 3 21 3 15" />
                  <line x1="21" y1="3" x2="14" y2="10" />
                  <line x1="3" y1="21" x2="10" y2="14" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={() => setLightbox(null)}
            className="absolute top-6 right-6 text-white/70 hover:text-white"
            aria-label="Fermer"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightbox(Math.max(0, lightbox - 1))
            }}
            className="absolute left-6 text-white/50 hover:text-white"
            aria-label="Précédent"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>

          <div
            className="relative w-[80vw] h-[70vh] max-w-4xl rounded-xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={photos[lightbox].url}
              alt={photos[lightbox].alt || 'Photo du restaurant'}
              fill
              className="object-contain"
              sizes="80vw"
            />
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation()
              setLightbox(Math.min(photos.length - 1, lightbox + 1))
            }}
            className="absolute right-6 text-white/50 hover:text-white"
            aria-label="Suivant"
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      )}
    </>
  )
}
