import React, { createContext, useState, useContext } from 'react'
import authService from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials)
      if (result.success && result.user) {
        // Ensure user object has all required fields
        const userData = {
          id: result.user.id || result.user._id,
          _id: result.user._id || result.user.id,
          username: result.user.username,
          email: result.user.email,
          role: result.user.role,
          profile: result.user.profile
        }
        setUser(userData)
        console.log('User set in AuthContext:', userData)
        return { success: true, user: userData }
      }
      return { success: false }
    } catch (error) {
      console.error('Login error in AuthContext:', error)
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
  }

  // Check if user exists in localStorage on app start and validate token
  React.useEffect(() => {
    const checkAuth = async () => {
      try {
        const storedUserData = authService.getCurrentUser()
        
        if (storedUserData && storedUserData.token) {
          // Validate token with backend before restoring user state
          try {
            const validation = await authService.validateToken()
            
            if (validation.valid && validation.user) {
              // Token is valid, restore user
              const userData = validation.user
              const normalizedUser = {
                id: userData.id || userData._id,
                _id: userData._id || userData.id,
                username: userData.username,
                email: userData.email,
                role: userData.role,
                profile: userData.profile
              }
              setUser(normalizedUser)
              console.log('✅ Valid token - User restored:', normalizedUser)
            } else {
              // Token is invalid or expired - clear it
              console.log('❌ Invalid/expired token - Clearing auth data')
              authService.logout()
              setUser(null)
            }
          } catch (validationError) {
            // Network error or backend unavailable
            // For security, don't restore user if we can't validate
            console.warn('⚠️ Could not validate token (backend may be unavailable):', validationError.message)
            // Clear token to force re-authentication
            authService.logout()
            setUser(null)
          }
        } else {
          // No stored data or no token
          console.log('ℹ️ No stored authentication data')
          setUser(null)
        }
      } catch (error) {
        console.error('Error checking authentication:', error)
        // On error, clear auth and set user to null for safety
        authService.logout()
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
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