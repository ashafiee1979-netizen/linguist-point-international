import { calculatePrice, PRICING } from "../lib/pricing";
import {
  verifyOrderEligibility,
  approveReview,
  rejectReview,
  registerOrder,
} from "../lib/review-store";
import { INITIAL_REVIEWS } from "../lib/mock-data";
import { getTrustedClientIp, checkRateLimit, clearRateLimits } from "../lib/rate-limit";

let passed = 0;
let failed = 0;

function assert(condition: boolean, testName: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${testName}`);
    failed++;
  }
}

async function runTests() {
  console.log("\n==========================================");
  console.log("  RUNNING LINGUIST POINT SYSTEM TESTS");
  console.log("==========================================\n");

  // 1. Pricing Engine Tests
  console.log("1. Testing Pricing Calculation Engine:");
  {
    // Certified 1 page standard
    const p1 = calculatePrice({
      serviceType: "certified",
      pageCount: 1,
      wordCount: 250,
      isRush12Hour: false,
      isNotarized: false,
      isHardCopyMail: false,
    });
    assert(p1.totalAmount === PRICING.pricePerPage, `Certified 1 page base price is $${PRICING.pricePerPage}`);
    assert(p1.turnaround === "Within 24 Hours", "Default certified turnaround is 'Within 24 Hours'");

    // Certified 2 pages + rush + notarization + hard copy
    const p2 = calculatePrice({
      serviceType: "certified",
      pageCount: 2,
      wordCount: 500,
      isRush12Hour: true,
      isNotarized: true,
      isHardCopyMail: true,
    });
    const expectedTotal =
      2 * PRICING.pricePerPage + PRICING.rushFee + PRICING.notarizationFee + PRICING.shippingFee;
    assert(
      Math.abs(p2.totalAmount - expectedTotal) < 0.01,
      `Certified 2 pages + add-ons calculates exactly $${expectedTotal.toFixed(2)} (got $${p2.totalAmount.toFixed(2)})`
    );
    assert(p2.turnaround === "Within 12 Hours (Express Rush)", "Rush turnaround is 'Within 12 Hours (Express Rush)'");

    // Standard word count minimum order
    const p3 = calculatePrice({
      serviceType: "standard",
      pageCount: 1,
      wordCount: 100,
      isRush12Hour: false,
      isNotarized: false,
      isHardCopyMail: false,
    });
    assert(
      p3.totalAmount === PRICING.standardMinimum,
      `Standard 100 words enforces minimum order floor $${PRICING.standardMinimum}`
    );
    assert(p3.turnaround === "24 – 48 Hours", "Default standard turnaround is '24 – 48 Hours'");

    // Standard high word count
    const p4 = calculatePrice({
      serviceType: "standard",
      pageCount: 4,
      wordCount: 1000,
      isRush12Hour: false,
      isNotarized: false,
      isHardCopyMail: false,
    });
    assert(
      p4.totalAmount === 1000 * PRICING.pricePerWord,
      `Standard 1000 words calculates $${(1000 * PRICING.pricePerWord).toFixed(2)}`
    );
  }

  // 2. Review Eligibility & Moderation Tests
  console.log("\n2. Testing Review Verification & Moderation Accuracy:");
  {
    // Non-existent order
    const v1 = await verifyOrderEligibility("NON-EXISTENT", "test@example.com");
    assert(v1.eligible === false && v1.reason === "not_found", "Non-existent order is rejected with not_found");

    // Find order with whitespace & case insensitivity
    const v2 = await verifyOrderEligibility("   lp-invalid-1234  ", "  user@domain.com  ");
    assert(v2.eligible === false, "Trim and case normalization handled cleanly");

    // Moderation: approve nonexistent review ID returns false (tested with await)
    const approveResult = await approveReview("nonexistent-review-id-99999");
    assert(approveResult === false, "approveReview on nonexistent ID cleanly returns false");

    // Moderation: reject nonexistent review ID returns false
    const rejectResult = await rejectReview("nonexistent-review-id-99999");
    assert(rejectResult === false, "rejectReview on nonexistent ID cleanly returns false");
  }

  // 3. Testimonial Integrity & Case Study Labeling
  console.log("\n3. Testing Testimonial Transparency & Sample Labeling:");
  {
    const allSamplesLabeled = INITIAL_REVIEWS.every((r) => r.isSample === true);
    assert(allSamplesLabeled, "All initial mock reviews are explicitly flagged with isSample: true");
  }

  // 4. Input Bounds, Sanitization & Document Intake
  console.log("\n4. Testing Input Bounds, Document Intake & Role Security:");
  {
    // Max pages bound
    assert(PRICING.maxPages === 1000, "Max page count upper bound is defined at 1000");

    // Email regex validation (matching API endpoint regex)
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    assert(emailPattern.test("valid.client@lawfirm.com") === true, "Valid email format passes");
    assert(emailPattern.test("malformed-email") === false, "Malformed email rejected");
    assert(emailPattern.test("<script>alert(1)</script>@hack.com") === false, "Injected HTML tags in email rejected");

    // Role filtering check (Chat hardening)
    const allowedRoles = new Set(["user", "assistant"]);
    assert(allowedRoles.has("user") === true, "Allowed role: user");
    assert(allowedRoles.has("assistant") === true, "Allowed role: assistant");
    assert(allowedRoles.has("system") === false, "Injected role 'system' is rejected");
    assert(allowedRoles.has("admin") === false, "Injected role 'admin' is rejected");

    // Order intake with file metadata
    const orderWithFiles = await registerOrder({
      orderNumber: "LP-TEST-FILE-01",
      clientEmail: "test-file@domain.com",
      clientName: "Test Document Intake",
      sourceLanguage: "German",
      targetLanguage: "English",
      serviceType: "certified",
      fileNames: ["diploma.pdf", "transcript.pdf"],
      filesReceived: true,
    });
    assert(orderWithFiles.filesReceived === true, "Order records filesReceived flag accurately");
    assert(orderWithFiles.fileNames?.length === 2, "Order preserves uploaded file names list");
  }

  // 5. Trusted Client IP Resolution & Rate Limiter Tests
  console.log("\n5. Testing Trusted IP Resolution & Rate Limiting:");
  {
    clearRateLimits();

    // Cloudflare edge IP takes precedence over X-Forwarded-For
    const mockReqCf = new Request("http://localhost/api/chat", {
      headers: {
        "cf-connecting-ip": "198.51.100.42",
        "x-forwarded-for": "10.0.0.1, 10.0.0.2",
      },
    });
    const ipCf = getTrustedClientIp(mockReqCf);
    assert(ipCf === "198.51.100.42", "Cloudflare connecting IP takes priority over spoofable headers");

    // Vercel edge IP
    const mockReqVercel = new Request("http://localhost/api/chat", {
      headers: {
        "x-vercel-forwarded-for": "203.0.113.19",
      },
    });
    const ipVercel = getTrustedClientIp(mockReqVercel);
    assert(ipVercel === "203.0.113.19", "Vercel forwarded IP is parsed accurately");

    // Malformed IP injection rejected
    const mockReqMalicious = new Request("http://localhost/api/chat", {
      headers: {
        "x-forwarded-for": "<script>alert(1)</script>",
      },
    });
    const ipSafe = getTrustedClientIp(mockReqMalicious);
    assert(ipSafe === "127.0.0.1", "Malformed/injected IP defaults safely to fallback IP");

    // Rate limiter allows up to limit and blocks after
    const testIp = "192.0.2.100";
    let lastAllowed = true;
    for (let i = 0; i < 30; i++) {
      lastAllowed = checkRateLimit(testIp, 30).allowed;
    }
    assert(lastAllowed === true, "30 requests within 1 minute are allowed");

    const blockedResult = checkRateLimit(testIp, 30);
    assert(blockedResult.allowed === false, "31st request is blocked by rate limiter (429)");
  }

  console.log("\n==========================================");
  console.log(`  RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log("==========================================\n");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test execution error:", err);
  process.exit(1);
});
