import React from 'react'
import { AuthProvider } from './contexts/AuthContext'
import AppRoutes from './router/AppRoutes'
import Chatbot from './components/ui/Chatbot'

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      <Chatbot />
    </AuthProvider>
  )
}

export default App
