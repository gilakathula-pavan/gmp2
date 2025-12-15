import React, { createContext, useState } from 'react'
import { getStudent } from '../services/student'

export const AuthContext = createContext(null)

export function AuthProvider({children}){
  const [user, setUserState] = useState(getStudent())
  const [isAuthenticated, setIsAuthenticated] = useState(true)

  const login = async (payload) => {
    setUserState(payload || getStudent())
    setIsAuthenticated(true)
  }

  const logout = () => {
    setUserState(null)
    setIsAuthenticated(false)
  }

  const updateUser = (patch) => {
    setUserState(prev => ({ ...prev, ...(typeof patch === 'function' ? patch(prev) : patch) }))
  }

  const updateProfile = (patch) => {
    setUserState(prev => ({
      ...prev,
      profile: { ...(prev?.profile || {}), ...(typeof patch === 'function' ? patch(prev?.profile || {}) : patch) }
    }))
  }

  const pushToProfileArray = (key, item) => {
    setUserState(prev => ({
      ...prev,
      profile: {
        ...(prev?.profile || {}),
        [key]: [ ...(prev?.profile?.[key] || []), item ]
      }
    }))
  }

  const removeFromProfileArray = (key, predicate) => {
    setUserState(prev => ({
      ...prev,
      profile: {
        ...(prev?.profile || {}),
        [key]: (prev?.profile?.[key] || []).filter(i => !predicate(i))
      }
    }))
  }

  return (
    <AuthContext.Provider value={{
      user,
      setUser: updateUser,
      isAuthenticated,
      login,
      logout,
      updateProfile,
      pushToProfileArray,
      removeFromProfileArray
    }}>
      {children}
    </AuthContext.Provider>
  )
}
