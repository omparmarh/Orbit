# Orbit - Deployment Checklist
# Legend: [DONE] = Agent completed | [YOU] = You must do this | [WAITING] = Agent waiting on your action

---

## PHASE 1 - Git and GitHub

[DONE] .gitignore created
[DONE] Git repository initialised (git init)
[DONE] First commit made (46 files committed)
[DONE] README.md written with full project description
[DONE] Second commit made (Capacitor config + README)

[YOU] CREATE GITHUB REPO AND PUSH  <-- DO THIS NOW
======================================================
  1. Open https://github.com/new in your browser
  2. Log in with: omhparmar2008@gmail.com
  3. Repository name: orbit
  4. Set to: Public
  5. Do NOT tick "Add README" or "Add .gitignore" (we already have them)
  6. Click "Create repository"
  7. GitHub will show you a page. Find the section "push an existing repository"
  8. Copy those 2 commands and paste them in your Terminal.
     They will look like this (with YOUR actual username filled in):

     git remote add origin https://github.com/omhparmar2008/orbit.git
     git branch -M main
     git push -u origin main

  NOTE: When it asks for username = your GitHub username
        When it asks for password = use a Personal Access Token (NOT your password):
        - Go to: https://github.com/settings/tokens/new
        - Name: orbit-push
        - Expiration: 90 days
        - Tick the "repo" checkbox
        - Click "Generate token"
        - Copy that token and use it as the password

---

## PHASE 2 - Supabase (Auth and Database)

[WAITING] Agent is waiting for you to complete this before deployment works

[YOU] CREATE SUPABASE PROJECT
  1. Open https://supabase.com in your browser
  2. Click "Start your project" - sign in with Google (omhparmar2008@gmail.com)
  3. Click "New Project":
     - Name: orbit-social
     - DB password: OrbitSocial2024#   (SAVE THIS SOMEWHERE SAFE)
     - Region: Southeast Asia (or nearest to you)
  4. Wait about 1 minute for the project to spin up

[YOU] COPY SUPABASE KEYS AND CREATE .env FILE
  1. In Supabase dashboard -> Project Settings -> API
  2. Copy the "Project URL" (looks like: https://xxxx.supabase.co)
  3. Copy the "anon public" key (long text under "Project API keys")
  4. Open Terminal and run these commands exactly:

     cd "/Users/macbookair/Documents/my projects/orbit"
     echo 'VITE_SUPABASE_URL=PASTE_YOUR_URL_HERE' > .env
     echo 'VITE_SUPABASE_ANON_KEY=PASTE_YOUR_KEY_HERE' >> .env

     (Replace PASTE_YOUR_URL_HERE and PASTE_YOUR_KEY_HERE with the real values)

[YOU] RUN DATABASE SQL IN SUPABASE
  1. Supabase dashboard -> SQL Editor -> click "New query"
  2. Paste the entire block below and click Run:
  3. You should see: "Success. No rows returned."

--- PASTE ALL OF THIS SQL ---
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
--- END SQL ---

---

## PHASE 3 - Deploy Frontend to Vercel (Live Web App)

[DONE] Vercel CLI ready (use via npx vercel)
[DONE] Production build passes (npm run build verified)

[YOU] DEPLOY TO VERCEL  <-- Do this AFTER finishing Supabase setup above
  Open Terminal and run these commands one at a time:

  Step A - Go to project:
     cd "/Users/macbookair/Documents/my projects/orbit"

  Step B - Login to Vercel:
     npx vercel login
     (Choose "Continue with GitHub" and approve in the browser that opens)

  Step C - Deploy:
     npx vercel

     When asked:
     - "Set up and deploy?" -> press Y then Enter
     - "Which scope?" -> pick your username
     - "Link to existing project?" -> press N then Enter
     - "Project name?" -> type: orbit  then Enter
     - Leave everything else as default (just press Enter)

  Step D - Make it live (production):
     npx vercel --prod

  Your live URL will print out. It will look like: https://orbit-xyz.vercel.app

  Step E - Add environment variables in Vercel dashboard:
  1. Go to https://vercel.com/dashboard
  2. Click on your "orbit" project
  3. Click Settings -> Environment Variables
  4. Add these two:
     Name: VITE_SUPABASE_URL        Value: (your supabase URL from phase 2)
     Name: VITE_SUPABASE_ANON_KEY   Value: (your supabase anon key from phase 2)
  5. Click Deployments -> click the three dots on latest -> Redeploy

---

## PHASE 4 - Android APK

[DONE] @capacitor/core, @capacitor/cli, @capacitor/android installed
[DONE] capacitor.config.ts created with app name "Orbit" and dark background
[IN PROGRESS] Android platform being added (downloading Gradle - may take 5 min)
[DONE] Production build ready in dist/ folder

[YOU] INSTALL ANDROID STUDIO (if you don't have it)
  Download from: https://developer.android.com/studio
  Install with default settings. Open once to download Android SDK.

[YOU] GENERATE THE APK
  After Android Studio is installed, run in Terminal:

     cd "/Users/macbookair/Documents/my projects/orbit"
     npm run build
     npx cap sync
     npx cap open android

  Then in Android Studio:
  1. Wait for "Gradle sync" to finish (bottom bar shows progress)
  2. Go to: Build -> Generate Signed Bundle / APK...
  3. Select: APK -> click Next
  4. Click "Create new..." for keystore:
     - Save path: Desktop/orbit-keystore.jks
     - Password: OrbitKey2024#
     - Alias: orbit
     - Key password: OrbitKey2024#
     - First name: your name
  5. Next -> select "release" -> Finish
  6. APK saves to: android/app/build/outputs/apk/release/app-release.apk
  7. AirDrop / email that file to your Android phone and install it

---

## CURRENT STATUS

What the agent has done:
  - Built auth system (login/signup screens with Supabase)
  - Built animated splash screen with orbital ring animation
  - Added real Orbit logo (AI generated, glowing cyan orb design)
  - Added sign-out button to app header
  - Git repo initialised with 2 commits (all files tracked)
  - Capacitor configured for Android (com.orbit.social)
  - Production build verified and working
  - Full README written for GitHub

What you need to do (in order):
  1. Create GitHub repo and push (Phase 1)
  2. Create Supabase project and run SQL (Phase 2)
  3. Create .env file with Supabase keys (Phase 2)
  4. Deploy to Vercel (Phase 3)
  5. Install Android Studio and generate APK (Phase 4)
