import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = new URL(process.env.DIRECT_URL!)
connectionString.searchParams.set('uselibpqcompat', 'true')
const adapter = new PrismaPg({ connectionString: connectionString.toString() })
const prisma = new PrismaClient({ adapter })

async function main() {
  // 1. Renommer "Plats" (id:2) en "Pizzas"
  await prisma.menuCategory.update({
    where: { id: 2 },
    data: { name: 'Pizzas' },
  })
  console.log('✓ Catégorie id:2 renommée "Plats" → "Pizzas"')

  // 2. Créer "Plats" si n'existe pas déjà
  const existing = await prisma.menuCategory.findFirst({
    where: { name: 'Plats' },
  })

  if (existing) {
    console.log(`✓ Catégorie "Plats" existe déjà (id:${existing.id})`)
  } else {
    const created = await prisma.menuCategory.create({
      data: { name: 'Plats', order: 5, isVisible: false },
    })
    console.log(`✓ Catégorie "Plats" créée (id:${created.id}, isVisible: false)`)
  }

  // 3. Vérification
  const all = await prisma.menuCategory.findMany({ orderBy: { id: 'asc' } })
  console.log('\nCatégories en base :')
  for (const c of all) {
    console.log(`  id:${c.id} — ${c.name} (order:${c.order}, isVisible:${c.isVisible})`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
