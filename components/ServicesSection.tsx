"use client";

import React from "react";
import { Check, ArrowRight } from "lucide-react";
import {
  SectionHeading,
  SECTION_PADDING,
  SECTION_FOOTNOTE_GAP,
} from "@/components/ui/SectionHeading";
import { PRICING } from "@/lib/pricing";
import type { ServiceType } from "@/lib/pricing";

interface ServicesSectionProps {
  onOpenOrder: (serviceType: ServiceType) => void;
}

interface Plan {
  badge?: string;
  name: string;
  blurb: string;
  wasPrice?: string;
  price: string;
  unit: string;
  saving: string;
  features: string[];
  cta: string;
  featured: boolean;
  serviceType: ServiceType | null;
}

const PLANS: Plan[] = [
  {
    badge: "Most Popular for USCIS & Legal",
    name: "Certified Document Translation",
    blurb:
      "Verbatim word-for-word official translation accompanied by a signed & stamped Certificate of Translation Accuracy.",
    wasPrice: `$${PRICING.listPricePerPage.toFixed(2)}`,
    price: `$${PRICING.pricePerPage.toFixed(2)}`,
    unit: "per page (up to 250 words)",
    saving: "Save 20% vs. Competitors",
    features: [
      "100% Guaranteed Acceptance by USCIS, Courts & WES",
      "Signed Statement of Accuracy on corporate letterhead",
      "Free unlimited formatting and spelling revisions",
      "Delivered in tamper-evident, secure high-res PDF",
      "Add Notarization & Physical Hard Copies",
    ],
    cta: "Order Certified Translation",
    featured: true,
    serviceType: "certified",
  },
  {
    name: "Standard Document Translation",
    blurb:
      "Nuanced, context-driven business translations delivered in editable formats for corporate, marketing, and private use.",
    wasPrice: `$${PRICING.listPricePerWord.toFixed(2)}`,
    price: `$${PRICING.pricePerWord.toFixed(2)}`,
    unit: `per word ($${PRICING.standardMinimum.toFixed(0)} minimum order)`,
    saving: "Best Market Rate",
    features: [
      "Delivered in editable format (DOCX, PPTX, XLSX)",
      "Handled by specialized native industry linguists",
      "Preserves original visual layout, tables & typography",
      "Ideal for marketing copy, reports, manuals & websites",
      "Dual-tier proofreading for grammatical perfection",
    ],
    cta: "Order Standard Translation",
    featured: false,
    serviceType: "standard",
  },
  {
    name: "Corporate & Volume Partnerships",
    blurb:
      "Dedicated translation infrastructure tailored for immigration law firms, multinational enterprises, and agencies.",
    price: "Custom Tiers",
    unit: "up to 30% volume discounts & Net-30",
    saving: "Enterprise",
    features: [
      "Dedicated Senior Account Manager & SLA guarantee",
      "Document Translation REST API & CMS integration",
      "White-Label branded delivery for law firms & partners",
      "Centralized team ordering portal with monthly billing",
      "Preferred linguist teams matched to your brand voice",
    ],
    cta: "Request Proposal / RFP",
    featured: false,
    serviceType: null,
  },
];

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onOpenOrder }) => {
  return (
    <section className={`${SECTION_PADDING} bg-slate-50 border-b border-slate-200`} id="services">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeading
          eyebrow="Competitive & Transparent Pricing"
          title="Translation Services Engineered for Every Milestone"
          description="Select from our certified submission-ready formats or customized business and enterprise solutions."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan) => {
            const handleCardClick = () => {
              if (plan.serviceType) {
                onOpenOrder(plan.serviceType as ServiceType);
              } else {
                const target = document.getElementById("enterprise-proposal");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth" });
                } else {
                  window.location.hash = "enterprise-proposal";
                }
              }
            };

            const handleKeyDown = (e: React.KeyboardEvent) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                handleCardClick();
              }
            };

            return (
              <div
                key={plan.name}
                role="button"
                tabIndex={0}
                onClick={handleCardClick}
                onKeyDown={handleKeyDown}
                className={`relative flex flex-col h-full rounded-2xl p-6 sm:p-8 transition-all duration-200 cursor-pointer group select-none ${
                  plan.featured
                    ? "bg-white border-2 border-[#173d40] shadow-xl hover:shadow-2xl hover:border-teal-700 lg:-mt-2 ring-1 ring-[#173d40]/10"
                    : "bg-white border border-slate-200 shadow-sm hover:border-[#173d40] hover:shadow-xl hover:-translate-y-1"
                }`}
                aria-label={`${plan.name} - ${plan.cta}`}
              >
                {plan.badge && (
                  <span className="absolute -top-3.5 left-6 bg-[#f59e0b] text-slate-950 text-xs font-extrabold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                    {plan.badge}
                  </span>
                )}

                <h3 className={`text-lg sm:text-xl font-extrabold text-slate-900 group-hover:text-[#173d40] transition-colors ${plan.badge ? "mt-2" : ""}`}>
                  {plan.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mt-2.5">{plan.blurb}</p>

                <div className="mt-6 pb-6 border-b border-slate-100">
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {plan.wasPrice && (
                      <span className="text-lg font-bold text-slate-400 line-through">{plan.wasPrice}</span>
                    )}
                    <span className="text-3xl sm:text-4xl font-extrabold text-[#173d40]">{plan.price}</span>
                  </div>
                  <div className="flex items-center gap-2.5 flex-wrap mt-2">
                    <span className="text-sm text-slate-500 font-medium">{plan.unit}</span>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                      {plan.saving}
                    </span>
                  </div>
                </div>

                <ul className="space-y-3 py-6 flex-grow">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-700 leading-snug">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" strokeWidth={2.75} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.serviceType ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenOrder(plan.serviceType as ServiceType);
                    }}
                    className={`w-full font-bold text-sm px-5 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${
                      plan.featured
                        ? "bg-[#173d40] hover:bg-[#123032] text-white shadow-md hover:shadow-lg active:scale-98"
                        : "bg-white border-2 border-[#173d40] text-[#173d40] group-hover:bg-[#173d40] group-hover:text-white"
                    }`}
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                ) : (
                  <a
                    href="#enterprise-proposal"
                    onClick={(e) => e.stopPropagation()}
                    className="w-full font-bold text-sm px-5 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 bg-white border-2 border-[#173d40] text-[#173d40] group-hover:bg-[#173d40] group-hover:text-white"
                  >
                    {plan.cta}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                )}
              </div>
            );
          })}
        </div>

        <div className={`${SECTION_FOOTNOTE_GAP} text-center`}>
          <p className="text-sm sm:text-base text-slate-600">
            Need an official certified translation right now? Delivered within 24 hours.{" "}
            <button
              onClick={() => onOpenOrder("certified")}
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
