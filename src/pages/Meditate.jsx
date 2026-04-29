import { useNavigate } from 'react-router-dom'
import { meditationThemes } from '../data/content'
import { ChevronRight } from 'lucide-react'

export default function Meditate() {
  const navigate = useNavigate()

  return (
    <div className="px-5 pt-14 pb-8 safe-top">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Meditate</h1>
        <p className="text-stone-400 text-sm mt-1">Choose a theme to begin your practice</p>
      </div>

      <div className="flex flex-col gap-3">
        {meditationThemes.map((theme) => (
          <button
            key={theme.id}
            onClick={() => navigate(`/meditate/${theme.id}`)}
            className={`w-full bg-gradient-to-br ${theme.color} rounded-3xl p-4 text-left active:scale-[0.98] transition-transform duration-150 shadow-soft`}
          >
            <div className="flex items-center gap-4">
              <span className="text-3xl flex-shrink-0">{theme.emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-800 text-sm">{theme.title}</p>
                <p className="text-stone-500 text-xs mt-0.5 leading-snug">{theme.subtitle}</p>
                <p className="text-stone-400 text-[10px] mt-1.5 font-medium">
                  {theme.sessions.length} sessions
                </p>
              </div>
              <ChevronRight size={18} className="text-stone-300 flex-shrink-0" />
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
