# The Founder's Guide — Book Landing Page

Premium landing page for **The Founder's Guide to Building in Regulated Markets**, hosted at [book.klarify.africa](https://book.klarify.africa).

## Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS v4
- Framer Motion

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

- **Analytics**: Google Analytics, Plausible, or Meta Pixel
- **Resend**: Form submissions and email automations (see below)

### Registration flow (`/api/register`)

1. **Persist to Supabase** — `book_virtual_event_registrations` (deduped on email + type)
2. **Notify admin** — Resend → `hello@klarify.africa`
3. **Confirm to registrant** — immediate auto-reply with event/book details
4. **Schedule follow-ups** — launch reminders 7 days and 1 day before the event (June 5 & 11, 2026)
5. **Sync contact** — Resend Contacts (optional segment via `RESEND_SEGMENT_ID`)
6. **Update row** — email delivery flags written back to Supabase

### Database migration

Run once in **Supabase Dashboard → SQL Editor** (same project as klarify.africa):

```bash
# File: supabase/migrations/20260326120000_book_virtual_event_registrations.sql
```

Or with Supabase CLI from this repo:

```bash
supabase db push
```

Table: `book_virtual_event_registrations` — RLS enabled, no public policies (service role only).

### Environment variables

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key for API routes |
| `RESEND_API_KEY` | API key from [resend.com/api-keys](https://resend.com/api-keys) |
| `RESEND_FROM_EMAIL` | Verified sender (default: `hello@klarify.africa`) |
| `RESEND_ADMIN_EMAIL` | Admin inbox (default: `hello@klarify.africa`) |
| `RESEND_SEGMENT_ID` | Optional Resend audience segment |

Registration types:

| Type | Purpose |
|------|---------|
| `launch` | Virtual launch registration |
| `klarify` | Klarify waitlist |
| `book-updates` | Book interest / updates |

## Deployment

Deploy to Vercel or Netlify:

```bash
npm run build
```

Set environment variables in your hosting dashboard.

## Project Structure

```
src/
├── app/              # Next.js App Router pages & API
├── components/
│   ├── sections/     # Landing page sections
│   └── ui/           # Shared UI components
└── lib/
    ├── db/           # Supabase registration persistence
    ├── email/        # Resend client, templates, automations
    ├── supabase/     # Supabase server client
    └── ...           # Constants, analytics, animations
supabase/
└── migrations/       # SQL migrations
public/
└── images/           # Book mockups, logos
```

## Sections

1. Hero
2. Problem Statement
3. About the Book
4. Who This Is For
5. Klarify Introduction
6. Foreword & Preface
7. About the Author
8. Virtual Launch Registration
9. Social Proof
10. Final CTA
