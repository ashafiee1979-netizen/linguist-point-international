import { NextResponse } from "next/server";
import { registerRfpInquiry } from "@/lib/review-store";

const asString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const PHONE_PATTERN = /^[+]?[\d\s().-]{7,30}$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON request body." }, { status: 400 });
  }

  const contactName = asString(body.contactName);
  const corporateEmail = asString(body.corporateEmail);
  const phone = asString(body.phone);

  if (!contactName || contactName.length < 2 || contactName.length > 100) {
    return NextResponse.json(
      { success: false, error: "Contact name must be between 2 and 100 characters." },
      { status: 400 }
    );
  }

  if (!corporateEmail || corporateEmail.length > 100 || !EMAIL_PATTERN.test(corporateEmail)) {
    return NextResponse.json(
      { success: false, error: "A valid corporate email address (max 100 characters) is required." },
      { status: 400 }
    );
  }

  if (!phone || !PHONE_PATTERN.test(phone)) {
    return NextResponse.json(
      { success: false, error: "A valid callback phone number (7 to 30 digits) is required." },
      { status: 400 }
    );
  }

  const projectNotes = asString(body.projectNotes);
  if (projectNotes.length > 2000) {
    return NextResponse.json(
      { success: false, error: "Project notes must not exceed 2000 characters." },
      { status: 400 }
    );
  }

  const preferredTime = asString(body.preferredTime).substring(0, 100);
  const volumeScope = asString(body.volumeScope).substring(0, 100);
  const targetLanguages = asString(body.targetLanguages).substring(0, 150);

  try {
    const inquiry = {
      id: `rfp_${Date.now()}`,
      referenceNumber: `LP-RFP-${Math.floor(10000 + Math.random() * 90000)}`,
      contactName,
      corporateEmail,
      phone,
      preferredTime: preferredTime || undefined,
      volumeScope: volumeScope || undefined,
      targetLanguages: targetLanguages || undefined,
      projectNotes: projectNotes || undefined,
      createdAt: new Date().toISOString(),
    };

    await registerRfpInquiry(inquiry);

    return NextResponse.json({
      success: true,
      message: "Proposal request received and registered successfully.",
      inquiry,
    });
  } catch (error) {
    console.error("RFP inquiry registration error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit proposal request. Please contact support." },
      { status: 500 }
    );
  }
}
