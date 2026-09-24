# Orbit - Deployment Checklist
# Legend: [DONE] = Agent completed | [YOU] = You must do this manually

=======================================================================
  AGENT STATUS: All terminal work is COMPLETE. 3 commits ready to push.
  Your repo has: auth, splash, logo, Android platform, production build.
=======================================================================

---

## PHASE 1 - Git and GitHub

[DONE] .gitignore created
[DONE] Git initialised + 3 commits made:
       - commit 1: all app code (auth, splash, logo, Supabase)
       - commit 2: Capacitor config + README
       - commit 3: Android platform + web assets synced
[DONE] Working tree clean (nothing left to commit)

[YOU] PUSH TO GITHUB  <-- START HERE
--------------------------------------
  1. Go to https://github.com/new  (log in with omhparmar2008@gmail.com)
  2. Repository name: orbit
  3. Set to: Public
  4. Do NOT tick any checkboxes (no README, no .gitignore)
  5. Click "Create repository"
  6. GitHub shows you commands. Run these in Terminal:

     cd "/Users/macbookair/Documents/my projects/orbit"
     git remote add origin https://github.com/YOUR_USERNAME/orbit.git
     git branch -M main
     git push -u origin main

     NOTE: Replace YOUR_USERNAME with your actual GitHub username.
     When prompted for password - use a Personal Access Token (not your password):
     -> https://github.com/settings/tokens/new
     -> Name: orbit | Expiry: 90 days | Tick "repo" | Generate | Copy the token

---

## PHASE 2 - Supabase (Auth and Database)

[YOU] STEP 1: Create Supabase project
  1. Go to https://supabase.com -> Start your project
  2. Sign in with Google (omhparmar2008@gmail.com)
  3. New Project:
     - Name: orbit-social
     - DB Password: OrbitSocial2024#   <-- SAVE THIS
     - Region: Southeast Asia
  4. Wait ~1 min for project to start

[YOU] STEP 2: Create .env file with your keys
  1. Supabase Dashboard -> Project Settings -> API
  2. Copy "Project URL" and "anon public" key
  3. In Terminal run:

     cd "/Users/macbookair/Documents/my projects/orbit"
     echo 'VITE_SUPABASE_URL=PASTE_URL_HERE' > .env
     echo 'VITE_SUPABASE_ANON_KEY=PASTE_KEY_HERE' >> .env

     (Replace PASTE_URL_HERE and PASTE_KEY_HERE with your real values)

[YOU] STEP 3: Run this SQL in Supabase SQL Editor
  Supabase Dashboard -> SQL Editor -> New query -> paste all of this -> Run:

  ---- COPY FROM HERE ----
  create extension if not exists "uuid-ossp";
  create table if not exists public.profiles (
    id uuid references auth.users on delete cascade not null primary key,
    display_name text not null,
    username text unique not null,
    avatar_url text,
    bio text,
    created_at timestamptz default now() not null
  );
  alter table public.profiles enable row level security;
  create policy "Public profiles are viewable by everyone." on public.profiles
    for select using (true);
  create policy "Users can insert their own profile." on public.profiles
    for insert with check (auth.uid() = id);
  create policy "Users can update own profile." on public.profiles
    for update using (auth.uid() = id);
  create or replace function public.handle_new_user()
  returns trigger as $$
  begin
    insert into public.profiles (id, display_name, username, avatar_url)
    values (
      new.id,
      coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
      coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
      'https://api.dicebear.com/7.x/avataaars/svg?seed=' || new.id
    );
    return new;
  end;
  $$ language plpgsql security definer;
  create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();
  ---- COPY TO HERE ----

  You should see: "Success. No rows returned."

[YOU] STEP 4: Test locally
  In Terminal:
     cd "/Users/macbookair/Documents/my projects/orbit"
     npm run dev
  Open http://localhost:5173 - you should see splash -> login -> app

---

## PHASE 3 - Deploy Live Web App (Vercel)

[YOU] DEPLOY (do this after Supabase is set up)
  In Terminal:

     cd "/Users/macbookair/Documents/my projects/orbit"
     npx vercel login
     (choose Continue with GitHub -> approve in browser)

     npx vercel
     (answer: Y, your username, N for existing, "orbit" for name, Enter rest)

     npx vercel --prod
     (this gives you the final live URL)

  Then add env vars to Vercel:
  1. Go to https://vercel.com/dashboard -> orbit project
  2. Settings -> Environment Variables
  3. Add: VITE_SUPABASE_URL = (your URL)
  4. Add: VITE_SUPABASE_ANON_KEY = (your key)
  5. Deployments -> Redeploy latest

---

## PHASE 4 - Android APK

[DONE] Capacitor installed and configured (com.orbit.social)
[DONE] Android platform created (android/ folder exists with all files)
[DONE] Web build synced into Android assets
[DONE] App name set to "Orbit", background color #070d1a (dark)

[YOU] GENERATE APK
  1. Download Android Studio: https://developer.android.com/studio
  2. Install with default settings. Open once (downloads Android SDK ~5 min)
  3. In Terminal:
       cd "/Users/macbookair/Documents/my projects/orbit"
       npm run build && npx cap sync && npx cap open android
  4. In Android Studio - wait for Gradle sync to finish
  5. Build -> Generate Signed Bundle / APK... -> APK -> Next
  6. Create new keystore:
       Path: ~/Desktop/orbit-keystore.jks
       Password: OrbitKey2024#
       Alias: orbit
       Key password: OrbitKey2024#
  7. Next -> release -> Finish
  8. APK location: android/app/build/outputs/apk/release/app-release.apk

---

## SUMMARY - What is in your project RIGHT NOW

  src/components/SplashScreen.tsx   - animated splash with orbital rings
  src/components/AuthScreen.tsx     - dark glassmorphism login/signup
  src/context/AuthContext.tsx       - Supabase auth (signIn/signUp/signOut)
  src/lib/supabase.ts               - Supabase client config
  src/components/OrbitLogo.tsx      - real logo image with glow effect
  src/components/Header.tsx         - header with sign-out button
  public/orbit-logo.jpg             - AI-generated Orbit logo
  android/                          - full Android project (ready for Studio)
  capacitor.config.ts               - Capacitor config for Android
  DEPLOY_CHECKLIST.md               - this file
  README.md                         - GitHub project description
  .env.example                      - template for your env variables
  .gitignore                        - protects .env from being committed
