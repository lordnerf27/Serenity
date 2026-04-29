# Serenity — Project Context for Claude

## What this is
A PWA meditation app built with React + Vite + Tailwind CSS.
Backend: Supabase (auth + database + storage).
Deployed on Vercel. Code lives on GitHub: https://github.com/lordnerf27/Serenity

## Live URL
https://serenity-pi-three.vercel.app

## Tech stack
- React 18 + Vite 5
- Tailwind CSS (custom design tokens in tailwind.config.js)
- React Router v6
- Supabase JS v2
- Lucide React icons
- PWA via vite-plugin-pwa

## Project structure
- src/pages/ — all screens
- src/components/layout/ — AppShell, BottomNav
- src/components/ui/ — Button, Card, Input
- src/context/AuthContext.jsx — Supabase auth wrapper
- src/lib/supabase.js — Supabase client
- src/data/content.js — all placeholder content (themes, sessions, sounds, quotes)

## Screens
- Login / Signup — public routes
- Home — greeting, daily quote, section cards, recent sessions
- Meditate — theme list → MeditateTheme (session list) → Player
- Breathe — technique selector + animated breathing circle
- Sleep — ambient sound grid → Player
- Progress — stats, weekly streak, session history
- Player — full screen audio player (/player/:themeId/:sessionId)

## Design language
Minimalist, light, airy. Feeling of dropping something heavy — freedom and lightness.
Palette: cream backgrounds, sage green accents, mist/lavender secondary, warm stone text.
Mobile-first. Max width container. Rounded corners. Soft shadows. No heavy gradients.

## Coding standards — CRITICAL
- Always use the most effective, architecturally sound solution.
- Never take shortcuts that create technical debt or make future fixes harder.
- If a fix touches one file but the correct fix touches three, touch three.
- Never alter unrelated code just to make something work locally.
- Every new feature should be built in a way that is easy to extend later.

## What's built
- [x] Auth (sign up, sign in, sign out)
- [x] All 5 main screens polished
- [x] 6 meditation themes, 31 sessions with free/locked states
- [x] 8 sleep sounds with free/locked states
- [x] 3 breathing techniques with animated timer
- [x] Full audio player screen (UI complete, awaiting real audio)
- [x] Supabase connected and deployed on Vercel

## What's next (in order)
1. Connect audio files via Supabase Storage
2. Build progress tracking (Supabase DB: sessions table)
3. Subscription/Stripe (later, tiers TBD)
4. Custom domain (later)

## Audio
- Hosted in Supabase Storage bucket: "audio" (public)
- URLs stored in src/data/content.js on each session/sound object as `audioUrl`
- Player.jsx reads audioUrl from content and sets it as audio src

## Environment variables
VITE_SUPABASE_URL — project URL
VITE_SUPABASE_ANON_KEY — anon public key
(Set in Vercel dashboard + .env locally in Codespaces)
