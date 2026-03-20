import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'
import prisma from '@/lib/prisma'
import type { MenuBadge } from '@prisma/client'

const VALID_BADGES: MenuBadge[] = ['NOUVEAU', 'CHEF']

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

    const body = await request.json()
    const { name, description, price, badge, isVisible, categoryId } = body

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
    }

    if (description && typeof description === 'string' && description.length > 200) {
      return NextResponse.json(
        { error: 'La description ne doit pas dépasser 200 caractères' },
        { status: 400 }
      )
    }

    if (!categoryId || typeof categoryId !== 'number') {
      return NextResponse.json({ error: 'Catégorie requise' }, { status: 400 })
    }

    const category = await prisma.menuCategory.findUnique({
      where: { id: categoryId },
    })

    if (!category) {
      return NextResponse.json({ error: 'Catégorie introuvable' }, { status: 404 })
    }

    const item = await prisma.menuItem.create({
      data: {
        name: name.trim(),
        categoryId,
        isVisible: typeof isVisible === 'boolean' ? isVisible : true,
        description: typeof description === 'string' ? description : undefined,
        price: typeof price === 'string' ? price : undefined,
        badge: badge && VALID_BADGES.includes(badge) ? badge : undefined,
      },
    })

    return NextResponse.json(item, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
