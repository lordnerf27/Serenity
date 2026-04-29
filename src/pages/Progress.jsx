import { useAuth } from '../context/AuthContext'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Flame, Clock, Star, LogOut } from 'lucide-react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Progress() {
  const { user, signOut } = useAuth()
  const name = user?.email?.split('@')[0] ?? 'there'

  return (
    <div className="px-5 pt-14 pb-8 safe-top">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Progress</h1>
          <p className="text-stone-400 text-sm mt-0.5 capitalize">{name}</p>
        </div>
        <button
          onClick={signOut}
          className="w-9 h-9 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center"
        >
          <LogOut size={15} className="text-stone-400" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { icon: Flame,  bg: 'bg-orange-50', color: 'text-orange-400', value: '0', label: 'Day streak' },
          { icon: Clock,  bg: 'bg-sage-300/20', color: 'text-sage-500',  value: '0m',  label: 'Total time' },
          { icon: Star,   bg: 'bg-violet-50',  color: 'text-violet-400', value: '0',   label: 'Sessions' },
        ].map(({ icon: Icon, bg, color, value, label }) => (
          <Card key={label} className="flex flex-col items-center py-5 gap-1.5">
            <div className={`w-9 h-9 rounded-2xl ${bg} flex items-center justify-center mb-0.5`}>
              <Icon size={17} className={color} strokeWidth={1.5} />
            </div>
            <span className="text-xl font-semibold text-stone-800 tabular-nums">{value}</span>
            <span className="text-[10px] text-stone-400 text-center leading-tight">{label}</span>
          </Card>
        ))}
      </div>

      {/* Weekly streak */}
      <Card className="mb-4">
        <p className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase mb-4">This week</p>
        <div className="flex justify-between items-end">
          {DAYS.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-cream-100 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-stone-200" />
              </div>
              <span className="text-[9px] text-stone-300 font-medium">{d}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Recent sessions */}
      <Card className="mb-6">
        <p className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase mb-4">Recent sessions</p>
        <div className="flex flex-col items-center py-6 gap-2">
          <span className="text-3xl">🌱</span>
          <p className="text-sm text-stone-400 text-center">No sessions yet</p>
          <p className="text-xs text-stone-300 text-center leading-relaxed">
            Complete your first meditation to start tracking your journey
          </p>
        </div>
      </Card>

      {/* Account email */}
      <div className="text-center mb-6">
        <p className="text-xs text-stone-300">{user?.email}</p>
      </div>
    </div>
  )
}
