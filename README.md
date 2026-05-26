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

### Resend email automations

On form submit, the `/api/register` route:

1. **Notifies admin** — sends registration details to `hello@klarify.africa`
2. **Confirms to registrant** — immediate auto-reply with event/book details
3. **Schedules follow-ups** — launch reminders 7 days and 1 day before the event (June 5 & 11, 2026)
4. **Syncs contact** — adds/updates the registrant in Resend Contacts (optional segment via `RESEND_SEGMENT_ID`)

Required env vars:

| Variable | Description |
|----------|-------------|
| `RESEND_API_KEY` | API key from [resend.com/api-keys](https://resend.com/api-keys) |
| `RESEND_FROM_EMAIL` | Verified sender (default: `hello@klarify.africa`) |
| `RESEND_ADMIN_EMAIL` | Admin inbox for notifications (default: `hello@klarify.africa`) |
| `RESEND_SEGMENT_ID` | Optional audience segment for registrants |

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
    ├── email/        # Resend client, templates, automations
    └── ...           # Constants, analytics, animations
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
