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

    const rows = await prisma.setting.findMany()
    const map: Record<string, string> = {}
    for (const row of rows) {
      map[row.key] = row.value
    }

    return NextResponse.json(map)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const payload = await verifyAdminToken(token)
    if (!payload) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })

    const body = await request.json()

    if (!Array.isArray(body)) {
      return NextResponse.json({ error: 'Body doit être un tableau de { key, value }' }, { status: 400 })
    }

    for (const item of body) {
      if (typeof item.key !== 'string' || typeof item.value !== 'string') {
        return NextResponse.json({ error: 'Chaque item doit avoir key et value (strings)' }, { status: 400 })
      }
    }

    const results: Record<string, string> = {}

    for (const { key, value } of body) {
      await prisma.setting.upsert({
        where: { key },
        update: { value },
        create: { key, value },
      })
      results[key] = value
    }

    return NextResponse.json(results)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
