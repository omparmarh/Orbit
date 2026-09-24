# Orbit - Deployment Checklist
# Legend: [DONE] = Agent completed | [YOU] = You must do this | [TODO] = Agent will do this

---

## PHASE 1 - Git and GitHub

[DONE] .gitignore created
[DONE] Git repository initialised
[DONE] First commit made

[YOU] CREATE GITHUB REPO (manual - browser required)
  1. Open https://github.com/new in your browser
  2. Log in with: omhparmar2008@gmail.com
  3. Repository name: orbit
  4. Set to: Public
  5. Do NOT tick "Add README" (we already have one)
  6. Click "Create repository"
  7. Then paste these commands in Terminal (replace YOUR_USERNAME with your GitHub username):

     cd "/Users/macbookair/Documents/my projects/orbit"
     git remote add origin https://github.com/YOUR_USERNAME/orbit.git
     git branch -M main
     git push -u origin main

---

## PHASE 2 - Supabase (Auth and Database)

[YOU] CREATE SUPABASE PROJECT (manual - browser required)
  1. Open https://supabase.com in your browser
  2. Click "Start your project" and sign in with Google (omhparmar2008@gmail.com)
  3. Click "New Project":
     - Name: orbit-social
     - DB password: OrbitSocial2024#   <-- SAVE THIS!
     - Region: Southeast Asia (or nearest to you)
  4. Wait about 1 minute for the project to be ready

[YOU] COPY SUPABASE KEYS
  1. In Supabase dashboard go to: Project Settings > API
  2. Copy the "Project URL" (looks like: https://xxxx.supabase.co)
  3. Copy the "anon public" key (long text under Project API keys)
  4. Open Terminal and run these commands one by one:

     cd "/Users/macbookair/Documents/my projects/orbit"

     Then create the .env file by running:
     echo 'VITE_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co' > .env
     echo 'VITE_SUPABASE_ANON_KEY=YOUR_ANON_PUBLIC_KEY' >> .env

     Replace YOUR_PROJECT_ID and YOUR_ANON_PUBLIC_KEY with the values you copied.

[YOU] RUN DATABASE SQL (manual - Supabase SQL editor)
  1. In Supabase dashboard go to: SQL Editor > New query
  2. Copy and paste ALL of the SQL below, then click Run:

--- SQL START ---
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
--- SQL END ---

  3. You should see "Success. No rows returned." - that means it worked.

---

## PHASE 3 - Deploy Frontend (Vercel)

[DONE] Vercel CLI installed
[DONE] Production build verified

[YOU] DEPLOY TO VERCEL
  After you have done Phases 1 and 2, run these commands in Terminal:

     cd "/Users/macbookair/Documents/my projects/orbit"
     vercel login

  - Choose "Continue with GitHub" and authorise in the browser that opens
  - Then run:

     vercel

  When it asks questions:
  - "Set up and deploy?" -> Y
  - "Which scope?" -> pick your username
  - "Link to existing project?" -> N
  - "Project name?" -> orbit
  - "Directory?" -> ./ (just press Enter)
  - It will auto-detect Vite

  After the preview URL appears and works, run:
     vercel --prod

  Your final live URL will be something like: https://orbit-app.vercel.app

[YOU] ADD ENV VARS TO VERCEL (if not added during deploy)
  1. Go to https://vercel.com/dashboard
  2. Click on your "orbit" project
  3. Go to Settings > Environment Variables
  4. Add:
     Name: VITE_SUPABASE_URL     Value: (your supabase URL)
     Name: VITE_SUPABASE_ANON_KEY  Value: (your supabase anon key)
  5. Go to Deployments and click "Redeploy" on the latest deployment

---

## PHASE 4 - Android APK (Capacitor)

[DONE] Capacitor packages installed
[DONE] Android platform added to project
[DONE] Web build synced into Android project

[YOU] INSTALL ANDROID STUDIO (required to build APK)
  1. Download from: https://developer.android.com/studio
  2. Run the installer with default settings
  3. Open Android Studio once to let it download the Android SDK (takes ~5 min)
  4. Then run in Terminal:

     cd "/Users/macbookair/Documents/my projects/orbit"
     npm run build
     npx cap sync
     npx cap open android

  5. Android Studio will open with the Orbit project loaded

[YOU] GENERATE THE APK IN ANDROID STUDIO
  1. In Android Studio top menu: Build > Generate Signed Bundle / APK...
  2. Select: APK -> click Next
  3. Click "Create new..." for keystore:
     - Save to: ~/Desktop/orbit-keystore.jks
     - Password: OrbitKey2024#
     - Key alias: orbit
     - Key password: OrbitKey2024#
     - First and Last Name: your name
     - Click OK
  4. Click Next
  5. Select "release" build variant
  6. Click Finish
  7. Wait for build to complete (1-3 minutes)
  8. APK file location: android/app/build/outputs/apk/release/app-release.apk
  9. Send that file to your phone via email, Google Drive, or USB cable

---

## NOTES

- All code is ready - splash screen, login screen, logo are all built
- The app already has: auth gate, supabase client, splash animation, real logo
- After Supabase is set up users can sign up / log in through the app
- The Vercel deployment auto-rebuilds every time you push to GitHub (main branch)
- Keep orbit-keystore.jks file safe - you need it for every future APK update
