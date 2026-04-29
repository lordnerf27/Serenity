import { useState, useEffect, useRef } from 'react'
import { Timer } from 'lucide-react'

const OPTIONS = [
  { label: '15m', seconds: 15 * 60 },
  { label: '30m', seconds: 30 * 60 },
  { label: '60m', seconds: 60 * 60 },
  { label: '90m', seconds: 90 * 60 },
]

function formatRemaining(seconds) {
  if (seconds <= 0) return 'Done'
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m === 0) return `${s}s`
  return s === 0 ? `${m}m` : `${m}m ${s}s`
}

/**
 * SleepTimer
 * Renders a timer button. When a duration is selected, counts down and
 * calls onExpire() when time runs out so the Player can stop the audio.
 */
export default function SleepTimer({ onExpire }) {
  const [open, setOpen]         = useState(false)
  const [remaining, setRemaining] = useState(null)
  const intervalRef             = useRef(null)

  const start = (seconds) => {
    clearInterval(intervalRef.current)
    setRemaining(seconds)
    setOpen(false)
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) {
          clearInterval(intervalRef.current)
          onExpire?.()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const cancel = () => {
    clearInterval(intervalRef.current)
    setRemaining(null)
  }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <div className="relative">
      <button
        onClick={() => remaining !== null ? cancel() : setOpen(o => !o)}
        className="flex items-center gap-1.5 text-stone-500 bg-white/50 rounded-2xl px-3 py-1.5 text-xs font-medium active:opacity-60"
      >
        <Timer size={13} />
        {remaining !== null ? formatRemaining(remaining) : 'Sleep timer'}
      </button>

      {open && (
        <div className="absolute bottom-10 right-0 bg-white rounded-2xl shadow-card overflow-hidden z-10">
          {OPTIONS.map(opt => (
            <button
              key={opt.label}
              onClick={() => start(opt.seconds)}
              className="block w-full px-5 py-3 text-sm text-stone-700 font-medium text-left hover:bg-cream-100 active:bg-cream-200 transition-colors"
            >
              Stop after {opt.label}
            </button>
          ))}
          <button
            onClick={() => setOpen(false)}
            className="block w-full px-5 py-3 text-sm text-stone-400 text-left border-t border-stone-100 active:bg-cream-100"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
