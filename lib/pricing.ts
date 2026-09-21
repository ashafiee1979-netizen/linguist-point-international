// Single source of truth for pricing, mirroring the approved prototype:
// certified work is billed per 250-word page, standard work per word with a
// floor. The hero calculator, the order modal and the order API all read this
// so a price change never has to be made in more than one place.

export type ServiceType = "certified" | "standard";

export const PRICING = {
  /** Certified translation, per 250-word page. */
  pricePerPage: 19.95,
  /** List price shown struck through next to the certified rate. */
  listPricePerPage: 24.95,
  /** Standard (non-certified) translation, per word. */
  pricePerWord: 0.08,
  /** List price shown struck through next to the standard rate. */
  listPricePerWord: 0.1,
  /** Smallest chargeable standard order. */
  standardMinimum: 15.0,
  rushFee: 14.95,
  notarizationFee: 19.95,
  shippingFee: 12.5,
  /** Upper bound on the page slider / page input. */
  maxPages: 1000,
} as const;

export interface PriceInputs {
  serviceType: ServiceType;
  pageCount: number;
  wordCount: number;
  isRush12Hour: boolean;
  isNotarized: boolean;
  isHardCopyMail: boolean;
}

export interface PriceBreakdown {
  basePrice: number;
  addOnsPrice: number;
  rushPrice: number;
  notarizationPrice: number;
  shippingPrice: number;
  totalAmount: number;
  /** Human-readable turnaround, which differs between the two service types. */
  turnaround: string;
}

const round = (value: number) => Math.round(value * 100) / 100;

export function calculatePrice(inputs: PriceInputs): PriceBreakdown {
  const { pricePerPage, pricePerWord, standardMinimum, rushFee, notarizationFee, shippingFee } =
    PRICING;

  const base =
    inputs.serviceType === "certified"
      ? inputs.pageCount * pricePerPage
      : Math.max(inputs.wordCount * pricePerWord, standardMinimum);

  const rush = inputs.isRush12Hour ? rushFee : 0;
  const notarization = inputs.isNotarized ? notarizationFee : 0;
  const shipping = inputs.isHardCopyMail ? shippingFee : 0;
  const addOns = rush + notarization + shipping;

  const turnaround =
    inputs.serviceType === "certified"
      ? inputs.isRush12Hour
        ? "Within 12 Hours (Express Rush)"
        : "Within 24 Hours"
      : inputs.isRush12Hour
        ? "12 – 24 Hours"
        : "24 – 48 Hours";

  return {
    basePrice: round(base),
    addOnsPrice: round(addOns),
    rushPrice: round(rush),
    notarizationPrice: round(notarization),
    shippingPrice: round(shipping),
    totalAmount: round(base + addOns),
    turnaround,
  };
}
