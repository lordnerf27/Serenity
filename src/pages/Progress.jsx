import { useAuth } from '../context/AuthContext'
import { useProgress } from '../hooks/useProgress'
import Card from '../components/ui/Card'
import { Flame, Clock, Star, LogOut, Sparkles } from 'lucide-react'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

function formatMinutes(mins) {
  if (!mins) return '0m'
  if (mins < 60) return `${mins}m`
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

function formatRelativeDate(dateStr) {
  const d     = new Date(dateStr)
  const today = new Date()
  const diff  = Math.floor((today - d) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return `${diff} days ago`
}

export default function Progress() {
  const { user, signOut } = useAuth()
  const { data, loading } = useProgress()
  const name = user?.email?.split('@')[0] ?? 'there'

  const stats = [
    { icon: Flame, bg: 'bg-orange-50',   color: 'text-orange-400', value: data?.currentStreak ?? 0,                label: 'Day streak' },
    { icon: Clock, bg: 'bg-sage-300/20', color: 'text-sage-500',   value: formatMinutes(data?.totalMinutes ?? 0), label: 'Total time' },
    { icon: Star,  bg: 'bg-violet-50',   color: 'text-violet-400', value: data?.totalSessions ?? 0,               label: 'Sessions' },
  ]

  return (
    <div className="px-5 pt-14 pb-8 safe-top">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Progress</h1>
          <p className="text-stone-400 text-sm mt-0.5 capitalize">{name}</p>
        </div>
        <button
          onClick={signOut}
          className="w-9 h-9 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center active:opacity-60"
        >
          <LogOut size={15} className="text-stone-400" />
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {stats.map(({ icon: Icon, bg, color, value, label }) => (
          <Card key={label} className="flex flex-col items-center py-5 gap-1.5">
            <div className={`w-9 h-9 rounded-2xl ${bg} flex items-center justify-center mb-0.5`}>
              <Icon size={17} className={color} strokeWidth={1.5} />
            </div>
            <span className="text-xl font-semibold text-stone-800 tabular-nums">
              {loading ? '—' : value}
            </span>
            <span className="text-[10px] text-stone-400 text-center leading-tight">{label}</span>
          </Card>
        ))}
      </div>

      {/* Weekly activity */}
      <Card className="mb-4">
        <p className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase mb-4">This week</p>
        <div className="flex justify-between items-end">
          {DAYS.map((d, i) => {
            const active = data?.weekActivity?.[i] ?? false
            return (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors
                  ${active ? 'bg-sage-400' : 'bg-cream-100'}`}>
                  {active
                    ? <Flame size={14} className="text-white" />
                    : <div className="w-1.5 h-1.5 rounded-full bg-stone-200" />
                  }
                </div>
                <span className={`text-[9px] font-medium ${active ? 'text-sage-500' : 'text-stone-300'}`}>{d}</span>
              </div>
            )
          })}
        </div>
      </Card>

      {/* Recent sessions */}
      <Card className="mb-6">
        <p className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase mb-4">Recent sessions</p>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="w-5 h-5 rounded-full border-2 border-stone-200 border-t-stone-400 animate-spin" />
          </div>
        ) : !data?.recentSessions?.length ? (
          <div className="flex flex-col items-center py-6 gap-2">
            <span className="text-3xl">🌱</span>
            <p className="text-sm text-stone-400 text-center">No sessions yet</p>
            <p className="text-xs text-stone-300 text-center leading-relaxed">
              Complete your first meditation to start tracking your journey
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {data.recentSessions.map((s) => (
              <div key={s.id} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-sage-300/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={15} className="text-sage-500" strokeWidth={1.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-700 truncate">{s.session_title}</p>
                  <p className="text-xs text-stone-400">
                    {Math.round(s.duration_seconds / 60)} min · {formatRelativeDate(s.completed_at)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <p className="text-center text-xs text-stone-300 mb-6">{user?.email}</p>
    </div>
  )
}
