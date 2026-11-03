import * as fs from "fs";
import * as path from "path";

function assert(condition: boolean, msg: string) {
  if (!condition) {
    console.error(`❌ FAIL: ${msg}`);
    process.exit(1);
  }
  console.log(`  ✓ PASS: ${msg}`);
}

console.log("==========================================");
console.log("  COMPREHENSIVE AUDIT: LINGUIST POINT");
console.log("==========================================");

// 1. Verify Pages and Routes Exist
console.log("\n1. Page Routes and Files:");
const appDir = path.join(process.cwd(), "app");
assert(fs.existsSync(path.join(appDir, "page.tsx")), "Homepage app/page.tsx exists");
assert(fs.existsSync(path.join(appDir, "reviews", "page.tsx")), "Reviews page app/reviews/page.tsx exists");
assert(fs.existsSync(path.join(appDir, "layout.tsx")), "Root layout app/layout.tsx exists");
assert(fs.existsSync(path.join(appDir, "sitemap.ts")), "Sitemap generator app/sitemap.ts exists");
assert(fs.existsSync(path.join(process.cwd(), "public", "robots.txt")), "robots.txt exists in public directory");

// 2. Verify Key In-Page Anchor IDs on Homepage
console.log("\n2. In-Page Anchor Target Verification (Homepage):");
const homeContent = fs.readFileSync(path.join(appDir, "page.tsx"), "utf8");
const componentFiles = [
  "components/HeroCalculator.tsx",
  "components/ServicesSection.tsx",
  "components/HowItWorks.tsx",
  "components/LanguageLookup.tsx",
  "components/IndustriesSection.tsx",
  "components/StatutorySection.tsx",
  "components/EnterpriseHeritage.tsx",
  "components/EnterpriseProposal.tsx",
  "components/ReviewSection.tsx",
  "components/FaqSection.tsx",
];

const combinedComponentText = componentFiles
  .map((file) => fs.readFileSync(path.join(process.cwd(), file), "utf8"))
  .join("\n");

const expectedAnchors = [
  "order",
  "services",
  "how-it-works",
  "languages",
  "industries",
  "institutions",
  "heritage",
  "enterprise-proposal",
  "reviews",
  "faq",
];

for (const anchor of expectedAnchors) {
  const hasId = combinedComponentText.includes(`id="${anchor}"`);
  assert(hasId, `Anchor ID '${anchor}' exists on target section component`);
}

// 3. Verify Header and Footer Links
console.log("\n3. Header & Footer Cross-Page Navigation Links:");
const headerContent = fs.readFileSync(path.join(process.cwd(), "components", "Header.tsx"), "utf8");
assert(headerContent.includes('{ href: "/", label: "Home" }'), "Header has Home navigation link to '/'");
assert(headerContent.includes('{ href: "/#services", label: "Services" }'), "Header routes to '/#services'");
assert(headerContent.includes('{ href: "/reviews", label: "Reviews" }'), "Header routes to '/reviews'");
assert(headerContent.includes('href="/"'), "Header logo links to root '/'");

const footerContent = fs.readFileSync(path.join(process.cwd(), "components", "Footer.tsx"), "utf8");
assert(footerContent.includes('href: "/#services"'), "Footer links route to '/#services'");
assert(footerContent.includes('href: "/reviews"'), "Footer links route to '/reviews'");

// 4. Verify Image Assets in Public Folder
console.log("\n4. Image Asset Integrity Check:");
const publicAssets = [
  "assets/logo-horizontal-cropped.png",
  "assets/pul-global-partners.png",
  "assets/pul-consulting.jpg",
  "assets/client-un.svg",
  "assets/client-usaid.png",
  "assets/client-world-bank.png",
  "assets/client-adb.png",
  "assets/client-asia-foundation.svg",
  "assets/client-tetra-tech.png",
  "assets/client-dai.jpg",
  "assets/client-etisalat-wide.png",
  "assets/flags/us.svg",
  "assets/flags/af.svg",
  "assets/flags/ua.svg",
  "assets/flags/es.svg",
  "assets/flags/fr.svg",
  "assets/flags/de.svg",
  "assets/flags/sa.svg",
  "assets/flags/cn.svg",
];

for (const asset of publicAssets) {
  const assetPath = path.join(process.cwd(), "public", asset);
  assert(fs.existsSync(assetPath), `Asset public/${asset} exists on disk`);
}

// 5. Verify Viewport & Mobile Responsive Settings
console.log("\n5. Viewport & Mobile Safety Audits:");
const layoutContent = fs.readFileSync(path.join(appDir, "layout.tsx"), "utf8");
assert(layoutContent.includes('width: "device-width"'), "Viewport defines device-width");
assert(layoutContent.includes("initialScale: 1"), "Viewport defines initialScale: 1");

const orderModalContent = fs.readFileSync(path.join(process.cwd(), "components", "OrderModal.tsx"), "utf8");
assert(orderModalContent.includes("100dvh"), "OrderModal uses dynamic 100dvh for mobile screens");
assert(orderModalContent.includes("safe-area-inset-bottom"), "OrderModal includes safe-area-inset-bottom padding");

const uiContent = fs.readFileSync(path.join(process.cwd(), "lib", "ui.ts"), "utf8");
assert(uiContent.includes("text-base sm:text-sm"), "Form inputs use text-base on mobile to prevent iOS Safari auto-zoom");

// 6. Verify Sitemap Contains Both Homepage and Reviews Page
console.log("\n6. Sitemap Indexing Check:");
const sitemapContent = fs.readFileSync(path.join(appDir, "sitemap.ts"), "utf8");
assert(sitemapContent.includes("url: baseUrl"), "Sitemap includes root domain");
assert(sitemapContent.includes("url: `${baseUrl}/reviews`"), "Sitemap includes /reviews page");

console.log("\n==========================================");
console.log("  ALL AUDIT CHECKS PASSED SUCCESSFULLY!");
console.log("==========================================");
