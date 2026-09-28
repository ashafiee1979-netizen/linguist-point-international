import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
} from "docx";
import * as fs from "fs";
import * as path from "path";

async function generate() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Title
          new Paragraph({
            text: "Linguist Point International",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: "Production Launch & Custom Domain Deployment Plan",
            heading: HeadingLevel.HEADING_1,
            alignment: AlignmentType.CENTER,
            spacing: { after: 300 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: "Date: September 28, 2026 | Document Status: Approved | Target: Live Production",
                italics: true,
                color: "555555",
              }),
            ],
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),

          // Executive Summary
          new Paragraph({
            text: "1. Executive Summary & Readiness Assessment",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "This document outlines the complete operational roadmap to launch Linguist Point International onto a custom domain (e.g., linguistpoint.com or www.linguistpoint.com) and begin receiving live translation orders and enterprise RFPs."
              ),
            ],
            spacing: { after: 200 },
          }),

          // Table
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Component", bold: true, color: "FFFFFF" })] })],
                    shading: { type: ShadingType.CLEAR, fill: "0F172A" },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Status", bold: true, color: "FFFFFF" })] })],
                    shading: { type: ShadingType.CLEAR, fill: "0F172A" },
                  }),
                  new TableCell({
                    children: [new Paragraph({ children: [new TextRun({ text: "Readiness Details", bold: true, color: "FFFFFF" })] })],
                    shading: { type: ShadingType.CLEAR, fill: "0F172A" },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Frontend UI & Mobile")] }),
                  new TableCell({ children: [new Paragraph("100% Complete")] }),
                  new TableCell({ children: [new Paragraph("Aligned for mobile (360px-430px), iPad (768px-1024px), and desktop.")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Pricing Engine")] }),
                  new TableCell({ children: [new Paragraph("100% Complete")] }),
                  new TableCell({ children: [new Paragraph("Certified ($19.95/page) and standard ($0.08/word) with exact turnaround rules.")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Order Intake API")] }),
                  new TableCell({ children: [new Paragraph("Ready")] }),
                  new TableCell({ children: [new Paragraph("Accepts multipart document uploads, calculates rates, generates LP-XXXXXX IDs.")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Security & Moderation")] }),
                  new TableCell({ children: [new Paragraph("Hardened")] }),
                  new TableCell({ children: [new Paragraph("API key protection, trusted proxy rate-limiting, and RFC email validation.")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Automated Tests")] }),
                  new TableCell({ children: [new Paragraph("27/27 Passing")] }),
                  new TableCell({ children: [new Paragraph("Zero failures; Next.js 14 production build succeeds cleanly.")] }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph("Domain & Hosting")] }),
                  new TableCell({ children: [new Paragraph("Ready to Link")] }),
                  new TableCell({ children: [new Paragraph("Connect GitHub repo to Vercel and point DNS A/CNAME records.")] }),
                ],
              }),
            ],
          }),

          // Phase 1
          new Paragraph({
            text: "2. Step-by-Step Deployment Roadmap",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 150 },
          }),
          new Paragraph({
            text: "Phase 1: Deploy to Vercel (Recommended)",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "1. Log In: ", bold: true }),
              new TextRun("Navigate to vercel.com and sign in with GitHub account (ashafiee1979-netizen).\n"),
              new TextRun({ text: "2. Import Project: ", bold: true }),
              new TextRun("Select repository 'linguist-point-international'.\n"),
              new TextRun({ text: "3. Environment Variables: ", bold: true }),
              new TextRun("Add ADMIN_API_KEY (choose a secure secret password) and NODE_ENV=production.\n"),
              new TextRun({ text: "4. Deploy: ", bold: true }),
              new TextRun("Click Deploy. The system generates an immediate preview URL within 90 seconds."),
            ],
            spacing: { after: 200 },
          }),

          // Phase 2
          new Paragraph({
            text: "Phase 2: Custom Domain & DNS Setup",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "1. Add Domain in Vercel: ", bold: true }),
              new TextRun("Under Project Settings -> Domains, enter your domain name (e.g., linguistpoint.com and www.linguistpoint.com).\n"),
              new TextRun({ text: "2. Configure DNS Records: ", bold: true }),
              new TextRun("Log into your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add:\n"),
              new TextRun("   • Type A | Host: @ | Value: 76.76.21.21\n"),
              new TextRun("   • Type CNAME | Host: www | Value: cname.vercel-dns.com\n"),
              new TextRun({ text: "3. Automatic SSL: ", bold: true }),
              new TextRun("Vercel automatically provisions and renews a free Let's Encrypt HTTPS certificate."),
            ],
            spacing: { after: 200 },
          }),

          // Phase 3
          new Paragraph({
            text: "Phase 3: Production Database & File Storage",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun(
                "Because serverless functions have ephemeral local disks, real production order storage should be connected to a managed cloud database:\n"
              ),
              new TextRun({ text: "• PostgreSQL Database: ", bold: true }),
              new TextRun("Create a free Postgres database on Neon.tech or Supabase.com and add DATABASE_URL to Vercel environment variables.\n"),
              new TextRun({ text: "• Document Intake Dispatch: ", bold: true }),
              new TextRun("Directly email customer uploaded documents to intake@linguistpoint.com via Resend or save them to an AWS S3/Cloudflare R2 bucket."),
            ],
            spacing: { after: 200 },
          }),

          // Phase 4
          new Paragraph({
            text: "Phase 4: Notifications & Payment Collection",
            heading: HeadingLevel.HEADING_3,
            spacing: { before: 150, after: 100 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "• Customer & Staff Notifications: ", bold: true }),
              new TextRun("Send an instant confirmation email with LP-XXXXXX reference number to the client and notify intake staff.\n"),
              new TextRun({ text: "• Payment Processing: ", bold: true }),
              new TextRun("Staff verifies page count and sends an official Stripe invoice, or enables direct in-app Stripe Checkout."),
            ],
            spacing: { after: 200 },
          }),

          // Checklist
          new Paragraph({
            text: "3. Pre-Launch Verification Checklist",
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun("[X] TypeScript validation: 0 errors\n"),
              new TextRun("[X] 27 system tests passing\n"),
              new TextRun("[X] Mobile & iPad responsive layouts verified\n"),
              new TextRun("[X] Robots.txt and Sitemap.xml generated\n"),
              new TextRun("[ ] Link GitHub repo to Vercel hosting\n"),
              new TextRun("[ ] Point DNS A and CNAME records at domain registrar\n"),
              new TextRun("[ ] Set ADMIN_API_KEY environment variable\n"),
              new TextRun("[ ] Place test order on live custom domain"),
            ],
            spacing: { after: 200 },
          }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.join(process.cwd(), "Linguist_Point_Implementation_Plan.docx");
  fs.writeFileSync(outPath, buffer);
  console.log("Successfully generated:", outPath);
}

generate().catch(console.error);
