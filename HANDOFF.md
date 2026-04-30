# Serenity — Full Project Handoff

## Who is Ibrahim?
Zero coding experience. Needs every step explained. Wants the **highest quality, architecturally sound code** — not quick fixes or shortcuts. If the correct fix touches 3 files, touch 3. Never take shortcuts that create technical debt. He is hands-on but relies entirely on Claude to write all code.

---

## What is Serenity?
A mobile-first **PWA meditation app** (think: Calm/Headspace). Users can do guided meditation, breathing exercises, and sleep sounds. Sessions are tracked in Supabase. Deployed on Vercel, code on GitHub. Built with React + Vite + Tailwind CSS.

---

## Infrastructure

| Thing | Detail |
|---|---|
| **GitHub repo** | https://github.com/lordnerf27/Serenity.git |
| **Live URL** | https://serenity-pi-three.vercel.app |
| **Supabase project** | `ndvsnpxdcjkgeeyogrex` → https://ndvsnpxdcjkgeeyogrex.supabase.co |
| **Supabase Storage bucket** | `Audio` (public) |
| **Vercel** | Auto-deploys on every `git push origin main` |
| **Dev environment** | GitHub Codespaces (browser-based). Run `npm run dev -- --host` to start. Two terminals: one for npm, one for git. |
| **Codespaces port** | Must be set to **Public** in the PORTS tab or the preview won't load |

### Environment Variables
Set in both Vercel dashboard and Codespaces `.env`:
```
VITE_SUPABASE_URL=https://ndvsnpxdcjkgeeyogrex.supabase.co
VITE_SUPABASE_ANON_KEY=<legacy anon key from Supabase API settings>
```

---

## Tech Stack

```
React 18 + Vite 5
Tailwind CSS 3 (custom design tokens — see tailwind.config.js)
React Router v6
Supabase JS v2
Lucide React (icons)
framer-motion (installed, available for animations)
vite-plugin-pwa (PWA manifest + service worker)
```

---

## Design Language

Minimalist, light, airy. "Dropping something heavy — freedom and lightness."

**Custom Tailwind tokens:**
```js
cream:  { 50: '#FAFAF8', 100: '#F5F0EB', 200: '#EDE6DC' }
sage:   { 300: '#B8D0C4', 400: '#8BAF9E', 500: '#6A9485' }  // primary accent
mist:   { 300: '#D6CCE8', 400: '#B8A8D4' }                  // secondary
stone:  { 400: '#9B9590', 600: '#6B6560', 800: '#3A3530' }  // text
```
Custom shadows: `shadow-soft`, `shadow-card`
Font: Inter
All corners heavily rounded (2xl, 3xl, 4xl). Mobile-first. Max-width container (`max-w-md mx-auto`).

---

## Project File Structure

```
serenity/
├── src/
│   ├── main.jsx                        # React entry point
│   ├── App.jsx                         # Router, PrivateRoute, PublicRoute, all routes
│   ├── context/
│   │   └── AuthContext.jsx             # Supabase auth wrapper (signIn, signUp, signOut, user, loading)
│   ├── lib/
│   │   └── supabase.js                 # Creates Supabase client (null if env vars missing)
│   ├── hooks/
│   │   ├── useMediaSession.js          # Media Session API hook (lock screen audio controls)
│   │   └── useProgress.js             # Fetches sessions from Supabase, computes streak/stats. Also exports saveSession()
│   ├── data/
│   │   └── content.js                  # All content: meditationThemes, sleepSounds, dailyQuotes
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.jsx            # Wraps all tabbed screens with <Outlet /> + BottomNav
│   │   │   └── BottomNav.jsx           # 5-tab nav: Home, Meditate, Breathe, Sleep, Progress
│   │   └── ui/
│   │       ├── Button.jsx              # Primary button component
│   │       ├── Card.jsx                # White rounded card with shadow
│   │       ├── Input.jsx               # Form input with label
│   │       ├── SleepTimer.jsx          # Countdown timer for sleep sounds (15/30/60/90m)
│   │       └── PWAInstallBanner.jsx    # "Add to home screen" prompt banner
│   └── pages/
│       ├── Home.jsx                    # Greeting, daily quote, section cards, PWAInstallBanner
│       ├── Meditate.jsx                # Theme grid
│       ├── MeditateTheme.jsx           # Session list for a theme
│       ├── Breathe.jsx                 # 3 breathing techniques with animated timer
│       ├── Sleep.jsx                   # Sleep sound grid
│       ├── Progress.jsx                # Stats, streak, weekly activity, session history
│       ├── Player.jsx                  # Full-screen audio player (used for both meditation + sleep)
│       ├── Completion.jsx              # Post-session screen (duration, streak, message)
│       ├── Login.jsx                   # Sign in form + forgot password link
│       ├── Signup.jsx                  # Sign up form → redirects to /onboarding
│       ├── ForgotPassword.jsx          # Email reset request screen
│       ├── ResetPassword.jsx           # New password form (handles Supabase token from email link)
│       └── Onboarding.jsx              # 3-step first-run flow (welcome → goal → experience)
├── vite.config.js                      # Vite + PWA plugin config
├── tailwind.config.js                  # Custom design tokens
├── package.json
└── CLAUDE.md                           # In-project context file for Claude
```

---

## Routing (App.jsx)

```
PUBLIC (redirect to / if already logged in):
  /login             → Login.jsx
  /signup            → Signup.jsx
  /forgot-password   → ForgotPassword.jsx

UNGUARDED (no auth check — needed because Supabase sends recovery token here):
  /reset-password    → ResetPassword.jsx

PRIVATE (redirect to /login if not logged in, redirect to /onboarding if not onboarded):
  /onboarding        → Onboarding.jsx        (full screen, no nav)
  /player/:themeId/:sessionId → Player.jsx   (full screen, no nav)
  /complete          → Completion.jsx         (full screen, no nav)

PRIVATE + AppShell (bottom nav shown):
  /                  → Home.jsx
  /meditate          → Meditate.jsx
  /meditate/:themeId → MeditateTheme.jsx
  /breathe           → Breathe.jsx
  /sleep             → Sleep.jsx
  /progress          → Progress.jsx
```

**Onboarding guard in PrivateRoute:**
If user is logged in but `localStorage.getItem('serenity_onboarded')` is falsy AND they're not already on `/onboarding`, redirect to `/onboarding`.

---

## Supabase Database

### Sessions Table (must be created via SQL Editor)
```sql
CREATE TABLE sessions (
  id               uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  theme_id         text        NOT NULL,
  session_id       text        NOT NULL,
  session_title    text        NOT NULL,
  duration_seconds integer     NOT NULL,
  completed_at     timestamptz DEFAULT now()
);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions"
  ON sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```
> ⚠️ If Ibrahim hasn't run this yet, progress tracking won't work. Check Supabase → Table Editor to confirm `sessions` table exists.

---

## Audio Files

Hosted in Supabase Storage bucket `Audio` (public). 3 sessions currently have audio:

| Session | File | audioUrl in content.js |
|---|---|---|
| dc-1 Body Scan Release | `5 min track - calm & relaxation.mp3` | `...Audio/5%20min%20track%20-%20calm%20%26%20relaxation.mp3` |
| sf-1 Single Point | `7 min track - deep focus.mp3` | `...Audio/7%20min%20track%20-%20deep%20focus.mp3` |
| ea-1 Grounding Now | `10 min track - ANXIETY.mp3` | `...Audio/10%20min%20track%20-%20ANXIETY.mp3` |

**Important:** `&` in filenames must be encoded as `%26` in the URL string.
All other sessions/sounds show "Audio coming soon" — Player gracefully handles `audioUrl: undefined`.
Sleep sounds have NO audio URLs yet.

---

## Key Hooks

### `useMediaSession` (`src/hooks/useMediaSession.js`)
Wraps the browser Media Session API. Keeps audio playing on lock screen, shows controls in notification shade.
```js
const mediaSession = useMediaSession({ title, onPlay, onPause, onSeekBack, onSeekForward })
mediaSession.update(playing)  // call whenever playing state changes
mediaSession.clear()          // call on unmount
```

### `useProgress` (`src/hooks/useProgress.js`)
Fetches all sessions for the logged-in user. Computes:
- `currentStreak` — consecutive calendar days with ≥1 session
- `totalMinutes` — sum of all session durations
- `totalSessions` — count
- `weekActivity` — `boolean[7]`, Mon=0 to Sun=6, true if session that day this week
- `recentSessions` — last 10 sessions, most recent first

```js
const { data, loading, error, refetch } = useProgress()
```

### `saveSession` (exported from `useProgress.js`)
```js
await saveSession({ userId, themeId, sessionId, sessionTitle, durationSeconds })
```
Called in `Player.jsx → handleEnded()` for non-sleep sessions.

---

## LocalStorage Keys

| Key | Value | Set by |
|---|---|---|
| `serenity_onboarded` | `'1'` | Onboarding.jsx on finish |
| `serenity_goal` | e.g. `'stress'` | Onboarding.jsx |
| `serenity_experience` | e.g. `'new'` | Onboarding.jsx |
| `serenity_pwa_dismissed` | `'1'` | PWAInstallBanner.jsx on dismiss |

---

## Content Data (`src/data/content.js`)

### Meditation Themes (6 total)
| id | title | emoji | Sessions |
|---|---|---|---|
| `deep-calm` | Deep Calm | 🌊 | 6 sessions |
| `sharp-focus` | Sharp Focus | 🎯 | 5 sessions |
| `restful-sleep` | Restful Sleep | 🌙 | 7 sessions |
| `ease-anxiety` | Ease Anxiety | 🍃 | 5 sessions |
| `morning-start` | Morning Start | ☀️ | 4 sessions |
| `self-compassion` | Self-Compassion | 🌸 | 4 sessions |

### Sleep Sounds (8 total)
`rain`, `ocean`, `forest`, `fire`, `cafe`, `wind`, `stream`, `white`
None have audio URLs yet.

### Player URL format
`/player/:themeId/:sessionId` e.g. `/player/deep-calm/dc-1`
For sleep: `/player/sleep/rain`

---

## What's Fully Working ✅

- Auth (sign up → onboarding → home, sign in, sign out, forgot password, reset password)
- All 5 main screens (Home, Meditate, Breathe, Sleep, Progress)
- All meditation themes and session lists (locked state shown for sessions without audio)
- 3 breathing techniques with animated circle timer
- Full audio player with progress bar, volume, skip ±15s
- Media Session API (lock screen controls, background audio)
- Sleep timer (15/30/60/90m, auto-stops audio)
- Session completion screen (shown after audio ends)
- Session saving to Supabase (non-sleep only)
- Progress tracking (real data from Supabase: streak, total time, weekly activity, history)
- Onboarding flow (3 steps, persisted to localStorage)
- PWA install banner (Android/Chrome prompt)
- Forgot password email flow
- Reset password page (receives Supabase token from email link)
- Vercel auto-deploy working
- PWA manifest + service worker configured

---

## Known Issues / Things Left To Do

### 🔴 Immediate — NOT yet pushed to GitHub
These fixes were made in the last session but **not committed yet**:

1. **`Completion.jsx`** — Fixed `navigate()` called during render → changed to `<Navigate to="/" replace />`
2. **`ResetPassword.jsx`** — Created (was missing). `/reset-password` route now exists in App.jsx.

**To push:**
```bash
git add src/pages/Completion.jsx src/pages/ResetPassword.jsx src/App.jsx
git commit -m "fix: navigate-during-render in Completion, add missing ResetPassword page"
git push origin main
```

### 🟡 Minor — Streak is always null on completion screen
In `Player.jsx → handleEnded()`, `streak: null` is hardcoded when navigating to `/complete`. The streak badge on the completion screen never appears. Fix: import `useProgress` in Player.jsx, call `const { data: progressData } = useProgress()`, and pass `streak: progressData?.currentStreak ?? null` in the navigate call.

### 🟡 Minor — Sleep sounds go to completion screen when audio ends
If a sleep sound file were uploaded and ended naturally, the completion screen would appear. For sleep sounds, it would be better to just navigate back to `/sleep`. In `Player.jsx → handleEnded()`, add: `if (isSleep) { navigate('/sleep', { replace: true }); return }` before the meditation save/navigate block.

### 🔵 Future — More audio files needed
28 meditation sessions and all 8 sleep sounds have no audio yet. Ibrahim creates these via ElevenLabs or similar tools and uploads to Supabase Storage bucket `Audio`. Once uploaded, add the URL to that session's object in `src/data/content.js` as `audioUrl: '...'`.

### 🔵 Future — Subscription/paywall (Stripe)
Sessions without `audioUrl` show a lock icon. The free/locked tier system is visually stubbed but not enforced. Future: Stripe integration, `is_premium` flag on user profile.

### 🔵 Future — Custom domain
Currently on `serenity-pi-three.vercel.app`. Will need a custom domain later.

### 🔵 Future — Home screen "Continue where you left off"
Currently shows a placeholder card. Should show the user's most recently played session from the progress data.

### 🔵 Future — Real name on profile
Currently the username is derived from the email address (`email.split('@')[0]`). Could add a `profiles` table in Supabase to store display names.

---

## Common Commands

```bash
# Start dev server (in Codespaces npm terminal)
npm run dev -- --host

# Push to GitHub (in Codespaces bash terminal)
git add <files>
git commit -m "description"
git push origin main

# If push is rejected (non-fast-forward)
git pull --rebase origin main
git push origin main
```

---

## Coding Standards (Critical)

From `CLAUDE.md` — Ibrahim has explicitly asked for this:
- Always use the **most effective, architecturally sound solution**
- Never take shortcuts that create technical debt
- If a fix touches one file but the correct fix touches three, **touch three**
- Never alter unrelated code just to make something work locally
- Every new feature should be **easy to extend later**
- Ibrahim has zero coding experience — **explain every step** when giving instructions he needs to follow manually (e.g., Supabase SQL, Vercel settings)

---

## Current State Summary

The app is **production-ready for its current feature set**. It is live, deployed, and fully functional for users who sign up. The sessions table may or may not exist in Supabase depending on whether Ibrahim ran the SQL. Two small bug fixes from the latest audit (Completion.jsx + ResetPassword.jsx) are written but not yet committed — that's the immediate next action.
