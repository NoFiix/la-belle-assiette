import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = new URL(process.env.DIRECT_URL!)
connectionString.searchParams.set('uselibpqcompat', 'true')

const adapter = new PrismaPg({ connectionString: connectionString.toString() })
const prisma = new PrismaClient({ adapter })

const updates = [
  { key: 'instagram_url', value: 'https://www.instagram.com/restaurant_labelle_assiette' },
  { key: 'tiktok_url', value: 'https://www.tiktok.com/@labelle_assiette' },
  { key: 'facebook_url', value: 'https://www.facebook.com/share/1Ht7vxYeab/' },
  { key: 'whatsapp_number', value: '+33602269007' },
]

async function main() {
  for (const { key, value } of updates) {
    await prisma.setting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    })
    console.log(`✓ ${key} → ${value}`)
  }
  console.log('\nDone.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
