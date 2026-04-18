import Card from '../components/ui/Card'
import { Lock } from 'lucide-react'

const themes = [
  {
    id: 'calm',
    emoji: '🌊',
    title: 'Deep Calm',
    subtitle: 'Release tension and find stillness',
    color: 'from-blue-100 to-sage-300/30',
    tracks: 6,
  },
  {
    id: 'focus',
    emoji: '🎯',
    title: 'Sharp Focus',
    subtitle: 'Clear your mind, sharpen attention',
    color: 'from-mist-300/30 to-cream-200',
    tracks: 5,
  },
  {
    id: 'sleep',
    emoji: '🌙',
    title: 'Restful Sleep',
    subtitle: 'Wind down and drift into rest',
    color: 'from-indigo-100 to-mist-300/20',
    tracks: 7,
  },
  {
    id: 'anxiety',
    emoji: '🍃',
    title: 'Ease Anxiety',
    subtitle: 'Let go of worry and breathe easy',
    color: 'from-sage-300/30 to-green-50',
    tracks: 5,
  },
  {
    id: 'morning',
    emoji: '☀️',
    title: 'Morning Start',
    subtitle: 'Begin your day with intention',
    color: 'from-amber-50 to-cream-200',
    tracks: 4,
  },
  {
    id: 'selfcompassion',
    emoji: '🌸',
    title: 'Self-Compassion',
    subtitle: 'Be kind to yourself',
    color: 'from-rose-50 to-mist-300/20',
    tracks: 4,
  },
]

export default function Meditate() {
  return (
    <div className="px-5 pt-14 pb-6 safe-top">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Meditate</h1>
        <p className="text-stone-400 text-sm mt-1">Choose a theme to begin</p>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {themes.map((theme) => (
          <Card
            key={theme.id}
            onClick={() => {}}
            className={`bg-gradient-to-br ${theme.color} border-0 relative overflow-hidden`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl">{theme.emoji}</span>
              <div className="flex-1">
                <p className="font-semibold text-stone-800 text-sm">{theme.title}</p>
                <p className="text-stone-500 text-xs mt-0.5">{theme.subtitle}</p>
                <p className="text-stone-400 text-[10px] mt-1">{theme.tracks} sessions</p>
              </div>
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white/60">
                <Lock size={13} className="text-stone-400" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-stone-300 mt-6">
        Audio content coming soon ✦
      </p>
    </div>
  )
}
