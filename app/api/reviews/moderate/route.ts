import { NextResponse } from "next/server";
import { approveReview, getPendingReviews, rejectReview } from "@/lib/review-store";

function isAuthorized(request: Request): boolean {
  const adminKey = process.env.ADMIN_API_KEY;

  // In production, ADMIN_API_KEY must be configured
  if (!adminKey) {
    if (process.env.NODE_ENV === "production") {
      return false;
    }
    // Allow local development testing only if dev key is explicitly passed
    const devFallbackKey = "dev-admin-key-change-in-prod";
    const headerKey = request.headers.get("x-admin-key");
    const authHeader = request.headers.get("authorization");
    const bearerKey = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    return headerKey === devFallbackKey || bearerKey === devFallbackKey;
  }

  const headerKey = request.headers.get("x-admin-key");
  const authHeader = request.headers.get("authorization");
  const bearerKey = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

  return headerKey === adminKey || bearerKey === adminKey;
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Valid admin API key required." },
      { status: 401 }
    );
  }

  const pending = getPendingReviews();
  return NextResponse.json({ success: true, pending });
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { success: false, error: "Unauthorized. Valid admin API key required." },
      { status: 401 }
    );
  }

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
