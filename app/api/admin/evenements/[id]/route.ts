import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'
import prisma from '@/lib/prisma'

async function authenticate() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await authenticate()
    if (!payload) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { id } = await params
    const eventId = parseInt(id, 10)
    if (isNaN(eventId)) return NextResponse.json({ error: 'ID invalide' }, { status: 400 })

    const existing = await prisma.event.findUnique({ where: { id: eventId } })
    if (!existing) return NextResponse.json({ error: 'Événement introuvable' }, { status: 404 })

    const body = await request.json()
    const { title, description, date, time, ctaLabel, isActive } = body

    const data: Record<string, unknown> = {}

    if (typeof title === 'string') {
      if (title.length === 0 || title.length > 80) {
        return NextResponse.json({ error: 'Titre entre 1 et 80 caractères' }, { status: 400 })
      }
      data.title = title.trim()
    }

    if (typeof description === 'string') {
      if (description.length > 300) {
        return NextResponse.json({ error: 'Description max 300 caractères' }, { status: 400 })
      }
      data.description = description
    }

    if (typeof date === 'string') {
      const parsed = new Date(date)
      if (isNaN(parsed.getTime())) {
        return NextResponse.json({ error: 'Date invalide' }, { status: 400 })
      }
      data.date = parsed
    }

    if (typeof time === 'string') data.time = time
    if (typeof ctaLabel === 'string') data.ctaLabel = ctaLabel

    // Gérer l'unicité de isActive
    if (typeof isActive === 'boolean') {
      if (isActive) {
        // Désactiver tous les autres
        await prisma.event.updateMany({ data: { isActive: false } })
      }
      data.isActive = isActive
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Aucune donnée' }, { status: 400 })
    }

    const updated = await prisma.event.update({
      where: { id: eventId },
      data,
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const payload = await authenticate()
    if (!payload) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const { id } = await params
    const eventId = parseInt(id, 10)
    if (isNaN(eventId)) return NextResponse.json({ error: 'ID invalide' }, { status: 400 })

    const existing = await prisma.event.findUnique({ where: { id: eventId } })
    if (!existing) return NextResponse.json({ error: 'Événement introuvable' }, { status: 404 })

    await prisma.event.delete({ where: { id: eventId } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
