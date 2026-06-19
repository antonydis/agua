# 💧 Daily Water Tracker

A lightweight, mobile-first hydration tracker that lives entirely in three static files — no backend, no account, no app store required. Designed to work with an NFC chip on your water bottle: tap your phone, log your intake, done.

## Features

- **Personalized onboarding** — calculates your daily water goal from weight, height, sex, and activity level, with a transparent breakdown of the formula used
- **Configurable bottle size** — set your main button to match your actual bottle (default 900 ml)
- **Contextual greeting** — a card on the home screen with time-of-day and progress-aware messages (different at 8am with 0 ml than at 6pm with goal met)
- **Unlimited history** — every day you've ever logged is kept, with 14-day / 30-day / 3-month / all-time filters and summary stats (best streak, average daily intake, % of days goal was met)
- **Bar chart history** — visual day-by-day view, green bars for days you hit your goal
- **Daily celebration** — confetti + a motivational message the first time you cross your goal each day
- **Streak counter** — tracks consecutive days you've met your goal, both current and all-time best
- **Quick-add buttons** — log 250 / 350 / 500 ml or any custom amount
- **Share your day** — generates a clean 1080×1080 image (name, date, ring progress, stats) via the Web Share API, so you can send it to family without a screenshot
- **Export / Import (JSON)** — back up your full profile and history to a file, and restore it later on a new browser, device, or after reinstalling the PWA
- **Best-effort hourly reminders** — optional notifications (9am–8pm) if you haven't logged water and haven't hit your goal yet, via a service worker
- **Fully offline** — all data stored in `localStorage`, nothing leaves your device, no analytics, no tracking
  
## Files in this repo

| File | Purpose |
|---|---|
| `index.html` | The entire app — UI, logic, onboarding, history, sharing, settings |
| `manifest.json` | PWA manifest, required for installing to the home screen and for Periodic Background Sync |
| `service-worker.js` | Handles notification display and (best-effort) periodic background checks |

## How it works with NFC

1. Deploy this repo to GitHub Pages (see below)
2. Install **NFC Tools** (free, Android/iOS)
3. Write one record to your chip: **URL → your GitHub Pages link**
4. Tap your phone to the chip after finishing a bottle → page opens → log it

No automatic registration on tap — the page opens and you confirm. This avoids accidental entries and lets you see your progress each time.

## Hydration reminders

You can enable hourly reminders during onboarding, or later from ⚙️ **Settings → Reminders**. They fire once per hour, only between 9am–8pm, only if you haven't logged water in the current hour and haven't reached your goal yet.

**Honest limitation:** without a push server (e.g. Firebase Cloud Messaging), no browser can guarantee notifications on a precise schedule while the app is fully closed. This implementation uses three layers, from most to least reliable:

1. **App open or recently minimized** — checks every 5 minutes, fires at most once per hour. This is the reliable path.
2. **Reopening the app** — if it was closed during the active window, checks immediately on open.
3. **Periodic Background Sync** — the browser *may* wake the service worker in the background without any window open, but it decides the real interval (often several hours, not exactly one) based on battery and usage. Some browsers (e.g. Brave) restrict this further by default.

## Data & privacy

All data is stored locally in your browser's `localStorage`. Nothing is sent to any server. Clearing your browser data, switching browsers, or switching devices will erase your history unless you've exported it first.

## Export & import your data

From ⚙️ **Settings**:
- **⬇ Exportar historial (JSON)** downloads a complete backup: your profile plus every logged entry, organized by day, with per-day totals and whether the goal was reached.
- **⬆ Importar historial (JSON)** restores a previously exported file. You'll see exactly how many days are about to be imported and a confirmation before anything is overwritten.

If you're setting up a fresh install (new phone, reinstalled PWA, cleared browser data), the onboarding welcome screen also has a **"¿Ya usabas la app? Restaurar desde un backup"** link that skips the setup questions entirely and restores your saved file.

The exported JSON is plain, readable, and intentionally structured close to a typical health-app schema (`date → total_ml / goal_ml / goal_reached / entries[]`), in case you ever want to bring it into Samsung Health or another tracker manually.

## Share your progress

The **"Compartir mi día"** button on the home screen renders your day's progress as a clean image — name, date, ring percentage, totals, and streak — and opens your phone's native share sheet (WhatsApp, etc.) via the Web Share API. If your browser doesn't support that API, it downloads the image instead.

## Goal calculation

The daily water goal is estimated using a base of 35 ml/kg of body weight, adjusted by a sex factor (×1.08 for male) and an activity multiplier (1.0–1.6). This is a practical heuristic used in general nutrition guidance — not a clinically derived formula. The closest real reference is the U.S. National Academies' Dietary Reference Intakes for Water (2004), which suggests roughly 2.7–3.7 L/day depending on sex; "8 glasses a day" specifically has no strong scientific backing. For medical needs, consult a healthcare provider.

## Settings

Tap ⚙️ at any time to:
- Change your daily goal or main bottle size
- Turn hourly reminders on/off, or send a test notification
- Export or import your full history
- Reset everything to start fresh or hand the app to someone else

## Mobile-first design notes

Typography scales fluidly with `clamp()` based on viewport width rather than fixed pixel sizes, and all interactive elements meet a minimum 44–56px touch target. The viewport doesn't lock pinch-zoom, respecting accessibility defaults.

## Known limitations

- **Single device only.** There's no sync between devices or browsers — each browser's `localStorage` is independent. Export/import is the only way to move data around.
- **Notifications are best-effort**, as described above — there's no guarantee of exact hourly timing without a dedicated push server.
- **The daily goal formula is a heuristic**, not a medical recommendation.

## License

MIT — do whatever you want with it.
