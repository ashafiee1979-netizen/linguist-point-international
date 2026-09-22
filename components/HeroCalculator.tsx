"use client";

import React, { useState } from "react";
import { CheckCircle2, Clock, Star, ArrowRight, ShieldCheck } from "lucide-react";
import { OTHER_LANGUAGES, POPULAR_LANGUAGES } from "@/lib/languages";
import { calculatePrice, PRICING } from "@/lib/pricing";
import type { ServiceType } from "@/lib/pricing";
import { SITE } from "@/lib/site";
import type { OrderDraft } from "@/lib/order";
import { Select } from "@/components/ui/Select";
import { inputClass, labelClass } from "@/lib/ui";
import { PaymentLogos } from "@/components/PaymentLogos";

interface HeroCalculatorProps {
  onOpenOrder: (draft?: Partial<OrderDraft>) => void;
  /** Lets the pricing cards below switch the calculator into standard mode. */
  serviceType: ServiceType;
  onServiceTypeChange: (serviceType: ServiceType) => void;
  externalSourceLang?: string;
  externalTargetLang?: string;
  isHighlighted?: boolean;
}

const ADD_ONS = [
  { key: "rush", label: "12-Hour Priority Express Rush", fee: PRICING.rushFee },
  { key: "notarized", label: "Notarized Certificate & Seal", fee: PRICING.notarizationFee },
  { key: "hardCopy", label: "Wet-Ink Physical Hard Copy via Priority Mail", fee: PRICING.shippingFee },
] as const;

const SLIDER_MAX = 25;

export const HeroCalculator: React.FC<HeroCalculatorProps> = ({
  onOpenOrder,
  serviceType,
  onServiceTypeChange,
  externalSourceLang,
  externalTargetLang,
  isHighlighted = false,
}) => {
  const [sourceLang, setSourceLang] = useState(externalSourceLang || "");
  const [targetLang, setTargetLang] = useState(externalTargetLang || "English");
  const [customSourceLang, setCustomSourceLang] = useState("");
  const [pageCount, setPageCount] = useState(1);
  const [wordCount, setWordCount] = useState(250);
  const [isRush, setIsRush] = useState(false);
  const [isNotarized, setIsNotarized] = useState(false);
  const [isHardCopy, setIsHardCopy] = useState(false);

  React.useEffect(() => {
    if (externalSourceLang) {
      setSourceLang(externalSourceLang);
    }
  }, [externalSourceLang]);

  React.useEffect(() => {
    if (externalTargetLang) {
      setTargetLang(externalTargetLang);
    }
  }, [externalTargetLang]);

  const price = calculatePrice({
    serviceType,
    pageCount,
    wordCount,
    isRush12Hour: isRush,
    isNotarized,
    isHardCopyMail: isHardCopy,
  });

  const addOnState: Record<string, [boolean, (value: boolean) => void]> = {
    rush: [isRush, setIsRush],
    notarized: [isNotarized, setIsNotarized],
    hardCopy: [isHardCopy, setIsHardCopy],
  };

  const handleStartOrder = () => {
    onOpenOrder({
      serviceType,
      sourceLang: sourceLang === "other" ? customSourceLang : sourceLang,
      targetLang,
      pageCount,
      wordCount,
      isRush,
      isNotarized,
      isHardCopy,
      totalAmount: price.totalAmount,
    });
  };

  const renderLanguageOptions = (prefix: string) => (
    <>
      <optgroup label="Popular Languages">
        {POPULAR_LANGUAGES.map((l) => (
          <option key={`${prefix}-${l.code}`} value={l.name}>
            {l.name}
          </option>
        ))}
      </optgroup>
      <optgroup label="All Languages (A to Z)">
        {OTHER_LANGUAGES.map((l) => (
          <option key={`${prefix}-all-${l.code}`} value={l.name}>
            {l.name}
          </option>
        ))}
      </optgroup>
    </>
  );

  return (
    <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 pt-7 sm:pt-9 lg:pt-11 pb-10 sm:pb-12 lg:pb-14 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

        {/* Left Column: Value Proposition */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-[11px] sm:text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#173d40]" aria-hidden="true"></span>
            #1 Rated Human Translation Agency • ATA Corporate Member
          </div>

          <h1 className="text-[2rem] leading-[1.15] sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight sm:leading-[1.12]">
            Official Certified Translation in{" "}
            <span className="block text-[#173d40]">{SITE.languageCount} Languages to English</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl leading-relaxed">
            Accredited, human-powered certified &amp; commercial translations starting at just{" "}
            <strong className="text-[#173d40]">${PRICING.pricePerPage.toFixed(2)} / page</strong> (Save 20% vs. industry rates). Fully guaranteed for official acceptance worldwide with standard 24-hour turnaround.
          </p>

          <div className="flex items-start gap-2.5 text-sm text-slate-700 bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p>
              <strong className="text-slate-900">Guaranteed 100% Acceptance:</strong> USCIS, U.S. Dept of State, WES, Academic Institutions, Federal/State Courts, DMVs, Embassies, and non-governmental entities worldwide.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => onOpenOrder({ serviceType })}
              className="bg-[#173d40] hover:bg-[#123032] text-white font-extrabold py-3.5 px-7 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-98 text-sm"
            >
              Start Your Order
              <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
            </button>
            <a
              href="#enterprise-proposal"
              className="bg-white border-2 border-[#173d40] text-[#173d40] hover:bg-[#173d40] hover:text-white font-extrabold py-3.5 px-7 rounded-xl flex items-center justify-center gap-2 transition-all text-sm"
            >
              Request Project Quote
            </a>
          </div>

          <div className="pt-5 sm:pt-6 border-t border-slate-200 flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="flex items-center gap-1 text-[#f59e0b]" aria-hidden="true">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </span>
            <span className="text-sm font-extrabold text-slate-900">{SITE.rating} Rating</span>
            <span className="text-slate-300" aria-hidden="true">|</span>
            <span className="text-xs font-semibold text-slate-600">
              {SITE.clientCount} Verified Certified Documents Delivered
            </span>
          </div>
        </div>

        {/* Right Column: Instant Live Order Calculator */}
        <div className="lg:col-span-5 w-full lg:-mt-8 xl:-mt-10" id="order">
          <div className={`bg-white rounded-2xl border p-4 sm:p-5 shadow-xl relative transition-all duration-300 ${
            isHighlighted
              ? "border-[#173d40] ring-4 ring-[#173d40]/25 shadow-2xl scale-[1.01]"
              : "border-slate-200 shadow-slate-900/5"
          }`}>
            <div className="border-b border-slate-100 pb-2 mb-2.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#173d40]">
                Instant Cost Builder
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Calculate &amp; Order</h2>
            </div>

            {/* Service type toggle */}
            <div
              className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl mb-2.5"
              role="group"
              aria-label="Translation service type"
            >
              {(
                [
                  { type: "certified" as const, label: "Certified", price: `$${PRICING.pricePerPage.toFixed(2)}/pg` },
                  { type: "standard" as const, label: "Standard", price: `$${PRICING.pricePerWord.toFixed(2)}/wd` },
                ]
              ).map((option) => {
                const active = serviceType === option.type;
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => onServiceTypeChange(option.type)}
                    aria-pressed={active}
                    className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                      active
                        ? "bg-white text-[#173d40] shadow-sm"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    <span className="block">{option.label}</span>
                    <span className={`block text-xs font-semibold ${active ? "text-slate-500" : "text-slate-400"}`}>
                      {option.price}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="space-y-2.5">
              {/* Language Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label htmlFor="hero-source" className={labelClass}>
                    Source Language
                  </label>
                  <Select
                    id="hero-source"
                    value={sourceLang}
                    isPlaceholder={!sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Language
                    </option>
                    {renderLanguageOptions("src")}
                    <option value="other">Other / Language Not Listed</option>
                  </Select>
                </div>

                <div>
                  <label htmlFor="hero-target" className={labelClass}>
                    Target Language
                  </label>
                  <Select
                    id="hero-target"
                    value={targetLang}
                    isPlaceholder={!targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Language
                    </option>
                    {renderLanguageOptions("tgt")}
                  </Select>
                </div>
              </div>

              {/* Other Language Input */}
              {sourceLang === "other" && (
                <div className="animate-fade-in">
                  <label htmlFor="hero-custom-source" className={labelClass}>
                    Specify Source Language *
                  </label>
                  <input
                    id="hero-custom-source"
                    type="text"
                    placeholder="e.g. Kurdish Sorani, Hmong, Tigre, Oromo, Basque…"
                    value={customSourceLang}
                    onChange={(e) => setCustomSourceLang(e.target.value)}
                    className={`${inputClass} border-teal-500 bg-teal-50/60`}
                    required
                  />
                </div>
              )}

              {/* Volume control: pages for certified, words for standard */}
              {serviceType === "certified" ? (
                <div>
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <label htmlFor="hero-pages" className="text-sm font-bold text-slate-700">
                      Page Count (250 words/page)
                    </label>
                    <span className="text-xs font-extrabold text-[#173d40] bg-teal-50 border border-teal-200 px-2 py-0.5 rounded-full">
                      {pageCount} {pageCount === 1 ? "Page" : "Pages"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPageCount(Math.max(1, pageCount - 1))}
                      disabled={pageCount <= 1}
                      className="w-9 h-9 flex-shrink-0 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 disabled:opacity-40 disabled:hover:bg-white text-slate-800 font-extrabold text-lg shadow-xs transition-all flex items-center justify-center"
                      aria-label="Decrease page count"
                    >
                      −
                    </button>
                    <input
                      id="hero-pages"
                      type="range"
                      min={1}
                      max={SLIDER_MAX}
                      value={Math.min(pageCount, SLIDER_MAX)}
                      onChange={(e) => setPageCount(parseInt(e.target.value, 10))}
                      className="flex-grow min-w-0 h-2 accent-[#173d40] cursor-pointer"
                      aria-label="Page count"
                    />
                    <button
                      type="button"
                      onClick={() => setPageCount(Math.min(PRICING.maxPages, pageCount + 1))}
                      disabled={pageCount >= PRICING.maxPages}
                      className="w-9 h-9 flex-shrink-0 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 hover:border-slate-400 disabled:opacity-40 disabled:hover:bg-white text-slate-800 font-extrabold text-lg shadow-xs transition-all flex items-center justify-center"
                      aria-label="Increase page count"
                    >
                      +
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1">
                    More than {SLIDER_MAX} pages? Use +, or{" "}
                    <a href="#enterprise-proposal" className="font-bold text-[#173d40] hover:underline">
                      request volume pricing
                    </a>
                    .
                  </p>
                </div>
              ) : (
                <div className="animate-fade-in">
                  <div className="flex justify-between items-center mb-1 gap-2">
                    <label htmlFor="hero-words" className="text-sm font-bold text-slate-700">
                      Total Word Count
                    </label>
                    <span className="text-xs text-slate-500 font-medium">
                      ${PRICING.standardMinimum.toFixed(2)} minimum order
                    </span>
                  </div>
                  <input
                    id="hero-words"
                    type="number"
                    inputMode="numeric"
                    min={50}
                    step={50}
                    value={wordCount}
                    onChange={(e) => setWordCount(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className={`${inputClass} no-spinner text-center font-bold text-base`}
                  />
                </div>
              )}

              {/* Add-ons */}
              <div className="space-y-1 pt-1.5 border-t border-slate-100">
                {ADD_ONS.map((addOn) => {
                  const [checked, setChecked] = addOnState[addOn.key];
                  return (
                    <label
                      key={addOn.key}
                      className={`flex items-center justify-between gap-2 py-1 px-2.5 rounded-lg border cursor-pointer transition-colors text-sm ${
                        checked ? "border-teal-500 bg-teal-50/70 shadow-2xs" : "border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={(e) => setChecked(e.target.checked)}
                          className="w-4 h-4 flex-shrink-0 accent-[#173d40] rounded"
                        />
                        <span className="font-semibold text-slate-800 leading-snug">{addOn.label}</span>
                      </span>
                      <span className="font-bold text-slate-700 whitespace-nowrap">
                        +${addOn.fee.toFixed(2)}
                      </span>
                    </label>
                  );
                })}
              </div>

              {/* Breakdown & total */}
              <div className="pt-1.5 border-t border-slate-200">
                <div className="flex justify-between items-center text-xs sm:text-sm text-slate-600 pb-1">
                  <span>Base: <strong className="text-slate-800">${price.basePrice.toFixed(2)}</strong>{price.addOnsPrice > 0 ? ` • Add-ons: +$${price.addOnsPrice.toFixed(2)}` : ""}</span>
                  <span className="font-bold text-[#173d40] flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                    {price.turnaround}
                  </span>
                </div>

                <div className="flex items-end justify-between gap-3 pt-1.5 border-t border-slate-200 mb-2">
                  <span className="text-sm font-medium text-slate-600">Total Quote Estimate</span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-[#173d40] leading-none">
                    ${price.totalAmount.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={handleStartOrder}
                  className="w-full bg-[#173d40] hover:bg-[#123032] text-white font-extrabold text-base py-2.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-98"
                >
                  Start Order Now
                  <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
                </button>

                <PaymentLogos className="mt-1.5" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
