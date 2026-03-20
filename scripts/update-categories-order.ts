import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = new URL(process.env.DIRECT_URL!)
connectionString.searchParams.set('uselibpqcompat', 'true')
const adapter = new PrismaPg({ connectionString: connectionString.toString() })
const prisma = new PrismaClient({ adapter })

const ORDER_MAP: Record<string, number> = {
  'Entrées': 1,
  'Plats': 2,
  'Pizzas': 3,
  'Desserts': 4,
  'Boissons': 5,
}

async function main() {
  const categories = await prisma.menuCategory.findMany()

  for (const cat of categories) {
    const newOrder = ORDER_MAP[cat.name]
    if (newOrder !== undefined && cat.order !== newOrder) {
      await prisma.menuCategory.update({
        where: { id: cat.id },
        data: { order: newOrder },
      })
      console.log(`✓ ${cat.name} (id:${cat.id}) → order: ${newOrder}`)
    } else if (newOrder !== undefined) {
      console.log(`— ${cat.name} (id:${cat.id}) déjà order: ${newOrder}`)
    } else {
      console.log(`? ${cat.name} (id:${cat.id}) pas dans la liste, inchangé`)
    }
  }

  console.log('\nVérification :')
  const all = await prisma.menuCategory.findMany({ orderBy: { order: 'asc' } })
  for (const c of all) {
    console.log(`  ${c.order}. ${c.name} (id:${c.id}, isVisible:${c.isVisible})`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
