import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = new URL(process.env.DIRECT_URL!)
connectionString.searchParams.set('uselibpqcompat', 'true')
const adapter = new PrismaPg({ connectionString: connectionString.toString() })
const prisma = new PrismaClient({ adapter })

const EVENTS = [
  {
    title: 'Soirée Andalouse',
    description: 'Une soirée envoûtante dédiée à la musique andalouse algérienne',
    date: new Date('2026-04-05'),
    time: '21h00',
    ctaLabel: 'Réserver pour cet événement',
    isActive: false,
  },
  {
    title: 'Soirée Gnawa',
    description: 'Plongez dans la transe mystique de la musique Gnawa',
    date: new Date('2026-04-12'),
    time: '21h00',
    ctaLabel: 'Réserver pour cet événement',
    isActive: false,
  },
  {
    title: 'Soirée Malouf',
    description: 'Une soirée dédiée au Malouf, patrimoine musical de Constantine',
    date: new Date('2026-04-19'),
    time: '21h00',
    ctaLabel: 'Réserver pour cet événement',
    isActive: false,
  },
]

async function main() {
  for (const event of EVENTS) {
    const existing = await prisma.event.findFirst({
      where: { title: event.title },
    })

    if (existing) {
      console.log(`— "${event.title}" existe déjà (id:${existing.id})`)
      continue
    }

    const created = await prisma.event.create({ data: event })
    console.log(`✓ "${created.title}" créé (id:${created.id}, isActive:false)`)
  }

  console.log('\nÉvénements en base :')
  const all = await prisma.event.findMany({ orderBy: { date: 'asc' } })
  for (const e of all) {
    console.log(`  id:${e.id} — ${e.title} (${e.date.toISOString().split('T')[0]}, active:${e.isActive})`)
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
