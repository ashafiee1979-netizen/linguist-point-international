# Production Launch & Custom Domain Deployment Plan

This plan outlines the complete, step-by-step roadmap to deploy **Linguist Point International** to your live custom domain (e.g., `linguistpoint.com` or `www.linguistpoint.com`) and begin receiving customer translation orders and enterprise RFPs securely.

---

## 🚦 Current Readiness Assessment

| Component | Status | Production Readiness |
| :--- | :--- | :--- |
| **Frontend & UI Responsiveness** | ✅ 100% Complete | Mobile (360px–430px), iPad (768px–1024px), and Desktop viewports tested and aligned. |
| **Pricing Calculation Engine** | ✅ 100% Complete | Deterministic certified ($19.95/page) & standard ($0.08/word) with exact turnaround rules. |
| **Order Intake API** | ✅ Ready | Accepts multipart file uploads, validates bounds, generates `LP-XXXXXX` order IDs. |
| **Review Moderation & Security** | ✅ Hardened | Rate limiting, RFC email validation, role injection sanitization, API key authorization. |
| **Automated Verification** | ✅ 27/27 Tests Passing | Full test suite and Next.js 14 production build verified with 0 errors. |
| **Custom Domain & Hosting** | ⏳ Pending Setup | Requires linking GitHub repository to Vercel/host and configuring DNS records. |
| **Cloud Database & Storage** | ⏳ Recommended | Connecting hosted PostgreSQL (Supabase/Neon) and cloud file storage (S3/R2/email). |
| **Email & Payment Notification** | ⏳ Recommended | Instant order dispatch notification to customer and admin email (`intake@linguistpoint.com`). |

---

## 📋 Step-by-Step Deployment Roadmap

### Phase 1: Deploy to Vercel (Recommended Next.js Host)
*Time required: ~5 minutes*

1. **Sign Up / Log In to [Vercel](https://vercel.com):**
   - Connect with your GitHub account: `ashafiee1979-netizen`.
2. **Import Repository:**
   - Click **"Add New..."** → **"Project"**.
   - Select `ashafiee1979-netizen/linguist-point-international`.
3. **Configure Build Settings:**
   - Framework Preset: **Next.js** (auto-detected).
   - Build Command: `npm run build`
   - Output Directory: `.next`
4. **Set Production Environment Variables:**
   - `ADMIN_API_KEY`: Set a secure secret key (used for review moderation actions).
   - `NODE_ENV`: `production`
   - *(Optional)* `OPENAI_API_KEY`: If using live OpenAI chat for the concierge.
5. **Click "Deploy":**
   - Vercel will build and assign a free preview URL (e.g., `linguist-point-international.vercel.app`).

---

### Phase 2: Connect Your Custom Domain & Configure DNS
*Time required: ~10 minutes (plus DNS propagation)*

1. **Add Domain in Vercel:**
   - In your Vercel Project Dashboard, navigate to **Settings** → **Domains**.
   - Enter your custom domain:
     - `yourdomain.com`
     - `www.yourdomain.com` (recommended to set a redirect from root to `www` or vice-versa).
2. **Update DNS Records at your Domain Registrar (GoDaddy, Namecheap, Cloudflare, Google):**
   - Add the following DNS records:
     | Type | Name / Host | Value / Target | TTL |
     | :--- | :--- | :--- | :--- |
     | **A** | `@` (root) | `76.76.21.21` | Auto / 300s |
     | **CNAME** | `www` | `cname.vercel-dns.com` | Auto / 300s |
3. **Automatic SSL/HTTPS Certificate:**
   - Vercel will automatically generate and renew a free Let's Encrypt SSL certificate once DNS records resolve.

---

### Phase 3: Production Persistence & Document Intake Workflow

Because Vercel serverless functions have ephemeral local filesystems, we recommend configuring persistent storage:

1. **PostgreSQL Database (Free & Managed):**
   - Create a free database on **[Neon.tech](https://neon.tech)** or **[Supabase](https://supabase.com)**.
   - Copy the database connection string and add it to Vercel environment variables:
     ```env
     DATABASE_URL="postgresql://user:password@ep-host.neon.tech/linguistpoint?sslmode=require"
     ```
   - Run database schema migration:
     ```bash
     npx prisma db push
     ```
2. **Document Intake Handling:**
   - *Option A (Direct Admin Email Dispatch - Fastest):* Send uploaded customer documents directly as email attachments to `intake@linguistpoint.com` via **Resend** or **SendGrid** API.
   - *Option B (Cloud Storage):* Configure AWS S3 or Cloudflare R2 bucket for permanently archiving translation intake files.

---

### Phase 4: Order Notification & Payment Collection

1. **Email Notifications:**
   - Add **Resend** (`npm install resend`):
     - Sends an immediate confirmation email to the client with their `LP-XXXXXX` reference number, turnaround commitment, and quote breakdown.
     - Alerts your intake team at `intake@linguistpoint.com` with customer details and requested language pair.
2. **Payment Collection Flow:**
   - **Current Workflow:** Client submits documents and receives an verified intake receipt with pricing breakdown. Your staff reviews word count/legibility and emails an invoice/Stripe payment link.
   - **Automated Instant Checkout (Optional):** Integrate Stripe Checkout session directly into the modal for upfront credit card processing.

---

## 🚀 Quick Launch Checklist

- [ ] **Step 1:** Link GitHub repository to Vercel and trigger initial deployment.
- [ ] **Step 2:** Point DNS A and CNAME records at your domain registrar.
- [ ] **Step 3:** Set `ADMIN_API_KEY` in Vercel project environment variables.
- [ ] **Step 4:** (Optional) Add free Neon/Supabase `DATABASE_URL` for persistent order records.
- [ ] **Step 5:** Place a test order on the live domain to verify end-to-end receipt.
