# KLARIFY KNOWLEDGE COMMERCE INFRASTRUCTURE

You are building a production-grade secure digital commerce and library infrastructure for Klarify.

Tech stack:
- Next.js 15+
- App Router
- TypeScript
- TailwindCSS
- Supabase
- Resend
- Korapay
- Netlify

This is NOT a generic ebook store.

This is institutional-grade knowledge infrastructure for:
- books
- reports
- premium founder resources
- compliance intelligence
- future digital education assets

The UX must feel:
- premium
- elegant
- calm
- modern
- fintech-grade
- institution-ready

Design inspiration:
- Stripe
- Linear
- Notion
- Ramp

Avoid:
- clutter
- marketplace aesthetics
- crypto hype visuals
- noisy interfaces

# CORE PRODUCT PHILOSOPHY

Users do NOT simply buy files.

Users gain:
- access,
- entitlements,
- and membership inside the Klarify ecosystem.

The library experience is strategic.

# ARCHITECTURE REQUIREMENTS

## Authentication
Use Supabase Auth.

Allow:
- guest checkout
- automatic account provisioning after payment
- magic login links

Do NOT force signup before checkout.

# STORAGE RULES

Use Supabase Storage private buckets ONLY.

Never expose public file URLs.

All downloads must:
1. verify authenticated user
2. verify ownership
3. generate temporary signed URL
4. log activity

# DOWNLOAD FLOW

Required route:
`/api/download/[productId]`

Flow:
- verify session
- verify purchase
- generate signed URL
- redirect securely
- log download

# SECURITY REQUIREMENTS

Mandatory:
- RLS
- webhook signature verification
- rate limiting
- private buckets
- secure API routes

Never trust payment webhooks blindly.

Always verify with Korapay API.

# DATABASE REQUIREMENTS

Use:
- products
- orders
- purchases
- download_logs
- profiles

Keep architecture scalable for:
- subscriptions
- courses
- memberships
- enterprise licensing

# UI REQUIREMENTS

Library UI should feel like:
- modern SaaS dashboard
- premium digital bookshelf

NOT:
- generic ecommerce template

# EMAIL REQUIREMENTS

Use Resend.

After successful purchase:
- send welcome email
- provide library access CTA
- encourage ecosystem onboarding

# IMPORTANT

This project is part of a broader Klarify ecosystem:
- regulatory intelligence
- compliance readiness
- founder infrastructure
- institutional trust systems

The implementation should reflect long-term scalability and professionalism.

# BUILD PRIORITIES

1. Security
2. Clean architecture
3. Excellent UX
4. Scalability
5. Maintainability

# CODE QUALITY

Required:
- modular architecture
- reusable components
- strict typing
- production-ready structure
- clean APIs
- server-side validation

Avoid:
- hacks
- monolithic code
- unnecessary complexity

# TARGET EXPERIENCE

The final product should feel like:
"The secure knowledge and intelligence layer for African regulated innovation."