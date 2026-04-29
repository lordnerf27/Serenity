import { useNavigate } from 'react-router-dom'
import { sleepSounds } from '../data/content'
import { Lock } from 'lucide-react'

const FREE_SOUNDS = 2

export default function Sleep() {
  const navigate = useNavigate()

  return (
    <div className="px-5 pt-14 pb-8 safe-top">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Sleep Sounds</h1>
        <p className="text-stone-400 text-sm mt-1">Ambient audio to help you rest</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {sleepSounds.map((s, index) => {
          const isFree = index < FREE_SOUNDS

          return (
            <button
              key={s.id}
              onClick={() => isFree && navigate(`/player/sleep/${s.id}`)}
              className={`bg-gradient-to-br ${s.color} rounded-3xl p-4 text-left shadow-soft
                relative overflow-hidden transition-all duration-150
                ${isFree ? 'active:scale-[0.98] cursor-pointer' : 'opacity-60 cursor-default'}`}
            >
              <span className="text-3xl block mb-3">{s.emoji}</span>
              <p className="font-semibold text-stone-800 text-sm leading-snug">{s.title}</p>
              <p className="text-stone-500 text-xs mt-0.5 leading-snug">{s.desc}</p>

              {!isFree && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-white/70 flex items-center justify-center">
                  <Lock size={11} className="text-stone-400" />
                </div>
              )}

              {isFree && (
                <div className="mt-3">
                  <span className="text-[9px] font-semibold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">
                    FREE
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-3xl p-5">
        <p className="text-sm font-semibold text-stone-700">Unlock all 8 sounds</p>
        <p className="text-xs text-stone-400 mt-1 leading-relaxed">
          Upgrade to Serenity Pro for the full sound library and new sounds added regularly.
        </p>
        <button className="mt-3 text-xs font-semibold text-sage-500 bg-white rounded-2xl px-4 py-2 shadow-soft">
          Learn more
        </button>
      </div>
    </div>
  )
}
