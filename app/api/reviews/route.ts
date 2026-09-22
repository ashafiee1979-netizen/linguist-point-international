import { NextResponse } from "next/server";
import { getApprovedReviews, submitVerifiedReview } from "@/lib/review-store";

export async function GET() {
  const reviews = getApprovedReviews();
  return NextResponse.json({ success: true, reviews });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const orderNumber = typeof body.orderNumber === "string" ? body.orderNumber.trim() : "";
  const clientEmail = typeof body.clientEmail === "string" ? body.clientEmail.trim() : "";
  const clientName = typeof body.clientName === "string" ? body.clientName.trim() : "";
  const location = typeof body.location === "string" ? body.location.trim() : "United States";
  const languagePair = typeof body.languagePair === "string" ? body.languagePair.trim() : "";
  const useCase = typeof body.useCase === "string" ? body.useCase.trim() : "Official Regulatory Submission";
  const rating = Number(body.rating) || 5;
  const comments = typeof body.comments === "string" ? body.comments.trim() : "";

  if (!orderNumber || !clientEmail) {
    return NextResponse.json(
      { success: false, error: "A valid order number and email are required to submit a verified review." },
      { status: 400 }
    );
  }

  if (!comments || comments.length < 10) {
    return NextResponse.json(
      { success: false, error: "Please write at least 10 characters detailing your translation experience." },
      { status: 400 }
    );
  }

  const result = submitVerifiedReview({
    orderNumber,
    clientEmail,
    clientName,
    location,
    languagePair,
    useCase,
    rating,
    comments,
  });

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    message: "Thank you! Your verified review has been submitted and will appear after quality approval.",
    review: result.review,
  });
}
