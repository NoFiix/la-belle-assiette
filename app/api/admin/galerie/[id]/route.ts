import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { deleteImage } from '@/lib/cloudinary'

async function authenticate() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await authenticate()
    if (!payload) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params
    const imageId = parseInt(id, 10)
    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }

    const image = await prisma.galleryImage.findUnique({
      where: { id: imageId },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image introuvable' }, { status: 404 })
    }

    // Supprimer sur Cloudinary si publicId existe
    if (image.publicId) {
      try {
        await deleteImage(image.publicId)
      } catch {
        // Log silencieux — on supprime quand même en base
      }
    }

    await prisma.galleryImage.delete({ where: { id: imageId } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await authenticate()
    if (!payload) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params
    const imageId = parseInt(id, 10)
    if (isNaN(imageId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }

    const image = await prisma.galleryImage.findUnique({
      where: { id: imageId },
    })

    if (!image) {
      return NextResponse.json({ error: 'Image introuvable' }, { status: 404 })
    }

    // Reset toutes les images à isMain: false
    await prisma.galleryImage.updateMany({
      data: { isMain: false },
    })

    // Définir cette image comme principale
    const updated = await prisma.galleryImage.update({
      where: { id: imageId },
      data: { isMain: true },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
