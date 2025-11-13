import React, { createContext, useState, useContext } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials)
      if (result.success) {
        setUser(result.user)
        // Store in localStorage for persistence
        localStorage.setItem('hmc-user', JSON.stringify(result.user))
        return { success: true, user: result.user }
      }
      return { success: false }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  // Check if user exists in localStorage on app start
  React.useEffect(() => {
    const storedUserData = authService.getCurrentUser()
    if (storedUserData && storedUserData.user) {
      setUser(storedUserData.user)
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}