import { PRICING } from "./pricing";
import { POPULAR_LANGUAGES } from "./languages";
import { searchLanguages } from "./language-search";

export interface ChatAction {
  type: "open_order" | "scroll_to";
  label: string;
  payload?: {
    serviceType?: "certified" | "standard";
    sourceLang?: string;
    targetLang?: string;
    pages?: number;
    words?: number;
    isRush?: boolean;
    isNotarized?: boolean;
    isHardCopy?: boolean;
    targetId?: string;
  };
}

export interface ChatMessage {
  id: string;
  sender: "user" | "assistant";
  text: string;
  action?: ChatAction;
  timestamp: string;
}

export interface AutomatedFaq {
  id: string;
  category: string;
  question: string;
  shortLabel: string;
  icon: string;
  answer: string;
  action?: ChatAction;
}

export const AUTOMATED_FAQS: AutomatedFaq[] = [
  {
    id: "faq-uscis",
    category: "Regulatory & Legal",
    question: "Will USCIS accept my translated documents?",
    shortLabel: "USCIS Acceptance Guarantee",
    icon: "🏛️",
    answer:
      "Yes, 100% unconditionally guaranteed. Every certified translation strictly satisfies federal regulation 8 CFR 204.2(a)(1)(iii). Your documents include a signed and embossed Certificate of Translation Accuracy on official agency letterhead with ATA accreditation credentials. In the rare event of a clarification request, free revisions are provided within 12 hours, backed by our 100% full money-back guarantee.",
    action: {
      type: "open_order",
      label: `Order USCIS Certified Translation ($${PRICING.pricePerPage.toFixed(2)}/pg)`,
      payload: { serviceType: "certified", pages: 1 },
    },
  },
  {
    id: "faq-pricing",
    category: "Pricing & Rates",
    question: "How is translation pricing calculated?",
    shortLabel: "Pricing & Page Rates",
    icon: "💰",
    answer:
      `Our pricing is 100% transparent with zero hidden fees:\n• Certified Translation: $${PRICING.pricePerPage.toFixed(2)} per page (up to 250 words per page), including signed Certificate of Accuracy.\n• Standard Translation: $${PRICING.pricePerWord.toFixed(2)} per word ($${PRICING.standardMinimum.toFixed(2)} minimum) for general business and non-official text.\n• Typical 1-page vital records (birth, marriage, diploma) cost exactly $${PRICING.pricePerPage.toFixed(2)}.`,
    action: {
      type: "open_order",
      label: `Start Order ($${PRICING.pricePerPage.toFixed(2)}/pg)`,
      payload: { serviceType: "certified", pages: 1 },
    },
  },
  {
    id: "faq-turnaround",
    category: "Speed & Turnaround",
    question: "How fast is delivery and do you offer rush?",
    shortLabel: "24h & 12h Rush Delivery",
    icon: "⏱️",
    answer:
      `Standard delivery is 24 hours via high-resolution digital PDF. For urgent legal or immigration deadlines, we offer 12-Hour Priority Express Rush for +$${PRICING.rushFee.toFixed(2)}. If you need physical wet-ink hard copies bearing embossed stamps, USPS Priority Mail shipping is available for +$${PRICING.shippingFee.toFixed(2)}.`,
    action: {
      type: "open_order",
      label: "Order with 12-Hour Rush",
      payload: { serviceType: "certified", isRush: true, pages: 1 },
    },
  },
  {
    id: "faq-notary",
    category: "Legal & Notary",
    question: "Do I need notarization or just certification?",
    shortLabel: "Notary vs Certification",
    icon: "🔏",
    answer:
      `Under federal regulation 8 CFR 204.2, USCIS does not require translations to be notarized—a signed & stamped Certificate of Accuracy is 100% sufficient. However, notarization is required by judicial courts, foreign consulates, apostille authorities, and certain state DMVs. We provide optional digital notary seals for +$${PRICING.notarizationFee.toFixed(2)}.`,
    action: {
      type: "open_order",
      label: "Order Notarized Translation",
      payload: { serviceType: "certified", isNotarized: true, pages: 1 },
    },
  },
  {
    id: "faq-languages",
    category: "Languages",
    question: "Do you translate Persian (Farsi), Dari, Pashto & Urdu?",
    shortLabel: "Persian, Dari, Pashto & Urdu",
    icon: "🌐",
    answer:
      "Yes! We maintain accredited native translators specialized in Persian (Farsi), Dari, Pashto, Urdu, Hindi, Arabic, Spanish, French, German, Russian, Chinese, and over 65 world languages. All translations preserve the exact original layout, seals, and formatting.",
    action: {
      type: "open_order",
      label: `Order Certified Translation ($${PRICING.pricePerPage.toFixed(2)}/pg)`,
      payload: { serviceType: "certified", sourceLang: "Persian (Farsi)", pages: 1 },
    },
  },
  {
    id: "faq-process",
    category: "Process & Security",
    question: "Do I need to mail physical original documents?",
    shortLabel: "How to Submit Documents",
    icon: "📄",
    answer:
      "No physical mailing is needed! You can simply upload a clear digital scan or high-resolution smartphone photo (PDF, JPG, PNG, DOCX). USCIS, WES, and regulatory bodies officially accept electronic digital certifications. Your files are protected by 256-bit bank-grade SSL encryption.",
    action: {
      type: "open_order",
      label: "Upload & Order Documents",
      payload: { serviceType: "certified", pages: 1 },
    },
  },
];

export const KNOWLEDGE_SYSTEM_PROMPT = `
You are the AI Sales & Regulatory Concierge for "Linguist Point International", a premier human translation agency.
Your objective is to provide instant, reassuring answers to clients and convert them directly into placing an order.

Key Facts & Policies:
1. Certified Translation: $${PRICING.pricePerPage.toFixed(2)} per page (up to 250 words per page).
2. Standard Translation: $${PRICING.pricePerWord.toFixed(2)} per word ($${PRICING.standardMinimum.toFixed(2)} minimum).
3. 100% Acceptance Guarantee: Unconditionally accepted by USCIS (8 CFR 204.2 compliant), U.S. Dept of State, Federal & State Courts, WES, Academic Institutions, and Embassies worldwide. If USCIS rejects for translation issues, 100% full refund + free expedited revision within 12 hours.
4. Turnaround Time: Standard delivery in 24 hours. 12-Hour Priority Express Rush available for +$${PRICING.rushFee.toFixed(2)}.
5. Optional Add-ons:
   - 12-Hour Priority Rush: +$${PRICING.rushFee.toFixed(2)}
   - Notarized Certificate & Seal: +$${PRICING.notarizationFee.toFixed(2)} (USCIS does not mandate notarization, but courts/foreign consulates do).
   - Wet-Ink Physical Hard Copy via Priority Mail: +$${PRICING.shippingFee.toFixed(2)}
6. Supported Languages: 65+ world languages, including Persian (Farsi), Dari, Pashto, Urdu, Hindi, Spanish, Chinese, Arabic, French, German, Russian, etc.
7. Translators: Accredited native human linguists, ATA Corporate Member, bank-grade 256-bit encrypted confidentiality.
8. How to Order: Upload documents online (PDF, JPG, PNG, DOCX), select language pair, and checkout in under 60 seconds with no account needed.

Tone: Professional, authoritative, warm, and solution-oriented. Answer the question thoroughly first, and provide clear next steps.
`;

/**
 * Intelligent deterministic response generator that runs instantly without an API key,
 * handling pricing calculations, regulatory compliance, and conversion buttons.
 */
export function generateLocalAssistantResponse(userPrompt: string): { text: string; action?: ChatAction } {
  const q = userPrompt.toLowerCase().trim();

  // Check direct FAQ match
  const matchedFaq = AUTOMATED_FAQS.find(
    (f) =>
      q === f.question.toLowerCase() ||
      q === f.shortLabel.toLowerCase() ||
      q.includes(f.shortLabel.toLowerCase())
  );
  if (matchedFaq) {
    return {
      text: matchedFaq.answer,
      action: matchedFaq.action,
    };
  }

  // 1. Language-specific inquiry (prioritize non-English source languages)
  const tokens = q.replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter((t) => t.length >= 3 && t !== "english");
  let matchedLangName: string | null = null;
  for (const token of tokens) {
    const hits = searchLanguages(token);
    if (hits.length > 0 && hits[0].language.code !== "en") {
      matchedLangName = hits[0].language.name;
      break;
    }
  }

  // 2. USCIS & Regulatory Acceptance
  if (
    q.includes("uscis") ||
    q.includes("immigration") ||
    q.includes("green card") ||
    q.includes("i-485") ||
    q.includes("n-400") ||
    q.includes("nvc") ||
    q.includes("rfe") ||
    q.includes("guarantee") ||
    q.includes("accepted")
  ) {
    return {
      text: `Yes, unconditionally! All our certified translations are **100% Guaranteed for USCIS Acceptance** under federal regulation **8 CFR 204.2(a)(1)(iii)**.\n\nEvery order includes a signed and embossed Certificate of Translation Accuracy on official agency letterhead with ATA credentials. In the rare event of a clarification request, revisions are completed free within 12 hours. We back this with a **100% full money-back guarantee**.`,
      action: {
        type: "open_order",
        label: `Start USCIS Certified Order ($${PRICING.pricePerPage.toFixed(2)}/pg)`,
        payload: { serviceType: "certified", pages: 1 },
      },
    };
  }

  // 3. Notarization inquiries
  if (q.includes("notar") || q.includes("notary") || q.includes("apostille")) {
    return {
      text: `**Do you need notarization?**\n• For **USCIS and university admissions (WES)**, a signed & stamped Certificate of Translation Accuracy is 100% sufficient—notarization is **not** legally required.\n• For **judicial courts, foreign consulates, apostille authorities, or select DMVs**, notarization is often mandated.\n\nWe provide an optional Notary Public Acknowledgment Seal for just **+$${PRICING.notarizationFee.toFixed(2)}**.`,
      action: {
        type: "open_order",
        label: "Order Notarized Translation",
        payload: { serviceType: "certified", isNotarized: true, pages: 1 },
      },
    };
  }

  // 4. Turnaround & Rush speed inquiries
  if (q.includes("how long") || q.includes("turnaround") || q.includes("rush") || q.includes("urgent") || q.includes("hours") || q.includes("fast") || q.includes("time")) {
    return {
      text: `⏱️ **Delivery Timelines:**\n• **Standard Certified Turnaround:** Delivered within **24 hours** via digital PDF (wet-ink hard copies also available).\n• **12-Hour Priority Express Rush:** Available for **+$${PRICING.rushFee.toFixed(2)}** for urgent filing deadlines.\n\nBoth options include an ATA-compliant signed Certificate of Translation Accuracy.`,
      action: {
        type: "open_order",
        label: "Order with 12-Hour Rush Delivery",
        payload: { serviceType: "certified", isRush: true, pages: 1 },
      },
    };
  }

  // 5. Pricing & Quote Calculations
  if (q.includes("price") || q.includes("cost") || q.includes("how much") || q.includes("quote") || q.includes("rate") || q.includes("fee")) {
    // Detect page number if mentioned (e.g., "2 pages", "3 page")
    const pageMatch = q.match(/(\d+)\s*(page|pg)/);
    const pages = pageMatch ? Math.min(PRICING.maxPages, Math.max(1, parseInt(pageMatch[1], 10))) : 1;
    const baseTotal = pages * PRICING.pricePerPage;

    return {
      text: `💰 **Transparent, Flat-Rate Pricing:**\n• **Certified Translation:** **$${PRICING.pricePerPage.toFixed(2)} / page** (up to 250 words per page). Includes signed & stamped Certificate of Accuracy.\n• **Standard Translation:** **$${PRICING.pricePerWord.toFixed(2)} / word** ($${PRICING.standardMinimum.toFixed(2)} minimum) for general documents.\n\n${
        pages > 1
          ? `For your **${pages} pages**, the certified translation estimate is **$${baseTotal.toFixed(2)}** with standard 24-hour turnaround.`
          : `A typical 1-page document (birth certificate, marriage certificate, transcript) is just **$${PRICING.pricePerPage.toFixed(2)}** total.`
      }`,
      action: {
        type: "open_order",
        label: `Order ${pages > 1 ? `${pages} Pages` : "Certified Translation"} ($${baseTotal.toFixed(2)})`,
        payload: { serviceType: "certified", pages },
      },
    };
  }

  // 6. Language availability inquiry
  if (matchedLangName || q.includes("language") || q.includes("translate from") || q.includes("translate to")) {
    const langName = matchedLangName || "your requested language";
    return {
      text: `🌐 **Language Availability:**\nYes, we provide certified human translations for **${langName} to English** with guaranteed 24-hour delivery and 100% USCIS acceptance.\n\nOur certified linguists handle official vital records, legal pleadings, immigration dossiers, and academic transcripts in over **65 world languages**.`,
      action: {
        type: "open_order",
        label: `Order ${langName} Translation ($${PRICING.pricePerPage.toFixed(2)}/pg)`,
        payload: {
          serviceType: "certified",
          sourceLang: matchedLangName || "Spanish",
          targetLang: "English",
          pages: 1,
        },
      },
    };
  }

  // 7. Academic / WES / Court inquiries
  if (q.includes("wes") || q.includes("academic") || q.includes("diploma") || q.includes("transcript") || q.includes("court") || q.includes("legal")) {
    return {
      text: `🎓 **Academic & Legal Credential Translations:**\nWe specialize in format-matched, line-by-line certified translations for:\n• **WES, ECE, Josef Silny & US Universities** (Transcripts, Diplomas, Syllabi)\n• **Federal & State Courts** (Affidavits, Depositions, Contracts)\n\nAll translations preserve the exact original formatting and grading tables.`,
      action: {
        type: "open_order",
        label: `Start Academic/Legal Order ($${PRICING.pricePerPage.toFixed(2)}/pg)`,
        payload: { serviceType: "certified", pages: 1 },
      },
    };
  }

  // 8. General how to order / welcome
  return {
    text: `Hello! I am your **Linguist Point AI Concierge**.\n\nWe provide accredited human certified translations at **$${PRICING.pricePerPage.toFixed(2)}/page** with:\n• **100% Guaranteed Acceptance** by USCIS, Courts, and Universities\n• **Standard 24-Hour Turnaround** (12-hour rush available)\n• Over **65 World Languages**\n\nTap any question topic above or ask anything you need!`,
    action: {
      type: "open_order",
      label: `Start Fast Checkout ($${PRICING.pricePerPage.toFixed(2)}/pg)`,
      payload: { serviceType: "certified", pages: 1 },
    },
  };
}
