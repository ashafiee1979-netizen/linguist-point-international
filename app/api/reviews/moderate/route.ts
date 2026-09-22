import { NextResponse } from "next/server";
import { approveReview, getPendingReviews, rejectReview } from "@/lib/review-store";

export async function GET() {
  const pending = getPendingReviews();
  return NextResponse.json({ success: true, pending });
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid request body." }, { status: 400 });
  }

  const reviewId = typeof body.reviewId === "string" ? body.reviewId.trim() : "";
  const action = typeof body.action === "string" ? body.action.trim() : "";

  if (!reviewId || !action) {
    return NextResponse.json({ success: false, error: "reviewId and action are required." }, { status: 400 });
  }

  if (action === "approve") {
    const success = approveReview(reviewId);
    if (!success) {
      return NextResponse.json({ success: false, error: "Review not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Review approved and published to live wall." });
  }

  if (action === "reject") {
    const success = rejectReview(reviewId);
    if (!success) {
      return NextResponse.json({ success: false, error: "Review not found." }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: "Review rejected." });
  }

  return NextResponse.json({ success: false, error: "Invalid action. Use 'approve' or 'reject'." }, { status: 400 });
}
