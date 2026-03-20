import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { uploadImage } from '@/lib/cloudinary'

const MAX_SIZE = 5 * 1024 * 1024 // 5 Mo
const ALLOWED_TYPES = ['image/jpeg', 'image/png']

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const payload = await verifyAdminToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    const images = await prisma.galleryImage.findMany({
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    return NextResponse.json(images)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value

    if (!token) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const payload = await verifyAdminToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token invalide' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 })
    }

    console.log('[Galerie Upload] Fichier reçu:', {
      name: file.name,
      type: file.type,
      size: file.size,
    })

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Format invalide. Seuls JPG et PNG sont acceptés.' },
        { status: 400 }
      )
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Fichier trop volumineux. Maximum 5 Mo.' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    console.log('[Galerie Upload] Buffer prêt, taille:', buffer.length)

    let url: string
    let publicId: string

    try {
      const result = await uploadImage(buffer)
      url = result.url
      publicId = result.publicId
      console.log('[Galerie Upload] Cloudinary OK, publicId:', publicId)
    } catch (cloudinaryError: unknown) {
      const err = cloudinaryError instanceof Error ? cloudinaryError : new Error(String(cloudinaryError))
      console.error('[Galerie Upload] Erreur Cloudinary:', err.message, err.stack)
      return NextResponse.json(
        { error: `Erreur Cloudinary: ${err.message}` },
        { status: 500 }
      )
    }

    const alt = formData.get('alt') as string | null

    const image = await prisma.galleryImage.create({
      data: {
        url,
        publicId,
        alt: alt || null,
        isMain: false,
        order: 0,
      },
    })

    return NextResponse.json(image, { status: 201 })
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error))
    console.error('[Galerie Upload] Erreur générale:', err.message, err.stack)
    return NextResponse.json(
      { error: `Erreur upload: ${err.message}` },
      { status: 500 }
    )
  }
}
