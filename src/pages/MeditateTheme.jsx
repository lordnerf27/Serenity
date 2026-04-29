import { useParams, useNavigate } from 'react-router-dom'
import { meditationThemes } from '../data/content'
import { ArrowLeft, Clock, Lock, Play } from 'lucide-react'

const FREE_SESSIONS = 2 // first 2 sessions per theme are free

export default function MeditateTheme() {
  const { themeId } = useParams()
  const navigate = useNavigate()
  const theme = meditationThemes.find(t => t.id === themeId)

  if (!theme) return <div className="p-6 text-stone-400">Theme not found.</div>

  return (
    <div className="pb-8 safe-top">
      {/* Header banner */}
      <div className={`bg-gradient-to-br ${theme.color} px-5 pt-14 pb-8`}>
        <button
          onClick={() => navigate('/meditate')}
          className="flex items-center gap-1.5 text-stone-500 text-sm mb-6 active:opacity-60"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <div className="flex items-center gap-4">
          <span className="text-5xl">{theme.emoji}</span>
          <div>
            <h1 className="text-xl font-semibold text-stone-800 tracking-tight">{theme.title}</h1>
            <p className="text-stone-500 text-sm mt-0.5">{theme.subtitle}</p>
            <p className="text-stone-400 text-xs mt-1">{theme.sessions.length} sessions</p>
          </div>
        </div>
      </div>

      {/* Sessions list */}
      <div className="px-5 mt-6">
        <p className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase mb-4">
          Sessions
        </p>
        <div className="flex flex-col gap-3">
          {theme.sessions.map((session, index) => {
            const isFree = index < FREE_SESSIONS

            return (
              <button
                key={session.id}
                onClick={() => isFree && navigate(`/player/${theme.id}/${session.id}`)}
                className={`w-full bg-white rounded-3xl shadow-soft p-4 text-left transition-all duration-150
                  ${isFree ? 'active:scale-[0.98] cursor-pointer' : 'opacity-60 cursor-default'}`}
              >
                <div className="flex items-center gap-4">
                  {/* Play / Lock icon */}
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0
                    ${isFree ? `bg-gradient-to-br ${theme.color}` : 'bg-stone-100'}`}>
                    {isFree
                      ? <Play size={16} className={`${theme.accent} ml-0.5`} fill="currentColor" />
                      : <Lock size={14} className="text-stone-300" />
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-800 text-sm">{session.title}</p>
                    <p className="text-stone-400 text-xs mt-0.5 leading-snug line-clamp-1">
                      {session.description}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[10px] text-stone-400">
                        <Clock size={10} />
                        {session.duration}
                      </span>
                      <span className="text-[10px] text-stone-300">·</span>
                      <span className="text-[10px] text-stone-400">{session.level}</span>
                    </div>
                  </div>

                  {!isFree && (
                    <span className="text-[9px] font-semibold text-stone-300 bg-stone-100 px-2 py-0.5 rounded-full flex-shrink-0">
                      PRO
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Upgrade nudge */}
        <div className="mt-6 bg-gradient-to-br from-sage-300/15 to-mist-300/15 rounded-3xl p-5 border border-sage-300/20">
          <p className="text-sm font-semibold text-stone-700">Unlock all sessions</p>
          <p className="text-xs text-stone-400 mt-1 leading-relaxed">
            Upgrade to Serenity Pro to access every session across all themes.
          </p>
          <button className="mt-3 text-xs font-semibold text-sage-500 bg-white rounded-2xl px-4 py-2 shadow-soft">
            Learn more
          </button>
        </div>
      </div>
    </div>
  )
}
