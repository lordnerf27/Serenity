import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import { Wind, Moon, Sparkles, ChevronRight } from 'lucide-react'

const sections = [
  {
    to: '/meditate',
    icon: Sparkles,
    color: 'bg-mist-300/40',
    iconColor: 'text-mist-400',
    title: 'Guided Meditation',
    subtitle: 'Find your calm',
  },
  {
    to: '/breathe',
    icon: Wind,
    color: 'bg-sage-300/30',
    iconColor: 'text-sage-500',
    title: 'Breathing',
    subtitle: 'Reset with your breath',
  },
  {
    to: '/sleep',
    icon: Moon,
    color: 'bg-cream-200',
    iconColor: 'text-stone-600',
    title: 'Sleep Sounds',
    subtitle: 'Drift off peacefully',
  },
]

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const name = user?.email?.split('@')[0] ?? 'there'

  return (
    <div className="px-5 pt-14 pb-6 safe-top">
      {/* Header */}
      <div className="mb-8">
        <p className="text-stone-400 text-sm">{greeting()},</p>
        <h1 className="text-2xl font-semibold text-stone-800 tracking-tight capitalize">{name} 👋</h1>
      </div>

      {/* Daily quote */}
      <Card className="mb-8 bg-gradient-to-br from-sage-300/20 to-mist-300/20 border border-sage-300/20">
        <p className="text-stone-600 text-sm italic leading-relaxed">
          "Almost everything will work again if you unplug it for a few minutes — including you."
        </p>
        <p className="text-stone-400 text-xs mt-2">— Anne Lamott</p>
      </Card>

      {/* Section title */}
      <h2 className="text-xs font-semibold text-stone-400 tracking-widest uppercase mb-3">
        What would you like to do?
      </h2>

      {/* Main sections */}
      <div className="flex flex-col gap-3">
        {sections.map(({ to, icon: Icon, color, iconColor, title, subtitle }) => (
          <Card key={to} onClick={() => navigate(to)} className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center flex-shrink-0`}>
              <Icon size={22} className={iconColor} strokeWidth={1.5} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-stone-800 text-sm">{title}</p>
              <p className="text-stone-400 text-xs mt-0.5">{subtitle}</p>
            </div>
            <ChevronRight size={16} className="text-stone-300" />
          </Card>
        ))}
      </div>

      {/* Continue where you left off */}
      <h2 className="text-xs font-semibold text-stone-400 tracking-widest uppercase mt-8 mb-3">
        Continue where you left off
      </h2>
      <Card className="flex items-center gap-4 opacity-50">
        <div className="w-12 h-12 rounded-2xl bg-cream-200 flex items-center justify-center flex-shrink-0">
          <Sparkles size={20} className="text-stone-400" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-stone-600 text-sm">No recent sessions yet</p>
          <p className="text-stone-400 text-xs mt-0.5">Start meditating to track progress</p>
        </div>
      </Card>
    </div>
  )
}
