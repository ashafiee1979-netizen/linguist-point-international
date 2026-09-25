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

### 2. Dual-Layer Resilient Storage
- **File System Persistence (`.data/store.json`)**: Automatic durable local store ensuring orders, reviews, and RFP inquiries persist across server restarts even without an external database.
- **Prisma PostgreSQL Sync**: Seamless asynchronous persistence to PostgreSQL when `DATABASE_URL` is configured.
- **Fail-Safe Client**: Dynamic Prisma loader (`lib/prisma.ts`) guarantees the app boots without crashing if database credentials are not yet provisioned.

### 3. Transparent Intake & Compliance
- The checkout modal clearly presents the process as **"Translation Intake & Document Review"**.
- Transparently communicates that certified translation documents undergo compliance assessment before Stripe payment links are dispatched.

### 4. Hardened API Endpoints
- **`/api/orders`**: Strict bounding on customer names (2–100 chars), valid RFC email format, languages (2–50 chars), page bounds (1–1000), word count bounds (1–1,000,000).
- **`/api/rfp`**: Strict validation on corporate contact name, corporate email, phone regex (7–30 digits), and project scope. Stores RFP inquiries into durable storage.
- **`/api/reviews` & `/api/reviews/verify`**: Strict bounding on order codes, rating (integer 1–5), comment length (10–1000 chars), and post-delivery timing verification.
- **`/api/chat`**: In-memory IP rate-limiting (30 requests/minute), message history bounds (max 15 messages, max 1000 chars/message), and strict message role filtering (`"user" | "assistant"` only).

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
