/**
 * MoodSelector
 * Reusable mood picker for pre- and post-session check-ins.
 * Shows 5 emoji buttons with labels. Calls onSelect(value) when tapped.
 *
 * MOODS is exported so other files can look up the emoji/label for a stored value:
 *   import { MOODS } from './MoodSelector'
 *   const mood = MOODS.find(m => m.value === storedValue)
 */

export const MOODS = [
  { value: 1, emoji: '😣', label: 'Stressed' },
  { value: 2, emoji: '😔', label: 'Restless' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 4, emoji: '🙂', label: 'Good' },
  { value: 5, emoji: '😌', label: 'Peaceful' },
]

export default function MoodSelector({ prompt, onSelect, onSkip }) {
  return (
    <div className="flex flex-col items-center gap-5">
      <p className="text-stone-600 text-sm font-medium text-center leading-relaxed">{prompt}</p>

      <div className="flex gap-2">
        {MOODS.map(({ value, emoji, label }) => (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className="flex flex-col items-center gap-1.5 px-2.5 py-3 rounded-2xl active:scale-90 hover:bg-white/60 transition-all"
          >
            <span className="text-3xl">{emoji}</span>
            <span className="text-[10px] text-stone-400 font-medium">{label}</span>
          </button>
        ))}
      </div>

      {onSkip && (
        <button
          onClick={onSkip}
          className="text-xs text-stone-300 active:text-stone-400 transition-colors"
        >
          Skip
        </button>
      )}
    </div>
  )
}
