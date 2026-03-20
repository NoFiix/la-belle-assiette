import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyAdminToken, COOKIE_NAME } from '@/lib/auth'
import prisma from '@/lib/prisma'

const VALID_BADGES = ['NOUVEAU', 'CHEF'] as const

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
    if (!payload) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params
    const itemId = parseInt(id, 10)
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }

    const existing = await prisma.menuItem.findUnique({ where: { id: itemId } })
    if (!existing) {
      return NextResponse.json({ error: 'Plat introuvable' }, { status: 404 })
    }

    const body = await request.json()
    const { name, description, price, badge, isVisible, categoryId } = body

    const data: Record<string, unknown> = {}

    if (typeof name === 'string') {
      if (name.trim().length === 0) {
        return NextResponse.json({ error: 'Nom requis' }, { status: 400 })
      }
      data.name = name.trim()
    }

    if (typeof description === 'string') {
      if (description.length > 200) {
        return NextResponse.json(
          { error: 'La description ne doit pas dépasser 200 caractères' },
          { status: 400 }
        )
      }
      data.description = description
    }

    if (description === null) {
      data.description = null
    }

    if (typeof price === 'string') {
      data.price = price
    }

    if (price === null) {
      data.price = null
    }

    if (badge === null) {
      data.badge = null
    } else if (typeof badge === 'string' && VALID_BADGES.includes(badge as typeof VALID_BADGES[number])) {
      data.badge = badge
    }

    if (typeof isVisible === 'boolean') {
      data.isVisible = isVisible
    }

    if (typeof categoryId === 'number') {
      const cat = await prisma.menuCategory.findUnique({ where: { id: categoryId } })
      if (!cat) {
        return NextResponse.json({ error: 'Catégorie introuvable' }, { status: 404 })
      }
      data.categoryId = categoryId
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Aucune donnée à mettre à jour' }, { status: 400 })
    }

    const updated = await prisma.menuItem.update({
      where: { id: itemId },
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
    if (!payload) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = await params
    const itemId = parseInt(id, 10)
    if (isNaN(itemId)) {
      return NextResponse.json({ error: 'ID invalide' }, { status: 400 })
    }

    const existing = await prisma.menuItem.findUnique({ where: { id: itemId } })
    if (!existing) {
      return NextResponse.json({ error: 'Plat introuvable' }, { status: 404 })
    }

    await prisma.menuItem.delete({ where: { id: itemId } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}
