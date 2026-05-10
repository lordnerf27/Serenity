import { useState, useEffect, useRef } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const techniques = [
  {
    id: 'box',
    name: 'Box Breathing',
    desc: 'Calm your nervous system',
    detail: 'Used by Navy SEALs to stay calm under pressure.',
    inhale: 4, hold1: 4, exhale: 4, hold2: 4,
    color: 'from-blue-900/30 to-cyan-900/20',
    accent: 'bg-blue-900/30',
    dot: 'bg-blue-400',
  },
  {
    id: '478',
    name: '4-7-8 Technique',
    desc: 'Fall asleep faster',
    detail: 'Dr. Weil\'s natural tranquiliser for the nervous system.',
    inhale: 4, hold1: 7, exhale: 8, hold2: 0,
    color: 'from-violet-900/30 to-purple-900/20',
    accent: 'bg-violet-900/30',
    dot: 'bg-violet-400',
  },
  {
    id: 'belly',
    name: 'Belly Breathing',
    desc: 'Reduce stress instantly',
    detail: 'Deep diaphragmatic breathing to activate the rest response.',
    inhale: 4, hold1: 0, exhale: 6, hold2: 0,
    color: 'from-emerald-900/30 to-green-900/20',
    accent: 'bg-emerald-900/30',
    dot: 'bg-emerald-400',
  },
]

const PHASE_NAMES = ['Inhale', 'Hold', 'Exhale', 'Hold']

export default function Breathe() {
  const [selected, setSelected] = useState(null)
  const [active, setActive] = useState(false)
  const [phaseIndex, setPhaseIndex] = useState(0)
  const [count, setCount] = useState(0)
  const [cycles, setCycles] = useState(0)
  const intervalRef = useRef(null)

  const tech = selected !== null ? techniques[selected] : null
  const phaseDurations = tech ? [tech.inhale, tech.hold1, tech.exhale, tech.hold2] : []

  useEffect(() => {
    if (!active || !tech) return
    let phase = 0
    while (phaseDurations[phase] === 0) phase = (phase + 1) % 4
    setPhaseIndex(phase)
    setCount(phaseDurations[phase])
    let remaining = phaseDurations[phase]

    intervalRef.current = setInterval(() => {
      remaining -= 1
      setCount(remaining)
      if (remaining <= 0) {
        let next = (phase + 1) % 4
        while (phaseDurations[next] === 0) next = (next + 1) % 4
        if (next <= phase) setCycles(c => c + 1)
        phase = next
        remaining = phaseDurations[phase]
        setPhaseIndex(phase)
        setCount(remaining)
      }
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [active])

  const stop = () => {
    clearInterval(intervalRef.current)
    setActive(false)
    setPhaseIndex(0)
    setCount(0)
    setCycles(0)
  }

  const circleSize = phaseIndex === 0 ? 'scale-125' : phaseIndex === 2 ? 'scale-75' : 'scale-100'
  const t = tech

  return (
    <div className="px-5 pt-14 pb-8 safe-top">
      {!active ? (
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Breathe</h1>
            <p className="text-stone-400 text-sm mt-1">Breathwork to reset your mind and body</p>
          </div>

          <div className="flex flex-col gap-3 mb-6">
            {techniques.map((t, i) => (
              <button
                key={t.id}
                onClick={() => setSelected(i)}
                className={`w-full bg-gradient-to-br ${t.color} rounded-3xl p-4 text-left
                  transition-all duration-150 active:scale-[0.98] shadow-soft
                  ${selected === i ? 'ring-2 ring-sage-400' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-semibold text-stone-800 text-sm">{t.name}</p>
                    <p className="text-stone-600 text-xs mt-0.5">{t.desc}</p>
                    <p className="text-stone-400 text-[10px] mt-1.5 italic">{t.detail}</p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {[t.inhale, t.hold1, t.exhale, t.hold2].filter(Boolean).map((d, idx) => (
                        <span key={idx} className={`text-[10px] font-medium text-stone-600 ${t.accent} px-2 py-0.5 rounded-full`}>
                          {['In', 'Hold', 'Out', 'Hold'].filter((_, j) => [t.inhale, t.hold1, t.exhale, t.hold2][j] > 0)[idx]} {d}s
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 ml-4 flex-shrink-0 transition-all
                    ${selected === i ? 'bg-sage-400 border-sage-400' : 'border-stone-400'}`}
                  />
                </div>
              </button>
            ))}
          </div>

          <Button onClick={() => selected !== null && setActive(true)} disabled={selected === null}>
            Start session
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[75vh]">
          <p className="text-[10px] font-semibold text-stone-400 tracking-widest uppercase mb-12">{t.name}</p>

          {/* Animated breathing circle */}
          <div className="relative flex items-center justify-center mb-12">
            <div className={`w-52 h-52 rounded-full bg-sage-300/10 transition-all duration-1000 ease-in-out ${circleSize}`} />
            <div className={`absolute w-40 h-40 rounded-full bg-sage-300/20 transition-all duration-1000 ease-in-out ${circleSize}`} />
            <div className={`absolute w-28 h-28 rounded-full bg-sage-300/30 transition-all duration-1000 ease-in-out ${circleSize}`} />
            <div className="absolute flex flex-col items-center gap-1">
              <span className="text-stone-800 font-semibold text-3xl tabular-nums">{count}</span>
              <span className="text-stone-600 text-sm font-medium">{PHASE_NAMES[phaseIndex]}</span>
            </div>
          </div>

          <p className="text-stone-400 text-sm mb-10">
            {cycles} {cycles === 1 ? 'cycle' : 'cycles'} complete
          </p>

          <button
            onClick={stop}
            className="text-sm text-stone-400 font-medium bg-cream-200 border border-cream-200 rounded-2xl px-8 py-3"
          >
            End session
          </button>
        </div>
      )}
    </div>
  )
}
