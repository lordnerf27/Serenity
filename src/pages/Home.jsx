import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import PWAInstallBanner from '../components/ui/PWAInstallBanner'
import { Wind, Moon, Sparkles, ChevronRight, Flame } from 'lucide-react'
import { dailyQuotes } from '../data/content'

const sections = [
  {
    to: '/meditate',
    icon: Sparkles,
    bg: 'bg-violet-50',
    iconColor: 'text-violet-400',
    title: 'Guided Meditation',
    subtitle: 'Find your calm',
    count: '6 themes',
  },
  {
    to: '/breathe',
    icon: Wind,
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-400',
    title: 'Breathing',
    subtitle: 'Reset with your breath',
    count: '3 techniques',
  },
  {
    to: '/sleep',
    icon: Moon,
    bg: 'bg-indigo-50',
    iconColor: 'text-indigo-400',
    title: 'Sleep Sounds',
    subtitle: 'Drift off peacefully',
    count: '8 sounds',
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
  const quote = dailyQuotes[new Date().getDay() % dailyQuotes.length]

  return (
    <div className="px-5 pb-8 safe-top">
      {/* Header */}
      <div className="pt-14 mb-8 flex items-start justify-between">
        <div>
          <p className="text-stone-400 text-sm">{greeting()},</p>
          <h1 className="text-2xl font-semibold text-stone-800 tracking-tight capitalize mt-0.5">{name} 👋</h1>
        </div>
        <div className="w-10 h-10 rounded-full bg-sage-300/30 flex items-center justify-center mt-1">
          <Flame size={18} className="text-sage-500" strokeWidth={1.5} />
        </div>
      </div>

      {/* Daily quote */}
      <div className="mb-8 bg-gradient-to-br from-sage-300/15 to-mist-300/15 rounded-3xl p-5 border border-sage-300/20">
        <p className="text-[10px] font-semibold text-sage-500 tracking-widest uppercase mb-2">Daily Reflection</p>
        <p className="text-stone-600 text-sm italic leading-relaxed">"{quote.text}"</p>
        <p className="text-stone-400 text-xs mt-2">— {quote.author}</p>
      </div>

      {/* Section title */}
      <p className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase mb-3">
        What would you like to do?
      </p>

      {/* Main sections */}
      <div className="flex flex-col gap-3 mb-8">
        {sections.map(({ to, icon: Icon, bg, iconColor, title, subtitle, count }) => (
          <Card key={to} onClick={() => navigate(to)} className="flex items-center gap-4 py-4">
            <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center flex-shrink-0`}>
              <Icon size={22} className={iconColor} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-stone-800 text-sm">{title}</p>
              <p className="text-stone-400 text-xs mt-0.5">{subtitle}</p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-[10px] text-stone-300 font-medium">{count}</span>
              <ChevronRight size={16} className="text-stone-300" />
            </div>
          </Card>
        ))}
      </div>

      {/* Continue where you left off */}
      <p className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase mb-3">
        Continue where you left off
      </p>
      <Card className="flex items-center gap-4 py-4 opacity-40">
        <div className="w-12 h-12 rounded-2xl bg-cream-200 flex items-center justify-center flex-shrink-0">
          <Sparkles size={20} className="text-stone-400" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <p className="font-medium text-stone-600 text-sm">No recent sessions yet</p>
          <p className="text-stone-400 text-xs mt-0.5">Your history will appear here</p>
        </div>
      </Card>

      <PWAInstallBanner />
    </div>
  )
}
