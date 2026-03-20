# Advault

B2B AdTech platform for MENA region.

## Stack
- Next.js 14 App Router
- TypeScript (strict)
- Tailwind CSS
- Supabase (auth + database + Storage)
- Zustand, Zod

## Design — Fixed Hybrid Mode (NO dark mode)
- Font: Tajawal (Arabic), `dir="rtl"` on `<html>`
- Primary: #84cc18 (lime green) — main CTAs, save, submit, upgrade
- Accent: #8957f6 (purple) — Pro badges, highlights, avatar
- Low-priority text: #9ca3af
- Page bg: #edf1f5 | Cards: #ffffff | Fields: #ffffff | Surface: #f3f5f9
- Border: #e5e7eb
- No dark mode toggle anywhere — fixed hybrid design
- Navbar: glassmorphism rgba(137,87,246,0.07) + backdrop-blur(16px)
- Sidebar: glassmorphism rgba(220,225,235,0.6) + backdrop-blur(16px)
- Active sidebar link: rgba(132,204,24,0.15) color #84cc18
- Link text: #6b7280
- Admin panel: always white #ffffff, no dark mode
- Glassmorphism: `.glass-card`, `.glass-purple`
- CSS variables in globals.css (no .dark class)

## Button Hierarchy
- Primary CTA (save, upgrade, submit): bg #84cc18 text white
- Important/Pro elements: bg #8957f6 text white
- Secondary: bg #f3f5f9 border #e5e7eb text #1c1c1e

## Auth
- `app/context/AuthContext.tsx` — global auth state via `useAuth()` hook
- `AuthUser`: `{ id, email, name, plan: "free"|"pro"|"enterprise"|"admin", avatar? }`
- Supabase session on mount + `onAuthStateChange`; falls back to `localStorage.mockUser`
- Pro features gated by `plan === "pro" || "enterprise" || "admin"`

## Storage (Supabase Storage buckets)
- `ads-images` — ad images + analysis images + attachments
- `influencer-photos` — influencer profile pictures
- `strategy-covers` — strategy thumbnail images
- `user-avatars` — user profile photos
- Helper: `app/lib/storage.ts` → `uploadFile(bucket, file, path?)`

## Pages
| Route | Description |
|-------|-------------|
| / | Home: hero (glassmorphism) + animated stats + latest ads + strategies |
| /library | Ad library with filter bar |
| /analysis | Strategy 3-col grid with Pro blur overlay + filter bar |
| /influencers | Influencer discovery |
| /planner | Campaign Planner — 2-step wizard |
| /blog | Blog listing with featured hero + category filter |
| /blog/[slug] | Full article page with share + related articles |
| /pricing | Subscription plans (mock payment + Enterprise contact) |
| /profile | User profile: 5 tabs (no theme toggle in preferences) |
| /login | Supabase auth login |
| /register | Supabase auth register |
| /terms | Terms + customer support modal → support_requests table |
| /removal | Content removal request form → removal_requests table |
| /admin/login | Separate admin-only login |
| /admin/dashboard | KPIs + charts + quick actions + recent activity |
| /admin/ads | Manage ads (CRUD + rich 10-field Pro analysis) |
| /admin/users | Manage users (plan + status) |
| /admin/influencers | Manage influencers (image upload + contact email) |
| /admin/strategies | Manage strategies (image upload + is_pro_only) |
| /admin/blog | Blog management (CRUD + image upload + draft/publish) |
| /admin/requests | Request management center (3 tabs: contact/removal/support) |
| /admin/terms | Terms section editor (add/edit/reorder/delete) |
| /admin/analytics | Advanced analytics (visitors, content, behavior, geo, devices) |
| /admin/planner-settings | Campaign planner algorithm settings |
| /admin/appsflyer | AppsFlyer integration settings |
| /admin/guide | Admin usage guide |

## Architecture
- Admin: always light mode, white sidebar with green active states
- Main platform: hybrid glassmorphism (no dark mode toggle)
- Sidebar: "مرحباً [name]" when logged in; Pro upgrade card only for free users
- FilterBar: z-index 9999 dropdowns, overflow-visible
- Pro blur: `filter: blur(5px)` + gradient overlay
- Scroll progress bar (thin green line at top)
- Toast notification system (ToastProvider)
- Blog data: `app/lib/blogData.ts`

## Supabase Tables
- `ads`, `influencers`, `strategies`, `users`, `saved_ads`
- `removal_requests`, `contact_requests`, `support_requests`
- `blog_posts`: id, title, slug, category, banner_image, content, tags, status, author, created_at
- `terms_sections`: id, title, content, order, created_at
- `planner_settings`, `appsflyer_config`

## Scripts
- `npm run build` | `npm run dev` | `npm run dev:clean` | `npm test`

## Data Fetching
- All public pages (/, /library, /analysis, /influencers) fetch from Supabase via `app/lib/db.ts`
- Falls back to `app/lib/mockData.ts` when Supabase tables are empty or unconfigured
- `isSupabaseConfigured()` guards all Supabase calls — returns false when env vars are missing/placeholder
- Admin CRUD pages use local state + Supabase when configured

## Auth Flow
- Register: `supabase.auth.signUp()` + INSERT into public `users` table (plan: "free")
- Login: `supabase.auth.signInWithPassword()` → redirect to /
- Logout: `supabase.auth.signOut()` + clear state + redirect to /
- Payment: mock flow → UPDATE `users.plan` in Supabase after success
- Profile save: UPDATE `users.full_name` + `avatar_url` in Supabase

## Last Audit (2026-03-21)
29 bugs found and fixed:
- 5 critical (register profile insert, payment plan update, profile save, logout redirect)
- 6 high (stale dark mode classes, broken CSS vars)
- 9 medium (forms not submitting to Supabase, avatar not persisting)
- 9 lower (pages using only mock data — now all fetch from Supabase first)
