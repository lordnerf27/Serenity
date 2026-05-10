import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('Passwords do not match')
    if (password.length < 6) return setError('Password must be at least 6 characters')
    setLoading(true)
    const { error } = await signUp(email, password)
    setLoading(false)
    if (error) return setError(error.message)
    navigate('/onboarding')
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 safe-top">
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-16 pb-8">
        <div className="w-16 h-16 rounded-3xl bg-sage-300/20 flex items-center justify-center mb-6">
          <span className="text-3xl">🎧</span>
        </div>
        <h1 className="text-2xl font-semibold text-stone-800 tracking-tight text-center">Begin your journey</h1>
        <p className="text-stone-400 text-sm mt-1 text-center">Free forever. No credit card needed.</p>

        <form onSubmit={handleSubmit} className="w-full max-w-sm mt-10 flex flex-col gap-4">
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
            placeholder="At least 6 characters"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Input
            label="Confirm Password"
            type="password"
            placeholder="••••••••"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
          {error && (
            <div className="bg-red-900/20 border border-red-800/30 rounded-2xl px-4 py-3">
              <p className="text-sm text-red-400 text-center">{error}</p>
            </div>
          )}
          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? 'Creating account…' : 'Get started — it\'s free'}
          </Button>
        </form>
      </div>

      <div className="px-6 pb-10 text-center safe-bottom">
        <p className="text-sm text-stone-400">
          Already have an account?{' '}
          <Link to="/login" className="text-sage-500 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
