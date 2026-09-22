import { INITIAL_REVIEWS, ReviewMock } from "@/lib/mock-data";

export interface StoredOrder {
  orderNumber: string;
  clientEmail: string;
  clientName: string;
  sourceLanguage: string;
  targetLanguage: string;
  serviceType: string;
  status: "COMPLETED" | "DELIVERED" | "IN_TRANSLATION" | "PENDING";
  deliveredAt?: string; // ISO date string
  createdAt: string;
  hasReview: boolean;
}

interface GlobalReviewStore {
  orders: StoredOrder[];
  reviews: ReviewMock[];
}

const globalForStore = globalThis as unknown as { __linguistReviewStore?: GlobalReviewStore };

if (!globalForStore.__linguistReviewStore) {
  globalForStore.__linguistReviewStore = {
    orders: [
      {
        orderNumber: "LP-2026-8941",
        clientEmail: "farhad@example.com",
        clientName: "Farhad Rahimi",
        sourceLanguage: "Persian (Farsi)",
        targetLanguage: "English",
        serviceType: "certified",
        status: "DELIVERED",
        // Delivered 3 days ago (> 24 hours):
        deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        hasReview: false,
      },
      {
        orderNumber: "LP-2026-7732",
        clientEmail: "zahra@example.com",
        clientName: "Zahra Hosseini",
        sourceLanguage: "Dari",
        targetLanguage: "English",
        serviceType: "certified",
        status: "DELIVERED",
        // Delivered 2 days ago (> 24 hours):
        deliveredAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        hasReview: false,
      },
      {
        orderNumber: "LP-2026-9915",
        clientEmail: "bilal@example.com",
        clientName: "Bilal Khan",
        sourceLanguage: "Urdu",
        targetLanguage: "English",
        serviceType: "certified",
        status: "DELIVERED",
        // Delivered 6 hours ago (< 24 hours):
        deliveredAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
        hasReview: false,
      },
      {
        orderNumber: "LP-2026-4421",
        clientEmail: "elena@example.com",
        clientName: "Elena Rostova",
        sourceLanguage: "Russian",
        targetLanguage: "English",
        serviceType: "standard",
        status: "IN_TRANSLATION",
        createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        hasReview: false,
      },
    ],
    reviews: [...INITIAL_REVIEWS],
  };
}

const store = globalForStore.__linguistReviewStore;

export function registerOrder(order: {
  orderNumber: string;
  clientEmail: string;
  clientName: string;
  sourceLanguage: string;
  targetLanguage: string;
  serviceType: string;
}) {
  store.orders.push({
    ...order,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    hasReview: false,
  });
}

export function findOrder(orderNumber: string, email: string): StoredOrder | undefined {
  const normNumber = orderNumber.trim().toUpperCase();
  const normEmail = email.trim().toLowerCase();
  return store.orders.find(
    (o) => o.orderNumber.toUpperCase() === normNumber && o.clientEmail.toLowerCase() === normEmail
  );
}

export interface VerificationResult {
  eligible: boolean;
  reason?: "not_found" | "in_progress" | "too_recent" | "already_reviewed";
  message: string;
  order?: {
    orderNumber: string;
    clientName: string;
    clientEmail: string;
    languagePair: string;
    serviceType: string;
    status: string;
    deliveredAt?: string;
  };
  hoursRemaining?: number;
}

export function verifyOrderEligibility(orderNumber: string, email: string): VerificationResult {
  const order = findOrder(orderNumber, email);

  if (!order) {
    return {
      eligible: false,
      reason: "not_found",
      message: "No order found matching this order number and email address. Please check your confirmation receipt.",
    };
  }

  if (order.hasReview) {
    return {
      eligible: false,
      reason: "already_reviewed",
      message: `A verified review has already been submitted for Order #${order.orderNumber}. Thank you for your feedback!`,
    };
  }

  if (order.status !== "COMPLETED" && order.status !== "DELIVERED") {
    return {
      eligible: false,
      reason: "in_progress",
      message: `Order #${order.orderNumber} is currently in progress (${order.status.toLowerCase().replace("_", " ")}). Reviews unlock 24 hours after final translation delivery.`,
      order: {
        orderNumber: order.orderNumber,
        clientName: order.clientName,
        clientEmail: order.clientEmail,
        languagePair: `${order.sourceLanguage} to ${order.targetLanguage}`,
        serviceType: order.serviceType,
        status: order.status,
      },
    };
  }

  if (!order.deliveredAt) {
    return {
      eligible: false,
      reason: "in_progress",
      message: "Delivery timestamp is not yet recorded for this order.",
    };
  }

  const deliveredTime = new Date(order.deliveredAt).getTime();
  const now = Date.now();
  const elapsedMs = now - deliveredTime;
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  if (elapsedMs < ONE_DAY_MS) {
    const hoursRemaining = Math.max(1, Math.ceil((ONE_DAY_MS - elapsedMs) / (60 * 60 * 1000)));
    return {
      eligible: false,
      reason: "too_recent",
      hoursRemaining,
      message: `Order #${order.orderNumber} was delivered recently. To ensure you have thoroughly reviewed your translated documents, review access unlocks 24 hours after delivery. Please check back in approximately ${hoursRemaining} hour${hoursRemaining === 1 ? "" : "s"}.`,
      order: {
        orderNumber: order.orderNumber,
        clientName: order.clientName,
        clientEmail: order.clientEmail,
        languagePair: `${order.sourceLanguage} to ${order.targetLanguage}`,
        serviceType: order.serviceType,
        status: order.status,
        deliveredAt: order.deliveredAt,
      },
    };
  }

  return {
    eligible: true,
    message: "Order verified successfully! You are eligible to submit a verified review.",
    order: {
      orderNumber: order.orderNumber,
      clientName: order.clientName,
      clientEmail: order.clientEmail,
      languagePair: `${order.sourceLanguage} to ${order.targetLanguage}`,
      serviceType: order.serviceType,
      status: order.status,
      deliveredAt: order.deliveredAt,
    },
  };
}

export function submitVerifiedReview(data: {
  orderNumber: string;
  clientEmail: string;
  clientName: string;
  location?: string;
  languagePair: string;
  useCase?: string;
  rating: number;
  comments: string;
}): { success: boolean; review?: ReviewMock; error?: string } {
  const verification = verifyOrderEligibility(data.orderNumber, data.clientEmail);
  if (!verification.eligible) {
    return { success: false, error: verification.message };
  }

  const order = findOrder(data.orderNumber, data.clientEmail);
  if (order) {
    order.hasReview = true;
  }

  const initials =
    data.clientName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "VC";

  const newReview: ReviewMock = {
    id: `rev-${Date.now()}`,
    orderNumber: data.orderNumber,
    clientName: data.clientName,
    initials,
    location: data.location || "United States",
    languagePair: data.languagePair,
    useCase: data.useCase || "Official Certified Translation",
    rating: Math.max(1, Math.min(5, data.rating)),
    comments: data.comments.trim(),
    dateAgo: "Just now",
    isVerified: true,
    isApproved: false, // Default to false pending moderator approval
  };

  store.reviews.unshift(newReview);

  return { success: true, review: newReview };
}

export function getApprovedReviews(): ReviewMock[] {
  return store.reviews.filter((r) => r.isApproved !== false);
}

export function getPendingReviews(): ReviewMock[] {
  return store.reviews.filter((r) => r.isApproved === false);
}

export function approveReview(id: string): boolean {
  const review = store.reviews.find((r) => r.id === id);
  if (review) {
    review.isApproved = true;
    return true;
  }
  return false;
}

export function rejectReview(id: string): boolean {
  const initialLength = store.reviews.length;
  store.reviews = store.reviews.filter((r) => r.id !== id);
  return store.reviews.length < initialLength;
}
