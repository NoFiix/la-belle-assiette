import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const payload = await verifyAdminToken(token)
    if (!payload) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })

    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    })

    return NextResponse.json(events)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const payload = await verifyAdminToken(token)
    if (!payload) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })

    const body = await request.json()
    const { title, description, date, time, ctaLabel } = body

    if (!title || typeof title !== 'string' || title.length > 80) {
      return NextResponse.json({ error: 'Titre requis (max 80 caractères)' }, { status: 400 })
    }

    if (description && typeof description === 'string' && description.length > 300) {
      return NextResponse.json({ error: 'Description max 300 caractères' }, { status: 400 })
    }

    if (!date) {
      return NextResponse.json({ error: 'Date requise' }, { status: 400 })
    }

    const parsed = new Date(date)
    if (isNaN(parsed.getTime())) {
      return NextResponse.json({ error: 'Date invalide' }, { status: 400 })
    }

    const event = await prisma.event.create({
      data: {
        title: title.trim(),
        description: description || null,
        date: parsed,
        time: time || null,
        ctaLabel: ctaLabel || 'Réserver pour cet événement',
        isActive: false,
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
