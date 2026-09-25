# Linguist Point International

Official Next.js web application for **Linguist Point International** — Certified & Professional Translation Services (USCIS, Legal, Medical, Financial & Enterprise RFP Intake).

---

## 🚀 Quick Start

### 1. Requirements
- Node.js 18+ (tested on Node.js 20.x)
- npm or yarn

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Create a `.env` file in the root of the project with the following configuration:

```env
# Server Administration & Review Moderation
ADMIN_API_KEY="your-secret-admin-key"

# Database Persistence (PostgreSQL via Prisma)
# Optional in local development; falls back cleanly to local persistent file store (.data/store.json)
DATABASE_URL="postgresql://user:password@localhost:5432/linguistpoint?schema=public"

# AI Concierge Chatbot (Optional fallback for OpenAI)
OPENAI_API_KEY="your-openai-api-key"

# Test Fixtures & QA Harness (Set to "true" in staging/e2e to seed demo review orders)
ENABLE_TEST_ORDERS="false"
```

### 4. Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Running Validation Tests
```bash
npm test
```
Executes the comprehensive automated verification test suite (`scripts/test-validation.ts`), asserting:
- Deterministic certified & standard calculation matching published rates
- Strict turnaround rules (Express 12h rush vs standard 24h/48h)
- Order verification and eligibility rules
- API input bounding, RFC email validation, and chat role-injection filtering

### 6. Production Build
```bash
npm run build
npm run start
```

---

## 🔒 Architecture & Security Highlights

### 1. Protected Review Moderation API
- Endpoints: `GET /api/reviews/moderate` and `POST /api/reviews/moderate`
- **Authentication**: Requires `x-admin-key: <ADMIN_API_KEY>` header or `Authorization: Bearer <ADMIN_API_KEY>`.
- Any unauthorized or malformed requests return `401 Unauthorized`.
- Client-facing UI exposes no administrative moderation actions.

### 2. Database Persistence as Primary Source of Truth
- **Prisma PostgreSQL as Primary**: When `DATABASE_URL` is set, Prisma is the primary source of truth. All writes are awaited, and database failures propagate visibly to callers (preventing silent write failure masking).
- **Durable File Store Fallback (`.data/store.json`)**: Automatic local store ensuring orders, reviews, and RFP inquiries persist across server restarts in offline/development setups.
- **Fail-Safe Client**: Dynamic Prisma loader (`lib/prisma.ts`) guarantees the app boots without crashing if database credentials are not yet provisioned.

### 3. Transparent Intake & Document Upload Workflow
- The intake modal operates as **"Translation Intake & Document Review"**.
- Supports direct **multipart file uploads** (PDF, DOCX, JPG, PNG, TIFF up to 15MB/file), saving documents to `.data/uploads/<orderNumber>/`.
- Transparently communicates the 3-step dispatch workflow: compliance file review -> itemized quote with Stripe payment link -> certified translation upon payment.

### 4. Hardened API Endpoints & Trusted IP Rate Limiting
- **`/api/orders`**: Strict bounds on customer names, languages, valid RFC emails, page count (1–1000), word count (1–1,000,000), and document attachments.
- **`/api/rfp`**: Strict validation on corporate contact name, corporate email, phone regex (7–30 digits), and project notes.
- **`/api/reviews` & `/api/reviews/moderate`**: Full async awaiting on approvals/rejections, 404 on nonexistent IDs, and separate labeling for representative case studies (`isSample`) vs genuine verified client orders.
- **`/api/chat`**: Trusted edge proxy IP resolution via `lib/rate-limit.ts` (Cloudflare `cf-connecting-ip`, Vercel `x-vercel-forwarded-for`, Nginx `x-real-ip`), 30 req/min sliding window rate limit, and strict message role filtering (`"user" | "assistant"` only).

---

## 📂 Project Structure

```
├── app/
│   ├── api/
│   │   ├── chat/             # Concierge AI chat API (rate-limited, sanitized)
│   │   ├── orders/           # Intake & document review API
│   │   ├── reviews/          # Verified client review retrieval & submission
│   │   │   ├── moderate/     # Admin-secured review moderation API
│   │   │   └── verify/       # Order delivery eligibility verification API
│   │   └── rfp/              # Enterprise RFP proposal submission API
│   ├── layout.tsx            # Global layout & metadata
│   ├── page.tsx              # Main landing page
│   └── globals.css           # Global Tailwind CSS styles
├── components/
│   ├── Header.tsx            # Navigation header & quick contact
│   ├── HeroSection.tsx       # Live interactive quote calculator & guarantees
│   ├── OrderModal.tsx        # Document intake & translation review modal
│   ├── ReviewSection.tsx     # Verified client feedback & submission gate
│   └── ...
├── lib/
│   ├── pricing.ts            # Single source of truth for pricing & turnaround formulas
│   ├── review-store.ts       # Unified durable storage (file + Prisma dual layer)
│   └── prisma.ts             # Safe dynamic Prisma client loader
├── prisma/
│   └── schema.prisma         # Data models (Order, Review, RfpInquiry)
└── scripts/
    └── test-validation.ts    # Automated test suite
```

---

## 🤝 Collaboration & Handoff
For details on peer review findings and implementation specifics, please consult [`HANDOFF_CODEX.md`](./HANDOFF_CODEX.md).
