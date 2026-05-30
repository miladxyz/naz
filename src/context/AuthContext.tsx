'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react'

interface User {
  id: string
  name: string
  email: string
  role: 'founder' | 'lawyer' | 'it_manager' | 'financial_manager' | 'client'
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  isStaff: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  logout: async () => {},
  isStaff: false,
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchMe = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me')
      // 401 = not logged in — expected, not an error
      if (res.status === 401) { setUser(null); setLoading(false); return }
      if (res.ok) {
        const data = await res.json()
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchMe() }, [fetchMe])

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch {
      return { success: false, error: 'خطا در ارتباط با سرور' }
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        setUser(data.user)
        return { success: true }
      }
      return { success: false, error: data.error }
    } catch {
      return { success: false, error: 'خطا در ارتباط با سرور' }
    }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    setUser(null)
  }

  const isStaff = !!user && ['founder', 'lawyer', 'it_manager', 'financial_manager'].includes(user.role)

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isStaff }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
