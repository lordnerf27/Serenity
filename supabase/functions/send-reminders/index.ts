/**
 * send-reminders — Supabase Edge Function
 *
 * Runs on a cron schedule (every 15 minutes). For each user with push
 * notifications enabled, checks whether:
 *   1. The current time in their timezone is past their reminder time
 *   2. They haven't already been notified today
 *
 * If both conditions are met, sends a Web Push notification and marks
 * them as notified for today.
 *
 * Required secrets (set via `supabase secrets set`):
 *   VAPID_PUBLIC_KEY  — same key used on the client
 *   VAPID_PRIVATE_KEY — private key (never shared with client)
 *   VAPID_EMAIL       — contact email for VAPID (e.g. mailto:you@example.com)
 *
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are available automatically.
 */

import { createClient } from 'npm:@supabase/supabase-js@2'
import webpush from 'npm:web-push@3.6.7'

Deno.serve(async (_req: Request) => {
  try {
    // --- Environment ---
    const supabaseUrl  = Deno.env.get('SUPABASE_URL')!
    const serviceKey   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const vapidPublic  = Deno.env.get('VAPID_PUBLIC_KEY')!
    const vapidPrivate = Deno.env.get('VAPID_PRIVATE_KEY')!
    const vapidEmail   = Deno.env.get('VAPID_EMAIL') || 'mailto:noreply@serenity.app'

    webpush.setVapidDetails(vapidEmail, vapidPublic, vapidPrivate)

    const supabase = createClient(supabaseUrl, serviceKey)

    // --- Fetch all push subscriptions ---
    const { data: subscriptions, error } = await supabase
      .from('push_subscriptions')
      .select('*')

    if (error) throw error

    const now = new Date()
    let sent = 0
    let skipped = 0

    for (const sub of subscriptions ?? []) {
      // Determine the current time in the user's timezone
      const userTimeStr = now.toLocaleString('en-US', {
        timeZone: sub.timezone || 'UTC',
        hour12: false,
      })
      const userNow   = new Date(userTimeStr)
      const userToday = now.toLocaleDateString('en-CA', { timeZone: sub.timezone || 'UTC' })

      // Parse the user's preferred reminder time (HH:MM)
      const [rH, rM] = (sub.reminder_time || '08:00').split(':').map(Number)

      // Skip if already notified today
      if (sub.last_notified === userToday) { skipped++; continue }

      // Skip if not yet past the reminder time in their timezone
      if (userNow.getHours() < rH || (userNow.getHours() === rH && userNow.getMinutes() < rM)) {
        skipped++
        continue
      }

      // --- Send push ---
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: sub.keys },
          JSON.stringify({
            title: 'Serenity',
            body: 'Time for your daily meditation 🌿',
            url: '/',
          })
        )

        // Mark as notified today
        await supabase
          .from('push_subscriptions')
          .update({ last_notified: userToday })
          .eq('user_id', sub.user_id)

        sent++
      } catch (pushErr: any) {
        // 410 Gone or 404 = subscription expired/invalid → clean up
        if (pushErr.statusCode === 410 || pushErr.statusCode === 404) {
          await supabase
            .from('push_subscriptions')
            .delete()
            .eq('user_id', sub.user_id)
        }
        console.error(`Push failed for ${sub.user_id}:`, pushErr.message)
      }
    }

    return new Response(
      JSON.stringify({ ok: true, sent, skipped, total: subscriptions?.length ?? 0 }),
      { headers: { 'Content-Type': 'application/json' } }
    )
  } catch (err: any) {
    console.error('send-reminders error:', err)
    return new Response(
      JSON.stringify({ ok: false, error: err.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
