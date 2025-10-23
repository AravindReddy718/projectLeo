import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import AppRouter from './router'
import './App.css'
import Navigation from './components/common/Navigation'
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <AppRouter />
      </BrowserRouter>
    </AuthProvider>
  )
}
export default App