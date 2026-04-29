import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { meditationThemes, sleepSounds } from '../data/content'
import { useMediaSession } from '../hooks/useMediaSession'
import { saveSession } from '../hooks/useProgress'
import { useAuth } from '../context/AuthContext'
import SleepTimer from '../components/ui/SleepTimer'
import { ArrowLeft, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react'

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function Player() {
  const { themeId, sessionId } = useParams()
  const navigate   = useNavigate()
  const { user }   = useAuth()
  const audioRef   = useRef(null)
  const startedAt  = useRef(null) // track actual listen time

  const [playing, setPlaying]   = useState(false)
  const [current, setCurrent]   = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume]     = useState(0.8)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)

  // Resolve content from data
  const isSleep = themeId === 'sleep'
  let title, subtitle, emoji, gradient, accent, audioUrl

  if (isSleep) {
    const sound  = sleepSounds.find(s => s.id === sessionId)
    title    = sound?.title    ?? 'Sound'
    subtitle = sound?.desc     ?? ''
    emoji    = sound?.emoji    ?? '🌙'
    gradient = sound?.color    ?? 'from-indigo-50 to-blue-50'
    accent   = 'text-indigo-400'
    audioUrl = sound?.audioUrl ?? null
  } else {
    const theme   = meditationThemes.find(t => t.id === themeId)
    const session = theme?.sessions.find(s => s.id === sessionId)
    title    = session?.title       ?? 'Session'
    subtitle = session?.description ?? ''
    emoji    = theme?.emoji         ?? '🌿'
    gradient = theme?.color         ?? 'from-sage-300/20 to-mist-300/20'
    accent   = theme?.accent        ?? 'text-sage-500'
    audioUrl = session?.audioUrl    ?? null
  }

  // Media Session API — keeps audio playing on lock screen
  const mediaSession = useMediaSession({
    title,
    onPlay:        () => { audioRef.current?.play(); setPlaying(true) },
    onPause:       () => { audioRef.current?.pause(); setPlaying(false) },
    onSeekBack:    () => skipBy(-15),
    onSeekForward: () => skipBy(15),
  })

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [])

  useEffect(() => {
    mediaSession.update(playing)
  }, [playing, title])

  useEffect(() => {
    return () => mediaSession.clear()
  }, [])

  // Core controls
  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      if (!startedAt.current) startedAt.current = Date.now()
      audioRef.current.play().catch(() => setError(true))
      setPlaying(true)
    }
  }

  const skipBy = (secs) => {
    if (!audioRef.current) return
    audioRef.current.currentTime = Math.max(0, Math.min(duration || 0, current + secs))
  }

  // Audio element handlers
  const handleTimeUpdate     = () => { if (audioRef.current) setCurrent(audioRef.current.currentTime) }
  const handleLoadedMetadata = () => { if (audioRef.current) { setDuration(audioRef.current.duration); setLoading(false) } }
  const handleCanPlay        = () => setLoading(false)
  const handleError          = () => { setError(true); setLoading(false) }

  const handleEnded = async () => {
    setPlaying(false)
    setCurrent(0)
    const durationSeconds = duration || (startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : 0)

    // Save session to Supabase
    if (user && !isSleep) {
      await saveSession({ userId: user.id, themeId, sessionId, sessionTitle: title, durationSeconds })
    }

    // Navigate to completion screen with data in router state
    const theme = meditationThemes.find(t => t.id === themeId)
    navigate('/complete', {
      replace: true,
      state: { title, emoji, gradient, durationSeconds, streak: null },
    })
  }

  // Sleep timer expired — stop audio
  const handleTimerExpire = () => {
    if (audioRef.current) { audioRef.current.pause(); setPlaying(false) }
  }

  const handleSeek = (e) => {
    const val = Number(e.target.value)
    setCurrent(val)
    if (audioRef.current) audioRef.current.currentTime = val
  }

  const handleVolumeChange = (e) => {
    const val = Number(e.target.value)
    setVolume(val)
    if (audioRef.current) audioRef.current.volume = val
  }

  const progress = duration > 0 ? (current / duration) * 100 : 0

  return (
    <div className={`min-h-screen bg-gradient-to-br ${gradient} flex flex-col safe-top`}>
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onCanPlay={handleCanPlay}
          onError={handleError}
          onEnded={handleEnded}
          preload="metadata"
        />
      )}

      {/* Top bar */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-2xl bg-white/60 backdrop-blur flex items-center justify-center active:opacity-60"
        >
          <ArrowLeft size={17} className="text-stone-600" />
        </button>
        <p className="text-xs font-semibold text-stone-500 tracking-widest uppercase">
          {isSleep ? 'Sleep Sound' : 'Meditation'}
        </p>
        {isSleep
          ? <SleepTimer onExpire={handleTimerExpire} />
          : <div className="w-9 h-9" />
        }
      </div>

      {/* Album art */}
      <div className="flex-1 flex flex-col items-center justify-center px-8 py-8">
        <div className="w-52 h-52 rounded-[3rem] bg-white/50 backdrop-blur shadow-card flex items-center justify-center mb-8">
          <span className="text-7xl">{emoji}</span>
        </div>
        <h1 className="text-xl font-semibold text-stone-800 text-center tracking-tight">{title}</h1>
        <p className="text-stone-500 text-sm text-center mt-2 leading-relaxed px-4">{subtitle}</p>

        {!audioUrl && <p className="text-xs text-stone-300 mt-4 italic">Audio coming soon</p>}
        {audioUrl && loading && !error && (
          <div className="mt-4 flex items-center gap-2">
            <div className="w-3 h-3 rounded-full border-2 border-stone-300 border-t-stone-500 animate-spin" />
            <p className="text-xs text-stone-400">Loading audio…</p>
          </div>
        )}
        {error && <p className="text-xs text-red-400 mt-4">Could not load audio. Check your connection.</p>}
      </div>

      {/* Controls panel */}
      <div className="px-6 pb-10 bg-white/40 backdrop-blur-sm rounded-t-3xl pt-6">
        {/* Progress bar */}
        <div className="mb-1">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={current}
            onChange={handleSeek}
            disabled={!audioUrl || !duration}
            className="w-full h-1 rounded-full appearance-none cursor-pointer disabled:opacity-30"
            style={{ background: `linear-gradient(to right, #8BAF9E ${progress}%, #e7e5e4 ${progress}%)` }}
          />
          <div className="flex justify-between mt-1.5">
            <span className="text-[10px] text-stone-400 tabular-nums">{formatTime(current)}</span>
            <span className="text-[10px] text-stone-400 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Play controls */}
        <div className="flex items-center justify-center gap-8 mt-4">
          <button onClick={() => skipBy(-15)} disabled={!audioUrl} className="w-11 h-11 flex items-center justify-center opacity-50 active:opacity-30 disabled:opacity-20">
            <SkipBack size={22} className="text-stone-600" fill="currentColor" />
          </button>

          <button
            onClick={togglePlay}
            disabled={!audioUrl || error}
            className="w-16 h-16 rounded-full bg-sage-400 shadow-card flex items-center justify-center active:scale-95 transition-transform disabled:opacity-40"
          >
            {playing
              ? <Pause size={26} className="text-white" fill="white" />
              : <Play  size={26} className="text-white ml-1" fill="white" />
            }
          </button>

          <button onClick={() => skipBy(15)} disabled={!audioUrl} className="w-11 h-11 flex items-center justify-center opacity-50 active:opacity-30 disabled:opacity-20">
            <SkipForward size={22} className="text-stone-600" fill="currentColor" />
          </button>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3 mt-6">
          <Volume2 size={14} className="text-stone-400 flex-shrink-0" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
            style={{ background: `linear-gradient(to right, #8BAF9E ${volume * 100}%, #e7e5e4 ${volume * 100}%)` }}
          />
        </div>
      </div>
    </div>
  )
}
