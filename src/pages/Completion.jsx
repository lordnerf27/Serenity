import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { Flame, Home, RotateCcw } from 'lucide-react'

function formatDuration(seconds) {
  if (!seconds) return '0 min'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  if (m === 0) return `${s}s`
  if (s === 0) return `${m} min`
  return `${m}m ${s}s`
}

const messages = [
  'Every breath is a step forward.',
  'You showed up. That\'s everything.',
  'Small steps, big changes.',
  'Peace lives in the practice.',
  'You did something good for yourself today.',
  'The mind you trained today is calmer than yesterday.',
]

export default function Completion() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  // If navigated to directly without state, go home
  if (!state) return <Navigate to="/" replace />

  const { title, emoji, gradient, durationSeconds, streak } = state
  const message = messages[Math.floor(Math.random() * messages.length)]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient ?? 'from-sage-300/20 to-mist-300/20'} flex flex-col items-center justify-between px-6 py-16 safe-top`}>
      {/* Top celebration */}
      <div className="flex flex-col items-center text-center">
        <div className="text-6xl mb-6">{emoji ?? '🌿'}</div>
        <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Session complete</h1>
        <p className="text-stone-500 text-sm mt-2">{title}</p>
      </div>

      {/* Stats */}
      <div className="flex flex-col items-center gap-6 w-full">
        {/* Time */}
        <div className="bg-white/60 backdrop-blur rounded-3xl px-8 py-5 text-center w-full max-w-xs shadow-soft">
          <p className="text-3xl font-semibold text-stone-800 tabular-nums">
            {formatDuration(durationSeconds)}
          </p>
          <p className="text-stone-400 text-xs mt-1">Time practised</p>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur rounded-3xl px-6 py-4 w-full max-w-xs shadow-soft">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 flex items-center justify-center">
              <Flame size={20} className="text-orange-400" />
            </div>
            <div>
              <p className="text-stone-800 font-semibold text-sm">
                {streak} day{streak !== 1 ? 's' : ''} in a row
              </p>
              <p className="text-stone-400 text-xs">Keep it going</p>
            </div>
          </div>
        )}

        {/* Inspirational message */}
        <p className="text-stone-500 text-sm italic text-center px-4">"{message}"</p>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={() => navigate('/')}
          className="w-full bg-sage-400 text-white rounded-2xl py-3.5 font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform shadow-soft"
        >
          <Home size={16} />
          Back to home
        </button>
        <button
          onClick={() => navigate(-2)}
          className="w-full bg-white/60 backdrop-blur text-stone-600 rounded-2xl py-3.5 font-medium text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
        >
          <RotateCcw size={16} />
          Meditate again
        </button>
      </div>
    </div>
  )
}
