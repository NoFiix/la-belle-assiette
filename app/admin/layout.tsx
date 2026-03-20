'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '□' },
  { label: 'Menu', href: '/admin/menu', icon: '☰' },
  { label: 'Événements', href: '/admin/evenements', icon: '★' },
  { label: 'Réservations', href: '/admin/reservations', icon: '◎' },
  { label: 'Galerie', href: '/admin/galerie', icon: '▣' },
  { label: 'Paramètres', href: '/admin/parametres', icon: '⚙' },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  // Ne pas afficher le layout admin sur la page login
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  async function handleLogout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: '#F9F6F0' }}>
      {/* Sidebar desktop */}
      <aside
        className="hidden md:flex md:flex-col md:w-60 md:fixed md:inset-y-0 border-r"
        style={{ backgroundColor: '#2D4A35', borderColor: '#1a3020' }}
      >
        <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <h2
            className="text-xl font-semibold text-white"
            style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif' }}
          >
            La Belle Assiette
          </h2>
          <p className="text-xs mt-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Administration
          </p>
        </div>

        <nav className="flex-1 py-4 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
            return (
              <a
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors"
                style={{
                  color: isActive ? '#C9A96E' : 'rgba(255,255,255,0.7)',
                  backgroundColor: isActive ? 'rgba(201,169,110,0.1)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.backgroundColor = 'transparent'
                }}
              >
                <span className="text-base">{item.icon}</span>
                {item.label}
              </a>
            )
          })}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2.5 rounded-md text-sm transition-colors"
            style={{ color: 'rgba(255,255,255,0.6)' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ef4444'
              e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.6)'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 border-b" style={{ backgroundColor: '#2D4A35' }}>
        <div className="flex items-center justify-between px-4 py-3">
          <h2
            className="text-lg font-semibold text-white"
            style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif' }}
          >
            La Belle Assiette
          </h2>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white p-1"
            aria-label="Menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {menuOpen ? (
                <path d="M6 6l12 12M6 18L18 6" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu dropdown */}
        {menuOpen && (
          <nav className="px-3 pb-3 space-y-1" style={{ backgroundColor: '#2D4A35' }}>
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm"
                  style={{
                    color: isActive ? '#C9A96E' : 'rgba(255,255,255,0.7)',
                    backgroundColor: isActive ? 'rgba(201,169,110,0.1)' : 'transparent',
                  }}
                >
                  <span className="text-base">{item.icon}</span>
                  {item.label}
                </a>
              )
            })}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm mt-2"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              Déconnexion
            </button>
          </nav>
        )}
      </div>

      {/* Main content */}
      <main className="flex-1 md:ml-60">
        <div className="p-6 pt-20 md:pt-6">
          {children}
        </div>
      </main>
    </div>
  )
}
