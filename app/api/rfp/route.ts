import { NextResponse } from "next/server";

const asString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const contactName = asString(body.contactName);
  const corporateEmail = asString(body.corporateEmail);
  const phone = asString(body.phone);

  const missing: string[] = [];
  if (!contactName) missing.push("a contact name");
  if (!EMAIL_PATTERN.test(corporateEmail)) missing.push("a valid corporate email");
  if (!phone) missing.push("a callback number");

  if (missing.length > 0) {
    return NextResponse.json(
      { success: false, error: `Please provide ${missing.join(", ")}.` },
      { status: 400 }
    );
  }

  try {
    // In production with Neon, this executes:
    // await prisma.rfpInquiry.create({ data: { ... } });

    const inquiry = {
      id: `rfp_${Date.now()}`,
      referenceNumber: `LP-RFP-${Math.floor(10000 + Math.random() * 90000)}`,
      contactName,
      corporateEmail,
      phone,
      preferredTime: asString(body.preferredTime),
      volumeScope: asString(body.volumeScope),
      targetLanguages: asString(body.targetLanguages),
      projectNotes: asString(body.projectNotes),
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: "Proposal request received (Ready for Neon DB)",
      inquiry,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: "Failed to submit your request." },
      { status: 500 }
    );
  }
}
