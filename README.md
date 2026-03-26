# Digital Heroes — Golf Charity Subscription Platform

[![Deployed on Vercel](https://vercel.com/button)](https://golf-committee-app.vercel.app/)

**Live Deployment:** [https://golf-committee-app.vercel.app/](https://golf-committee-app.vercel.app/)

A high-end, production-ready web application built as a full-stack trainee selection assignment. It combines precision golf performance tracking, an algorithmic monthly prize draw, and aggressive philanthropy. 

Built with Next.js (App Router), Supabase, Razorpay, and Nodemailer.

---

## ✅ PRD Full Compliance Highlights

This application strictly adheres to the provided Product Requirements Document (PRD):

- **§04 Subscription Management:** Integrated with Razorpay for Monthly/Yearly plans. Includes complete webhook handling (`subscription.charged`, `subscription.cancelled`) and user cancellation flows.
- **§05 Score System:** Verifies Stableford range (1–45) and strictly maintains a 5-score rolling subset (oldest overwritten) per PRD rules.
- **§06/07 Draw Engine System:** Fully functional Admin Draw Simulator with PRNG Random Selection and Algorithmic Weighting logic. Precisely calculates the `40/35/25` prize pool split and rolls over un-won jackpots.
- **§08 Charity Contributions:** Users can select one of 6 verified charities, dynamically allocate 10–50% of their subscription, or make independent one-off donations.
- **§09 Verification Lifecycle:** Winners are notified via email and provided a dashboard UI to upload scorecard proof. Admins can verify/reject/mark paid.
- **§10/11 Dual Dashboards:** Role-Based Access Control (RBAC) securely separates the User Hub and Admin Management consoles using Supabase middleware.
- **§12 UI/UX Identity:** Rejects "traditional golf aesthetics" in favor of the requested "Philanthropic Ledger" design—heavy serif typography, motion-enhanced interactions, and a premium green/gold color palette.

---

## 🚀 Technical Stack

- **Frontend**: Next.js 15 (React 19), Tailwind CSS, Framer Motion, Lucide Icons.
- **Backend**: Supabase (PostgreSQL + Auth), Next.js Route Handlers.
- **Payments**: Razorpay (Subscriptions + Webhooks).
- **Messaging**: Nodemailer via securely configured Gmail App Password for unrestricted delivery.

## 🛠️ Evaluator Setup Guide

To run this application locally and verify functionality:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/amanm-sudo/Golf-committee-app.git
   cd Golf-committee-app
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables (`.env.local`)**:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=          # Your Supabase Project URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY=     # Your Supabase Anon Key
   SUPABASE_SERVICE_ROLE_KEY=         # Needed to bypass RLS for Admin operations

   # Razorpay (Test Mode keys)
   NEXT_PUBLIC_RAZORPAY_KEY_ID=       # rzp_test_...
   RAZORPAY_KEY_SECRET=               # ...
   RAZORPAY_WEBHOOK_SECRET=           # whsec_...
   RAZORPAY_MONTHLY_PLAN_ID=          # plan_...
   RAZORPAY_YEARLY_PLAN_ID=           # plan_...

   # Nodemailer (Gmail App Password)
   GMAIL_USER=                        # your-email@gmail.com
   GMAIL_APP_PASSWORD=                # 16-character google app password
   
   # App Settings
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize Supabase**:
   Run the `supabase_patch.sql` script within your Supabase SQL Editor to seed the Charity tables and configure missing columns.

5. **Start Development Server**:
   ```bash
   npm run dev
   ```

## 📩 Webhook & Email Testing

- **Emails:** The application uses Nodemailer over SMTP. Emails are triggered on **Welcome/Signup**, **Subscription Charged**, **Win Results Published**, and **Subscription Cancelled**.
- **Webhooks:** To test Razorpay subscriptions locally, you must route your webhooks, or simply test on the live Vercel deployment where the webhook listener (`/api/webhooks/razorpay`) is publicly accessible.

---
© 2026 Digital Heroes LP · Submitted for Selection Evaluation.
