1. PROJECT OVERVIEW
Product Name

Klarify Knowledge Commerce Infrastructure

Objective

Build a secure digital commerce and content delivery system for:

eBooks
premium reports
downloadable digital assets
future educational products

The system will:

process payments,
verify transactions,
provision user access,
create a secure personal library,
and enable protected downloads via authenticated access.
2. PRIMARY BUSINESS GOALS
Core Goals
Sell digital books directly from Klarify ecosystem
Own customer relationship and purchase data
Eliminate dependency on third-party marketplaces
Create recurring ecosystem engagement
Build a scalable digital knowledge infrastructure
Strategic Goals

Position Klarify as:

knowledge infrastructure,
regulatory intelligence platform,
founder education ecosystem,
and premium digital resource hub.
3. PRODUCT SCOPE
INCLUDED IN MVP
Commerce Features
Book checkout
Korapay integration
Payment verification
Secure order creation
Email confirmation
Authentication Features
Account creation
Login/logout
Password reset
Session management
User Library Features
Personal digital library
Purchased products listing
Secure download access
Download history
Product entitlement verification
File Security Features
Private bucket storage
Signed URL generation
Download logging
Abuse prevention
Temporary secure delivery
Admin Features
Product management
Order visibility
Download analytics
User analytics
Manual entitlement assignment
EXCLUDED FROM MVP
DRM encryption
Mobile app
Subscription billing
Team licenses
Affiliate system
Coupons/referrals
Multi-vendor marketplace
Dynamic PDF watermarking (Phase 2)
4. TECH STACK
Frontend
Next.js 15+
App Router
TypeScript
TailwindCSS
Framer Motion
Backend
Node.js APIs
Next.js Route Handlers
Database
Supabase PostgreSQL
Authentication
Supabase Auth
File Storage
Supabase Storage
Private Buckets ONLY
Email
Resend
Payment Gateway
Korapay
Hosting
Netlify
5. SYSTEM ARCHITECTURE
Core Flow

User → Checkout → Korapay → Webhook → Verify Payment → Create Purchase → Email User → Access Library → Secure Download

6. DATABASE SCHEMA
TABLE: users

Managed via Supabase Auth.

Additional profile table:

profiles
---------
id
email
full_name
country
created_at
TABLE: products
products
---------
id
title
slug
description
price
currency
cover_image
storage_path
file_size
file_type
active
created_at
TABLE: orders
orders
---------
id
user_id
product_id
payment_reference
korapay_reference
amount
currency
status
payment_verified
created_at
TABLE: purchases
purchases
---------
id
user_id
product_id
order_id
download_count
last_downloaded_at
created_at
TABLE: download_logs
download_logs
---------
id
user_id
product_id
ip_address
user_agent
downloaded_at
TABLE: webhooks
webhooks
---------
id
provider
payload
status
created_at
7. STORAGE ARCHITECTURE
Supabase Storage Bucket
Bucket Name
klarify-library
Bucket Rules
PRIVATE ONLY
No public access
Signed URLs only
Authenticated access enforced
Recommended Folder Structure
/books/
/reports/
/templates/
/courses/
/audio/
Example File Paths
/books/founders-guide-v1.pdf
/books/founders-guide-v1.epub
8. AUTHENTICATION FLOW
User Registration
Triggered:
before checkout
OR
immediately after payment success
Recommended UX

Allow:

quick guest checkout

Then:

automatically create account
send magic login link
Flow
User enters email
User pays
Account auto-created
Magic login link sent
User accesses library
IMPORTANT

Avoid forcing account creation before payment.

This reduces checkout friction.

9. PAYMENT FLOW
Korapay Checkout Flow
Step 1

User clicks:

Buy Now
Step 2

Create pending order in database.

Step 3

Initialize Korapay transaction.

Step 4

Redirect user to Korapay checkout.

Step 5

Korapay webhook sent to:

/api/webhooks/korapay
Step 6

Backend verifies payment directly with Korapay API.

IMPORTANT:
Never trust webhook payload blindly.

Step 7

If verified:

mark order successful
create purchase entitlement
trigger onboarding email
10. EMAIL FLOW
Provider

Resend

Emails Required
1. Payment Success

Subject:

Your Klarify Library Access is Ready

Contains:

confirmation
login button
library access CTA
2. Magic Login Link

Supabase Auth email.

3. Purchase Receipt

Optional but recommended.

11. LIBRARY EXPERIENCE
Route
/library
User Can:
view purchased books
download securely
view invoices
access updates
access bonuses
UI REQUIREMENTS

Must feel:

premium
modern
institution-grade
simple
calm
elegant
Suggested Layout

Netflix-style digital shelf.

Each Product Card Shows
cover image
title
purchased date
available formats
download button
12. SECURE DOWNLOAD SYSTEM
IMPORTANT SECURITY PRINCIPLE

Files must NEVER be publicly accessible.

Download Flow
User clicks download
Backend verifies:
session
ownership
Backend generates signed URL
Redirect user
Log download activity
Signed URL Duration

Recommended:

60 seconds
API Route
/api/download/[productId]
13. DOWNLOAD LIMIT STRATEGY
Recommended MVP Policy
Allow:
unlimited personal downloads

BUT:

monitor abuse
log IPs
detect anomalies
Future Upgrade

Add:

soft limits
abuse throttling
device monitoring
14. SECURITY REQUIREMENTS
Required
Rate Limiting

Protect:

downloads
auth routes
webhooks
Webhook Signature Verification

Mandatory.

Row Level Security (RLS)

Enable on all sensitive tables.

Audit Logging

Track:

downloads
purchases
failed payments
login attempts
File Access Protection

Never expose raw storage paths.

15. ADMIN DASHBOARD
Route
/admin
Features
Products
add/edit products
upload files
manage pricing
Orders
view transactions
filter successful/failed
Users
purchase history
library access
Analytics
downloads
sales
top products
user activity
16. FUTURE SCALABILITY

Architecture should support future:

audiobooks
premium research
subscriptions
founder toolkits
memberships
enterprise licenses
courses
certification programs
17. PERFORMANCE REQUIREMENTS
Must Achieve
Lighthouse > 90
Fast TTFB
Optimized downloads
Mobile responsiveness
18. UX REQUIREMENTS
Experience Should Feel Like:
Stripe
Notion
Linear
modern SaaS platforms

NOT:

WordPress bookstore
generic ebook shop
Gumroad clone
19. MVP SUCCESS METRICS
KPIs
successful purchase rate
conversion rate
library activation rate
repeat login rate
download completion rate
20. DEPLOYMENT REQUIREMENTS
Environment Variables
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

KORAPAY_SECRET_KEY=
KORAPAY_PUBLIC_KEY=
KORAPAY_WEBHOOK_SECRET=

RESEND_API_KEY=

NEXT_PUBLIC_SITE_URL=