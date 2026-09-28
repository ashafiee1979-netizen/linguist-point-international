# Follow-up Hardening & Peer Review Resolution

We have resolved all 5 follow-up points raised by Codex. The solution has been validated with an expanded automated test suite (**27 Passed, 0 Failed**) and a verified Next.js production build (`npm run build`).

---

## 🛠️ Itemized Breakdown of Follow-up Resolutions

### 1. Database Persistence as Primary Source of Truth
- **Files Modified**: [`lib/review-store.ts`](file:///e:/Linguist%20Point%20International/linguist-point-international-main/lib/review-store.ts), [`prisma/schema.prisma`](file:///e:/Linguist%20Point%20International/linguist-point-international-main/prisma/schema.prisma)
- **Changes**:
  - **Prisma Primary**: When `DATABASE_URL` is set, all writes (`registerOrder`, `submitVerifiedReview`, `registerRfpInquiry`) execute against PostgreSQL and await completion.
  - **Visible Failures**: Write errors are no longer swallowed; if PostgreSQL write fails, it throws immediately so callers receive `500 Internal Server Error` instead of false success.
  - **Reads from DB**: `findOrder`, `getApprovedReviews`, and `getPendingReviews` query Prisma directly.
  - **Durable Moderation**: `approveReview` and `rejectReview` mutate records directly in PostgreSQL via Prisma.
  - **Schema Correlation**: Added `orderNumber` field and index to `Review` model in `schema.prisma`.

### 2. Uploaded Documents Workflow & Intake Transparency
- **Files Modified**: [`components/OrderModal.tsx`](file:///e:/Linguist%20Point%20International/linguist-point-international-main/components/OrderModal.tsx), [`app/api/orders/route.ts`](file:///e:/Linguist%20Point%20International/linguist-point-international-main/app/api/orders/route.ts)
- **Changes**:
  - **Multipart FormData**: `OrderModal.tsx` submits actual `File` objects via `multipart/form-data`.
  - **Server File Storage**: `/api/orders` parses file streams, validates extensions (`.pdf`, `.doc`, `.docx`, `.jpg`, `.png`, `.tiff`, `.txt`) and 15MB limits, sanitizes names, and saves documents to disk at `.data/uploads/<orderNumber>/`.
  - **Separate Email Path**: Explicitly added clear guidance for clients who prefer emailing sensitive legal files separately to `intake@linguistpoint.com` citing their order number.
  - **Confirmation Dispatch Screen**: Details file status (files received vs. pending email) and outlines the 3-step review workflow:
    1. *Document Review* (source legibility & stamps in 1–2 hours)
    2. *Verified Invoice* (Stripe payment link sent to client email)
    3. *Certified Translation* (starts upon invoice payment)

### 3. Await Async Review Moderation
- **File Modified**: [`app/api/reviews/moderate/route.ts`](file:///e:/Linguist%20Point%20International/linguist-point-international-main/app/api/reviews/moderate/route.ts)
- **Changes**:
  - Awaited `approveReview(reviewId)`, `rejectReview(reviewId)`, and `getPendingReviews()`.
  - Nonexistent review IDs now accurately return `404 Not Found`.

### 4. Trusted Proxy IP Extraction & Rate Limiting
- **Files Modified / Added**: [`lib/rate-limit.ts`](file:///e:/Linguist%20Point%20International/linguist-point-international-main/lib/rate-limit.ts), [`app/api/chat/route.ts`](file:///e:/Linguist%20Point%20International/linguist-point-international-main/app/api/chat/route.ts)
- **Changes**:
  - Created `lib/rate-limit.ts` with `getTrustedClientIp(req)`.
  - Resolves edge proxy headers in order of trust: `cf-connecting-ip` (Cloudflare) > `x-vercel-forwarded-for` (Vercel) > `x-real-ip` (reverse proxy) > sanitized `x-forwarded-for`.
  - Validates IPv4/IPv6 structure to prevent injection.
  - Sliding window rate limiting with automatic periodic cleanup of stale keys and `Retry-After` headers on 429.

### 5. Testimonial Transparency & Sample Case Studies
- **Files Modified**: [`lib/mock-data.ts`](file:///e:/Linguist%20Point%20International/linguist-point-international-main/lib/mock-data.ts), [`components/ReviewSection.tsx`](file:///e:/Linguist%20Point%20International/linguist-point-international-main/components/ReviewSection.tsx)
- **Changes**:
  - Added `isSample: boolean` flag to `ReviewMock`.
  - All default mock items in `INITIAL_REVIEWS` are flagged with `isSample: true`.
  - In `ReviewSection.tsx`, mock items render with a neutral **`Representative Case`** badge.
  - Only real customer orders that pass verification and QA moderation receive the emerald **`Verified Client Order`** badge.
  - Updated section description for transparency.

### 6. Expanded Automated Test Suite
- **File Modified**: [`scripts/test-validation.ts`](file:///e:/Linguist%20Point%20International/linguist-point-international-main/scripts/test-validation.ts)
- **Result**: **27 Passed, 0 Failed**.
  - Pricing & turnaround calculations
  - Review eligibility & moderation 404 checks for nonexistent IDs
  - Testimonial sample labeling checks
  - Input bounds & document intake metadata persistence
  - Trusted client IP resolution & rate limiter enforcement (blocks 31st request)

---

## 🚦 Verification Status

```bash
# Automated Tests
npm test
# Output: 27 PASSED, 0 FAILED

# TypeScript Check
npx tsc --noEmit
# Output: Exit code 0 (No type errors)

# Production Build
npm run build
# Output: All 9 static & dynamic routes compiled and generated cleanly
```

---

## 📦 Git Status
Committed and pushed to `origin main`:
- Commit: `Enhance persistence source-of-truth, multipart document intake, async moderation, trusted proxy rate limiting, and sample labeling`
- Remote: `https://github.com/ashafiee1979-netizen/linguist-point-international.git` (`main -> main`)
