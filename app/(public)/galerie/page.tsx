import prisma from '@/lib/prisma'
import GalleryClient from '@/components/public/GalleryClient'

async function getGalleryPhotos() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    return images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt,
    }))
  } catch {
    return []
  }
}

export default async function GalleryPage() {
  const photos = await getGalleryPhotos()

  return <GalleryClient photos={photos} />
}
