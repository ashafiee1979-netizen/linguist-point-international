import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { calculatePrice, PRICING } from "@/lib/pricing";
import type { ServiceType } from "@/lib/pricing";
import { registerOrder } from "@/lib/review-store";

const asString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const ALLOWED_FILE_EXTENSIONS = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
  ".tiff",
  ".tif",
  ".txt",
]);

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let body: Record<string, unknown> = {};
  const receivedFiles: Array<{ name: string; size: number; type: string; buffer: Buffer }> = [];

  try {
    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        if (typeof value === "string") {
          body[key] = value;
        }
      });

      // Extract uploaded files
      const rawFiles = formData.getAll("files");
      for (const item of rawFiles) {
        if (item && typeof item === "object" && "arrayBuffer" in item && "name" in item) {
          const file = item as File;
          const ext = path.extname(file.name).toLowerCase();
          if (!ALLOWED_FILE_EXTENSIONS.has(ext)) {
            return NextResponse.json(
              {
                success: false,
                error: `File type "${ext}" is not supported. Please upload PDF, DOCX, TXT, or image files (JPG, PNG, TIFF).`,
              },
              { status: 400 }
            );
          }
          if (file.size > 15 * 1024 * 1024) {
            return NextResponse.json(
              {
                success: false,
                error: `File "${file.name}" exceeds the 15MB limit. Please upload smaller files or compress them.`,
              },
              { status: 400 }
            );
          }
          const buffer = Buffer.from(await file.arrayBuffer());
          receivedFiles.push({
            name: path.basename(file.name),
            size: file.size,
            type: file.type || "application/octet-stream",
            buffer,
          });
        }
      }
    } else {
      body = await request.json();
    }
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
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
  if (body.pageCount !== undefined && body.pageCount !== null && body.pageCount !== "") {
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
  if (body.wordCount !== undefined && body.wordCount !== null && body.wordCount !== "") {
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
  const isRush12Hour = body.isRush12Hour === true || body.isRush12Hour === "true";
  const isNotarized = body.isNotarized === true || body.isNotarized === "true";
  const isHardCopyMail = body.isHardCopyMail === true || body.isHardCopyMail === "true";

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

    // Store uploaded files on disk in secure directory
    const savedFileNames: string[] = [];
    if (receivedFiles.length > 0) {
      const uploadDir = path.join(process.cwd(), ".data", "uploads", orderNumber);
      try {
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        for (const file of receivedFiles) {
          const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
          fs.writeFileSync(path.join(uploadDir, safeName), file.buffer);
          savedFileNames.push(safeName);
        }
      } catch (err) {
        console.warn("Could not save physical file to disk:", err);
      }
    } else if (Array.isArray(body.fileNames)) {
      savedFileNames.push(...body.fileNames.map(String));
    }

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
      fileNames: savedFileNames,
      filesReceived: savedFileNames.length > 0,
    });

    const fileMessage = savedFileNames.length > 0
      ? `${savedFileNames.length} document(s) uploaded successfully and assigned to intake queue.`
      : "No files attached. If you have confidential documents, please email them to intake@linguistpoint.com citing this order number.";

    return NextResponse.json({
      success: true,
      message: `Translation intake recorded successfully for Order #${orderNumber}. ${fileMessage}`,
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
        fileNames: savedOrder.fileNames,
        filesReceived: savedOrder.filesReceived,
      },
    });
  } catch (error) {
    console.error("Order intake processing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to process translation intake.",
      },
      { status: 500 }
    );
  }
}
