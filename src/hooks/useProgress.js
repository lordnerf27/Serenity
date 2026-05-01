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

    // Mood averages — only from sessions that have mood data
    const withMoodBefore = rows.filter(r => r.mood_before != null)
    const withMoodAfter  = rows.filter(r => r.mood_after  != null)
    const avgMoodBefore  = withMoodBefore.length
      ? Math.round((withMoodBefore.reduce((a, r) => a + r.mood_before, 0) / withMoodBefore.length) * 10) / 10
      : null
    const avgMoodAfter   = withMoodAfter.length
      ? Math.round((withMoodAfter.reduce((a, r) => a + r.mood_after, 0) / withMoodAfter.length) * 10) / 10
      : null

    setData({
      totalSessions,
      totalMinutes,
      currentStreak: streak,
      recentSessions: rows.slice(0, 10),
      weekActivity,
      avgMoodBefore,
      avgMoodAfter,
      moodSessionCount: Math.min(withMoodBefore.length, withMoodAfter.length),
    })
    setLoading(false)
  }

  useEffect(() => { fetch() }, [user])

  return { data, loading, error, refetch: fetch }
}

/**
 * saveSession
 * Call this when a session completes to persist it to Supabase.
 * Returns { data: { id }, error } so callers can reference the row later
 * (e.g. to update mood_after on the completion screen).
 */
export async function saveSession({ userId, themeId, sessionId, sessionTitle, durationSeconds, moodBefore }) {
  if (!supabase) return { data: null, error: 'Supabase not configured' }
  return supabase.from('sessions').insert({
    user_id:          userId,
    theme_id:         themeId,
    session_id:       sessionId,
    session_title:    sessionTitle,
    duration_seconds: Math.round(durationSeconds),
    mood_before:      moodBefore ?? null,
  }).select('id').single()
}

/**
 * updateSessionMood
 * Called from the Completion screen to save the post-session mood
 * on the row that was created by saveSession.
 */
export async function updateSessionMood(sessionDbId, moodAfter) {
  if (!supabase || !sessionDbId) return { error: 'Missing session ID or Supabase' }
  return supabase.from('sessions').update({ mood_after: moodAfter }).eq('id', sessionDbId)
}
