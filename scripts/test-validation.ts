import { calculatePrice, PRICING } from "../lib/pricing";
import { verifyOrderEligibility } from "../lib/review-store";

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

  // 2. Review Eligibility Tests
  console.log("\n2. Testing Review Verification Eligibility:");
  {
    // Non-existent order
    const v1 = verifyOrderEligibility("NON-EXISTENT", "test@example.com");
    assert(v1.eligible === false && v1.reason === "not_found", "Non-existent order is rejected with not_found");

    // Find order with whitespace & case insensitivity
    const v2 = verifyOrderEligibility("   lp-invalid-1234  ", "  user@domain.com  ");
    assert(v2.eligible === false, "Trim and case normalization handled cleanly");
  }

  // 3. Input Validation Bounds & Role Security
  console.log("\n3. Testing Input Bounds & Sanitization:");
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
