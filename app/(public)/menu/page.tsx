"use client";

import { useState } from "react";
import Link from "next/link";

const categories = [
  {
    name: "Entrees",
    dishes: [
      { name: "Bourek aux Crevettes", desc: "Feuilles croustillantes farcies de crevettes epicees, menthe fraiche", price: "1 800 DA", badge: "CHEF" },
      { name: "Salade Mechouia", desc: "Poivrons et tomates grilles, ail confit, huile d'olive", price: "800 DA" },
      { name: "Chorba Frik", desc: "Veloute de ble vert, agneau effiloche, coriandre fraiche", price: "1 200 DA" },
      { name: "Dolma", desc: "Feuilles de vigne farcies au riz, viande hachee et epices", price: "1 400 DA", badge: "NOUVEAU" },
      { name: "Hrira", desc: "Soupe traditionnelle aux tomates, lentilles et pois chiches", price: "900 DA" },
    ],
  },
  {
    name: "Plats",
    dishes: [
      { name: "Couscous Royal", desc: "Couscous signature aux legumes de saison, merguez, poulet fermier", price: "2 800 DA", badge: "NOUVEAU" },
      { name: "Epaule d'Agneau Confite", desc: "Agneau confit 8h aux pruneaux et amandes torrefiees", price: "3 200 DA", badge: "CHEF" },
      { name: "Tajine Zitoune", desc: "Poulet aux olives vertes et citron confit, pommes de terre fondantes", price: "2 200 DA" },
      { name: "Chakhchoukha de Biskra", desc: "Pate dechiree en sauce tomate epicee, viande d'agneau", price: "2 600 DA" },
      { name: "Rechta Algeroise", desc: "Pates fines en sauce blanche, poulet, navets et pois chiches", price: "2 400 DA" },
      { name: "Pave de Merou Grille", desc: "Poisson frais du jour, legumes mediterraneens, chermoula", price: "3 500 DA" },
    ],
  },
  {
    name: "Desserts",
    dishes: [
      { name: "Baklawa aux Pistaches", desc: "Fines feuilles dorees au miel de montagne, pistaches concassees", price: "900 DA" },
      { name: "Makroud de Tlemcen", desc: "Semoule croustillante fourree aux dattes, parfumee a la fleur d'oranger", price: "700 DA" },
      { name: "Kalb el Louz", desc: "Coeur d'amande fondant au sirop de sucre et eau de rose", price: "800 DA", badge: "CHEF" },
      { name: "Tamina", desc: "Douceur de semoule grillee au miel et beurre, cannelle", price: "600 DA" },
    ],
  },
  {
    name: "Boissons",
    dishes: [
      { name: "The a la Menthe", desc: "The vert infuse a la menthe fraiche, servi en theiere traditionnelle", price: "400 DA" },
      { name: "Citronnade Maison", desc: "Citron presse, fleur d'oranger, miel de Kabylie", price: "500 DA" },
      { name: "Jus d'Orange Frais", desc: "Oranges pressees de Blida", price: "350 DA" },
      { name: "Cafe Turc", desc: "Cafe finement moulu, cardamome, servi avec loukoum", price: "300 DA" },
      { name: "Lait de Dattes", desc: "Dattes Deglet Nour mixees au lait frais et cannelle", price: "450 DA", badge: "NOUVEAU" },
    ],
  },
];

export default function MenuPage() {
  const [active, setActive] = useState(0);

  return (
    <>
      <section className="bg-primary pt-32 pb-16 px-6 text-center">
        <h1 className="heading-hero text-white text-4xl md:text-6xl">Notre Carte</h1>
      </section>

      {/* Sticky tabs */}
      <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-3xl mx-auto flex gap-6 md:gap-8 px-6 overflow-x-auto">
          {categories.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => setActive(i)}
              className={`py-4 text-[13px] uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors ${
                active === i
                  ? "border-accent text-text"
                  : "border-transparent text-text-muted hover:text-text"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* PDF buttons */}
      <div className="flex justify-center gap-4 pt-8 px-6">
        <a
          href="/menus/Menu_Pizza.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          Carte des Pizzas (PDF)
        </a>
        <a
          href="/menus/Menu_Final.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline"
        >
          Carte Complete (PDF)
        </a>
      </div>

      {/* Menu items */}
      <section className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="heading-section mb-8">{categories[active].name}</h2>
        <div className="divide-y divide-black/5">
          {categories[active].dishes.map((dish) => (
            <div key={dish.name} className="py-6 group cursor-default">
              <div className="flex justify-between items-end mb-1">
                <h3 className="font-serif text-xl md:text-2xl group-hover:text-primary transition-colors">
                  {dish.name}
                  {dish.badge && (
                    <span
                      className={`ml-3 inline-block align-middle px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        dish.badge === "CHEF"
                          ? "bg-primary/10 text-primary"
                          : "bg-accent/20 text-accent"
                      }`}
                    >
                      {dish.badge}
                    </span>
                  )}
                </h3>
                <span className="font-mono text-sm whitespace-nowrap ml-4">
                  {dish.price}
                </span>
              </div>
              <p className="text-text-muted text-sm max-w-[80%]">{dish.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
