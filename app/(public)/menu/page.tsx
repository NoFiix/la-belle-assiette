"use client";

import { useState } from "react";

type Dish = {
  name: string;
  price: string;
  desc?: string;
};

type SubSection = {
  title: string;
  items: Dish[];
};

type Category = {
  name: string;
  dishes?: Dish[];
  subsections?: SubSection[];
};

const categories: Category[] = [
  {
    name: "Entrees",
    dishes: [
      { name: "Bourek aux Crevettes", desc: "Feuilles croustillantes farcies de crevettes epicees, menthe fraiche", price: "1 800 DA" },
      { name: "Salade Mechouia", desc: "Poivrons et tomates grilles, ail confit, huile d'olive", price: "800 DA" },
      { name: "Chorba Frik", desc: "Veloute de ble vert, agneau effiloche, coriandre fraiche", price: "1 200 DA" },
      { name: "Dolma", desc: "Feuilles de vigne farcies au riz, viande hachee et epices", price: "1 400 DA" },
      { name: "Hrira", desc: "Soupe traditionnelle aux tomates, lentilles et pois chiches", price: "900 DA" },
    ],
  },
  {
    name: "Plats",
    dishes: [
      { name: "Couscous Royal", desc: "Couscous signature aux legumes de saison, merguez, poulet fermier", price: "2 800 DA" },
      { name: "Epaule d'Agneau Confite", desc: "Agneau confit 8h aux pruneaux et amandes torrefiees", price: "3 200 DA" },
      { name: "Tajine Zitoune", desc: "Poulet aux olives vertes et citron confit, pommes de terre fondantes", price: "2 200 DA" },
      { name: "Chakhchoukha de Biskra", desc: "Pate dechiree en sauce tomate epicee, viande d'agneau", price: "2 600 DA" },
      { name: "Rechta Algeroise", desc: "Pates fines en sauce blanche, poulet, navets et pois chiches", price: "2 400 DA" },
      { name: "Pave de Merou Grille", desc: "Poisson frais du jour, legumes mediterraneens, chermoula", price: "3 500 DA" },
    ],
  },
  {
    name: "Desserts",
    dishes: [
      { name: "Viennoiseries", price: "300 DA" },
      { name: "Ile flottante", price: "450 DA" },
      { name: "Mousse au chocolat", price: "500 DA" },
      { name: "Patisserie du jour", price: "550 DA" },
      { name: "Pana cotta", price: "550 DA" },
      { name: "Cheesecake", price: "600 DA" },
      { name: "Brownie", price: "600 DA" },
      { name: "Tiramisu", price: "600 DA" },
      { name: "Fraisier", price: "600 DA" },
      { name: "Creme brulee", price: "600 DA" },
      { name: "Fondant citron", price: "700 DA" },
      { name: "Nougat glace", price: "700 DA" },
      { name: "Salade de fruit", price: "800 DA" },
      { name: "Fondant chocolat", price: "800 DA" },
      { name: "Cheesecake pistache", price: "850 DA" },
      { name: "Fondant pistache", price: "900 DA" },
      { name: "Assiette de fruit", price: "1 000 DA" },
    ],
  },
  {
    name: "Crepes & Gaufres",
    dishes: [
      { name: "Crepe nutella", price: "600 DA" },
      { name: "Crepe miel", price: "600 DA" },
      { name: "Crepe nutella banane", price: "700 DA" },
      { name: "Crepe fruits", price: "850 DA" },
      { name: "Crepe miel fruits sec", price: "850 DA" },
      { name: "Crepe la belle assiette", price: "1 000 DA" },
      { name: "Gaufre nutella", price: "600 DA" },
      { name: "Gaufre miel", price: "600 DA" },
      { name: "Gaufre nutella banane", price: "700 DA" },
      { name: "Gaufre fruits", price: "850 DA" },
      { name: "Gaufre miel fruits sec", price: "850 DA" },
      { name: "Gaufre la belle assiette", price: "1 000 DA" },
    ],
  },
  {
    name: "Boissons Chaudes",
    dishes: [
      { name: "Cafe l'or grain", price: "300 DA" },
      { name: "Cafe l'or expresso", price: "350 DA" },
      { name: "Americano", price: "350 DA" },
      { name: "Cafe noisette", price: "350 DA" },
      { name: "Iced coffee", price: "350 DA" },
      { name: "Macchiato", price: "400 DA" },
      { name: "Flat white", price: "400 DA" },
      { name: "Cafe viennois", price: "450 DA" },
      { name: "Mocha", price: "500 DA" },
      { name: "Caramel macchiato", price: "500 DA" },
      { name: "Cappuccino", price: "500 DA" },
      { name: "Bobon expresso", price: "500 DA" },
      { name: "Iced latte", price: "500 DA" },
      { name: "Cappuccino caramel", price: "600 DA" },
      { name: "Chocolat chaud", price: "600 DA" },
      { name: "Affogato", price: "650 DA" },
      { name: "Chocolat chaud viennois", price: "700 DA" },
      { name: "Cafe la belle assiette", price: "900 DA" },
      { name: "The maison", price: "300 DA" },
      { name: "The infusion", price: "300 DA" },
      { name: "Iced tea", price: "650 DA" },
    ],
  },
  {
    name: "Milkshakes",
    dishes: [
      { name: "Milkshake banane", price: "700 DA" },
      { name: "Milkshake chocolat", price: "700 DA" },
      { name: "Milkshake fraise", price: "700 DA" },
      { name: "Milkshake fraise banane", price: "800 DA" },
      { name: "Milkshake chocolat banane", price: "850 DA" },
      { name: "Milkshake orientale", price: "1 200 DA" },
    ],
  },
  {
    name: "Cocktails",
    dishes: [
      { name: "Blue lagoon", price: "700 DA" },
      { name: "Coastal mood", price: "700 DA" },
      { name: "Ile paradisiaque", price: "700 DA" },
      { name: "Perle des caraibes", price: "700 DA" },
      { name: "Golden mirage", price: "700 DA" },
      { name: "Mojito classique", price: "700 DA" },
      { name: "Orientale mojito", price: "700 DA" },
      { name: "Virgine mojito", price: "700 DA" },
      { name: "Pina colada", price: "700 DA" },
      { name: "Flammes andalous", price: "700 DA" },
      { name: "Safari exotique", price: "700 DA" },
      { name: "Lagoon sunset", price: "750 DA" },
      { name: "Aube de bali", price: "750 DA" },
      { name: "Mango colada", price: "750 DA" },
      { name: "Cuba libre mojito", price: "800 DA" },
      { name: "Evasion Tropicale", price: "900 DA" },
      { name: "Litchi mojito", price: "850 DA" },
      { name: "Red mojito", price: "850 DA" },
      { name: "Exotic mojito", price: "850 DA" },
      { name: "Green mojito", price: "900 DA" },
      { name: "Golden mojito", price: "1 000 DA" },
    ],
  },
  {
    name: "Jus",
    dishes: [
      { name: "Detox au choix", price: "500 DA" },
      { name: "Jus d'orange", price: "500 DA" },
      { name: "Jus de citron", price: "550 DA" },
      { name: "Jus de fraise", price: "600 DA" },
    ],
  },
  {
    name: "Pizzas",
    subsections: [
      {
        title: "Les Classiques",
        items: [
          { name: "Margherita", price: "850 DA", desc: "Sauce tomate, mozzarella, emmental, filet d'huile d'olive, basilic frais, origan" },
          { name: "Mediterraneenne", price: "950 DA", desc: "Sauce tomate, mozzarella, emmental, thon, capres, oignon, origan" },
          { name: "Rustica", price: "1 400 DA", desc: "Sauce tomate, mozzarella, emmental, viande hachee, oignon, poivron, origan" },
          { name: "Rosee des Mers", price: "1 600 DA", desc: "Sauce tomate, mozzarella, emmental, crevettes marinees, oignon, poivron, origan" },
        ],
      },
      {
        title: "Les Cremeuses",
        items: [
          { name: "Cremeuse au Poulet", price: "1 100 DA", desc: "Sauce blanche, mozzarella, emmental, poulet marine, oignon caramelise, champignons frais, basilic" },
          { name: "Indiana", price: "1 300 DA", desc: "Sauce curry douce, mozzarella, emmental, poulet epice, oignon, poivron, origan" },
          { name: "Fumee", price: "1 350 DA", desc: "Sauce blanche, mozzarella, emmental, poulet fume, oignon, poivron, champignons frais, origan" },
          { name: "Tagliatella", price: "1 650 DA", desc: "Sauce blanche, mozzarella, emmental, tagliatelles, poulet fume & poulet epice, oignon, poivron, origan" },
        ],
      },
      {
        title: "Les Vegetariennes",
        items: [
          { name: "Jardiniera", price: "1 200 DA", desc: "Sauce tomate, mozzarella, emmental, oignon, courgette, aubergine, poivron, champignons frais, filet d'huile d'olive, origan" },
          { name: "Douceur de Chevre", price: "1 450 DA", desc: "Sauce blanche, mozzarella, emmental, fromage de chevre doux, noix concassees, miel, origan" },
          { name: "Quattro Formaggi", price: "1 450 DA", desc: "Sauce fromagere, mozzarella, emmental, gruyere, camembert, filet d'huile d'olive, origan" },
        ],
      },
      {
        title: "Les Maritimes",
        items: [
          { name: "Norvegienne", price: "1 500 DA", desc: "Sauce blanche, mozzarella, emmental, saumon fume, capres, oignon, zeste de citron, origan" },
          { name: "Perle Blanche", price: "1 850 DA", desc: "Sauce blanche, mozzarella, emmental, capres, filet de poisson blanc poele, zeste de citron, origan" },
          { name: "La Belle Assiette", price: "2 300 DA", desc: "Sauce tomate, mozzarella, emmental, crevettes marinees, calamars, moules, filet de poisson blanc, filet de pesto, filet d'huile d'olive, origan" },
        ],
      },
    ],
  },
];

export default function MenuPage() {
  const [active, setActive] = useState(0);
  const cat = categories[active];

  return (
    <>
      <section className="bg-primary pt-32 pb-16 px-6 text-center">
        <h1 className="heading-hero text-white text-4xl md:text-6xl">Notre Carte</h1>
      </section>

      {/* Sticky tabs */}
      <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-4xl mx-auto flex gap-4 md:gap-6 px-6 overflow-x-auto scrollbar-hide">
          {categories.map((c, i) => (
            <button
              key={c.name}
              onClick={() => setActive(i)}
              className={`py-4 text-[12px] md:text-[13px] uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors ${
                active === i
                  ? "border-accent text-text"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Menu items */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="heading-section mb-8">{cat.name}</h2>

        {/* Simple list (no subsections) */}
        {cat.dishes && (
          <div className="divide-y divide-black/5">
            {cat.dishes.map((dish) => (
              <div key={dish.name} className="py-5 group cursor-default">
                <div className="flex justify-between items-baseline gap-4">
                  <h3 className="font-serif text-lg md:text-xl group-hover:text-primary transition-colors">
                    {dish.name}
                  </h3>
                  <span className="font-mono text-sm whitespace-nowrap text-accent font-medium">
                    {dish.price}
                  </span>
                </div>
                {dish.desc && (
                  <p className="text-text-muted text-sm mt-1 max-w-[85%]">{dish.desc}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Subsections (Pizzas) */}
        {cat.subsections && (
          <div className="space-y-10">
            {cat.subsections.map((sub) => (
              <div key={sub.title}>
                <h3 className="eyebrow text-accent mb-6">{sub.title}</h3>
                <div className="divide-y divide-black/5">
                  {sub.items.map((dish) => (
                    <div key={dish.name} className="py-5 group cursor-default">
                      <div className="flex justify-between items-baseline gap-4">
                        <h4 className="font-serif text-lg md:text-xl group-hover:text-primary transition-colors">
                          {dish.name}
                        </h4>
                        <span className="font-mono text-sm whitespace-nowrap text-accent font-medium">
                          {dish.price}
                        </span>
                      </div>
                      {dish.desc && (
                        <p className="text-text-muted text-sm mt-1 max-w-[85%]">{dish.desc}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Signature */}
      <div className="text-center pb-16 px-6">
        <p className="font-serif text-lg md:text-xl text-text-muted italic">
          &ldquo;Parce que chaque tasse raconte une histoire...&rdquo;
        </p>
      </div>
    </>
  );
}
