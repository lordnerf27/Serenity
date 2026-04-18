import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Flame, Clock, Star } from 'lucide-react'

const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

export default function Progress() {
  const { user, signOut } = useAuth()

  return (
    <div className="px-5 pt-14 pb-6 safe-top">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Your Progress</h1>
        <p className="text-stone-400 text-sm mt-1">{user?.email}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Flame,  color: 'text-orange-400', bg: 'bg-orange-50', value: '0', label: 'Day streak' },
          { icon: Clock,  color: 'text-sage-500',   bg: 'bg-sage-300/20', value: '0m', label: 'Total time' },
          { icon: Star,   color: 'text-mist-400',   bg: 'bg-mist-300/20', value: '0', label: 'Sessions' },
        ].map(({ icon: Icon, color, bg, value, label }) => (
          <Card key={label} className="flex flex-col items-center py-4 gap-1">
            <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-1`}>
              <Icon size={16} className={color} />
            </div>
            <span className="text-lg font-semibold text-stone-800">{value}</span>
            <span className="text-[10px] text-stone-400 text-center leading-tight">{label}</span>
          </Card>
        ))}
      </div>

      {/* Weekly view */}
      <Card className="mb-4">
        <p className="text-xs font-semibold text-stone-400 tracking-widest uppercase mb-4">This week</p>
        <div className="flex justify-between">
          {days.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center">
                <span className="text-[10px] text-stone-300">—</span>
              </div>
              <span className="text-[10px] text-stone-400">{d}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-8">
        <p className="text-xs font-semibold text-stone-400 tracking-widest uppercase mb-3">Recent sessions</p>
        <p className="text-sm text-stone-300 text-center py-4">No sessions yet — start meditating to track your progress.</p>
      </Card>

      <Button variant="ghost" onClick={signOut}>
        Sign out
      </Button>
    </div>
  )
}
