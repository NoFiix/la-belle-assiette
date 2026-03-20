'use client'

import { useState } from 'react'
import Link from 'next/link'

interface MenuItem {
  id: number
  name: string
  description: string | null
  price: string | null
  badge: 'NOUVEAU' | 'CHEF' | null
  isVisible: boolean
}

interface MenuCategory {
  id: number
  name: string
  items: MenuItem[]
}

interface SubSection {
  title: string | null
  items: MenuItem[]
}

// Generic tag parser: "[Tag Name] actual description" → { tag, text }
function parseTag(description: string | null): { tag: string | null; text: string } {
  if (!description) return { tag: null, text: '' }
  const match = description.match(/^\[([^\]]+)\]\s*(.*)$/)
  if (match) return { tag: match[1], text: match[2] }
  return { tag: null, text: description }
}

// Subsection display order per category
const SUBSECTION_ORDER: Record<string, string[]> = {
  Plats: ['Pizzas - Classiques', 'Pizzas - Crémeuses', 'Pizzas - Végétariennes', 'Pizzas - Maritimes'],
  Desserts: ['Desserts', 'Crêpes', 'Gaufres'],
  Boissons: ['Boissons Chaudes', 'Milkshakes', 'Cocktails', 'Jus'],
}

function groupByTag(items: MenuItem[], categoryName: string): SubSection[] {
  const order = SUBSECTION_ORDER[categoryName]

  // No subsection config → flat list
  if (!order) return [{ title: null, items }]

  const groups: Record<string, MenuItem[]> = {}
  const ungrouped: MenuItem[] = []

  for (const item of items) {
    const { tag } = parseTag(item.description)
    if (tag) {
      if (!groups[tag]) groups[tag] = []
      groups[tag].push(item)
    } else {
      ungrouped.push(item)
    }
  }

  const sections: SubSection[] = []

  // Untagged items first (no header)
  if (ungrouped.length > 0) {
    sections.push({ title: null, items: ungrouped })
  }

  // Tagged items in defined order
  for (const name of order) {
    if (groups[name] && groups[name].length > 0) {
      sections.push({ title: name, items: groups[name] })
    }
  }

  // Any tagged items not in the order list
  for (const key of Object.keys(groups)) {
    if (!order.includes(key) && groups[key].length > 0) {
      sections.push({ title: key, items: groups[key] })
    }
  }

  return sections
}

function DishItem({ dish, showTag }: { dish: MenuItem; showTag: boolean }) {
  const { text } = showTag ? parseTag(dish.description) : { text: dish.description || '' }

  return (
    <div className="py-5 group cursor-default">
      <div className="flex justify-between items-baseline gap-4">
        <h3 className="font-serif text-lg md:text-xl group-hover:text-primary transition-colors">
          {dish.name}
          {dish.badge && (
            <span
              className={`inline-block ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider align-middle ${
                dish.badge === 'CHEF'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-accent/20 text-accent'
              }`}
            >
              {dish.badge === 'CHEF' ? 'CHEF' : 'NOUVEAU'}
            </span>
          )}
        </h3>
        {dish.price && (
          <span className="font-mono text-sm whitespace-nowrap text-accent font-medium">
            {dish.price}
          </span>
        )}
      </div>
      {text && (
        <p className="text-text-muted text-sm mt-1 max-w-[85%]">{text}</p>
      )}
    </div>
  )
}

export default function MenuClient({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(0)

  if (categories.length === 0) {
    return (
      <>
        <section className="bg-primary pt-32 pb-16 px-6 text-center">
          <h1 className="heading-hero text-white text-4xl md:text-6xl">Notre Carte</h1>
        </section>
        <section className="max-w-3xl mx-auto px-6 py-12 text-center">
          <p className="font-serif text-lg text-text-muted italic">
            Notre carte est en cours de préparation. Revenez bientôt.
          </p>
        </section>
      </>
    )
  }

  const cat = categories[active]
  const sections = groupByTag(cat.items, cat.name)
  const hasSubsections = sections.some((s) => s.title !== null)

  return (
    <>
      <section className="bg-primary pt-32 pb-16 px-6 text-center">
        <h1 className="heading-hero text-white text-4xl md:text-6xl">Notre Carte</h1>
        <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
          <Link
            href="/menus/Menu_Pizza.pdf"
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium border border-white/30 text-white hover:bg-white/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 18 15 15" />
            </svg>
            Carte Pizzas
          </Link>
          <Link
            href="/menus/Menu_Boissons&Desserts.pdf"
            target="_blank"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md text-sm font-medium border border-white/30 text-white hover:bg-white/10 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="12" y1="18" x2="12" y2="12" />
              <polyline points="9 15 12 18 15 15" />
            </svg>
            Carte Boissons &amp; Desserts
          </Link>
        </div>
      </section>

      {/* Sticky tabs */}
      <div className="sticky top-20 z-40 bg-background/80 backdrop-blur-md border-b border-black/5">
        <div className="max-w-4xl mx-auto flex gap-4 md:gap-6 px-6 overflow-x-auto scrollbar-hide">
          {categories.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActive(i)}
              className={`py-4 text-[12px] md:text-[13px] uppercase tracking-widest whitespace-nowrap border-b-2 transition-colors ${
                active === i
                  ? 'border-accent text-text'
                  : 'border-transparent text-text-muted hover:text-text'
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

        {/* Empty state */}
        {cat.items.length === 0 && (
          <p className="font-serif text-lg text-text-muted italic text-center py-8">
            Cette section est en préparation.
          </p>
        )}

        {/* Flat list (no subsections) */}
        {!hasSubsections && cat.items.length > 0 && (
          <div className="divide-y divide-black/5">
            {cat.items.map((dish) => (
              <DishItem key={dish.id} dish={dish} showTag={false} />
            ))}
          </div>
        )}

        {/* Grouped by subsections */}
        {hasSubsections && (
          <div className="space-y-10">
            {sections.map((section, idx) => (
              <div key={section.title || `ungrouped-${idx}`}>
                {section.title && (
                  <h3 className="eyebrow text-accent mb-6">{section.title}</h3>
                )}
                <div className="divide-y divide-black/5">
                  {section.items.map((dish) => (
                    <DishItem key={dish.id} dish={dish} showTag={true} />
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
  )
}
