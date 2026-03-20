import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'
import prisma from '@/lib/prisma'

const EXPECTED_CATEGORIES = [
  { name: 'Entrées', order: 1 },
  { name: 'Plats', order: 2 },
  { name: 'Desserts', order: 3 },
  { name: 'Boissons', order: 4 },
]

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

    // Ensure all expected categories exist (idempotent)
    const existing = await prisma.menuCategory.findMany()
    const existingNames = existing.map((c) => c.name)

    const missing = EXPECTED_CATEGORIES.filter(
      (ec) => !existingNames.includes(ec.name)
    )

    if (missing.length > 0) {
      await prisma.menuCategory.createMany({
        data: missing,
        skipDuplicates: true,
      })
    }

    // Return all categories with items, ordered
    const categories = await prisma.menuCategory.findMany({
      include: {
        items: {
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(categories)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
