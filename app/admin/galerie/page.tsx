'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import Image from 'next/image'

interface GalleryImage {
  id: number
  url: string
  publicId: string | null
  alt: string | null
  isMain: boolean
  order: number
  createdAt: string
}

const MAX_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = ['image/jpeg', 'image/png']

export default function GaleriePage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Upload state
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Action states
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [settingMainId, setSettingMainId] = useState<number | null>(null)

  // Drag & drop reorder
  const [dragIdx, setDragIdx] = useState<number | null>(null)
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null)

  const fetchImages = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/galerie')
      if (!res.ok) throw new Error()
      setImages(await res.json())
      setError('')
    } catch {
      setError('Impossible de charger les images')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  function showFeedback(type: 'success' | 'error', message: string) {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3000)
  }

  function handleFileSelect(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      showFeedback('error', 'Format invalide. Seuls JPG et PNG sont acceptés.')
      return
    }
    if (file.size > MAX_SIZE) {
      showFeedback('error', 'Fichier trop volumineux. Maximum 5 Mo.')
      return
    }
    setSelectedFile(file)
    setPreview(URL.createObjectURL(file))
  }

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  function cancelSelection() {
    setSelectedFile(null)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  async function handleUpload() {
    if (!selectedFile) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)

      const res = await fetch('/api/admin/galerie', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()
      if (!res.ok) {
        showFeedback('error', data.error || 'Erreur upload')
        return
      }

      showFeedback('success', 'Image uploadée')
      cancelSelection()
      await fetchImages()
    } catch {
      showFeedback('error', 'Erreur serveur')
    } finally {
      setUploading(false)
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/admin/galerie/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json()
        showFeedback('error', data.error || 'Erreur')
        return
      }
      showFeedback('success', 'Image supprimée')
      setConfirmDeleteId(null)
      await fetchImages()
    } catch {
      showFeedback('error', 'Erreur serveur')
    } finally {
      setDeletingId(null)
    }
  }

  async function handleSetMain(id: number) {
    setSettingMainId(id)
    try {
      const res = await fetch(`/api/admin/galerie/${id}`, { method: 'PATCH' })
      if (!res.ok) {
        const data = await res.json()
        showFeedback('error', data.error || 'Erreur')
        return
      }
      showFeedback('success', 'Image principale définie')
      await fetchImages()
    } catch {
      showFeedback('error', 'Erreur serveur')
    } finally {
      setSettingMainId(null)
    }
  }

  function handleDragStart(idx: number) {
    setDragIdx(idx)
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault()
    if (dragIdx === null || dragIdx === idx) return
    setDragOverIdx(idx)
  }

  async function handleDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) {
      setDragIdx(null)
      setDragOverIdx(null)
      return
    }

    const reordered = [...images]
    const [moved] = reordered.splice(dragIdx, 1)
    reordered.splice(targetIdx, 0, moved)

    // Optimistic update
    setImages(reordered)
    setDragIdx(null)
    setDragOverIdx(null)

    // Save to DB
    const payload = reordered.map((img, i) => ({ id: img.id, order: i }))
    try {
      const res = await fetch('/api/admin/galerie', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        showFeedback('error', 'Erreur sauvegarde ordre')
        await fetchImages()
      }
    } catch {
      showFeedback('error', 'Erreur serveur')
      await fetchImages()
    }
  }

  function handleDragEnd() {
    setDragIdx(null)
    setDragOverIdx(null)
  }

  return (
    <div>
      <h1
        className="text-2xl font-semibold mb-6"
        style={{
          fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
          color: '#2D4A35',
        }}
      >
        Galerie
      </h1>

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

      {/* Upload zone */}
      <div
        className="bg-white rounded-lg shadow-sm border p-6 mb-6"
        style={{ borderColor: '#e5e7eb' }}
      >
        {!selectedFile ? (
          <div
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors"
            style={{
              borderColor: dragOver ? '#C9A96E' : '#d1d5db',
              backgroundColor: dragOver ? '#fdf8f0' : 'transparent',
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-3" style={{ color: '#9ca3af' }}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            <p className="text-sm font-medium" style={{ color: '#374151' }}>
              Glissez une image ici ou cliquez pour sélectionner
            </p>
            <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>
              JPG ou PNG uniquement — 5 Mo max
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png"
              onChange={handleInputChange}
              className="hidden"
            />
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden shrink-0">
              {preview && (
                <Image
                  src={preview}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="128px"
                  unoptimized
                />
              )}
            </div>
            <div className="flex-1 text-sm" style={{ color: '#374151' }}>
              <p className="font-medium">{selectedFile.name}</p>
              <p style={{ color: '#9ca3af' }}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} Mo
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="px-4 py-2 rounded-md text-sm font-medium text-white disabled:opacity-50"
                style={{ backgroundColor: '#2D4A35' }}
              >
                {uploading ? 'Upload en cours...' : 'Uploader'}
              </button>
              <button
                onClick={cancelSelection}
                disabled={uploading}
                className="px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <p className="text-sm" style={{ color: '#9ca3af' }}>Chargement des images...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && images.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border p-12 text-center" style={{ borderColor: '#e5e7eb' }}>
          <p
            className="text-lg mb-2"
            style={{
              fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif',
              color: '#2D4A35',
            }}
          >
            Aucune photo dans la galerie
          </p>
          <p className="text-sm" style={{ color: '#9ca3af' }}>
            Uploadez votre première image ci-dessus.
          </p>
        </div>
      )}

      {/* Image grid */}
      {!loading && images.length > 1 && (
        <p className="text-xs mb-3" style={{ color: '#9ca3af' }}>
          Glissez les images pour réorganiser l&apos;ordre d&apos;affichage sur le site.
        </p>
      )}
      {!loading && images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((img, idx) => (
            <div
              key={img.id}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDrop={() => handleDrop(idx)}
              onDragEnd={handleDragEnd}
              className="relative rounded-lg overflow-hidden group"
              style={{
                border: dragOverIdx === idx ? '2px dashed #C9A96E' : img.isMain ? '3px solid #C9A96E' : '1px solid #e5e7eb',
                opacity: dragIdx === idx ? 0.4 : 1,
                cursor: 'grab',
              }}
            >
              <div className="relative aspect-square">
                <Image
                  src={img.url}
                  alt={img.alt || 'Photo galerie'}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>

              {/* Main badge */}
              {img.isMain && (
                <div
                  className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-medium text-white"
                  style={{ backgroundColor: '#C9A96E' }}
                >
                  Principale
                </div>
              )}

              {/* Actions overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-end justify-center gap-2 p-3 opacity-0 group-hover:opacity-100">
                {!img.isMain && (
                  <button
                    onClick={() => handleSetMain(img.id)}
                    disabled={settingMainId === img.id}
                    className="px-2.5 py-1.5 rounded text-xs font-medium text-white disabled:opacity-50"
                    style={{ backgroundColor: '#C9A96E' }}
                  >
                    {settingMainId === img.id ? '...' : 'Principale'}
                  </button>
                )}
                {confirmDeleteId === img.id ? (
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleDelete(img.id)}
                      disabled={deletingId === img.id}
                      className="px-2.5 py-1.5 rounded text-xs font-medium text-white disabled:opacity-50"
                      style={{ backgroundColor: '#dc2626' }}
                    >
                      {deletingId === img.id ? '...' : 'Oui'}
                    </button>
                    <button
                      onClick={() => setConfirmDeleteId(null)}
                      className="px-2.5 py-1.5 rounded text-xs font-medium bg-white/90"
                      style={{ color: '#374151' }}
                    >
                      Non
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDeleteId(img.id)}
                    className="px-2.5 py-1.5 rounded text-xs font-medium"
                    style={{ backgroundColor: '#fee2e2', color: '#991b1b' }}
                  >
                    Supprimer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
