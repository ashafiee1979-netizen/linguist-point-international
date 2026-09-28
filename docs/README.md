# Linguist Point International — Documentation & Artifacts Index

This directory contains all architecture documentation, hardening walkthroughs, peer-review resolution logs, and the custom domain production deployment plan.

---

## 📁 Available Documents

### 1. Production Launch & Custom Domain Deployment Plan
Detailed operational guide covering Vercel cloud hosting, DNS record configuration (`A` and `CNAME` records), database persistence setup, and payment/intake notification workflows.
- **Word Document (`.docx`):** [`Linguist_Point_Implementation_Plan.docx`](./Linguist_Point_Implementation_Plan.docx)
- **Markdown (`.md`):** [`implementation_plan.md`](./implementation_plan.md)

### 2. Architecture, Hardening & Security Walkthrough
Detailed technical record of how the system addressed Codex review items, database persistence, multipart document intake, async review moderation, sliding-window rate limiting, and mobile/iPad responsive alignment.
- **Word Document (`.docx`):** [`Linguist_Point_Architecture_and_Security_Walkthrough.docx`](./Linguist_Point_Architecture_and_Security_Walkthrough.docx)
- **Markdown (`.md`):** [`walkthrough.md`](./walkthrough.md)

---

## 🚦 System Verification Summary
- **Automated QA Suite:** 27 Passed, 0 Failed (`npm test`)
- **TypeScript Typecheck:** 0 Errors (`npx tsc --noEmit`)
- **Next.js Production Build:** 10/10 Routes Compiled & Optimized (`npm run build`)
- **Local Server Test:** Verified live at `http://localhost:3000`
- **Git Repository:** Synced with `https://github.com/ashafiee1979-netizen/linguist-point-international.git`
