'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Erreur de connexion')
        return
      }

      router.push('/admin/dashboard')
    } catch {
      setError('Erreur serveur — veuillez réessayer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: '#F9F6F0' }}>
      <div className="w-full max-w-sm">
        <h1
          className="text-3xl font-semibold text-center mb-8"
          style={{ fontFamily: 'var(--font-cormorant), Cormorant Garamond, serif', color: '#2D4A35' }}
        >
          La Belle Assiette
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-8 space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1.5" style={{ color: '#2D4A35' }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
              onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              placeholder="admin@labelleassiette.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-1.5" style={{ color: '#2D4A35' }}>
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: '#d1d5db' }}
              onFocus={(e) => (e.target.style.borderColor = '#C9A96E')}
              onBlur={(e) => (e.target.style.borderColor = '#d1d5db')}
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-md text-sm font-medium text-white transition-opacity disabled:opacity-50"
            style={{ backgroundColor: '#2D4A35' }}
            onMouseEnter={(e) => { if (!loading) e.currentTarget.style.backgroundColor = '#C9A96E' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#2D4A35' }}
          >
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </div>
    </div>
  )
}
