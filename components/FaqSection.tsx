"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { PRICING } from "@/lib/pricing";
import {
  SectionHeading,
  SECTION_PADDING,
  SECTION_FOOTNOTE_GAP,
} from "@/components/ui/SectionHeading";

interface FaqItem {
  q: string;
  a: React.ReactNode;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "What is an official Certified Translation, and what is included in my order?",
    a: "An official certified translation is a complete, word-for-word translation of your original document performed by an accredited professional linguist, accompanied by a formal, sworn Certificate of Translation Accuracy on official corporate letterhead. The certificate is signed by an authorized company official under penalty of perjury, bearing our corporate seal, contact credentials, and formal attestation certifying translator fluency and document completeness. It is delivered in high-resolution, secure PDF format formatted to replicate the visual layout, stamps, and seal placements of the original document.",
  },
  {
    q: "What are the terms and conditions of your 100% USCIS Acceptance Guarantee?",
    a: (
      <>
        <p>
          We unconditionally guarantee that your certified translation will be accepted by U.S. Citizenship and Immigration Services (USCIS) under 8 CFR 204.2(a)(1)(iii). In the rare event that USCIS requests clarification (RFE) regarding the translation, our legal compliance team will promptly furnish revised, re-certified documentation at zero charge within 12 hours. If USCIS issues a rejection solely and directly attributable to our translation, we will issue an immediate 100% full refund.
        </p>
        <p className="mt-3 pt-3 border-t border-slate-100">
          <strong className="text-slate-800">Legal Disclaimer:</strong> Clients must submit clear, legible source documents. Our guarantee applies strictly to our translation accuracy; we do not verify or warrant the legal validity or authenticity of the underlying foreign original document issued by third-party authorities.
        </p>
      </>
    ),
  },
  {
    q: "Does USCIS require Notarized Translations, or is Certification sufficient?",
    a: (
      <>
        Under current federal regulations (8 CFR 204.2), USCIS does <strong className="text-slate-800">not</strong> require translations to be notarized; a signed and stamped Certificate of Translation Accuracy from an established translation agency is completely sufficient. However, notarization is legally mandated by specific foreign consulates, apostille authorities, judicial courts, and certain state DMVs. We provide optional notary public acknowledgment seals on all language pairs for {`$${PRICING.notarizationFee.toFixed(2)}`}, which can be selected with one click during ordering.
      </>
    ),
  },
  {
    q: "How is the document page count calculated? (The 250 Words-per-Page Rule)",
    a: "In accordance with American Translators Association (ATA) and international industry standards, a standard translation “page” is legally defined as up to 250 words (including numbers, titles, and abbreviations). Standard vital records — such as single-page birth certificates, marriage certificates, driver's licenses, and diplomas — virtually always qualify as 1 page each. If an individual physical sheet contains dense text exceeding 250 words (such as multi-column legal contracts or academic syllabi), the page count is calculated based on total words divided by 250. This legally protects both parties and ensures transparent, predictable billing.",
  },
  {
    q: "How are confidential documents, financial records, and medical data protected?",
    a: "We enforce strict enterprise data protection protocols. All uploads and downloads are encrypted using 256-bit bank-grade SSL encryption in transit and at rest. Every linguist, editor, and account manager is bound by strict, bilateral Non-Disclosure Agreements (NDAs). Our systems are fully HIPAA-aligned for medical records and GDPR-compliant for European personal data. Upon order completion and statutory retention expiry, documents can be permanently purged from our servers upon client request.",
  },
  {
    q: "Can you evaluate academic credentials or convert foreign GPA/grades to the US scale?",
    a: "As an accredited translation agency, our legal statutory scope is to provide exact, word-for-word certified translations of your foreign diplomas, transcripts, and course descriptions. We preserve the original grading scales, credits, and terminology exactly as issued. In accordance with U.S. federal and state regulations, grade conversions and credential equivalence evaluations must be conducted by an authorized credential evaluation service (such as WES, ECE, or Josef Silny). Our certified translations are format-engineered to be 100% accepted by all NACES-member credential evaluators.",
  },
  {
    q: "How do you handle handwritten, degraded, blurred, or illegible text?",
    a: (
      <>
        To maintain legal truthfulness and regulatory compliance under penalty of perjury, translators are prohibited by federal standards from guessing or fabricating illegible words. Any portion of a document that is obscured, physically torn, blurred, or illegible due to poor scan quality is formally noted in brackets as{" "}
        <code className="font-mono text-[11px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-800">
          [illegible]
        </code>{" "}
        or{" "}
        <code className="font-mono text-[11px] bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded text-slate-800">
          [seal illegible]
        </code>
        . If your original document contains faint handwriting or damaged sections, we strongly advise providing a higher-resolution scan or clarifying notes when placing your order.
      </>
    ),
  },
  {
    q: "What is the difference between Certified Translation and Standard Translation?",
    a: (
      <>
        <strong className="text-slate-800">
          Certified Translations ({`$${PRICING.pricePerPage.toFixed(2)}`}/page)
        </strong>{" "}
        are non-editable, tamper-evident PDF documents issued with our signed &amp; stamped Certificate of Accuracy, specifically tailored for official, governmental, legal, and academic bodies.{" "}
        <strong className="text-slate-800">
          Standard Translations ({`$${PRICING.pricePerWord.toFixed(2)}`}/word)
        </strong>{" "}
        are delivered in editable formats (DOCX, XLSX, PPTX) preserving visual layout, designed for business contracts, employee handbooks, websites, marketing materials, and personal correspondence where formal certification is not required.
      </>
    ),
  },
  {
    q: "What is your cancellation and refund policy?",
    a: "You may cancel your order for a 100% full refund at any time prior to translator assignment and commencement of work. Because human translation is an intensive custom professional service, once a native linguist has begun translating your document, cancellations are subject to a pro-rated fee corresponding to the work already performed. If an order is delivered and contains any linguistic discrepancies, we provide free unlimited revisions until it meets your complete satisfaction.",
  },
  {
    q: "Do I need to mail my physical original documents, and will USCIS accept electronic copies?",
    a: (
      <>
        No, you do <strong className="text-slate-800">not</strong> need to mail your original documents. You can simply upload a clear digital scan or high-resolution smartphone photo (PDF, JPG, PNG). USCIS, WES, and virtually all modern regulatory agencies officially accept electronic copies of certified translations. If you need physical hard copies bearing original wet-ink signatures and embossed notary stamps (for apostille or court presentations), we offer 2-Day Priority Mail and Overnight FedEx shipping.
      </>
    ),
  },
];

interface FaqSectionProps {
  onOpenOrder: () => void;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ onOpenOrder }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className={`${SECTION_PADDING} bg-slate-50 border-b border-slate-200`} id="faq">
      <div className="max-w-4xl mx-auto px-4">
        <SectionHeading
          eyebrow="Clarity & Legal Compliance"
          title="Frequently Asked Questions"
          description="Comprehensive details on our certified translation standards, statutory acceptance guarantees, confidentiality, and page counting policies."
        />

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={item.q}
                className={`bg-white border rounded-xl overflow-hidden shadow-xs transition-colors ${
                  isOpen ? "border-teal-300" : "border-slate-200"
                }`}
              >
                <h3>
                  <button
                    onClick={() => toggle(idx)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${idx}`}
                    id={`faq-trigger-${idx}`}
                    className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 font-bold text-base sm:text-lg text-slate-900 hover:text-[#173d40] transition-colors"
                  >
                    <span className="flex items-start gap-3">
                      <span className="text-[#173d40]/40 font-extrabold tabular-nums flex-shrink-0">
                        {idx + 1}.
                      </span>
                      <span>{item.q}</span>
                    </span>
                    <span
                      className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
                        isOpen
                          ? "bg-[#173d40] border-[#173d40] text-white rotate-180"
                          : "bg-white border-slate-200 text-slate-400"
                      }`}
                      aria-hidden="true"
                    >
                      <ChevronDown className="w-4 h-4" strokeWidth={2.25} />
                    </span>
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={`faq-panel-${idx}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${idx}`}
                    className="px-5 sm:px-6 pb-6 text-sm sm:text-base text-slate-600 leading-relaxed border-t border-slate-100 pt-4 animate-accordion-down"
                  >
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={`${SECTION_FOOTNOTE_GAP} text-center`}>
          <p className="text-sm sm:text-base text-slate-600">
            Have documents ready for official certification? Standard delivery in 24 hours.{" "}
            <button
              onClick={onOpenOrder}
              className="font-extrabold text-[#173d40] underline underline-offset-4 hover:text-[#f59e0b] transition-colors"
            >
              Start Order
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};
