"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "1. What is an official Certified Translation, and what is included in my order?",
    a: "An official certified translation is a complete, word-for-word translation of your original document performed by an accredited professional linguist, accompanied by a formal, sworn Certificate of Translation Accuracy on official corporate letterhead. The certificate is signed under penalty of perjury, bearing our corporate seal and formal attestation. It is delivered in secure high-resolution PDF format engineered to replicate the visual layout, stamps, and signatures of the original."
  },
  {
    q: "2. What are the terms and conditions of your 100% USCIS Acceptance Guarantee?",
    a: "We unconditionally guarantee that your certified translation will be accepted by U.S. Citizenship and Immigration Services (USCIS) under 8 CFR 204.2(a)(1)(iii). In the rare event that USCIS requests clarification (RFE) regarding the translation, our legal compliance team will promptly furnish revised documentation at zero charge within 12 hours. If rejected solely due to our translation, we issue a 100% full refund."
  },
  {
    q: "3. Does USCIS require Notarized Translations, or is Certification sufficient?",
    a: "Under current federal regulations (8 CFR 204.2), USCIS does NOT require translations to be notarized; a signed Certificate of Translation Accuracy from an accredited corporate provider is completely sufficient. However, notarization is legally mandated by specific foreign consulates, apostille authorities, judicial courts, and certain state DMVs. You can select Notarized Seals for $19.95 during checkout."
  },
  {
    q: "4. How is the document page count calculated? (The 250 Words-per-Page Rule)",
    a: "In accordance with American Translators Association (ATA) standards, a standard translation 'page' is legally defined as up to 250 words (including numbers, titles, and seals). Standard vital records—such as single-page birth certificates, marriage certificates, driver's licenses, and diplomas—virtually always qualify as 1 page each."
  },
  {
    q: "5. How are confidential documents, financial records, and medical data protected?",
    a: "We enforce enterprise data protection protocols. All uploads and downloads are encrypted using 256-bit bank-grade SSL encryption in transit and at rest. Every linguist and project manager is bound by strict bilateral Non-Disclosure Agreements (NDAs). Our systems are fully HIPAA-aligned for medical records and GDPR-compliant for personal data."
  }
];

export const FaqSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200" id="faq">
      <div className="max-w-4xl mx-auto px-4">
        
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-[#173d40] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Clarity &amp; Compliance
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Comprehensive details on our certified translation standards, statutory acceptance guarantees, confidentiality, and page counting policies.
          </p>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-slate-800 hover:text-[#173d40] transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 flex-shrink-0 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-[#173d40]" : ""}`} />
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
