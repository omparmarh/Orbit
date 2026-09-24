# Orbit - Your Social Universe

A premium social sharing app built with React, Vite, TypeScript, and Supabase.

## Features

- **Synchronized Live Rooms** - Watch and discuss content together in real-time
- **Social Circles** - Persistent interest groups with collaborative streaks
- **Discovery Feed** - Topic channels, trending content, and creator drops
- **Community Challenges** - Participate in group challenges and submit entries
- **Bookmarks & Saved Items** - Save content to revisit later
- **Wellbeing Dashboard** - Responsible usage tracking and streak management
- **Full Authentication** - Secure login/signup via Supabase Auth
- **Beautiful Splash Screen** - Animated orbital rings on launch
- **Android APK** - Native mobile app via Capacitor

## Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Auth & Database:** Supabase (PostgreSQL + Auth)
- **Styling:** Vanilla CSS with CSS variables (dark glassmorphism theme)
- **Audio:** Web Audio API for tactile sound feedback
- **Mobile:** Capacitor for Android APK

## Getting Started (Local Development)

1. Clone the repo:
   ```bash
   git clone https://github.com/YOUR_USERNAME/orbit.git
   cd orbit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up Supabase:
   - Create a project at https://supabase.com
   - Copy your Project URL and anon key
   - Create a `.env` file:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your-anon-key
     ```
   - Run the SQL in `supabase/schema.sql` in the Supabase SQL editor

4. Start the dev server:
   ```bash
   npm run dev
   ```

## Deployment

See [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md) for the full step-by-step deployment guide covering:
- GitHub push
- Supabase database setup
- Vercel hosting
- Android APK generation

## Build

```bash
npm run build    # production build
npx cap sync     # sync to Android
npx cap open android  # open in Android Studio
```

## License

MIT
