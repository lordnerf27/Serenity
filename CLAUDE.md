# Serenity — Project Context for Claude

## What this is
A PWA meditation app built with React + Vite + Tailwind CSS.
Backend: Supabase (auth + database + storage).
Deployed on Vercel. Code lives on GitHub: https://github.com/lordnerf27/Serenity

## Who is Ibrahim
Zero coding experience. Needs every step explained. Wants the highest quality, architecturally sound code — not quick fixes. Always use the most effective method. If the correct fix touches 3 files, touch 3.

## Live URL
https://serenity-pi-three.vercel.app

## Tech stack
- React 18 + Vite 5
- Tailwind CSS (custom design tokens in tailwind.config.js)
- React Router v6
- Supabase JS v2
- Lucide React icons
- framer-motion (installed, available)
- PWA via vite-plugin-pwa

## Project structure
- src/pages/ — all screens
- src/components/layout/ — AppShell, BottomNav
- src/components/ui/ — Button, Card, Input, SleepTimer, PWAInstallBanner, MoodSelector
- src/context/AuthContext.jsx — Supabase auth wrapper
- src/lib/supabase.js — Supabase client (null if env vars missing)
- src/hooks/useMediaSession.js — Media Session API (lock screen audio)
- src/hooks/useProgress.js — session fetch/stats from Supabase + saveSession() + updateSessionMood()
- src/hooks/useReminder.js — daily reminder notifications (browser Notification API)
- src/data/content.js — all content (themes, sessions, sounds, quotes)

## Screens / Routes
- /login, /signup — public auth
- /forgot-password — public, email reset
- /reset-password — unguarded, receives Supabase recovery token from email link
- /onboarding — private, first-run 3-step flow
- / — Home (with "Continue where you left off" showing last session)
- /meditate → /meditate/:themeId — theme list → session list
- /breathe — breathing techniques
- /sleep — ambient sound grid
- /progress — stats, streak, history, mood trend, reminder settings
- /player/:themeId/:sessionId — full-screen audio player (with pre-session mood check-in)
- /complete — post-session completion screen (with post-session mood check-in)

## Design language
Minimalist, light, airy. Palette: cream backgrounds, sage green accents, mist/lavender secondary, warm stone text.
Mobile-first. Max width container. Rounded corners. Soft shadows.
Custom Tailwind tokens: cream (50/100/200), sage (300/400/500), mist (300/400), stone (400/600/800)

## Coding standards — CRITICAL
- Always use the most effective, architecturally sound solution.
- Never take shortcuts that create technical debt or make future fixes harder.
- If a fix touches one file but the correct fix touches three, touch three.
- Never alter unrelated code just to make something work locally.
- Every new feature should be built in a way that is easy to extend later.

## What's built (complete)
- [x] Auth: sign up → onboarding → home, sign in, sign out
- [x] Forgot password + reset password (full email flow)
- [x] Onboarding (3-step: welcome, goal, experience — localStorage persisted)
- [x] All 5 main screens (Home, Meditate, Breathe, Sleep, Progress)
- [x] 6 meditation themes, 31 sessions
- [x] 8 sleep sounds
- [x] 3 breathing techniques with animated timer
- [x] Full audio player (progress bar, volume, skip ±15s)
- [x] Media Session API (lock screen controls, background playback)
- [x] Sleep timer (15/30/60/90m, auto-stops audio)
- [x] Session completion screen
- [x] Session saving to Supabase on completion
- [x] Progress tracking (streak, total time, weekly activity, session history)
- [x] PWA install banner (beforeinstallprompt)
- [x] PWA manifest + service worker
- [x] Vercel auto-deploy
- [x] Pre-session mood check-in (5-emoji scale, skippable, meditation only)
- [x] Post-session mood check-in (before→after journey display)
- [x] Mood trend on Progress page (average before vs after)
- [x] Daily reminder notifications (browser Notification API, time picker, toggle)
- [x] "Continue where you left off" on Home (shows last session from Supabase)
- [x] Sleep sounds navigate to /sleep on end (not /complete)
- [x] Real streak value on completion screen

## Supabase
- URL: https://ndvsnpxdcjkgeeyogrex.supabase.co
- Storage bucket: "Audio" (public) — holds MP3 files
- Database table: "sessions"
- sessions table: id, user_id, theme_id, session_id, session_title, duration_seconds, completed_at, mood_before, mood_after

## Audio
- 3 sessions have audioUrl: dc-1 (calm/relaxation 5min), sf-1 (deep focus 7min), ea-1 (anxiety 10min)
- Sleep sounds have no audio yet
- URLs stored in src/data/content.js on each session object as `audioUrl`
- & in filenames must be encoded as %26 in URL strings

## LocalStorage
- serenity_onboarded = '1' (skip onboarding)
- serenity_goal = e.g. 'stress' (user's selected goal)
- serenity_experience = e.g. 'new' (experience level)
- serenity_pwa_dismissed = '1' (skip PWA banner)
- serenity_reminder_enabled = '1' (daily reminder on)
- serenity_reminder_time = e.g. '08:00' (preferred reminder time)
- serenity_reminder_last_notified = 'YYYY-MM-DD' (prevents duplicate daily notifications)

## Known remaining issues
1. No audio for 28 meditation sessions or any sleep sounds yet
2. No subscription/paywall built yet (sessions without audioUrl show lock icon visually only)
3. Reminder notifications only fire while app is open (no push server yet)

## Environment variables
VITE_SUPABASE_URL — project URL
VITE_SUPABASE_ANON_KEY — anon public key
(Set in Vercel dashboard + .env locally in Codespaces)

## Dev environment
GitHub Codespaces. Run: npm run dev -- --host
Two terminals: npm terminal + git terminal.
Port must be set to Public in Codespaces PORTS tab.
