import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'
import { saveToken, getToken, clearToken } from '../lib/auth'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const existing = getToken()
    if (!existing) {
      setLoading(false)
      return
    }

    api.get('/api/auth/me', existing)
      .then(data => {
        if (data && data.id) {
          setUser(data)
          setToken(existing)
        } else {
          clearToken()
        }
      })
      .catch(() => {
        clearToken()
      })
      .finally(() => setLoading(false))
  }, [])

  function login(newToken, userData) {
    saveToken(newToken)
    setToken(newToken)
    setUser(userData)
  }

  function logout() {
    clearToken()
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
