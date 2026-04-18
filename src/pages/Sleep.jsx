import Card from '../components/ui/Card'
import { Lock } from 'lucide-react'

const sounds = [
  { id: 'rain',    emoji: '🌧️', title: 'Gentle Rain',      desc: 'Soft rainfall on leaves' },
  { id: 'ocean',   emoji: '🌊', title: 'Ocean Waves',      desc: 'Rhythmic shore sounds' },
  { id: 'forest',  emoji: '🌲', title: 'Forest Night',     desc: 'Crickets and rustling trees' },
  { id: 'fire',    emoji: '🔥', title: 'Crackling Fire',   desc: 'Warm fireside ambience' },
  { id: 'cafe',    emoji: '☕', title: 'Café Murmur',      desc: 'Soft background chatter' },
  { id: 'wind',    emoji: '💨', title: 'Mountain Wind',    desc: 'Cool high-altitude breeze' },
  { id: 'stream',  emoji: '🏞️', title: 'Flowing Stream',  desc: 'Babbling brook sounds' },
  { id: 'white',   emoji: '⬜', title: 'White Noise',      desc: 'Pure steady noise for focus' },
]

export default function Sleep() {
  return (
    <div className="px-5 pt-14 pb-6 safe-top">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Sleep Sounds</h1>
        <p className="text-stone-400 text-sm mt-1">Ambient sounds to help you rest</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sounds.map((s) => (
          <Card key={s.id} onClick={() => {}} className="flex flex-col items-start gap-2 relative">
            <span className="text-3xl">{s.emoji}</span>
            <div>
              <p className="font-medium text-stone-800 text-sm">{s.title}</p>
              <p className="text-stone-400 text-xs mt-0.5 leading-snug">{s.desc}</p>
            </div>
            <div className="absolute top-3 right-3">
              <Lock size={12} className="text-stone-300" />
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
