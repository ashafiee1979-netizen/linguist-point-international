import { NextResponse } from "next/server";
import { calculatePrice, PRICING } from "@/lib/pricing";
import type { ServiceType } from "@/lib/pricing";
import { registerOrder } from "@/lib/review-store";

const asString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON request body." }, { status: 400 });
  }

  const clientName = asString(body.clientName);
  const clientEmail = asString(body.clientEmail);
  const sourceLanguage = asString(body.sourceLanguage);
  const targetLanguage = asString(body.targetLanguage);

  // 1. Required field checks & string length bounds
  if (!clientName || clientName.length < 2 || clientName.length > 100) {
    return NextResponse.json(
      { success: false, error: "A valid client name between 2 and 100 characters is required." },
      { status: 400 }
    );
  }

  if (!clientEmail || clientEmail.length > 100 || !EMAIL_PATTERN.test(clientEmail)) {
    return NextResponse.json(
      { success: false, error: "A valid email address (max 100 characters) is required." },
      { status: 400 }
    );
  }

  if (!sourceLanguage || sourceLanguage.length < 2 || sourceLanguage.length > 50) {
    return NextResponse.json(
      { success: false, error: "Source language must be between 2 and 50 characters." },
      { status: 400 }
    );
  }

  if (!targetLanguage || targetLanguage.length < 2 || targetLanguage.length > 50) {
    return NextResponse.json(
      { success: false, error: "Target language must be between 2 and 50 characters." },
      { status: 400 }
    );
  }

  // 2. Service type validation
  const rawServiceType = body.serviceType;
  if (rawServiceType !== "certified" && rawServiceType !== "standard") {
    return NextResponse.json(
      { success: false, error: "Service type must be either 'certified' or 'standard'." },
      { status: 400 }
    );
  }
  const serviceType: ServiceType = rawServiceType;

  // 3. Numeric bounds validation (reject malformed input instead of silent fallback)
  let pageCount = 1;
  if (body.pageCount !== undefined && body.pageCount !== null) {
    const parsedPage = Number(body.pageCount);
    if (!Number.isInteger(parsedPage) || parsedPage < 1 || parsedPage > PRICING.maxPages) {
      return NextResponse.json(
        { success: false, error: `Page count must be an integer between 1 and ${PRICING.maxPages}.` },
        { status: 400 }
      );
    }
    pageCount = parsedPage;
  }

  let wordCount = 250;
  if (body.wordCount !== undefined && body.wordCount !== null) {
    const parsedWords = Number(body.wordCount);
    if (!Number.isInteger(parsedWords) || parsedWords < 1 || parsedWords > 1_000_000) {
      return NextResponse.json(
        { success: false, error: "Word count must be an integer between 1 and 1,000,000." },
        { status: 400 }
      );
    }
    wordCount = parsedWords;
  }

  // 4. Calculate deterministic pricing from published price list
  const isRush12Hour = body.isRush12Hour === true;
  const isNotarized = body.isNotarized === true;
  const isHardCopyMail = body.isHardCopyMail === true;

  const price = calculatePrice({
    serviceType,
    pageCount,
    wordCount,
    isRush12Hour,
    isNotarized,
    isHardCopyMail,
  });

  try {
    const orderNumber = `LP-${Math.floor(100000 + Math.random() * 900000)}`;

    const savedOrder = await registerOrder({
      id: `ord_${Date.now()}`,
      orderNumber,
      clientName,
      clientEmail,
      serviceType,
      sourceLanguage,
      targetLanguage,
      pageCount,
      wordCount,
      totalAmount: price.totalAmount,
      turnaround: price.turnaround,
    });

    return NextResponse.json({
      success: true,
      message: "Translation intake recorded successfully. Our team will verify document parameters and email your confirmed invoice.",
      order: {
        id: savedOrder.id,
        orderNumber: savedOrder.orderNumber,
        clientName: savedOrder.clientName,
        clientEmail: savedOrder.clientEmail,
        serviceType: savedOrder.serviceType,
        sourceLanguage: savedOrder.sourceLanguage,
        targetLanguage: savedOrder.targetLanguage,
        pageCount: savedOrder.pageCount,
        wordCount: savedOrder.wordCount,
        totalAmount: savedOrder.totalAmount,
        turnaround: savedOrder.turnaround,
        paymentStatus: savedOrder.status,
        createdAt: savedOrder.createdAt,
      },
    });
  } catch (error) {
    console.error("Order intake processing error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process translation intake." },
      { status: 500 }
    );
  }
}
