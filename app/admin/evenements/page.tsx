'use client'

import { useEffect, useState, useCallback, FormEvent } from 'react'

interface EventData {
  id: number
  title: string
  description: string | null
  date: string
  time: string | null
  ctaLabel: string
  isActive: boolean
}

function formatDate(d: string): string {
  return new Date(d).toLocaleDateString('fr-FR', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

export default function EvenementsPage() {
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Edit/create
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [formTitle, setFormTitle] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formTime, setFormTime] = useState('')
  const [formCta, setFormCta] = useState('')
  const [saving, setSaving] = useState(false)

  const [togglingId, setTogglingId] = useState<number | null>(null)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  const fetchEvents = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/evenements')
      if (!res.ok) throw new Error()
      setEvents(await res.json())
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchEvents() }, [fetchEvents])

  function fb(type: 'success' | 'error', message: string) {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3000)
  }

  function openCreate() {
    setEditingEvent(null)
    setFormTitle('')
    setFormDesc('')
    setFormDate('')
    setFormTime('21h00')
    setFormCta('Réserver pour cet événement')
    setShowForm(true)
  }

  function openEdit(e: EventData) {
    setEditingEvent(e)
    setFormTitle(e.title)
    setFormDesc(e.description || '')
    setFormDate(e.date.split('T')[0])
    setFormTime(e.time || '')
    setFormCta(e.ctaLabel)
    setShowForm(true)
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    if (!formTitle.trim() || !formDate) return
    setSaving(true)

    const body = {
      title: formTitle.trim(),
      description: formDesc || null,
      date: formDate,
      time: formTime || null,
      ctaLabel: formCta || 'Réserver pour cet événement',
    }

    try {
      let res: Response
      if (editingEvent) {
        res = await fetch(`/api/admin/evenements/${editingEvent.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        res = await fetch('/api/admin/evenements', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }

      const data = await res.json()
      if (!res.ok) { fb('error', data.error || 'Erreur'); return }

      setShowForm(false)
      fb('success', editingEvent ? 'Événement modifié' : 'Événement créé')
      await fetchEvents()
    } catch {
      fb('error', 'Erreur serveur')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggleActive(event: EventData) {
    setTogglingId(event.id)
    try {
      const res = await fetch(`/api/admin/evenements/${event.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !event.isActive }),
      })
      if (!res.ok) { fb('error', 'Erreur'); return }
      await fetchEvents()
    } catch {
      fb('error', 'Erreur serveur')
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/evenements/${id}`, { method: 'DELETE' })
      if (!res.ok) { fb('error', 'Erreur'); return }
      setConfirmDeleteId(null)
      if (editingEvent?.id === id) setShowForm(false)
      fb('success', 'Événement supprimé')
      await fetchEvents()
    } catch {
      fb('error', 'Erreur serveur')
    } finally {
      setDeletingId(null)
    }
  }

  const isDatePassed = (d: string) => new Date(d) < new Date(new Date().toDateString())

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', color: '#2D4A35' }}
        >
          Événements
        </h1>
        <button
          onClick={openCreate}
          className="px-4 py-2 rounded-md text-sm font-medium text-white"
          style={{ backgroundColor: '#2D4A35' }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C9A96E')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2D4A35')}
        >
          + Ajouter un événement
        </button>
      </div>

      {feedback && (
        <div
          className="mb-4 text-sm px-4 py-3 rounded-md border"
          style={{
            backgroundColor: feedback.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: feedback.type === 'success' ? '#065f46' : '#991b1b',
            borderColor: feedback.type === 'success' ? '#a7f3d0' : '#fecaca',
          }}
        >
          {feedback.message}
        </div>
      )}

      {loading && (
        <p className="text-sm text-center py-12" style={{ color: '#9ca3af' }}>Chargement...</p>
      )}

      {/* Event cards */}
      {!loading && events.length === 0 && !showForm && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center" style={{ borderColor: '#e5e7eb' }}>
          <p className="text-lg mb-2" style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', color: '#2D4A35' }}>
            Aucun événement
          </p>
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            Créez votre premier événement ci-dessus.
          </p>
        </div>
      )}

      {!loading && events.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {events.map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-lg shadow-sm border p-5 cursor-pointer transition-shadow hover:shadow-md"
              style={{
                borderColor: ev.isActive ? '#C9A96E' : '#e5e7eb',
                borderWidth: ev.isActive ? 2 : 1,
              }}
              onClick={() => openEdit(ev)}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-medium text-sm" style={{ color: '#111827' }}>{ev.title}</h3>
                {ev.isActive && (
                  <span className="shrink-0 px-2 py-0.5 rounded-full text-xs font-medium text-white" style={{ backgroundColor: '#C9A96E' }}>
                    Actif
                  </span>
                )}
              </div>
              <p className="text-xs mb-3" style={{ color: isDatePassed(ev.date) ? '#991b1b' : '#6b7280' }}>
                {formatDate(ev.date)}{ev.time ? ` — ${ev.time}` : ''}
                {isDatePassed(ev.date) && ' (passé)'}
              </p>
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => handleToggleActive(ev)}
                  disabled={togglingId === ev.id}
                  className="relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50"
                  style={{ backgroundColor: ev.isActive ? '#2D4A35' : '#d1d5db' }}
                >
                  <span
                    className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200"
                    style={{ transform: ev.isActive ? 'translate(16px, 3px)' : 'translate(3px, 3px)' }}
                  />
                </button>
                <span className="text-xs" style={{ color: '#9ca3af' }}>
                  {ev.isActive ? 'Bannière active' : 'Inactif'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border p-6" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center justify-between mb-5">
            <h2
              className="text-lg font-semibold"
              style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', color: '#2D4A35' }}
            >
              {editingEvent ? 'Modifier l\'événement' : 'Nouvel événement'}
            </h2>
            <button onClick={() => setShowForm(false)} className="text-sm" style={{ color: '#9ca3af' }}>
              Fermer
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label className="text-sm font-medium" style={{ color: '#2D4A35' }}>Titre</label>
                <span className="text-xs" style={{ color: formTitle.length > 80 ? '#991b1b' : '#9ca3af' }}>{formTitle.length}/80</span>
              </div>
              <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} maxLength={80} required className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} placeholder="Ex: Soirée Chaabi" />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1">
                <label className="text-sm font-medium" style={{ color: '#2D4A35' }}>Description</label>
                <span className="text-xs" style={{ color: formDesc.length > 300 ? '#991b1b' : '#9ca3af' }}>{formDesc.length}/300</span>
              </div>
              <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} maxLength={300} rows={3} className="w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2D4A35' }}>Date</label>
                <input type="date" value={formDate} onChange={(e) => setFormDate(e.target.value)} required className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2D4A35' }}>Heure</label>
                <input type="text" value={formTime} onChange={(e) => setFormTime(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} placeholder="Ex: 21h00" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2D4A35' }}>Texte du bouton CTA</label>
              <input type="text" value={formCta} onChange={(e) => setFormCta(e.target.value)} className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} placeholder="Réserver pour cet événement" />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={saving || !formTitle.trim() || !formDate}
                className="px-5 py-2 rounded-md text-sm font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: '#2D4A35' }}
              >
                {saving ? 'Enregistrement...' : editingEvent ? 'Modifier' : 'Créer'}
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-md text-sm font-medium" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                Annuler
              </button>
              {editingEvent && (
                confirmDeleteId === editingEvent.id ? (
                  <div className="flex gap-1 ml-auto">
                    <button type="button" onClick={() => handleDelete(editingEvent.id)} disabled={deletingId === editingEvent.id} className="px-3 py-2 rounded text-xs font-medium text-white disabled:opacity-50" style={{ backgroundColor: '#dc2626' }}>
                      {deletingId === editingEvent.id ? '...' : 'Confirmer'}
                    </button>
                    <button type="button" onClick={() => setConfirmDeleteId(null)} className="px-3 py-2 rounded text-xs font-medium" style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>
                      Non
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setConfirmDeleteId(editingEvent.id)} className="px-3 py-2 rounded text-xs font-medium ml-auto" style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}>
                    Supprimer
                  </button>
                )
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
