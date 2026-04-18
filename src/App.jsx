import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import AppShell from './components/layout/AppShell'
import Home from './pages/Home'
import Meditate from './pages/Meditate'
import Breathe from './pages/Breathe'
import Sleep from './pages/Sleep'
import Progress from './pages/Progress'
import Login from './pages/Login'
import Signup from './pages/Signup'

function PrivateRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 rounded-full border-2 border-sage-300 border-t-sage-500 animate-spin" />
    </div>
  )
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  return user ? <Navigate to="/" replace /> : children
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public auth routes */}
          <Route path="/login"  element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

          {/* Protected app routes */}
          <Route element={<PrivateRoute><AppShell /></PrivateRoute>}>
            <Route path="/"         element={<Home />} />
            <Route path="/meditate" element={<Meditate />} />
            <Route path="/breathe"  element={<Breathe />} />
            <Route path="/sleep"    element={<Sleep />} />
            <Route path="/progress" element={<Progress />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
