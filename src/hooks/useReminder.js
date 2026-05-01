import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

/**
 * useReminder
 * Manages daily meditation reminders with two layers:
 *
 * 1. IN-APP (existing) — while the app is open, an interval checks every minute
 *    and fires a browser Notification if it's past the set time.
 *
 * 2. PUSH (new) — subscribes to the Web Push API so the server can send
 *    notifications even when the app is fully closed. Requires:
 *    - VITE_VAPID_PUBLIC_KEY env var set
 *    - push_subscriptions table in Supabase
 *    - send-reminders Edge Function deployed and scheduled via cron
 *
 * Both layers are managed by a single toggle. If push is unavailable (no VAPID
 * key, unsupported browser), the in-app layer still works.
 */

const KEYS = {
  enabled:      'serenity_reminder_enabled',
  time:         'serenity_reminder_time',
  lastNotified: 'serenity_reminder_last_notified',
}

// ---------------------------------------------------------------------------
// Push subscription utilities
// ---------------------------------------------------------------------------

/** Convert a URL-safe base64 VAPID key to a Uint8Array for PushManager */
function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64  = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const raw     = window.atob(base64)
  return Uint8Array.from([...raw].map(c => c.charCodeAt(0)))
}

/** Subscribe this browser to push and store the subscription in Supabase */
async function subscribeToPush(user, reminderTime) {
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
  if (!supabase || !user) return

  const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY
  if (!vapidKey) return // push not configured — in-app only

  try {
    const registration = await navigator.serviceWorker.ready
    let subscription   = await registration.pushManager.getSubscription()

    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      })
    }

    const subJson  = subscription.toJSON()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone

    await supabase.from('push_subscriptions').upsert({
      user_id:       user.id,
      endpoint:      subJson.endpoint,
      keys:          subJson.keys,
      reminder_time: reminderTime,
      timezone,
    }, { onConflict: 'user_id' })
  } catch (err) {
    console.warn('Push subscription failed (in-app reminders still active):', err.message)
  }
}

/** Unsubscribe from push and remove the row from Supabase */
async function unsubscribeFromPush(user) {
  try {
    if ('serviceWorker' in navigator) {
      const registration  = await navigator.serviceWorker.ready
      const subscription  = await registration.pushManager.getSubscription()
      if (subscription) await subscription.unsubscribe()
    }
    if (supabase && user) {
      await supabase.from('push_subscriptions').delete().eq('user_id', user.id)
    }
  } catch (err) {
    console.warn('Push unsubscribe failed:', err.message)
  }
}

/** Sync the reminder time to the server so the cron function knows when to send */
async function syncReminderTime(userId, newTime) {
  if (!supabase) return
  try {
    await supabase
      .from('push_subscriptions')
      .update({ reminder_time: newTime, last_notified: null })
      .eq('user_id', userId)
  } catch {
    // Non-critical — in-app reminder still works
  }
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useReminder() {
  const { user } = useAuth()

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
  // Toggle reminders on/off
  // ------------------------------------------------------------------
  const toggleReminder = useCallback(async (on) => {
    if (on) {
      const perm = await requestPermission()
      if (perm !== 'granted') return false

      // Subscribe to push (for when app is closed)
      await subscribeToPush(user, time)
    } else {
      // Unsubscribe from push
      await unsubscribeFromPush(user)
    }

    setEnabled(on)
    localStorage.setItem(KEYS.enabled, on ? '1' : '0')
    return true
  }, [requestPermission, user, time])

  // ------------------------------------------------------------------
  // Update the preferred reminder time
  // ------------------------------------------------------------------
  const updateTime = useCallback((newTime) => {
    setTime(newTime)
    localStorage.setItem(KEYS.time, newTime)
    localStorage.removeItem(KEYS.lastNotified)

    // Sync to server so the push cron picks up the new time
    if (enabled && user) syncReminderTime(user.id, newTime)
  }, [enabled, user])

  // ------------------------------------------------------------------
  // In-app notification interval (works while app is open)
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!enabled || permission !== 'granted') return

    const check = () => {
      const now = new Date()
      const [h, m] = time.split(':').map(Number)
      const today = now.toLocaleDateString('en-CA')

      if (localStorage.getItem(KEYS.lastNotified) === today) return
      if (now.getHours() < h || (now.getHours() === h && now.getMinutes() < m)) return

      try {
        new Notification('Serenity', {
          body: 'Time for your daily meditation \u{1F33F}',
          icon: '/icons/icon-192.png',
          tag:  'serenity-reminder',
        })
      } catch {
        // Fail silently
      }
      localStorage.setItem(KEYS.lastNotified, today)
    }

    check()
    const interval = setInterval(check, 60_000)
    return () => clearInterval(interval)
  }, [enabled, permission, time])

  return { enabled, time, permission, toggleReminder, updateTime }
}
