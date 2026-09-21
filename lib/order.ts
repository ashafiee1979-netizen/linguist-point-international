import type { ServiceType } from "@/lib/pricing";

// Shape handed from the hero calculator, pricing cards and language lookup to
// the order modal, so the quote the client already configured carries over into
// checkout. Every field is optional at the call site; the modal fills the gaps.
export interface OrderDraft {
  serviceType: ServiceType;
  sourceLang: string;
  targetLang: string;
  pageCount: number;
  wordCount: number;
  isRush: boolean;
  isNotarized: boolean;
  isHardCopy: boolean;
  totalAmount: number;
}

// What POST /api/orders returns on success.
export interface OrderRecord {
  id: string;
  orderNumber: string;
  clientName: string;
  clientEmail: string;
  serviceType: ServiceType;
  sourceLanguage: string;
  targetLanguage: string;
  pageCount: number;
  wordCount: number;
  totalAmount: number;
  turnaround: string;
  paymentStatus: string;
  orderStatus: string;
  createdAt: string;
}

export interface OrderResponse {
  success: boolean;
  message?: string;
  error?: string;
  order?: OrderRecord;
}
