import { useState, useEffect, useCallback } from 'react'

/**
 * useReminder
 * Manages daily meditation reminders via the browser Notification API.
 *
 * How it works:
 * - User sets a preferred time (HH:MM) and toggles reminders on/off.
 * - Settings are stored in localStorage so they persist across sessions.
 * - While the app is open (foreground or backgrounded PWA tab), an interval
 *   checks once per minute whether it's past the reminder time.
 * - If so, and the user hasn't been notified today, a browser notification fires.
 *
 * Limitations (honest):
 * - Only fires while the app process is alive (open tab or installed PWA).
 * - For truly background notifications (app fully closed), a push server
 *   (e.g. Supabase Edge Functions + Web Push API) would be needed.
 * - The permission flow and settings UI are ready for that future upgrade.
 */

const KEYS = {
  enabled:      'serenity_reminder_enabled',
  time:         'serenity_reminder_time',
  lastNotified: 'serenity_reminder_last_notified',
}

export function useReminder() {
  const [enabled, setEnabled] = useState(() => localStorage.getItem(KEYS.enabled) === '1')
  const [time, setTime]       = useState(() => localStorage.getItem(KEYS.time) ?? '08:00')
  const [permission, setPermission] = useState(() =>
    typeof Notification !== 'undefined' ? Notification.permission : 'denied'
  )

  // ------------------------------------------------------------------
  // Request browser notification permission
  // ------------------------------------------------------------------
  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') return 'denied'
    const result = await Notification.requestPermission()
    setPermission(result)
    return result
  }, [])

  // ------------------------------------------------------------------
  // Toggle reminders on/off (requests permission if turning on)
  // ------------------------------------------------------------------
  const toggleReminder = useCallback(async (on) => {
    if (on) {
      const perm = await requestPermission()
      if (perm !== 'granted') return false // user denied — don't enable
    }
    setEnabled(on)
    localStorage.setItem(KEYS.enabled, on ? '1' : '0')
    return true
  }, [requestPermission])

  // ------------------------------------------------------------------
  // Update the preferred reminder time
  // ------------------------------------------------------------------
  const updateTime = useCallback((newTime) => {
    setTime(newTime)
    localStorage.setItem(KEYS.time, newTime)
    // Reset last-notified so the new time takes effect today
    localStorage.removeItem(KEYS.lastNotified)
  }, [])

  // ------------------------------------------------------------------
  // Check every minute and fire if it's past reminder time
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!enabled || permission !== 'granted') return

    const check = () => {
      const now = new Date()
      const [h, m] = time.split(':').map(Number)
      const today = now.toLocaleDateString('en-CA') // YYYY-MM-DD

      // Already notified today — skip
      if (localStorage.getItem(KEYS.lastNotified) === today) return

      // Not yet past the reminder time — skip
      if (now.getHours() < h || (now.getHours() === h && now.getMinutes() < m)) return

      // Fire notification
      try {
        new Notification('Serenity', {
          body: 'Time for your daily meditation \u{1F33F}',
          icon: '/icons/icon-192.png',
          tag:  'serenity-reminder', // prevents duplicate notifications
        })
      } catch {
        // Notification constructor can throw in some environments — fail silently
      }
      localStorage.setItem(KEYS.lastNotified, today)
    }

    check() // run immediately on mount / when settings change
    const interval = setInterval(check, 60_000) // then every minute
    return () => clearInterval(interval)
  }, [enabled, permission, time])

  return { enabled, time, permission, toggleReminder, updateTime }
}
