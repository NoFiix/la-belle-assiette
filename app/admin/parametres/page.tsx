'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'

type Settings = Record<string, string>

const SCHEDULE_DAYS = [
  { key: 'schedule_lundi', label: 'Lundi' },
  { key: 'schedule_mardi', label: 'Mardi' },
  { key: 'schedule_mercredi', label: 'Mercredi' },
  { key: 'schedule_jeudi', label: 'Jeudi' },
  { key: 'schedule_vendredi', label: 'Vendredi' },
  { key: 'schedule_samedi', label: 'Samedi' },
  { key: 'schedule_dimanche', label: 'Dimanche' },
]

const IMAGE_SLOTS = [
  { key: 'image_notre_histoire_home', label: 'Homepage — Notre Histoire' },
  { key: 'image_restaurant_hero', label: 'Restaurant — Image principale' },
  { key: 'image_restaurant_histoire', label: 'Restaurant — Un héritage culinaire' },
  { key: 'image_restaurant_lieu', label: 'Restaurant — Notre Lieu' },
  { key: 'image_restaurant_soirees', label: 'Restaurant — Les soirées musicales' },
]

const TOGGLE_KEYS = [
  { key: 'show_gallery', label: 'Afficher la galerie' },
  { key: 'show_restaurant_lieu', label: 'Afficher Notre Lieu' },
  { key: 'show_reviews', label: 'Afficher les avis' },
]

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-lg font-semibold mb-4"
      style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', color: '#2D4A35' }}
    >
      {children}
    </h2>
  )
}

function Feedback({ feedback }: { feedback: { type: 'success' | 'error'; msg: string } | null }) {
  if (!feedback) return null
  return (
    <div
      className="mt-3 text-sm px-3 py-2 rounded-md border"
      style={{
        backgroundColor: feedback.type === 'success' ? '#d1fae5' : '#fee2e2',
        color: feedback.type === 'success' ? '#065f46' : '#991b1b',
        borderColor: feedback.type === 'success' ? '#a7f3d0' : '#fecaca',
      }}
    >
      {feedback.msg}
    </div>
  )
}

export default function ParametresPage() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)

  // Section feedbacks
  const [textsFb, setTextsFb] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [contactFb, setContactFb] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const [scheduleFb, setScheduleFb] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)

  const [savingTexts, setSavingTexts] = useState(false)
  const [savingContact, setSavingContact] = useState(false)
  const [savingSchedule, setSavingSchedule] = useState(false)

  // Image upload states
  const [uploadingKey, setUploadingKey] = useState<string | null>(null)
  const [imageFb, setImageFb] = useState<{ type: 'success' | 'error'; msg: string } | null>(null)
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({})

  const fetchSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/parametres')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setSettings(data)
    } catch {
      // silent
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  function get(key: string): string {
    return settings[key] || ''
  }

  function set(key: string, value: string) {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  function showFb(setter: typeof setTextsFb, type: 'success' | 'error', msg: string) {
    setter({ type, msg })
    setTimeout(() => setter(null), 3000)
  }

  async function saveKeys(
    keys: { key: string; value: string }[],
    setSaving: (v: boolean) => void,
    setFb: typeof setTextsFb
  ) {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/parametres', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(keys),
      })
      if (!res.ok) {
        const data = await res.json()
        showFb(setFb, 'error', data.error || 'Erreur')
        return
      }
      showFb(setFb, 'success', 'Enregistré')
    } catch {
      showFb(setFb, 'error', 'Erreur serveur')
    } finally {
      setSaving(false)
    }
  }

  async function handleToggle(key: string) {
    const newVal = get(key) === 'true' ? 'false' : 'true'
    set(key, newVal)
    try {
      await fetch('/api/admin/parametres', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([{ key, value: newVal }]),
      })
    } catch {
      // revert
      set(key, newVal === 'true' ? 'false' : 'true')
    }
  }

  async function handleImageUpload(key: string, file: File) {
    if (!['image/jpeg', 'image/png'].includes(file.type)) {
      showFb(setImageFb, 'error', 'Format invalide. JPG/PNG uniquement.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      showFb(setImageFb, 'error', 'Fichier trop volumineux. Max 5 Mo.')
      return
    }
    setUploadingKey(key)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('key', key)
      const res = await fetch('/api/admin/parametres/upload', {
        method: 'POST',
        body: formData,
      })
      const data = await res.json()
      if (!res.ok) {
        showFb(setImageFb, 'error', data.error || 'Erreur upload')
        return
      }
      set(key, data.url)
      showFb(setImageFb, 'success', 'Image mise à jour')
    } catch {
      showFb(setImageFb, 'error', 'Erreur serveur')
    } finally {
      setUploadingKey(null)
    }
  }

  // Schedule: init from old keys if new keys are empty
  function getScheduleValue(day: string): string {
    const key = `schedule_${day}`
    if (settings[key]) return settings[key]
    // Fallback from old seed keys
    const oldFallbacks: Record<string, string> = {
      lundi: get('schedule_mon_sat'),
      mardi: get('schedule_mon_sat'),
      mercredi: get('schedule_mon_sat'),
      jeudi: get('schedule_mon_sat'),
      vendredi: get('schedule_friday'),
      samedi: get('schedule_mon_sat'),
      dimanche: get('schedule_sunday'),
    }
    return oldFallbacks[day] || ''
  }

  if (loading) {
    return (
      <div>
        <h1
          className="text-2xl font-semibold mb-6"
          style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', color: '#2D4A35' }}
        >
          Paramètres
        </h1>
        <p className="text-sm" style={{ color: '#9ca3af' }}>Chargement...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <h1
        className="text-2xl font-semibold"
        style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', color: '#2D4A35' }}
      >
        Paramètres
      </h1>

      {/* Section: Textes du site */}
      <div className="bg-white rounded-lg shadow-sm border p-6" style={{ borderColor: '#e5e7eb' }}>
        <SectionTitle>Textes du site</SectionTitle>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-sm font-medium" style={{ color: '#2D4A35' }}>Intro homepage</label>
              <span className="text-xs" style={{ color: get('homepage_intro').length > 200 ? '#991b1b' : '#9ca3af' }}>{get('homepage_intro').length}/200</span>
            </div>
            <textarea value={get('homepage_intro')} onChange={(e) => set('homepage_intro', e.target.value)} maxLength={200} rows={2} className="w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-sm font-medium" style={{ color: '#2D4A35' }}>Description restaurant</label>
              <span className="text-xs" style={{ color: get('restaurant_desc').length > 500 ? '#991b1b' : '#9ca3af' }}>{get('restaurant_desc').length}/500</span>
            </div>
            <textarea value={get('restaurant_desc')} onChange={(e) => set('restaurant_desc', e.target.value)} maxLength={500} rows={3} className="w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
          </div>
          <div>
            <div className="flex justify-between items-baseline mb-1">
              <label className="text-sm font-medium" style={{ color: '#2D4A35' }}>Texte Notre Lieu</label>
              <span className="text-xs" style={{ color: get('restaurant_lieu_text').length > 500 ? '#991b1b' : '#9ca3af' }}>{get('restaurant_lieu_text').length}/500</span>
            </div>
            <textarea value={get('restaurant_lieu_text')} onChange={(e) => set('restaurant_lieu_text', e.target.value)} maxLength={500} rows={3} className="w-full px-3 py-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
          </div>
        </div>
        <button
          onClick={() => saveKeys([
            { key: 'homepage_intro', value: get('homepage_intro') },
            { key: 'restaurant_desc', value: get('restaurant_desc') },
            { key: 'restaurant_lieu_text', value: get('restaurant_lieu_text') },
          ], setSavingTexts, setTextsFb)}
          disabled={savingTexts}
          className="mt-4 px-5 py-2 rounded-md text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: '#2D4A35' }}
        >
          {savingTexts ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <Feedback feedback={textsFb} />
      </div>

      {/* Section: Contact & Réseaux */}
      <div className="bg-white rounded-lg shadow-sm border p-6" style={{ borderColor: '#e5e7eb' }}>
        <SectionTitle>Contact &amp; Réseaux</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { key: 'whatsapp_number', label: 'WhatsApp', placeholder: '+213...' },
            { key: 'instagram_url', label: 'Instagram', placeholder: 'https://instagram.com/...' },
            { key: 'facebook_url', label: 'Facebook', placeholder: 'https://facebook.com/...' },
            { key: 'tiktok_url', label: 'TikTok', placeholder: 'https://tiktok.com/@...' },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-sm font-medium mb-1" style={{ color: '#2D4A35' }}>{f.label}</label>
              <input type="text" value={get(f.key)} onChange={(e) => set(f.key, e.target.value)} placeholder={f.placeholder} className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2" style={{ borderColor: '#d1d5db' }} />
            </div>
          ))}
        </div>
        <button
          onClick={() => saveKeys([
            { key: 'whatsapp_number', value: get('whatsapp_number') },
            { key: 'instagram_url', value: get('instagram_url') },
            { key: 'facebook_url', value: get('facebook_url') },
            { key: 'tiktok_url', value: get('tiktok_url') },
          ], setSavingContact, setContactFb)}
          disabled={savingContact}
          className="mt-4 px-5 py-2 rounded-md text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: '#2D4A35' }}
        >
          {savingContact ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <Feedback feedback={contactFb} />
      </div>

      {/* Section: Horaires */}
      <div className="bg-white rounded-lg shadow-sm border p-6" style={{ borderColor: '#e5e7eb' }}>
        <SectionTitle>Horaires</SectionTitle>
        <div className="space-y-3">
          {SCHEDULE_DAYS.map((d) => (
            <div key={d.key} className="flex items-center gap-4">
              <label className="text-sm font-medium w-24 shrink-0" style={{ color: '#2D4A35' }}>{d.label}</label>
              <input
                type="text"
                value={get(d.key) || getScheduleValue(d.label.toLowerCase())}
                onChange={(e) => set(d.key, e.target.value)}
                placeholder="Ex: 11h - 23h"
                className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
                style={{ borderColor: '#d1d5db' }}
              />
            </div>
          ))}
        </div>
        <button
          onClick={() => saveKeys(
            SCHEDULE_DAYS.map((d) => ({ key: d.key, value: get(d.key) || getScheduleValue(d.label.toLowerCase()) })),
            setSavingSchedule, setScheduleFb
          )}
          disabled={savingSchedule}
          className="mt-4 px-5 py-2 rounded-md text-sm font-medium text-white disabled:opacity-50"
          style={{ backgroundColor: '#2D4A35' }}
        >
          {savingSchedule ? 'Enregistrement...' : 'Enregistrer'}
        </button>
        <Feedback feedback={scheduleFb} />
      </div>

      {/* Section: Images du site */}
      <div className="bg-white rounded-lg shadow-sm border p-6" style={{ borderColor: '#e5e7eb' }}>
        <SectionTitle>Images du site</SectionTitle>
        <Feedback feedback={imageFb} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {IMAGE_SLOTS.map((slot) => (
            <div key={slot.key}>
              <p className="text-sm font-medium mb-2" style={{ color: '#2D4A35' }}>{slot.label}</p>
              <div className="relative aspect-video rounded-lg overflow-hidden border mb-2" style={{ borderColor: '#e5e7eb', backgroundColor: '#f9fafb' }}>
                {get(slot.key) ? (
                  <Image src={get(slot.key)} alt={slot.label} fill className="object-cover" sizes="300px" />
                ) : (
                  <div className="flex items-center justify-center h-full text-xs" style={{ color: '#9ca3af' }}>Aucune image</div>
                )}
              </div>
              <input
                ref={(el) => { fileRefs.current[slot.key] = el }}
                type="file"
                accept="image/jpeg,image/png"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleImageUpload(slot.key, file)
                }}
              />
              <button
                onClick={() => fileRefs.current[slot.key]?.click()}
                disabled={uploadingKey === slot.key}
                className="px-3 py-1.5 rounded text-xs font-medium disabled:opacity-50"
                style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
              >
                {uploadingKey === slot.key ? 'Upload...' : 'Changer l\'image'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section: Affichage */}
      <div className="bg-white rounded-lg shadow-sm border p-6" style={{ borderColor: '#e5e7eb' }}>
        <SectionTitle>Affichage</SectionTitle>
        <div className="space-y-4">
          {TOGGLE_KEYS.map((t) => (
            <div key={t.key} className="flex items-center justify-between">
              <span className="text-sm" style={{ color: '#374151' }}>{t.label}</span>
              <button
                onClick={() => handleToggle(t.key)}
                className="relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors duration-200"
                style={{ backgroundColor: get(t.key) === 'true' ? '#2D4A35' : '#d1d5db' }}
              >
                <span
                  className="inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                  style={{ transform: get(t.key) === 'true' ? 'translate(22px, 4px)' : 'translate(4px, 4px)' }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
