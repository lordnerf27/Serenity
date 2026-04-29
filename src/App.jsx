import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { supabase } from './lib/supabase'
import AppShell from './components/layout/AppShell'
import Home from './pages/Home'
import Meditate from './pages/Meditate'
import MeditateTheme from './pages/MeditateTheme'
import Breathe from './pages/Breathe'
import Sleep from './pages/Sleep'
import Progress from './pages/Progress'
import Player from './pages/Player'
import Login from './pages/Login'
import Signup from './pages/Signup'

const isConfigured = Boolean(supabase)

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 rounded-full border-2 border-sage-300 border-t-sage-500 animate-spin" />
    </div>
  )
  if (!isConfigured) return children
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!isConfigured) return children
  return user ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {!isConfigured && (
          <div className="bg-amber-50 text-amber-700 text-xs text-center py-1.5 px-4">
            Preview mode — Supabase not connected yet
          </div>
        )}
        <Routes>
          {/* Public auth routes */}
          <Route path="/login"  element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Full-screen player — outside AppShell so no bottom nav */}
          <Route path="/player/:themeId/:sessionId" element={<PrivateRoute><Player /></PrivateRoute>} />

          {/* Protected app routes with bottom nav */}
          <Route element={<PrivateRoute><AppShell /></PrivateRoute>}>
            <Route path="/"                      element={<Home />} />
            <Route path="/meditate"              element={<Meditate />} />
            <Route path="/meditate/:themeId"     element={<MeditateTheme />} />
            <Route path="/breathe"               element={<Breathe />} />
            <Route path="/sleep"                 element={<Sleep />} />
            <Route path="/progress"              element={<Progress />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
