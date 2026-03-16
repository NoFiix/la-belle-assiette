import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'

dotenv.config()

const connectionString = new URL(process.env.DIRECT_URL!)
connectionString.searchParams.set('uselibpqcompat', 'true')

const adapter = new PrismaPg({ connectionString: connectionString.toString() })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Démarrage du seed...')

  // ADMIN USER
  const passwordHash = await bcrypt.hash(
    process.env.SEED_ADMIN_PASSWORD || 'admin123456',
    12
  )
  await prisma.adminUser.upsert({
    where: { email: process.env.SEED_ADMIN_EMAIL || 'admin@labelleassiette.com' },
    update: {},
    create: {
      email: process.env.SEED_ADMIN_EMAIL || 'admin@labelleassiette.com',
      password_hash: passwordHash,
      role: 'admin',
    },
  })
  console.log('✅ Admin créé')

  // CATÉGORIES MENU
  const categories = [
    { name: 'Entrées', order: 1 },
    { name: 'Plats', order: 2 },
    { name: 'Desserts', order: 3 },
    { name: 'Boissons', order: 4 },
  ]
  for (const cat of categories) {
    await prisma.menuCategory.upsert({
      where: { id: cat.order },
      update: {},
      create: cat,
    })
  }
  console.log('✅ Catégories menu créées')

  // ÉVÉNEMENT PAR DÉFAUT
  await prisma.event.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Soirée musicale',
      description: 'Une soirée exceptionnelle vous attend.',
      date: new Date('2099-01-01'),
      time: '21h00',
      ctaLabel: 'Réserver pour cet événement',
      isActive: false,
    },
  })
  console.log('✅ Événement par défaut créé')

  // PARAMÈTRES
  const settings = [
    { key: 'homepage_intro', value: 'Bienvenue à La Belle Assiette' },
    { key: 'restaurant_desc', value: '' },
    { key: 'chef_bio', value: '' },
    { key: 'whatsapp_number', value: '+213054247224' },
    { key: 'instagram_url', value: '' },
    { key: 'facebook_url', value: '' },
    { key: 'tiktok_url', value: '' },
    { key: 'schedule_mon_sat', value: '11h - 23h' },
    { key: 'schedule_friday', value: '17h - 23h' },
    { key: 'schedule_sunday', value: 'Fermé' },
    { key: 'show_gallery', value: 'true' },
    { key: 'show_chef', value: 'true' },
    { key: 'show_reviews', value: 'false' },
  ]
  for (const setting of settings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log('✅ Paramètres créés')

  console.log('🎉 Seed terminé avec succès !')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })