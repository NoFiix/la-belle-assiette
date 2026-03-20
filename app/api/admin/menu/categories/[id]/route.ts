import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(COOKIE_NAME)?.value
    if (!token) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

    const payload = await verifyAdminToken(token)
    if (!payload) return NextResponse.json({ error: 'Token invalide' }, { status: 401 })

    const { id } = await params
    const catId = parseInt(id, 10)
    if (isNaN(catId)) return NextResponse.json({ error: 'ID invalide' }, { status: 400 })

    const existing = await prisma.menuCategory.findUnique({ where: { id: catId } })
    if (!existing) return NextResponse.json({ error: 'Catégorie introuvable' }, { status: 404 })

    const body = await request.json()
    const { isVisible } = body

    if (typeof isVisible !== 'boolean') {
      return NextResponse.json({ error: 'isVisible doit être un booléen' }, { status: 400 })
    }

    const updated = await prisma.menuCategory.update({
      where: { id: catId },
      data: { isVisible },
    })

    return NextResponse.json(updated)
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
