# 💧 Daily Water Tracker

A lightweight, mobile-first hydration tracker that lives entirely in a single HTML file (no backend, no account, no app install required). Designed to work with an NFC chip on your water bottle: tap your phone, log your intake, done.

## Features

- **Personalized onboarding** — calculates your daily water goal based on weight, height, sex, and activity level
- **Configurable bottle size** — set your main button to match your actual bottle (default 900 ml)
- **Bar chart history** — last 14 days at a glance, green bars for days you hit your goal
- **Daily celebration** — confetti + motivational message when you reach your target
- **Streak counter** — tracks consecutive days you've met your goal
- **Quick-add buttons** — log 250 / 350 / 500 ml or any custom amount
- **Fully offline** — all data stored in `localStorage`, nothing leaves your device
- **Shareable** — anyone who opens the URL sets up their own independent profile

## How it works with NFC

1. Deploy this repo to GitHub Pages (see below)
2. Install **NFC Tools** (free, Android/iOS)
3. Write one record to your chip: **URL → your GitHub Pages link**
4. Tap your phone to the chip after finishing a bottle → page opens → log it

No automatic registration on tap — the page opens and you confirm. This avoids accidental entries and lets you see your progress each time.

## Data & privacy

All data is stored locally in your browser's `localStorage`. Nothing is sent to any server. Clearing your browser data will erase your history — there is no cloud backup.

## Goal calculation

The daily water goal is estimated using a base of 35 ml/kg of body weight, adjusted by a sex factor and an activity multiplier. This is a practical heuristic used in general nutrition guidance — not a clinically derived formula. For medical needs, consult a healthcare provider.

## Settings

Tap ⚙️ at any time to change your daily goal or bottle size without redoing onboarding. Use **Reset** to start fresh or set up a different profile.

## License

MIT — do whatever you want with it.
