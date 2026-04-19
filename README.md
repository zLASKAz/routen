# Routn_ — Personal Routine Tracker

A sleek, mobile-first personal routine tracking PWA built with Next.js, Tailwind CSS, and Framer Motion.

## Features

- 📅 **7-Day Dynamic Schedule** — Mon-Sun with unique layouts per day
- ✅ **Mark as Done** — Toggle tasks complete, persisted in LocalStorage
- ✏️ **Edit Activities** — Full modal editor for name, time, duration, category, and days
- ➕ **Add Activities** — Create new activities via the floating action button
- 🔔 **Smart Notifications** — Browser push notifications 5 min before and at task start
- 📱 **PWA Ready** — Install on your phone, works offline with service worker
- 🌙 **Sunday Recharge** — Special relaxing UI on Sundays with no reminders
- ⏱️ **Live Timeline** — Visual progress bar showing how far through the day you are
- 🎨 **Dark Purple & Neon Theme** — Glassmorphism cards with neon purple accents

## Tech Stack

- **Next.js** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — Smooth animations
- **Radix UI** — Accessible dialog/modal primitives
- **Lucide React** — Beautiful icons
- **PWA** — Service worker + manifest for mobile installation

## Getting Started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) on your mobile device or browser.

## Deployment

Ready for **Vercel** deployment:

```bash
vercel deploy
```

Or push to GitHub and connect to Vercel for automatic deployments.

## Notification Setup

1. Open the app in your browser
2. Tap the **bell icon** in the top-right corner
3. Allow notifications when prompted
4. You'll receive alerts 5 minutes before and at the start of each activity
