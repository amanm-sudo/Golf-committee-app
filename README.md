# Digital Heroes — Golf Charity Subscription Platform

A high-end, production-ready web application where precision golf meets aggressive philanthropy. Built with Next.js (App Router), Supabase, Stripe, and Resend.

## 🚀 Architectural Overview

This platform uses a **"The Philanthropic Ledger"** design system, prioritizing purposeful white space, aggressive typographic contrast, and a charity-first hierarchy.

- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion.
- **Backend**: Supabase (PostgreSQL + Auth), Edge Functions.
- **Payments**: Razorpay (Subscriptions + Webhooks).
- **Messaging**: Resend (Transactional emails).

## 🛠️ Installation & Setup

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/digital-heroes/golf-platform.git
    cd golf-platform
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Environment Variables**:
    Create a `.env.local` file with the following:
    ```env
    # Supabase
    NEXT_PUBLIC_SUPABASE_URL=          # Project URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Anon Key
    SUPABASE_SERVICE_ROLE_KEY=         # Service Role Key for Admin routes

    # Razorpay
    NEXT_PUBLIC_RAZORPAY_KEY_ID=       # rzp_test_...
    RAZORPAY_KEY_SECRET=               # ...
    RAZORPAY_WEBHOOK_SECRET=           # whsec_...
    RAZORPAY_MONTHLY_PLAN_ID=          # plan_...
    RAZORPAY_YEARLY_PLAN_ID=           # plan_...

    # Resend
    RESEND_API_KEY=                    # re_...

    # App Settings
    NEXT_PUBLIC_APP_URL=http://localhost:3000
    ```

4.  **Supabase Schema**:
    Run the `supabase_schema.sql` script in your Supabase SQL Editor to initialize all tables, triggers, and RLS policies.

5.  **Razorpay Configuration**:
    Configure a webhook endpoint pointing to `https://.../api/webhooks/razorpay` with the following events:
    - `subscription.charged`
    - `subscription.halted`
    - `subscription.cancelled`

6.  **Launch**:
    ```bash
    npm run dev
    ```

## 🎯 Key Internal Features & Rules

### Score Rolling Window
Subscribers maintain exactly 5 scores. When a 6th is added, the oldest is automatically purged. This logic is enforced at the API layer (`/api/scores`).

### The Draw Engine
Admin triggered monthly draws. Matches are determined by set comparison between winning numbers and a subscriber's current 5 scores.
- **Random Choose**: PRNG based selection.
- **Algorithmic Choice**: Frequency histogram of all scores in the current cycle.

### Prize Pool Split
- **Tier 5 (40%)**: Split between all 5-number match winners.
- **Tier 4 (35%)**: Split between all 4-number match winners.
- **Tier 3 (25%)**: Split between all 3-number match winners.
- **Rollover**: If Tier 5 has no winner, the pool carries forward to the next month's jackpot.

## ⚖️ Decisions Documented

- **Subscription prices**: £9.99/month · £99.99/year.
- **Net Contribution**: 60% of subscription (after charity share) feeds the prize pool.
- **Verification Rule**: Winners must upload a scorecard screenshot showing username, date, and score matching their entry.
- **Exclusions**: Admin accounts are excluded from draw simulations and entries.
- **Grace Period**: Subscriptions moving to `past_due` or `lapsed` lose dashboard access immediately.

---
© 2026 Digital Heroes LP · Precision in Philanthropy.
