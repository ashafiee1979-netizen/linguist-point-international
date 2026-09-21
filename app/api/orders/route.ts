import { NextResponse } from "next/server";
import { calculatePrice, PRICING } from "@/lib/pricing";
import type { ServiceType } from "@/lib/pricing";

const asString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clampInt = (value: unknown, min: number, max: number, fallback: number): number => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(Math.max(Math.floor(parsed), min), max);
};

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const clientName = asString(body.clientName);
  const clientEmail = asString(body.clientEmail);
  const sourceLanguage = asString(body.sourceLanguage);
  const targetLanguage = asString(body.targetLanguage);

  const missing: string[] = [];
  if (!clientName) missing.push("a name");
  if (!EMAIL_PATTERN.test(clientEmail)) missing.push("a valid email address");
  if (!sourceLanguage || !targetLanguage) missing.push("both languages");

  if (missing.length > 0) {
    return NextResponse.json(
      { success: false, error: `Please provide ${missing.join(", ")}.` },
      { status: 400 }
    );
  }

  const serviceType: ServiceType = body.serviceType === "standard" ? "standard" : "certified";
  const pageCount = clampInt(body.pageCount, 1, PRICING.maxPages, 1);
  const wordCount = clampInt(body.wordCount, 1, 1_000_000, 250);

  // The total is recalculated here rather than trusted from the client, so the
  // recorded amount always matches the published price list.
  const price = calculatePrice({
    serviceType,
    pageCount,
    wordCount,
    isRush12Hour: body.isRush12Hour === true,
    isNotarized: body.isNotarized === true,
    isHardCopyMail: body.isHardCopyMail === true,
  });

  try {
    // In production with Neon, this executes:
    // await prisma.order.create({ data: { ... } });

    const orderRecord = {
      id: `ord_${Date.now()}`,
      orderNumber: `LP-${Math.floor(100000 + Math.random() * 900000)}`,
      clientName,
      clientEmail,
      serviceType,
      sourceLanguage,
      targetLanguage,
      pageCount,
      wordCount,
      totalAmount: price.totalAmount,
      turnaround: price.turnaround,
      paymentStatus: "PENDING",
      orderStatus: "PENDING",
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Order placed successfully (Ready for Neon DB)",
      order: orderRecord,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to process order." },
      { status: 500 }
    );
  }
}
