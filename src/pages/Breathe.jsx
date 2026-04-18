import { useState, useEffect, useRef } from 'react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const techniques = [
  { id: 'box',     name: 'Box Breathing',     desc: 'Calm your nervous system',   inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
  { id: '478',     name: '4-7-8 Technique',   desc: 'Fall asleep faster',         inhale: 4, hold1: 7, exhale: 8, hold2: 0 },
  { id: 'belly',   name: 'Belly Breathing',   desc: 'Reduce stress instantly',    inhale: 4, hold1: 0, exhale: 6, hold2: 0 },
]

const PHASES = ['Inhale', 'Hold', 'Exhale', 'Hold']

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
    setPhaseIndex(0)
    setCount(phaseDurations[0])

    let phase = 0
    let remaining = phaseDurations[0]

    intervalRef.current = setInterval(() => {
      remaining -= 1
      setCount(remaining)

      if (remaining <= 0) {
        do { phase = (phase + 1) % 4 } while (phaseDurations[phase] === 0)
        if (phase === 0) setCycles(c => c + 1)
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

  const circleScale = phaseIndex === 0 ? 'scale-125' : phaseIndex === 2 ? 'scale-75' : 'scale-100'

  return (
    <div className="px-5 pt-14 pb-6 safe-top">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-stone-800 tracking-tight">Breathe</h1>
        <p className="text-stone-400 text-sm mt-1">Breathwork to reset your mind</p>
      </div>

      {!active ? (
        <>
          <div className="flex flex-col gap-3 mb-6">
            {techniques.map((t, i) => (
              <Card
                key={t.id}
                onClick={() => setSelected(i)}
                className={`transition-all ${selected === i ? 'ring-2 ring-sage-400' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stone-800 text-sm">{t.name}</p>
                    <p className="text-stone-400 text-xs mt-0.5">{t.desc}</p>
                    <p className="text-stone-300 text-[10px] mt-1">
                      {[t.inhale && `In ${t.inhale}s`, t.hold1 && `Hold ${t.hold1}s`, `Out ${t.exhale}s`, t.hold2 && `Hold ${t.hold2}s`].filter(Boolean).join(' · ')}
                    </p>
                  </div>
                  <div className={`w-4 h-4 rounded-full border-2 ${selected === i ? 'bg-sage-400 border-sage-400' : 'border-stone-200'}`} />
                </div>
              </Card>
            ))}
          </div>
          <Button onClick={() => selected !== null && setActive(true)} disabled={selected === null}>
            Start breathing
          </Button>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
          <p className="text-stone-400 text-xs tracking-widest uppercase">{tech.name}</p>

          {/* Animated circle */}
          <div className="relative flex items-center justify-center">
            <div className={`w-44 h-44 rounded-full bg-sage-300/20 transition-all duration-1000 ease-in-out ${circleScale}`} />
            <div className={`absolute w-32 h-32 rounded-full bg-sage-300/40 transition-all duration-1000 ease-in-out ${circleScale}`} />
            <div className="absolute flex flex-col items-center">
              <span className="text-stone-800 font-semibold text-xl">{count}</span>
              <span className="text-stone-500 text-xs mt-0.5">{PHASES[phaseIndex]}</span>
            </div>
          </div>

          <p className="text-stone-300 text-sm">{cycles} {cycles === 1 ? 'cycle' : 'cycles'} complete</p>

          <Button variant="ghost" onClick={stop} className="max-w-[160px]">
            Stop
          </Button>
        </div>
      )}
    </div>
  )
}
