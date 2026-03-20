export default function DashboardPage() {
  const cards = [
    { label: 'Réservations en attente', value: '—', color: '#C9A96E' },
    { label: 'Événement actif', value: '—', color: '#2D4A35' },
    { label: 'Total plats', value: '—', color: '#2D4A35' },
    { label: 'Total photos', value: '—', color: '#C9A96E' },
  ]

  return (
    <div>
      <h1
        className="text-2xl font-semibold mb-6"
        style={{
          fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
          color: '#2D4A35',
        }}
      >
        Bonjour, La Belle Assiette
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-lg shadow-sm border p-5"
            style={{ borderColor: '#e5e7eb' }}
          >
            <p className="text-sm mb-2" style={{ color: '#6b7280' }}>
              {card.label}
            </p>
            <p
              className="text-3xl font-semibold"
              style={{
                fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
                color: card.color,
              }}
            >
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-sm border p-6" style={{ borderColor: '#e5e7eb' }}>
        <p className="text-sm" style={{ color: '#9ca3af' }}>
          Les modules admin (Menu, Événements, Réservations, Galerie, Paramètres) seront connectés prochainement.
        </p>
      </div>
    </div>
  )
}
