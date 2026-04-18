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
    <div className="min-h-full flex flex-col justify-between px-6 py-12 safe-top">
      <div>
        <div className="mb-12 text-center">
          <div className="text-4xl mb-3">🌿</div>
          <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Welcome back</h1>
          <p className="text-stone-400 text-sm mt-1">Continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="text-sm text-red-400 text-center bg-red-50 rounded-2xl py-2 px-4">{error}</p>
          )}
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>

      <p className="text-center text-sm text-stone-400 mt-8">
        New here?{' '}
        <Link to="/signup" className="text-sage-500 font-medium">
          Create an account
        </Link>
      </p>
    </div>
  )
}
