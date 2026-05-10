import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

const GOALS = [
  { id: 'stress',      emoji: '🍃', label: 'Reduce stress',      desc: 'Find calm in a busy life' },
  { id: 'sleep',       emoji: '🌙', label: 'Sleep better',       desc: 'Unwind and rest deeply' },
  { id: 'focus',       emoji: '🎯', label: 'Improve focus',      desc: 'Clear your mind for deep work' },
  { id: 'anxiety',     emoji: '💛', label: 'Ease anxiety',       desc: 'Feel grounded and safe' },
  { id: 'wellbeing',   emoji: '🌸', label: 'General wellbeing',  desc: 'Build a daily mindful habit' },
]

const EXPERIENCE = [
  { id: 'new',         label: 'I\'m brand new',         desc: 'Never meditated before' },
  { id: 'some',        label: 'Some experience',        desc: 'I\'ve tried it a few times' },
  { id: 'regular',     label: 'I meditate regularly',   desc: 'It\'s already part of my routine' },
]

export default function Onboarding() {
  const navigate   = useNavigate()
  const [step, setStep]         = useState(0) // 0 = welcome, 1 = goal, 2 = experience
  const [goal, setGoal]         = useState(null)
  const [experience, setExperience] = useState(null)

  const finish = () => {
    // Persist selections to localStorage so we don't show onboarding again
    localStorage.setItem('serenity_onboarded', '1')
    if (goal)       localStorage.setItem('serenity_goal', goal)
    if (experience) localStorage.setItem('serenity_experience', experience)
    navigate('/', { replace: true })
  }

  if (step === 0) return (
    <div className="min-h-screen bg-gradient-to-br from-sage-300/10 to-mist-300/10 flex flex-col items-center justify-between px-6 py-16 safe-top">
      <div />
      <div className="flex flex-col items-center text-center gap-5">
        <div className="text-6xl">🎧</div>
        <h1 className="text-3xl font-semibold text-stone-800 tracking-tight leading-tight">
          Welcome to<br />Serenity
        </h1>
        <p className="text-stone-400 text-sm leading-relaxed max-w-xs">
          A quiet space for your mind. Lo-fi meditation to help you find calm, sleep better, and build a practice that fits your life.
        </p>
      </div>
      <button
        onClick={() => setStep(1)}
        className="w-full max-w-xs bg-sage-400 text-white rounded-2xl py-4 font-medium text-sm flex items-center justify-center gap-2 shadow-soft active:scale-[0.98] transition-transform"
      >
        Get started <ChevronRight size={16} />
      </button>
    </div>
  )

  if (step === 1) return (
    <div className="min-h-screen bg-cream-50 flex flex-col px-6 py-14 safe-top">
      <div className="mb-2">
        <p className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase">1 of 2</p>
        <h1 className="text-xl font-semibold text-stone-800 mt-2 tracking-tight">What brings you here?</h1>
        <p className="text-stone-400 text-sm mt-1">We'll personalise your experience around your goal.</p>
      </div>

      <div className="flex flex-col gap-3 mt-8 flex-1">
        {GOALS.map(g => (
          <button
            key={g.id}
            onClick={() => setGoal(g.id)}
            className={`w-full rounded-3xl p-4 text-left flex items-center gap-4 transition-all active:scale-[0.98] shadow-soft
              ${goal === g.id ? 'bg-sage-400' : 'bg-cream-100'}`}
          >
            <span className="text-2xl flex-shrink-0">{g.emoji}</span>
            <div className="flex-1">
              <p className={`font-semibold text-sm ${goal === g.id ? 'text-white' : 'text-stone-800'}`}>{g.label}</p>
              <p className={`text-xs mt-0.5 ${goal === g.id ? 'text-white/70' : 'text-stone-400'}`}>{g.desc}</p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={() => goal && setStep(2)}
        disabled={!goal}
        className="mt-6 w-full bg-stone-800 text-cream-50 rounded-2xl py-4 font-medium text-sm disabled:opacity-30 active:scale-[0.98] transition-all"
      >
        Continue
      </button>
    </div>
  )

  return (
    <div className="min-h-screen bg-cream-50 flex flex-col px-6 py-14 safe-top">
      <div className="mb-2">
        <p className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase">2 of 2</p>
        <h1 className="text-xl font-semibold text-stone-800 mt-2 tracking-tight">Your experience level?</h1>
        <p className="text-stone-400 text-sm mt-1">No right or wrong answer — just helps us guide you.</p>
      </div>

      <div className="flex flex-col gap-3 mt-8 flex-1">
        {EXPERIENCE.map(e => (
          <button
            key={e.id}
            onClick={() => setExperience(e.id)}
            className={`w-full rounded-3xl p-4 text-left transition-all active:scale-[0.98] shadow-soft
              ${experience === e.id ? 'bg-sage-400' : 'bg-cream-100'}`}
          >
            <p className={`font-semibold text-sm ${experience === e.id ? 'text-white' : 'text-stone-800'}`}>{e.label}</p>
            <p className={`text-xs mt-0.5 ${experience === e.id ? 'text-white/70' : 'text-stone-400'}`}>{e.desc}</p>
          </button>
        ))}
      </div>

      <button
        onClick={() => experience && finish()}
        disabled={!experience}
        className="mt-6 w-full bg-stone-800 text-cream-50 rounded-2xl py-4 font-medium text-sm disabled:opacity-30 active:scale-[0.98] transition-all"
      >
        Start my journey
      </button>
    </div>
  )
}
