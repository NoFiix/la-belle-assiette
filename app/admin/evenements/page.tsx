'use client'

import { useEffect, useState, useCallback, FormEvent } from 'react'

interface EventData {
  id: number
  title: string
  description: string | null
  date: string
  time: string | null
  imageUrl: string | null
  ctaLabel: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export default function EvenementsPage() {
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [saving, setSaving] = useState(false)
  const [toggling, setToggling] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Form fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [ctaLabel, setCtaLabel] = useState('')

  const fetchEvent = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/evenements')
      if (res.status === 404) {
        setNotFound(true)
        return
      }
      if (!res.ok) throw new Error()
      const data: EventData = await res.json()
      setEvent(data)
      setTitle(data.title)
      setDescription(data.description || '')
      setDate(data.date.split('T')[0])
      setTime(data.time || '')
      setCtaLabel(data.ctaLabel)
    } catch {
      setFeedback({ type: 'error', message: 'Impossible de charger l\'événement' })
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  async function handleToggle() {
    if (!event) return
    setToggling(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/admin/evenements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !event.isActive }),
      })
      if (!res.ok) {
        const data = await res.json()
        setFeedback({ type: 'error', message: data.error || 'Erreur' })
        return
      }
      const updated: EventData = await res.json()
      setEvent(updated)
    } catch {
      setFeedback({ type: 'error', message: 'Erreur serveur' })
    } finally {
      setToggling(false)
    }
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      const res = await fetch('/api/admin/evenements', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, date, time, ctaLabel }),
      })
      const data = await res.json()
      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Erreur' })
        return
      }
      setEvent(data)
      setFeedback({ type: 'success', message: 'Modifications enregistrées' })
      setTimeout(() => setFeedback(null), 3000)
    } catch {
      setFeedback({ type: 'error', message: 'Erreur serveur' })
    } finally {
      setSaving(false)
    }
  }

  const isDatePassed = date ? new Date(date) < new Date(new Date().toDateString()) : false

  if (loading) {
    return (
      <div>
        <h1
          className="text-2xl font-semibold mb-6"
          style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', color: '#2D4A35' }}
        >
          Événements
        </h1>
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: '#9ca3af' }}>Chargement...</p>
        </div>
      </div>
    )
  }

  if (notFound) {
    return (
      <div>
        <h1
          className="text-2xl font-semibold mb-6"
          style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', color: '#2D4A35' }}
        >
          Événements
        </h1>
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center" style={{ borderColor: '#e5e7eb' }}>
          <p className="text-lg mb-2" style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', color: '#2D4A35' }}>
            Aucun événement en base
          </p>
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            Lancez le seed Prisma pour créer l&apos;événement initial.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1
        className="text-2xl font-semibold mb-6"
        style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', color: '#2D4A35' }}
      >
        Événements
      </h1>

      {/* Toggle ON/OFF */}
      <div
        className="bg-white rounded-lg shadow-sm border p-6 mb-6 flex items-center justify-between"
        style={{ borderColor: '#e5e7eb' }}
      >
        <div>
          <p className="font-medium text-sm" style={{ color: '#111827' }}>
            {event?.isActive ? 'Bannière événement active' : 'Bannière masquée'}
          </p>
          <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
            {event?.isActive
              ? 'Visible sur la homepage si la date n\'est pas passée'
              : 'La bannière n\'est pas affichée sur le site'}
          </p>
        </div>
        <button
          onClick={handleToggle}
          disabled={toggling}
          className="relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors duration-200 focus:outline-none disabled:opacity-50"
          style={{ backgroundColor: event?.isActive ? '#2D4A35' : '#d1d5db' }}
          aria-label="Toggle événement"
        >
          <span
            className="inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200"
            style={{
              transform: event?.isActive ? 'translate(22px, 4px)' : 'translate(4px, 4px)',
            }}
          />
        </button>
      </div>

      {/* Avertissement date passée */}
      {isDatePassed && (
        <div
          className="mb-6 text-sm px-4 py-3 rounded-md border"
          style={{ backgroundColor: '#fef3c7', color: '#92400e', borderColor: '#fde68a' }}
        >
          La date de cet événement est passée. La bannière ne sera pas affichée sur la homepage, même si elle est active.
        </div>
      )}

      {/* Feedback */}
      {feedback && (
        <div
          className="mb-6 text-sm px-4 py-3 rounded-md border"
          style={{
            backgroundColor: feedback.type === 'success' ? '#d1fae5' : '#fee2e2',
            color: feedback.type === 'success' ? '#065f46' : '#991b1b',
            borderColor: feedback.type === 'success' ? '#a7f3d0' : '#fecaca',
          }}
        >
          {feedback.message}
        </div>
      )}

      {/* Formulaire */}
      <form
        onSubmit={handleSave}
        className="bg-white rounded-lg shadow-sm border p-6 space-y-5"
        style={{ borderColor: '#e5e7eb' }}
      >
        {/* Titre */}
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <label htmlFor="title" className="text-sm font-medium" style={{ color: '#2D4A35' }}>
              Titre
            </label>
            <span className="text-xs" style={{ color: title.length > 80 ? '#991b1b' : '#9ca3af' }}>
              {title.length}/80
            </span>
          </div>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            required
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: '#d1d5db' }}
            onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            placeholder="Ex: Soirée Chaabi"
          />
        </div>

        {/* Description */}
        <div>
          <div className="flex justify-between items-baseline mb-1.5">
            <label htmlFor="description" className="text-sm font-medium" style={{ color: '#2D4A35' }}>
              Description
            </label>
            <span className="text-xs" style={{ color: description.length > 300 ? '#991b1b' : '#9ca3af' }}>
              {description.length}/300
            </span>
          </div>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
            rows={3}
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 resize-none"
            style={{ borderColor: '#d1d5db' }}
            onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            placeholder="Description de l'événement"
          />
        </div>

        {/* Date + Heure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium mb-1.5" style={{ color: '#2D4A35' }}>
              Date
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
              onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            />
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium mb-1.5" style={{ color: '#2D4A35' }}>
              Heure
            </label>
            <input
              id="time"
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
              onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              placeholder="Ex: 21h00"
            />
          </div>
        </div>

        {/* CTA Label */}
        <div>
          <label htmlFor="ctaLabel" className="block text-sm font-medium mb-1.5" style={{ color: '#2D4A35' }}>
            Texte du bouton CTA
          </label>
          <input
            id="ctaLabel"
            type="text"
            value={ctaLabel}
            onChange={(e) => setCtaLabel(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: '#d1d5db' }}
            onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
            onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
            placeholder="Réserver pour cet événement"
          />
        </div>

        {/* Bouton submit */}
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-md text-sm font-medium text-white transition-opacity disabled:opacity-50"
          style={{ backgroundColor: '#2D4A35' }}
          onMouseEnter={(e) => { if (!saving) e.currentTarget.style.backgroundColor = '#C9A96E' }}
          onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2D4A35' }}
        >
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </form>
    </div>
  )
}
