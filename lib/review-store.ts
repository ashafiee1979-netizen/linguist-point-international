import fs from "fs";
import path from "path";
import { INITIAL_REVIEWS, ReviewMock } from "@/lib/mock-data";
import { prisma } from "@/lib/prisma";

export interface StoredOrder {
  id?: string;
  orderNumber: string;
  clientEmail: string;
  clientName: string;
  sourceLanguage: string;
  targetLanguage: string;
  serviceType: string;
  pageCount?: number;
  wordCount?: number;
  totalAmount?: number;
  turnaround?: string;
  status: "COMPLETED" | "DELIVERED" | "IN_TRANSLATION" | "PENDING";
  deliveredAt?: string; // ISO date string
  createdAt: string;
  hasReview: boolean;
}

export interface StoredRfp {
  id: string;
  referenceNumber: string;
  contactName: string;
  corporateEmail: string;
  phone: string;
  preferredTime?: string;
  volumeScope?: string;
  targetLanguages?: string;
  projectNotes?: string;
  createdAt: string;
}

interface GlobalReviewStore {
  orders: StoredOrder[];
  reviews: ReviewMock[];
  rfps: StoredRfp[];
}

const isProduction = process.env.NODE_ENV === "production";
const allowDemoOrders = process.env.ENABLE_TEST_ORDERS === "true" && !isProduction;

// File persistence path
function getStorageFilePath(): string {
  // Use .data in workspace, or fallback to /tmp if read-only filesystem
  const localDir = path.join(process.cwd(), ".data");
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    return path.join(localDir, "store.json");
  } catch {
    return path.join("/tmp", "linguist-point-store.json");
  }
}

function loadPersistedStore(): GlobalReviewStore | null {
  try {
    const filePath = getStorageFilePath();
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, "utf-8");
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed.orders) && Array.isArray(parsed.reviews)) {
        return {
          orders: parsed.orders,
          reviews: parsed.reviews,
          rfps: Array.isArray(parsed.rfps) ? parsed.rfps : [],
        };
      }
    }
  } catch {
    // Ignore and fallback to defaults
  }
  return null;
}

function saveStoreToDisk(data: GlobalReviewStore) {
  try {
    const filePath = getStorageFilePath();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch {
    // Ignore in read-only environments
  }
}

const globalForStore = globalThis as unknown as { __linguistReviewStore?: GlobalReviewStore };

if (!globalForStore.__linguistReviewStore) {
  const persisted = loadPersistedStore();
  if (persisted) {
    globalForStore.__linguistReviewStore = persisted;
  } else {
    globalForStore.__linguistReviewStore = {
      orders: allowDemoOrders
        ? [
            {
              orderNumber: "LP-2026-8941",
              clientEmail: "farhad@example.com",
              clientName: "Farhad Rahimi",
              sourceLanguage: "Persian (Farsi)",
              targetLanguage: "English",
              serviceType: "certified",
              status: "DELIVERED",
              deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
              hasReview: false,
            },
          ]
        : [],
      reviews: [...INITIAL_REVIEWS],
      rfps: [],
    };
    saveStoreToDisk(globalForStore.__linguistReviewStore);
  }
}

const store = globalForStore.__linguistReviewStore;

export async function registerOrder(order: {
  id?: string;
  orderNumber: string;
  clientEmail: string;
  clientName: string;
  sourceLanguage: string;
  targetLanguage: string;
  serviceType: string;
  pageCount?: number;
  wordCount?: number;
  totalAmount?: number;
  turnaround?: string;
}) {
  const newOrder: StoredOrder = {
    ...order,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    hasReview: false,
  };

  store.orders.push(newOrder);
  saveStoreToDisk(store);

  // If Prisma database is connected, persist to Postgres
  if (prisma) {
    try {
      await prisma.order.create({
        data: {
          orderNumber: newOrder.orderNumber,
          clientName: newOrder.clientName,
          clientEmail: newOrder.clientEmail,
          sourceLanguage: newOrder.sourceLanguage,
          targetLanguage: newOrder.targetLanguage,
          serviceType: newOrder.serviceType,
          pageCount: newOrder.pageCount ?? 1,
          wordCount: newOrder.wordCount,
          subtotal: newOrder.totalAmount ?? 0,
          totalAmount: newOrder.totalAmount ?? 0,
          turnaround: newOrder.turnaround,
          paymentStatus: "UNPAID",
          orderStatus: "PENDING",
        },
      });
    } catch (err) {
      console.warn("Prisma order persistence fallback to local store:", err);
    }
  }

  return newOrder;
}

export function findOrder(orderNumber: string, email: string): StoredOrder | undefined {
  const normNumber = orderNumber.trim().toUpperCase();
  const normEmail = email.trim().toLowerCase();

  return store.orders.find(
    (o) =>
      o.orderNumber.trim().toUpperCase() === normNumber &&
      o.clientEmail.trim().toLowerCase() === normEmail
  );
}

export interface VerificationResult {
  eligible: boolean;
  reason?: "not_found" | "already_reviewed" | "in_progress" | "too_recent";
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

export async function submitVerifiedReview(data: {
  orderNumber: string;
  clientEmail: string;
  clientName: string;
  location?: string;
  languagePair: string;
  useCase?: string;
  rating: number;
  comments: string;
}): Promise<{ success: boolean; review?: ReviewMock; error?: string }> {
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
  saveStoreToDisk(store);

  // If Prisma is available, also insert into Postgres
  if (prisma) {
    try {
      await prisma.review.create({
        data: {
          clientName: newReview.clientName,
          initials: newReview.initials,
          location: newReview.location,
          languagePair: newReview.languagePair,
          useCase: newReview.useCase,
          rating: newReview.rating,
          comments: newReview.comments,
          isVerified: true,
          isApproved: false,
        },
      });
    } catch (err) {
      console.warn("Prisma review persistence fallback to local store:", err);
    }
  }

  return { success: true, review: newReview };
}

export function getApprovedReviews(): ReviewMock[] {
  return store.reviews.filter((r) => r.isApproved !== false);
}

export function getPendingReviews(): ReviewMock[] {
  return store.reviews.filter((r) => r.isApproved === false);
}

export async function approveReview(id: string): Promise<boolean> {
  const review = store.reviews.find((r) => r.id === id);
  if (review) {
    review.isApproved = true;
    saveStoreToDisk(store);
    return true;
  }
  return false;
}

export async function rejectReview(id: string): Promise<boolean> {
  const initialLength = store.reviews.length;
  store.reviews = store.reviews.filter((r) => r.id !== id);
  if (store.reviews.length < initialLength) {
    saveStoreToDisk(store);
    return true;
  }
  return false;
}

export async function registerRfpInquiry(data: StoredRfp) {
  store.rfps.unshift(data);
  saveStoreToDisk(store);

  if (prisma) {
    try {
      await prisma.rfpInquiry.create({
        data: {
          contactName: data.contactName,
          corporateEmail: data.corporateEmail,
          phone: data.phone,
          preferredTime: data.preferredTime,
          volumeScope: data.volumeScope,
          targetLanguages: data.targetLanguages,
          projectNotes: data.projectNotes,
        },
      });
    } catch (err) {
      console.warn("Prisma RFP persistence fallback to local store:", err);
    }
  }

  return data;
}

export function getRfpInquiries(): StoredRfp[] {
  return store.rfps;
}
