import { useAuth } from '../context/AuthContext'
import { useProgress } from '../hooks/useProgress'
import { useReminder } from '../hooks/useReminder'
import Card from '../components/ui/Card'
import { MOODS } from '../components/ui/MoodSelector'
import { Flame, Clock, Star, LogOut, Sparkles, Bell, BellOff } from 'lucide-react'

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

/** Find the closest mood emoji for a decimal average (e.g. 3.7 → 🙂) */
function closestMoodEmoji(avg) {
  if (avg == null) return null
  const rounded = Math.round(avg)
  return MOODS.find(m => m.value === rounded)?.emoji ?? null
}

export default function Progress() {
  const { user, signOut } = useAuth()
  const { data, loading } = useProgress()
  const { enabled, time, permission, toggleReminder, updateTime } = useReminder()
  const name = user?.email?.split('@')[0] ?? 'there'

  const stats = [
    { icon: Flame, bg: 'bg-orange-50',   color: 'text-orange-400', value: data?.currentStreak ?? 0,                label: 'Day streak' },
    { icon: Clock, bg: 'bg-sage-300/20', color: 'text-sage-500',   value: formatMinutes(data?.totalMinutes ?? 0), label: 'Total time' },
    { icon: Star,  bg: 'bg-violet-50',   color: 'text-violet-400', value: data?.totalSessions ?? 0,               label: 'Sessions' },
  ]

  const moodImproved = data?.avgMoodBefore != null && data?.avgMoodAfter != null
    ? data.avgMoodAfter > data.avgMoodBefore
    : false

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

      {/* Mood trend — only shown when there's mood data */}
      {data?.moodSessionCount > 0 && (
        <Card className="mb-4">
          <p className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase mb-4">Mood trend</p>
          <div className="flex items-center justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl">{closestMoodEmoji(data.avgMoodBefore)}</span>
              <span className="text-[10px] text-stone-400">Before</span>
            </div>
            <div className="text-stone-300 text-lg">→</div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-3xl">{closestMoodEmoji(data.avgMoodAfter)}</span>
              <span className="text-[10px] text-stone-400">After</span>
            </div>
          </div>
          {moodImproved && (
            <p className="text-center text-xs text-sage-500 mt-3 font-medium">
              Your sessions are helping you feel better
            </p>
          )}
          <p className="text-center text-[10px] text-stone-300 mt-2">
            Based on {data.moodSessionCount} session{data.moodSessionCount !== 1 ? 's' : ''}
          </p>
        </Card>
      )}

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

      {/* Daily reminder settings */}
      <Card className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${enabled ? 'bg-sage-300/20' : 'bg-stone-50'}`}>
              {enabled
                ? <Bell size={17} className="text-sage-500" strokeWidth={1.5} />
                : <BellOff size={17} className="text-stone-300" strokeWidth={1.5} />
              }
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-800">Daily reminder</p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                {enabled ? `Set for ${time}` : 'Get a gentle nudge to meditate'}
              </p>
            </div>
          </div>

          {/* Toggle */}
          <button
            onClick={() => toggleReminder(!enabled)}
            className={`w-11 h-6 rounded-full transition-colors relative ${enabled ? 'bg-sage-400' : 'bg-stone-200'}`}
          >
            <div className={`w-5 h-5 rounded-full bg-white shadow-sm absolute top-0.5 transition-all ${enabled ? 'left-[22px]' : 'left-0.5'}`} />
          </button>
        </div>

        {enabled && (
          <div className="flex items-center gap-3 pt-3 border-t border-stone-50">
            <label className="text-xs text-stone-400 flex-shrink-0">Remind me at</label>
            <input
              type="time"
              value={time}
              onChange={(e) => updateTime(e.target.value)}
              className="flex-1 text-sm text-stone-700 font-medium bg-cream-50 rounded-xl px-3 py-2 border border-stone-100 outline-none focus:border-sage-300 transition-colors"
            />
          </div>
        )}

        {permission === 'denied' && (
          <p className="text-[10px] text-red-400 mt-2">
            Notifications are blocked. Enable them in your browser settings.
          </p>
        )}
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
                {/* Show mood journey if both moods exist */}
                {s.mood_before != null && s.mood_after != null && (
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <span className="text-sm">{MOODS.find(m => m.value === s.mood_before)?.emoji}</span>
                    <span className="text-[10px] text-stone-300">→</span>
                    <span className="text-sm">{MOODS.find(m => m.value === s.mood_after)?.emoji}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <p className="text-center text-xs text-stone-300 mb-6">{user?.email}</p>
    </div>
  )
}
