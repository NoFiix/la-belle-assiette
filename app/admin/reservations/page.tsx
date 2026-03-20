'use client'

import { useEffect, useState, useCallback } from 'react'

interface Reservation {
  id: number
  name: string
  phone: string
  email: string | null
  date: string
  time: string
  guests: number
  occasion: string | null
  message: string | null
  status: 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE'
  createdAt: string
}

type FilterStatus = 'ALL' | 'EN_ATTENTE' | 'CONFIRMEE' | 'ANNULEE'

const STATUS_CONFIG = {
  EN_ATTENTE: { label: 'En attente', bg: '#fef3c7', text: '#92400e', border: '#fde68a' },
  CONFIRMEE: { label: 'Confirmée', bg: '#d1fae5', text: '#065f46', border: '#a7f3d0' },
  ANNULEE: { label: 'Annulée', bg: '#fee2e2', text: '#991b1b', border: '#fecaca' },
}

function formatDateFr(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [filter, setFilter] = useState<FilterStatus>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchReservations = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/reservations')
      if (!res.ok) throw new Error('Erreur chargement')
      const data = await res.json()
      setReservations(data)
      setError('')
    } catch {
      setError('Impossible de charger les réservations')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchReservations()
  }, [fetchReservations])

  async function updateStatus(id: number, status: 'CONFIRMEE' | 'ANNULEE') {
    setUpdatingId(id)
    try {
      const res = await fetch(`/api/admin/reservations/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Erreur lors de la mise à jour')
        return
      }

      const updated = await res.json()
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      )
      setError('')
    } catch {
      setError('Erreur serveur')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = filter === 'ALL'
    ? reservations
    : reservations.filter((r) => r.status === filter)

  const counts = {
    ALL: reservations.length,
    EN_ATTENTE: reservations.filter((r) => r.status === 'EN_ATTENTE').length,
    CONFIRMEE: reservations.filter((r) => r.status === 'CONFIRMEE').length,
    ANNULEE: reservations.filter((r) => r.status === 'ANNULEE').length,
  }

  const filters: { key: FilterStatus; label: string }[] = [
    { key: 'ALL', label: 'Toutes' },
    { key: 'EN_ATTENTE', label: 'En attente' },
    { key: 'CONFIRMEE', label: 'Confirmées' },
    { key: 'ANNULEE', label: 'Annulées' },
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
        Réservations
      </h1>

      {/* Filtres */}
      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className="px-4 py-2 rounded-md text-sm font-medium transition-colors"
            style={{
              backgroundColor: filter === f.key ? '#2D4A35' : 'white',
              color: filter === f.key ? 'white' : '#374151',
              border: filter === f.key ? '1px solid #2D4A35' : '1px solid #e5e7eb',
            }}
          >
            {f.label}
            <span
              className="ml-2 px-1.5 py-0.5 rounded text-xs"
              style={{
                backgroundColor: filter === f.key ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                color: filter === f.key ? 'white' : '#6b7280',
              }}
            >
              {counts[f.key]}
            </span>
          </button>
        ))}
      </div>

      {/* Erreur */}
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: '#9ca3af' }}>Chargement des réservations...</p>
        </div>
      )}

      {/* État vide */}
      {!loading && filtered.length === 0 && (
        <div
          className="bg-white rounded-lg shadow-sm border p-12 text-center"
          style={{ borderColor: '#e5e7eb' }}
        >
          <p
            className="text-lg mb-2"
            style={{
              fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
              color: '#2D4A35',
            }}
          >
            {filter === 'ALL'
              ? 'Aucune réservation pour le moment'
              : `Aucune réservation ${filters.find((f) => f.key === filter)?.label.toLowerCase()}`}
          </p>
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            Les nouvelles réservations apparaîtront ici.
          </p>
        </div>
      )}

      {/* Tableau */}
      {!loading && filtered.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ backgroundColor: '#f9fafb' }}>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Nom</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Téléphone</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Date</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Heure</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Couverts</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Occasion</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Statut</th>
                  <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r) => {
                  const statusCfg = STATUS_CONFIG[r.status]
                  const isUpdating = updatingId === r.id

                  return (
                    <tr
                      key={r.id}
                      className="border-t"
                      style={{ borderColor: '#f3f4f6' }}
                    >
                      <td className="px-4 py-3 font-medium" style={{ color: '#111827' }}>
                        {r.name}
                      </td>
                      <td className="px-4 py-3" style={{ color: '#374151' }}>
                        {r.phone}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#374151' }}>
                        {formatDateFr(r.date)}
                      </td>
                      <td className="px-4 py-3" style={{ color: '#374151' }}>
                        {r.time}
                      </td>
                      <td className="px-4 py-3 text-center" style={{ color: '#374151' }}>
                        {r.guests}
                      </td>
                      <td className="px-4 py-3" style={{ color: '#374151' }}>
                        {r.occasion || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className="inline-block px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{
                            backgroundColor: statusCfg.bg,
                            color: statusCfg.text,
                            border: `1px solid ${statusCfg.border}`,
                          }}
                        >
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateStatus(r.id, 'CONFIRMEE')}
                            disabled={r.status === 'CONFIRMEE' || isUpdating}
                            className="px-3 py-1.5 rounded text-xs font-medium transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                              backgroundColor: '#d1fae5',
                              color: '#065f46',
                              border: '1px solid #a7f3d0',
                            }}
                          >
                            {isUpdating ? '...' : 'Confirmer'}
                          </button>
                          <button
                            onClick={() => updateStatus(r.id, 'ANNULEE')}
                            disabled={r.status === 'ANNULEE' || isUpdating}
                            className="px-3 py-1.5 rounded text-xs font-medium transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                            style={{
                              backgroundColor: '#fee2e2',
                              color: '#991b1b',
                              border: '1px solid #fecaca',
                            }}
                          >
                            {isUpdating ? '...' : 'Annuler'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
