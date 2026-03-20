import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'
import prisma from '@/lib/prisma'

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

    const event = await prisma.event.findFirst()

    if (!event) {
      return NextResponse.json(
        { error: 'Aucun événement en base. Lancez le seed pour en créer un.' },
        { status: 404 }
      )
    }

    return NextResponse.json(event)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
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

    const event = await prisma.event.findFirst()

    if (!event) {
      return NextResponse.json(
        { error: 'Aucun événement en base. Lancez le seed pour en créer un.' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { title, description, date, time, ctaLabel, isActive } = body

    const data: Record<string, unknown> = {}

    if (typeof isActive === 'boolean') {
      data.isActive = isActive
    }

    if (typeof title === 'string') {
      if (title.length === 0 || title.length > 80) {
        return NextResponse.json(
          { error: 'Le titre doit faire entre 1 et 80 caractères' },
          { status: 400 }
        )
      }
      data.title = title
    }

    if (typeof description === 'string') {
      if (description.length > 300) {
        return NextResponse.json(
          { error: 'La description ne doit pas dépasser 300 caractères' },
          { status: 400 }
        )
      }
      data.description = description
    }

    if (typeof date === 'string') {
      const parsed = new Date(date)
      if (isNaN(parsed.getTime())) {
        return NextResponse.json(
          { error: 'Date invalide' },
          { status: 400 }
        )
      }
      data.date = parsed
    }

    if (typeof time === 'string') {
      data.time = time
    }

    if (typeof ctaLabel === 'string') {
      data.ctaLabel = ctaLabel
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: 'Aucune donnée à mettre à jour' },
        { status: 400 }
      )
    }

    const updated = await prisma.event.update({
      where: { id: event.id },
      data,
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
