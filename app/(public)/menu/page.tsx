import prisma from '@/lib/prisma'
import MenuClient from '@/components/public/MenuClient'

async function getMenuData() {
  try {
    const categories = await prisma.menuCategory.findMany({
      where: { isVisible: true },
      include: {
        items: {
          where: { isVisible: true },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    })

    return categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      items: cat.items.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        price: item.price,
        badge: item.badge as 'NOUVEAU' | 'CHEF' | null,
        isVisible: item.isVisible,
      })),
    }))
  } catch {
    return []
  }
}

export default async function MenuPage() {
  const categories = await getMenuData()

  return <MenuClient categories={categories} />
}
