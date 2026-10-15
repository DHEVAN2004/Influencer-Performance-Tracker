import { useState } from 'react'
import { useAuth } from './AuthContext.tsx'
import { useNavigate } from 'react-router-dom'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('mahaadhevans04@gmail.com')
  const [password, setPassword] = useState('123456')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Email is required.')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError('Enter a valid email.')
    if (!password.trim()) return setError('Password is required.')
    if (password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-slate-950 p-4">
      <div className="w-full max-w-sm bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <div className="w-12 h-12 rounded-xl bg-sky-600 text-white font-bold flex items-center justify-center text-xl mx-auto mb-3">I</div>
          <h1 className="text-2xl font-extrabold text-slate-800 dark:text-slate-100">Sign in to buzzd</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Influencer Performance Tracker</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 dark:bg-rose-950/50 px-3 py-2 text-sm text-rose-700 dark:text-rose-300">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-sky-500 py-2 text-sm font-semibold text-white hover:bg-sky-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p className="text-center text-xs text-slate-400">Demo: use any valid email + 6+ char password</p>
      </div>
    </div>
  )
}
