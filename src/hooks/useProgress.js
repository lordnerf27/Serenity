import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

/**
 * useProgress
 * Fetches all sessions for the logged-in user and computes:
 * - totalSessions count
 * - totalMinutes (sum of duration_seconds / 60)
 * - currentStreak (consecutive days with at least one session, counting back from today)
 * - recentSessions (last 10, most recent first)
 * - weekActivity (array of 7 booleans, Mon–Sun, for the current week)
 */
export function useProgress() {
  const { user } = useAuth()
  const [data, setData]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetch = async () => {
    if (!supabase || !user) { setLoading(false); return }
    setLoading(true)

    const { data: rows, error: err } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', user.id)
      .order('completed_at', { ascending: false })

    if (err) { setError(err.message); setLoading(false); return }

    const totalSessions = rows.length
    const totalMinutes  = Math.round(rows.reduce((acc, r) => acc + (r.duration_seconds ?? 0), 0) / 60)

    // Streak: count consecutive calendar days (local time) going back from today
    const uniqueDays = [...new Set(
      rows.map(r => new Date(r.completed_at).toLocaleDateString('en-CA')) // YYYY-MM-DD
    )].sort().reverse()

    let streak = 0
    const today = new Date()
    for (let i = 0; i < uniqueDays.length; i++) {
      const expected = new Date(today)
      expected.setDate(today.getDate() - i)
      if (uniqueDays[i] === expected.toLocaleDateString('en-CA')) {
        streak++
      } else {
        break
      }
    }

    // Week activity: Mon(0)–Sun(6) for the current week
    const weekActivity = Array(7).fill(false)
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7)) // Monday
    weekStart.setHours(0, 0, 0, 0)
    rows.forEach(r => {
      const d = new Date(r.completed_at)
      const diff = Math.floor((d - weekStart) / 86400000)
      if (diff >= 0 && diff < 7) weekActivity[diff] = true
    })

    setData({
      totalSessions,
      totalMinutes,
      currentStreak: streak,
      recentSessions: rows.slice(0, 10),
      weekActivity,
    })
    setLoading(false)
  }

  useEffect(() => { fetch() }, [user])

  return { data, loading, error, refetch: fetch }
}

/**
 * saveSession
 * Call this when a session completes to persist it to Supabase.
 */
export async function saveSession({ userId, themeId, sessionId, sessionTitle, durationSeconds }) {
  if (!supabase) return { error: 'Supabase not configured' }
  return supabase.from('sessions').insert({
    user_id:          userId,
    theme_id:         themeId,
    session_id:       sessionId,
    session_title:    sessionTitle,
    duration_seconds: Math.round(durationSeconds),
  })
}
