import { NextResponse } from "next/server";
import { verifyOrderEligibility } from "@/lib/review-store";

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const orderNumber = typeof body.orderNumber === "string" ? body.orderNumber.trim() : "";
  const clientEmail = typeof body.clientEmail === "string" ? body.clientEmail.trim() : "";

  if (!orderNumber || !clientEmail) {
    return NextResponse.json(
      { success: false, eligible: false, error: "Please enter both your Order Number and Email Address." },
      { status: 400 }
    );
  }

  const result = verifyOrderEligibility(orderNumber, clientEmail);

  return NextResponse.json({
    success: true,
    eligible: result.eligible,
    reason: result.reason,
    message: result.message,
    order: result.order,
    hoursRemaining: result.hoursRemaining,
  });
}
