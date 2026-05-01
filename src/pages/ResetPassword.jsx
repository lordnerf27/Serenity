import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { CheckCircle } from 'lucide-react'

/**
 * ResetPassword
 * Supabase sends users here after they click the password-reset email link.
 * Handles both PKCE flow (?code= query param) and implicit flow (#access_token= hash).
 */
export default function ResetPassword() {
  const navigate = useNavigate()
  const [ready, setReady]         = useState(false)
  const [password, setPassword]   = useState('')
  const [confirm, setConfirm]     = useState('')
  const [loading, setLoading]     = useState(false)
  const [done, setDone]           = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    if (!supabase) return

    // Handle PKCE flow: if there's a code query param, exchange it first
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (!error) setReady(true)
        else setError('Reset link expired or already used. Please request a new one.')
      })
    }

    // Handle implicit flow: token arrives as URL hash fragment
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true)
      }
    })

    // Fallback: if the session was already established before mount
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && !code) setReady(true)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirm) return setError('Passwords do not match')
    if (password.length < 6)  return setError('Password must be at least 6 characters')
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) return setError(error.message)
    setDone(true)
    setTimeout(() => navigate('/'), 2500)
  }

  if (done) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-cream-50 px-6 gap-5 safe-top">
      <div className="w-16 h-16 rounded-3xl bg-sage-300/20 flex items-center justify-center">
        <CheckCircle size={32} className="text-sage-500" strokeWidth={1.5} />
      </div>
      <h1 className="text-xl font-semibold text-stone-800 text-center">Password updated</h1>
      <p className="text-stone-400 text-sm text-center">Taking you back to the app…</p>
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 safe-top px-6">
      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
        <div className="mb-10 text-center">
          <div className="w-16 h-16 rounded-3xl bg-sage-300/20 flex items-center justify-center mb-6 mx-auto">
            <span className="text-3xl">🌿</span>
          </div>
          <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Choose a new password</h1>
          <p className="text-stone-400 text-sm mt-1">Make it something you'll remember</p>
        </div>

        {!ready && error ? (
          <div className="flex flex-col items-center text-center gap-4 py-8">
            <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 w-full">
              <p className="text-sm text-red-400">{error}</p>
            </div>
            <a href="/forgot-password" className="text-sage-500 font-semibold text-sm">
              Request a new reset link
            </a>
          </div>
        ) : !ready ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <div className="w-6 h-6 rounded-full border-2 border-stone-200 border-t-stone-400 animate-spin" />
            <p className="text-stone-400 text-xs">Verifying reset link…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              label="New password"
              type="password"
              placeholder="At least 6 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <Input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
            />
            {error && (
              <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                <p className="text-sm text-red-400 text-center">{error}</p>
              </div>
            )}
            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? 'Saving…' : 'Set new password'}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}
