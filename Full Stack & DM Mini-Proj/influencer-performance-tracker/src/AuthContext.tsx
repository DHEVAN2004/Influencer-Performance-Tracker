import { createContext, useContext, useState, type ReactNode } from 'react'

interface AuthUser { name: string; email: string; profilePhoto?: string }
interface AuthContextType {
  user: AuthUser | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateProfile: (updates: Partial<AuthUser>) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

const BASE_URL = import.meta.env.VITE_API_BASE_URL as string | undefined
const USE_BACKEND_AUTH = false

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem('auth_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const [token, setToken] = useState<string | null>(() => {
    try {
      return localStorage.getItem('auth_token')
    } catch {
      return null
    }
  })

  const login = async (email: string, password: string) => {
    if (USE_BACKEND_AUTH && BASE_URL) {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const err = await res.text()
        throw new Error(err || 'Login failed')
      }

      const data = await res.json() as { token: string; name: string; email: string }

      const authUser = { name: data.name, email: data.email }
      localStorage.setItem('auth_user', JSON.stringify(authUser))
      localStorage.setItem('auth_token', data.token)
      setUser(authUser)
      setToken(data.token)
    } else {
      // Mock login
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API delay

      if (email === 'mahaadhevans04@gmail.com' && password === '123456') {
        const authUser = { name: 'Mahaa Dhevans', email }
        const mockToken = 'mock-jwt-token-' + Date.now()

        localStorage.setItem('auth_user', JSON.stringify(authUser))
        localStorage.setItem('auth_token', mockToken)
        setUser(authUser)
        setToken(mockToken)
      } else {
        throw new Error('Invalid email or password')
      }
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_user')
    localStorage.removeItem('auth_token')
    setUser(null)
    setToken(null)
  }

  const updateProfile = (updates: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      localStorage.setItem('auth_user', JSON.stringify(updated))
      return updated
    })
  }

  return <AuthContext.Provider value={{ user, token, login, logout, updateProfile }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
