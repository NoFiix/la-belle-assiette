'use client'

import { useEffect, useState, useCallback } from 'react'

interface MenuItem {
  id: number
  name: string
  description: string | null
  price: string | null
  badge: 'NOUVEAU' | 'CHEF' | null
  isVisible: boolean
  categoryId: number
  createdAt: string
  updatedAt: string
}

interface MenuCategory {
  id: number
  name: string
  order: number
  isVisible: boolean
  items: MenuItem[]
}

// Subsection options per category name
const SUBSECTION_OPTIONS: Record<string, string[]> = {
  Plats: ['Pizzas - Classiques', 'Pizzas - Crémeuses', 'Pizzas - Végétariennes', 'Pizzas - Maritimes'],
  Desserts: ['Desserts', 'Crêpes', 'Gaufres'],
  Boissons: ['Boissons Chaudes', 'Milkshakes', 'Cocktails', 'Jus'],
}

// Generic tag parser: "[Tag] text" → { tag, text }
function parseTag(description: string | null): { tag: string | null; text: string } {
  if (!description) return { tag: null, text: '' }
  const match = description.match(/^\[([^\]]+)\]\s*(.*)$/)
  if (match) return { tag: match[1], text: match[2] }
  return { tag: null, text: description }
}

function buildDescription(text: string, tag: string | null): string {
  if (tag) return `[${tag}] ${text}`
  return text
}

const BADGE_LABELS: Record<string, string> = {
  NOUVEAU: 'Nouveau',
  CHEF: "Chef's choice",
}

export default function MenuAdminPage() {
  const [categories, setCategories] = useState<MenuCategory[]>([])
  const [activeTab, setActiveTab] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Modal state
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null)
  const [formName, setFormName] = useState('')
  const [formDesc, setFormDesc] = useState('')
  const [formPrice, setFormPrice] = useState('')
  const [formBadge, setFormBadge] = useState<'NOUVEAU' | 'CHEF' | ''>('')
  const [formVisible, setFormVisible] = useState(true)
  const [formCategoryId, setFormCategoryId] = useState<number>(0)
  const [formSubTag, setFormSubTag] = useState<string>('')
  const [saving, setSaving] = useState(false)

  // Delete state
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)

  // Toggle state
  const [togglingId, setTogglingId] = useState<number | null>(null)

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/menu/categories')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setCategories(data)
      setError('')
    } catch {
      setError('Impossible de charger le menu')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchCategories()
  }, [fetchCategories])

  const activeCat = categories[activeTab]
  const activeCatName = activeCat?.name || ''
  const activeSubOptions = SUBSECTION_OPTIONS[activeCatName] || []
  const hasSubOptions = activeSubOptions.length > 0

  function getSubOptionsForCategory(catId: number): string[] {
    const name = categories.find((c) => c.id === catId)?.name || ''
    return SUBSECTION_OPTIONS[name] || []
  }

  function openAddModal() {
    setEditingItem(null)
    setFormName('')
    setFormDesc('')
    setFormPrice('')
    setFormBadge('')
    setFormVisible(true)
    setFormCategoryId(activeCat?.id || 0)
    setFormSubTag('')
    setShowModal(true)
  }

  function openEditModal(item: MenuItem) {
    setEditingItem(item)
    setFormName(item.name)
    setFormPrice(item.price || '')
    setFormBadge(item.badge || '')
    setFormVisible(item.isVisible)
    setFormCategoryId(item.categoryId)

    const catName = categories.find((c) => c.id === item.categoryId)?.name || ''
    const hasSubs = !!SUBSECTION_OPTIONS[catName]

    if (hasSubs) {
      const parsed = parseTag(item.description)
      setFormDesc(parsed.text)
      setFormSubTag(parsed.tag || '')
    } else {
      setFormDesc(item.description || '')
      setFormSubTag('')
    }

    setShowModal(true)
  }

  async function handleSave() {
    if (!formName.trim()) return
    setSaving(true)
    setFeedback(null)

    const targetCatName = categories.find((c) => c.id === formCategoryId)?.name || ''
    const hasSubs = !!SUBSECTION_OPTIONS[targetCatName]
    const finalDesc = hasSubs && formSubTag
      ? buildDescription(formDesc, formSubTag)
      : formDesc

    const body: Record<string, unknown> = {
      name: formName.trim(),
      description: finalDesc || null,
      price: formPrice || null,
      badge: formBadge || null,
      isVisible: formVisible,
      categoryId: formCategoryId,
    }

    try {
      let res: Response
      if (editingItem) {
        res = await fetch(`/api/admin/menu/items/${editingItem.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      } else {
        res = await fetch('/api/admin/menu/items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })
      }

      const data = await res.json()
      if (!res.ok) {
        setFeedback({ type: 'error', message: data.error || 'Erreur' })
        return
      }

      setShowModal(false)
      setFeedback({
        type: 'success',
        message: editingItem ? 'Plat modifié' : 'Plat ajouté',
      })
      setTimeout(() => setFeedback(null), 3000)
      await fetchCategories()
    } catch {
      setFeedback({ type: 'error', message: 'Erreur serveur' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/menu/items/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        setFeedback({ type: 'error', message: data.error || 'Erreur' })
        return
      }
      setFeedback({ type: 'success', message: 'Plat supprimé' })
      setTimeout(() => setFeedback(null), 3000)
      setConfirmDeleteId(null)
      await fetchCategories()
    } catch {
      setFeedback({ type: 'error', message: 'Erreur serveur' })
    } finally {
      setDeletingId(null)
    }
  }

  async function handleToggleVisible(item: MenuItem) {
    setTogglingId(item.id)
    try {
      const res = await fetch(`/api/admin/menu/items/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !item.isVisible }),
      })
      if (!res.ok) return
      await fetchCategories()
    } catch {
      // silent
    } finally {
      setTogglingId(null)
    }
  }

  function displayDesc(item: MenuItem, catName: string): string {
    if (SUBSECTION_OPTIONS[catName]) {
      return parseTag(item.description).text
    }
    return item.description || ''
  }

  function displaySubTag(item: MenuItem, catName: string): string | null {
    if (!SUBSECTION_OPTIONS[catName]) return null
    return parseTag(item.description).tag
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1
          className="text-2xl font-semibold"
          style={{
            fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
            color: '#2D4A35',
          }}
        >
          Menu
        </h1>
        {!loading && categories.length > 0 && (
          <button
            onClick={openAddModal}
            className="px-4 py-2 rounded-md text-sm font-medium text-white"
            style={{ backgroundColor: '#2D4A35' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#C9A96E')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2D4A35')}
          >
            + Ajouter un plat
          </button>
        )}
      </div>

      {/* Feedback */}
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

      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-4 py-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: '#9ca3af' }}>Chargement du menu...</p>
        </div>
      )}

      {!loading && categories.length > 0 && (
        <>
          {/* Category tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(i)}
                className="px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: activeTab === i ? '#2D4A35' : 'white',
                  color: activeTab === i ? 'white' : '#374151',
                  border: activeTab === i ? '1px solid #2D4A35' : '1px solid #e5e7eb',
                }}
              >
                {cat.name}
                <span
                  className="ml-1.5 px-1.5 py-0.5 rounded text-xs"
                  style={{
                    backgroundColor: activeTab === i ? 'rgba(255,255,255,0.2)' : '#f3f4f6',
                    color: activeTab === i ? 'white' : '#6b7280',
                  }}
                >
                  {cat.items.length}
                </span>
              </button>
            ))}
          </div>

          {/* Items list */}
          {activeCat && activeCat.items.length === 0 && (
            <div className="bg-white rounded-lg shadow-sm border p-12 text-center" style={{ borderColor: '#e5e7eb' }}>
              <p
                className="text-lg mb-2"
                style={{
                  fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
                  color: '#2D4A35',
                }}
              >
                Aucun plat dans cette catégorie
              </p>
              <p className="text-sm" style={{ color: '#9ca3af' }}>
                Cliquez sur &quot;Ajouter un plat&quot; pour commencer.
              </p>
            </div>
          )}

          {activeCat && activeCat.items.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden" style={{ borderColor: '#e5e7eb' }}>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr style={{ backgroundColor: '#f9fafb' }}>
                      <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Nom</th>
                      {hasSubOptions && (
                        <th className="text-left px-4 py-3 font-medium hidden sm:table-cell" style={{ color: '#6b7280' }}>Sous-section</th>
                      )}
                      <th className="text-left px-4 py-3 font-medium hidden md:table-cell" style={{ color: '#6b7280' }}>Description</th>
                      <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Prix</th>
                      <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Badge</th>
                      <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Visible</th>
                      <th className="text-left px-4 py-3 font-medium" style={{ color: '#6b7280' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeCat.items.map((item) => {
                      const desc = displayDesc(item, activeCatName)
                      const subTag = displaySubTag(item, activeCatName)
                      return (
                        <tr key={item.id} className="border-t" style={{ borderColor: '#f3f4f6' }}>
                          <td className="px-4 py-3 font-medium" style={{ color: '#111827' }}>
                            {item.name}
                          </td>
                          {hasSubOptions && (
                            <td className="px-4 py-3 hidden sm:table-cell">
                              {subTag ? (
                                <span
                                  className="text-xs px-1.5 py-0.5 rounded"
                                  style={{ backgroundColor: '#f3f4f6', color: '#6b7280' }}
                                >
                                  {subTag}
                                </span>
                              ) : (
                                <span style={{ color: '#d1d5db' }}>—</span>
                              )}
                            </td>
                          )}
                          <td className="px-4 py-3 hidden md:table-cell max-w-xs truncate" style={{ color: '#6b7280' }}>
                            {desc || '—'}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap" style={{ color: '#374151' }}>
                            {item.price || '—'}
                          </td>
                          <td className="px-4 py-3">
                            {item.badge ? (
                              <span
                                className="inline-block px-2 py-0.5 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: item.badge === 'CHEF' ? '#2D4A35' : '#C9A96E',
                                  color: 'white',
                                }}
                              >
                                {BADGE_LABELS[item.badge]}
                              </span>
                            ) : (
                              <span style={{ color: '#9ca3af' }}>—</span>
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handleToggleVisible(item)}
                              disabled={togglingId === item.id}
                              className="relative inline-flex h-5 w-9 shrink-0 rounded-full transition-colors duration-200 disabled:opacity-50"
                              style={{ backgroundColor: item.isVisible ? '#2D4A35' : '#d1d5db' }}
                            >
                              <span
                                className="inline-block h-3.5 w-3.5 rounded-full bg-white shadow-sm transition-transform duration-200"
                                style={{
                                  transform: item.isVisible ? 'translate(16px, 3px)' : 'translate(3px, 3px)',
                                }}
                              />
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openEditModal(item)}
                                className="px-2.5 py-1 rounded text-xs font-medium"
                                style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
                              >
                                Modifier
                              </button>
                              {confirmDeleteId === item.id ? (
                                <div className="flex gap-1">
                                  <button
                                    onClick={() => handleDelete(item.id)}
                                    disabled={deletingId === item.id}
                                    className="px-2.5 py-1 rounded text-xs font-medium text-white disabled:opacity-50"
                                    style={{ backgroundColor: '#dc2626' }}
                                  >
                                    {deletingId === item.id ? '...' : 'Oui'}
                                  </button>
                                  <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="px-2.5 py-1 rounded text-xs font-medium"
                                    style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
                                  >
                                    Non
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDeleteId(item.id)}
                                  className="px-2.5 py-1 rounded text-xs font-medium"
                                  style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
                                >
                                  Supprimer
                                </button>
                              )}
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
        </>
      )}

      {/* Modal ajout/modification */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}>
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2
              className="text-xl font-semibold mb-5"
              style={{
                fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
                color: '#2D4A35',
              }}
            >
              {editingItem ? 'Modifier le plat' : 'Ajouter un plat'}
            </h2>

            <div className="space-y-4">
              {/* Nom */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2D4A35' }}>
                  Nom *
                </label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                  onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                  placeholder="Nom du plat"
                />
              </div>

              {/* Catégorie */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2D4A35' }}>
                  Catégorie
                </label>
                <select
                  value={formCategoryId}
                  onChange={(e) => {
                    const newId = Number(e.target.value)
                    setFormCategoryId(newId)
                    // Reset sub-tag when switching category
                    setFormSubTag('')
                  }}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Sous-section (dynamic per category) */}
              {getSubOptionsForCategory(formCategoryId).length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#2D4A35' }}>
                    Sous-section
                  </label>
                  <select
                    value={formSubTag}
                    onChange={(e) => setFormSubTag(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#d1d5db' }}
                  >
                    <option value="">Aucune</option>
                    {getSubOptionsForCategory(formCategoryId).map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Description */}
              <div>
                <div className="flex justify-between items-baseline mb-1">
                  <label className="text-sm font-medium" style={{ color: '#2D4A35' }}>
                    Description
                  </label>
                  <span className="text-xs" style={{ color: formDesc.length > 200 ? '#991b1b' : '#9ca3af' }}>
                    {formDesc.length}/200
                  </span>
                </div>
                <textarea
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  maxLength={200}
                  rows={2}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 resize-none"
                  style={{ borderColor: '#d1d5db' }}
                  onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                  placeholder="Description du plat"
                />
              </div>

              {/* Prix */}
              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: '#2D4A35' }}>
                  Prix
                </label>
                <input
                  type="text"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: '#d1d5db' }}
                  onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
                  onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
                  placeholder="Ex: 1 800 DA"
                />
              </div>

              {/* Badge + Visible */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#2D4A35' }}>
                    Badge
                  </label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value as typeof formBadge)}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: '#d1d5db' }}
                  >
                    <option value="">Aucun</option>
                    <option value="NOUVEAU">Nouveau</option>
                    <option value="CHEF">Chef&apos;s choice</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: '#2D4A35' }}>
                    Visible
                  </label>
                  <button
                    type="button"
                    onClick={() => setFormVisible(!formVisible)}
                    className="mt-1 relative inline-flex h-7 w-12 shrink-0 rounded-full transition-colors duration-200"
                    style={{ backgroundColor: formVisible ? '#2D4A35' : '#d1d5db' }}
                  >
                    <span
                      className="inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200"
                      style={{
                        transform: formVisible ? 'translate(22px, 4px)' : 'translate(4px, 4px)',
                      }}
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleSave}
                disabled={saving || !formName.trim()}
                className="px-5 py-2 rounded-md text-sm font-medium text-white transition-opacity disabled:opacity-50"
                style={{ backgroundColor: '#2D4A35' }}
              >
                {saving ? 'Enregistrement...' : editingItem ? 'Modifier' : 'Ajouter'}
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-md text-sm font-medium"
                style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
