import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) return setError(error.message)
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 safe-top">
      {/* Top visual area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="w-16 h-16 rounded-3xl bg-sage-300/20 flex items-center justify-center mb-6">
          <span className="text-3xl">🌿</span>
        </div>
        <h1 className="text-2xl font-semibold text-stone-800 tracking-tight text-center">Welcome back</h1>
        <p className="text-stone-400 text-sm mt-1 text-center">Continue your journey to peace</p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm mt-10 flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <div>
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Link to="/forgot-password" className="text-xs text-stone-400 text-right block mt-1.5 pr-1">
              Forgot password?
            </Link>
          </div>
          {error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          )}
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>

      {/* Bottom link */}
      <div className="px-6 pb-10 text-center safe-bottom">
        <p className="text-sm text-stone-400">
          New here?{' '}
          <Link to="/signup" className="text-sage-500 font-semibold">
            Create a free account
          </Link>
        </p>
      </div>
    </div>
  )
}
