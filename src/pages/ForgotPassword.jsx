import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import { ArrowLeft, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail]     = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent]       = useState(false)
  const [error, setError]     = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) return setError(error.message)
    setSent(true)
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-50 safe-top px-6">
      <div className="pt-14 mb-8">
        <Link to="/login" className="flex items-center gap-1.5 text-stone-400 text-sm active:opacity-60">
          <ArrowLeft size={16} />
          Back to sign in
        </Link>
      </div>

      <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
        {sent ? (
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-3xl bg-sage-300/20 flex items-center justify-center">
              <CheckCircle size={32} className="text-sage-500" strokeWidth={1.5} />
            </div>
            <h1 className="text-xl font-semibold text-stone-800">Check your inbox</h1>
            <p className="text-stone-400 text-sm leading-relaxed">
              We sent a password reset link to <span className="font-medium text-stone-600">{email}</span>.
              Check your spam folder if it doesn't appear within a minute.
            </p>
            <Link to="/login" className="mt-4 text-sage-500 font-semibold text-sm">
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-10 text-center">
              <div className="w-16 h-16 rounded-3xl bg-sage-300/20 flex items-center justify-center mb-6 mx-auto">
                <span className="text-3xl">🌿</span>
              </div>
              <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Reset password</h1>
              <p className="text-stone-400 text-sm mt-1">Enter your email and we'll send a reset link</p>
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
              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
                  <p className="text-sm text-red-400 text-center">{error}</p>
                </div>
              )}
              <Button type="submit" disabled={loading} className="mt-2">
                {loading ? 'Sending…' : 'Send reset link'}
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
