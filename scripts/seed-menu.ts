import * as dotenv from 'dotenv'
dotenv.config()

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = new URL(process.env.DIRECT_URL!)
connectionString.searchParams.set('uselibpqcompat', 'true')
const adapter = new PrismaPg({ connectionString: connectionString.toString() })
const prisma = new PrismaClient({ adapter })

type Item = { name: string; desc: string; price: string; tag?: string }

const PLATS: Item[] = [
  // Pizzas - Classiques
  { name: "Margherita", desc: "Sauce tomate, mozzarella, emmental, filet d'huile d'olive, basilic frais, origan", price: "850 DA", tag: "Pizzas - Classiques" },
  { name: "Méditerranéenne", desc: "Sauce tomate, mozzarella, emmental, thon, câpres, oignon, origan", price: "950 DA", tag: "Pizzas - Classiques" },
  { name: "Rustica", desc: "Sauce tomate, mozzarella, emmental, viande hachée, oignon, poivron, origan", price: "1400 DA", tag: "Pizzas - Classiques" },
  { name: "Rosée des Mers", desc: "Sauce tomate, mozzarella, emmental, crevettes marinées, oignon, poivron, origan", price: "1600 DA", tag: "Pizzas - Classiques" },
  // Pizzas - Crémeuses
  { name: "Crémeuse au Poulet", desc: "Sauce blanche, mozzarella, emmental, poulet mariné, oignon caramélisé, champignons frais, basilic", price: "1100 DA", tag: "Pizzas - Crémeuses" },
  { name: "Indiana", desc: "Sauce curry douce, mozzarella, emmental, poulet épicé, oignon, poivron, origan", price: "1300 DA", tag: "Pizzas - Crémeuses" },
  { name: "Fumée", desc: "Sauce blanche, mozzarella, emmental, poulet fumé, oignon, poivron, champignons frais, origan", price: "1350 DA", tag: "Pizzas - Crémeuses" },
  { name: "Tagliatella", desc: "Sauce blanche, mozzarella, emmental, tagliatelles, poulet fumé & poulet épicé, oignon, poivron, origan", price: "1650 DA", tag: "Pizzas - Crémeuses" },
  // Pizzas - Végétariennes
  { name: "Jardiniera", desc: "Sauce tomate, mozzarella, emmental, oignon, courgette, aubergine, poivron, champignons frais, filet d'huile d'olive, origan", price: "1200 DA", tag: "Pizzas - Végétariennes" },
  { name: "Douceur de Chèvre", desc: "Sauce blanche, mozzarella, emmental, fromage de chèvre doux, noix concassées, miel, origan", price: "1450 DA", tag: "Pizzas - Végétariennes" },
  { name: "Quattro Formaggi", desc: "Sauce fromagère, mozzarella, emmental, gruyère, camembert, filet d'huile d'olive, origan", price: "1450 DA", tag: "Pizzas - Végétariennes" },
  // Pizzas - Maritimes
  { name: "Norvégienne", desc: "Sauce blanche, mozzarella, emmental, saumon fumé, câpres, oignon, zeste de citron, origan", price: "1500 DA", tag: "Pizzas - Maritimes" },
  { name: "Perle Blanche", desc: "Sauce blanche, mozzarella, emmental, câpres, filet de poisson blanc poêlé, zeste de citron, origan", price: "1850 DA", tag: "Pizzas - Maritimes" },
  { name: "La Belle Assiette", desc: "Sauce tomate, mozzarella, emmental, crevettes marinées, calamars, moules, filet de poisson blanc, filet de pesto, filet d'huile d'olive, origan", price: "2300 DA", tag: "Pizzas - Maritimes" },
]

const DESSERTS: Item[] = [
  // Desserts
  { name: "Viennoiseries", desc: "", price: "300 DA", tag: "Desserts" },
  { name: "Île flotante", desc: "", price: "450 DA", tag: "Desserts" },
  { name: "Mousse au chocolat", desc: "", price: "500 DA", tag: "Desserts" },
  { name: "Patisserie du jour", desc: "", price: "550 DA", tag: "Desserts" },
  { name: "Pana cotta", desc: "", price: "550 DA", tag: "Desserts" },
  { name: "Cheesecake", desc: "", price: "600 DA", tag: "Desserts" },
  { name: "Brownie", desc: "", price: "600 DA", tag: "Desserts" },
  { name: "Tiramisu", desc: "", price: "600 DA", tag: "Desserts" },
  { name: "Fraisier", desc: "", price: "600 DA", tag: "Desserts" },
  { name: "Crème brûlée", desc: "", price: "600 DA", tag: "Desserts" },
  { name: "Fondant citron", desc: "", price: "700 DA", tag: "Desserts" },
  { name: "Nougat glacé", desc: "", price: "700 DA", tag: "Desserts" },
  { name: "Salade de fruit", desc: "", price: "800 DA", tag: "Desserts" },
  { name: "Fondant chocolat", desc: "", price: "800 DA", tag: "Desserts" },
  { name: "Cheesecake pistache", desc: "", price: "850 DA", tag: "Desserts" },
  { name: "Fondant pistache", desc: "", price: "900 DA", tag: "Desserts" },
  { name: "Assiette de fruit", desc: "", price: "1000 DA", tag: "Desserts" },
  // Crêpes
  { name: "Crêpe nutella", desc: "", price: "600 DA", tag: "Crêpes" },
  { name: "Crêpe miel", desc: "", price: "600 DA", tag: "Crêpes" },
  { name: "Crêpe nutella banane", desc: "", price: "700 DA", tag: "Crêpes" },
  { name: "Crêpe fruits", desc: "", price: "850 DA", tag: "Crêpes" },
  { name: "Crêpe miel fruits sec", desc: "", price: "850 DA", tag: "Crêpes" },
  { name: "Crêpe la belle assiette", desc: "", price: "1000 DA", tag: "Crêpes" },
  // Gaufres
  { name: "Gaufre nutella", desc: "", price: "600 DA", tag: "Gaufres" },
  { name: "Gaufre miel", desc: "", price: "600 DA", tag: "Gaufres" },
  { name: "Gaufre nutella banane", desc: "", price: "700 DA", tag: "Gaufres" },
  { name: "Gaufre fruits", desc: "", price: "850 DA", tag: "Gaufres" },
  { name: "Gaufre miel fruits sec", desc: "", price: "850 DA", tag: "Gaufres" },
  { name: "Gaufre la belle assiette", desc: "", price: "1000 DA", tag: "Gaufres" },
]

const BOISSONS: Item[] = [
  // Boissons Chaudes
  { name: "Café l'or grain", desc: "", price: "300 DA", tag: "Boissons Chaudes" },
  { name: "Café l'or expresso", desc: "", price: "350 DA", tag: "Boissons Chaudes" },
  { name: "Americano", desc: "", price: "350 DA", tag: "Boissons Chaudes" },
  { name: "Café noisette", desc: "", price: "350 DA", tag: "Boissons Chaudes" },
  { name: "Iced coffee", desc: "", price: "350 DA", tag: "Boissons Chaudes" },
  { name: "Macchiato", desc: "", price: "400 DA", tag: "Boissons Chaudes" },
  { name: "Flat white", desc: "", price: "400 DA", tag: "Boissons Chaudes" },
  { name: "Café viennois", desc: "", price: "450 DA", tag: "Boissons Chaudes" },
  { name: "Mocha", desc: "", price: "500 DA", tag: "Boissons Chaudes" },
  { name: "Caramel macchiato", desc: "", price: "500 DA", tag: "Boissons Chaudes" },
  { name: "Cappuccino", desc: "", price: "500 DA", tag: "Boissons Chaudes" },
  { name: "Bobon expresso", desc: "", price: "500 DA", tag: "Boissons Chaudes" },
  { name: "Iced latte", desc: "", price: "500 DA", tag: "Boissons Chaudes" },
  { name: "Cappuccino caramel", desc: "", price: "600 DA", tag: "Boissons Chaudes" },
  { name: "Chocolat chaud", desc: "", price: "600 DA", tag: "Boissons Chaudes" },
  { name: "Affogato", desc: "", price: "650 DA", tag: "Boissons Chaudes" },
  { name: "Chocolat chaud viennois", desc: "", price: "700 DA", tag: "Boissons Chaudes" },
  { name: "Café la belle assiette", desc: "", price: "900 DA", tag: "Boissons Chaudes" },
  { name: "Thé maison", desc: "", price: "300 DA", tag: "Boissons Chaudes" },
  { name: "Thé infusion", desc: "", price: "300 DA", tag: "Boissons Chaudes" },
  { name: "Iced tea", desc: "", price: "650 DA", tag: "Boissons Chaudes" },
  // Milkshakes
  { name: "Milkshake banane", desc: "", price: "700 DA", tag: "Milkshakes" },
  { name: "Milkshake chocolat", desc: "", price: "700 DA", tag: "Milkshakes" },
  { name: "Milkshake fraise", desc: "", price: "700 DA", tag: "Milkshakes" },
  { name: "Milkshake fraise banane", desc: "", price: "800 DA", tag: "Milkshakes" },
  { name: "Milkshake chocolat banane", desc: "", price: "850 DA", tag: "Milkshakes" },
  { name: "Milkshake orientale", desc: "", price: "1200 DA", tag: "Milkshakes" },
  // Cocktails
  { name: "Blue lagoon", desc: "ananas, citron, bleu curaçao", price: "700 DA", tag: "Cocktails" },
  { name: "Coastal mood", desc: "Orange, mangue, banane, vanille", price: "700 DA", tag: "Cocktails" },
  { name: "Île paradisiaque", desc: "orange, ananas, fruit de la passion, fraise", price: "700 DA", tag: "Cocktails" },
  { name: "Perle des caraïbes", desc: "jus de citron, jus d'ananas, sirop de fraise, grenadine", price: "700 DA", tag: "Cocktails" },
  { name: "Golden mirage", desc: "orange, vanille, citron, eau gazeuse", price: "700 DA", tag: "Cocktails" },
  { name: "Mojito classique", desc: "", price: "700 DA", tag: "Cocktails" },
  { name: "Orientale mojito", desc: "", price: "700 DA", tag: "Cocktails" },
  { name: "Virgine mojito", desc: "", price: "700 DA", tag: "Cocktails" },
  { name: "Pina colada", desc: "", price: "700 DA", tag: "Cocktails" },
  { name: "Flammes andalous", desc: "ananas, citron, melon, bleu curaçao rhum", price: "700 DA", tag: "Cocktails" },
  { name: "Safari exotique", desc: "coco, ananas, orange, grenadine", price: "700 DA", tag: "Cocktails" },
  { name: "Lagoon sunset", desc: "fruit de la passion, fruit des bois, lait de coco, jus d'orange", price: "750 DA", tag: "Cocktails" },
  { name: "Aube de bali", desc: "orange, pêche, citron, grenadine", price: "750 DA", tag: "Cocktails" },
  { name: "Mango colada", desc: "lait de coco, mangue, ananas, rhum", price: "750 DA", tag: "Cocktails" },
  { name: "Cuba libre mojito", desc: "", price: "800 DA", tag: "Cocktails" },
  { name: "Évasion Tropicale", desc: "Cocktail de fruits de saison", price: "900 DA", tag: "Cocktails" },
  { name: "Litchi mojito", desc: "", price: "850 DA", tag: "Cocktails" },
  { name: "Red mojito", desc: "", price: "850 DA", tag: "Cocktails" },
  { name: "Exotic mojito", desc: "", price: "850 DA", tag: "Cocktails" },
  { name: "Green mojito", desc: "", price: "900 DA", tag: "Cocktails" },
  { name: "Golden mojito", desc: "", price: "1000 DA", tag: "Cocktails" },
  // Jus
  { name: "Detox au choix", desc: "", price: "500 DA", tag: "Jus" },
  { name: "Jus d'orange", desc: "", price: "500 DA", tag: "Jus" },
  { name: "Jus de citron", desc: "", price: "550 DA", tag: "Jus" },
  { name: "Jus de fraise", desc: "", price: "600 DA", tag: "Jus" },
]

function buildDescription(tag: string, desc: string): string {
  if (desc) return `[${tag}] ${desc}`
  return `[${tag}]`
}

async function seedCategory(categoryId: number, categoryName: string, items: Item[]) {
  let created = 0
  let skipped = 0

  for (const item of items) {
    const description = item.tag ? buildDescription(item.tag, item.desc) : (item.desc || null)

    const existing = await prisma.menuItem.findFirst({
      where: { name: item.name, categoryId },
    })

    if (existing) {
      skipped++
      continue
    }

    await prisma.menuItem.create({
      data: {
        name: item.name,
        description,
        price: item.price,
        categoryId,
        isVisible: true,
      },
    })
    created++
  }

  console.log(`${categoryName}: ${created} créés, ${skipped} déjà existants`)
  return created
}

async function main() {
  console.log('Seed menu — début\n')

  const plats = await seedCategory(2, 'Plats (Pizzas)', PLATS)
  const desserts = await seedCategory(3, 'Desserts', DESSERTS)
  const boissons = await seedCategory(4, 'Boissons', BOISSONS)

  console.log(`\nTotal: ${plats + desserts + boissons} plats insérés`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
