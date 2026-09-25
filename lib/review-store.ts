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
  fileNames?: string[];
  filesReceived?: boolean;
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
  } catch (err) {
    console.warn("Could not load local persisted store:", err);
  }
  return null;
}

function saveStoreToDisk(data: GlobalReviewStore) {
  try {
    const filePath = getStorageFilePath();
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Local file store write failure:", err);
    // If not using Prisma and local write fails, re-throw to make failure visible
    if (!prisma) {
      throw new Error(`Failed to write to local storage: ${err instanceof Error ? err.message : String(err)}`);
    }
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

/**
 * Register a new translation intake order.
 * If Prisma PostgreSQL is connected, it acts as the primary source of truth,
 * and any database write failure will propagate immediately to the caller.
 */
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
  fileNames?: string[];
  filesReceived?: boolean;
}): Promise<StoredOrder> {
  const newOrder: StoredOrder = {
    ...order,
    status: "PENDING",
    createdAt: new Date().toISOString(),
    hasReview: false,
    fileNames: order.fileNames || [],
    filesReceived: order.filesReceived ?? (order.fileNames && order.fileNames.length > 0),
  };

  // Primary Durable Source of Truth: Prisma PostgreSQL
  if (prisma) {
    try {
      const dbOrder = await prisma.order.create({
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
      newOrder.id = dbOrder.id;
    } catch (err) {
      console.error("Critical: Prisma order write failure:", err);
      // Make write failures visible - do NOT silently swallow DB errors in production
      throw new Error(`Database order persistence failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Also sync to local memory/file store
  store.orders.push(newOrder);
  saveStoreToDisk(store);

  return newOrder;
}

/**
 * Find an order by orderNumber and clientEmail.
 * Queries PostgreSQL when Prisma is configured, falling back to local store.
 */
export async function findOrder(orderNumber: string, email: string): Promise<StoredOrder | undefined> {
  const normNumber = orderNumber.trim().toUpperCase();
  const normEmail = email.trim().toLowerCase();

  if (prisma) {
    try {
      const dbOrder = await prisma.order.findFirst({
        where: {
          orderNumber: { equals: normNumber, mode: "insensitive" },
          clientEmail: { equals: normEmail, mode: "insensitive" },
        },
      });

      if (dbOrder) {
        // Check if review already exists for this order in database
        const existingReview = await prisma.review.findFirst({
          where: { orderNumber: dbOrder.orderNumber },
        });

        return {
          id: dbOrder.id,
          orderNumber: dbOrder.orderNumber,
          clientName: dbOrder.clientName,
          clientEmail: dbOrder.clientEmail,
          sourceLanguage: dbOrder.sourceLanguage,
          targetLanguage: dbOrder.targetLanguage,
          serviceType: dbOrder.serviceType,
          pageCount: dbOrder.pageCount,
          wordCount: dbOrder.wordCount ?? undefined,
          totalAmount: Number(dbOrder.totalAmount),
          turnaround: dbOrder.turnaround ?? undefined,
          status: dbOrder.orderStatus as StoredOrder["status"],
          deliveredAt: dbOrder.updatedAt ? dbOrder.updatedAt.toISOString() : undefined,
          createdAt: dbOrder.createdAt.toISOString(),
          hasReview: Boolean(existingReview),
        };
      }
    } catch (err) {
      console.error("Prisma findOrder query error:", err);
      throw err;
    }
  }

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

/**
 * Verify order eligibility for submitting a customer review.
 * Awaits order lookup from the primary database source of truth.
 */
export async function verifyOrderEligibility(orderNumber: string, email: string): Promise<VerificationResult> {
  const order = await findOrder(orderNumber, email);

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

/**
 * Submit a verified customer review.
 * Persists to PostgreSQL with visible error propagation, and queues for moderation.
 */
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
  const verification = await verifyOrderEligibility(data.orderNumber, data.clientEmail);
  if (!verification.eligible) {
    return { success: false, error: verification.message };
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
    isSample: false,
  };

  // Primary DB persistence
  if (prisma) {
    try {
      const dbReview = await prisma.review.create({
        data: {
          orderNumber: newReview.orderNumber,
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
      newReview.id = dbReview.id;
    } catch (err) {
      console.error("Critical: Prisma review write failure:", err);
      throw new Error(`Database review persistence failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  // Update memory/file store
  const localOrder = store.orders.find(
    (o) =>
      o.orderNumber.trim().toUpperCase() === data.orderNumber.trim().toUpperCase() &&
      o.clientEmail.trim().toLowerCase() === data.clientEmail.trim().toLowerCase()
  );
  if (localOrder) {
    localOrder.hasReview = true;
  }

  store.reviews.unshift(newReview);
  saveStoreToDisk(store);

  return { success: true, review: newReview };
}

/**
 * Retrieve approved reviews for the public reviews wall.
 * Reads from PostgreSQL when Prisma is configured.
 */
export async function getApprovedReviews(): Promise<ReviewMock[]> {
  if (prisma) {
    try {
      const dbReviews = await prisma.review.findMany({
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
      });

      if (dbReviews.length > 0) {
        return dbReviews.map((r: any) => ({
          id: r.id,
          orderNumber: r.orderNumber ?? undefined,
          clientName: r.clientName,
          initials: r.initials,
          location: r.location ?? "United States",
          languagePair: r.languagePair,
          useCase: r.useCase ?? "Certified Translation",
          rating: r.rating,
          comments: r.comments,
          dateAgo: "Verified Client",
          isVerified: r.isVerified,
          isApproved: r.isApproved,
          isSample: false,
        }));
      }
    } catch (err) {
      console.error("Prisma getApprovedReviews error:", err);
      throw err;
    }
  }

  return store.reviews.filter((r) => r.isApproved !== false);
}

/**
 * Retrieve pending reviews for the moderation API.
 * Reads from PostgreSQL when Prisma is configured.
 */
export async function getPendingReviews(): Promise<ReviewMock[]> {
  if (prisma) {
    try {
      const dbReviews = await prisma.review.findMany({
        where: { isApproved: false },
        orderBy: { createdAt: "desc" },
      });

      return dbReviews.map((r: any) => ({
        id: r.id,
        orderNumber: r.orderNumber ?? undefined,
        clientName: r.clientName,
        initials: r.initials,
        location: r.location ?? "United States",
        languagePair: r.languagePair,
        useCase: r.useCase ?? "Certified Translation",
        rating: r.rating,
        comments: r.comments,
        dateAgo: "Pending QA",
        isVerified: r.isVerified,
        isApproved: r.isApproved,
        isSample: false,
      }));
    } catch (err) {
      console.error("Prisma getPendingReviews error:", err);
      throw err;
    }
  }

  return store.reviews.filter((r) => r.isApproved === false);
}

/**
 * Approve a review in the primary data store.
 * Returns true if successfully updated, or false if not found.
 */
export async function approveReview(id: string): Promise<boolean> {
  if (prisma) {
    try {
      await prisma.review.update({
        where: { id },
        data: { isApproved: true },
      });
      // Mirror to local cache
      const local = store.reviews.find((r) => r.id === id);
      if (local) local.isApproved = true;
      saveStoreToDisk(store);
      return true;
    } catch {
      // Prisma update throws if record does not exist
      return false;
    }
  }

  const review = store.reviews.find((r) => r.id === id);
  if (review) {
    review.isApproved = true;
    saveStoreToDisk(store);
    return true;
  }
  return false;
}

/**
 * Reject / delete a review in the primary data store.
 * Returns true if deleted, or false if not found.
 */
export async function rejectReview(id: string): Promise<boolean> {
  if (prisma) {
    try {
      await prisma.review.delete({
        where: { id },
      });
      store.reviews = store.reviews.filter((r) => r.id !== id);
      saveStoreToDisk(store);
      return true;
    } catch {
      return false;
    }
  }

  const initialLength = store.reviews.length;
  store.reviews = store.reviews.filter((r) => r.id !== id);
  if (store.reviews.length < initialLength) {
    saveStoreToDisk(store);
    return true;
  }
  return false;
}

/**
 * Register an enterprise RFP inquiry.
 * Persists directly to PostgreSQL when configured, propagating write failures.
 */
export async function registerRfpInquiry(data: StoredRfp): Promise<StoredRfp> {
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
      console.error("Critical: Prisma RFP inquiry write failure:", err);
      throw new Error(`Database RFP persistence failed: ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  store.rfps.unshift(data);
  saveStoreToDisk(store);

  return data;
}

export function getRfpInquiries(): StoredRfp[] {
  return store.rfps;
}
