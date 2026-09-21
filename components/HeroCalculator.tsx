"use client";

import React, { useState } from "react";
import { CheckCircle2, Shield, Clock, Award, ArrowRight } from "lucide-react";
import { ALL_LANGUAGES, POPULAR_LANGUAGES } from "@/lib/languages";
import { calculateOrderPrice } from "@/lib/mock-data";

interface HeroCalculatorProps {
  onOpenOrder: (initialState?: any) => void;
}

export const HeroCalculator: React.FC<HeroCalculatorProps> = ({ onOpenOrder }) => {
  const [sourceLang, setSourceLang] = useState<string>("");
  const [targetLang, setTargetLang] = useState<string>("");
  const [customSourceLang, setCustomSourceLang] = useState<string>("");
  const [pageCount, setPageCount] = useState<number>(1);
  const [isRush, setIsRush] = useState<boolean>(false);
  const [isNotarized, setIsNotarized] = useState<boolean>(false);
  const [isHardCopy, setIsHardCopy] = useState<boolean>(false);

  const price = calculateOrderPrice({
    pageCount,
    isRush12Hour: isRush,
    isNotarized,
    isHardCopyMail: isHardCopy,
  });

  const handleStartOrder = () => {
    onOpenOrder({
      sourceLang: sourceLang === "other" ? customSourceLang : sourceLang,
      targetLang,
      pageCount,
      isRush,
      isNotarized,
      isHardCopy,
      totalAmount: price.totalAmount,
    });
  };

  return (
    <section className="relative bg-gradient-to-b from-slate-50 via-white to-slate-50 py-16 lg:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Column: Value Proposition */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-teal-900 text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-[#173d40]"></span>
            USCIS &amp; Official Regulatory Compliant
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.12]">
            Official Certified <br />
            <span className="text-[#173d40]">Document Translation</span>
          </h1>

          <p className="text-lg text-slate-600 max-w-2xl leading-relaxed">
            Guaranteed 100% acceptance by <strong>USCIS</strong>, foreign consulates, courts, universities, and federal agencies. Word-for-word legal accuracy with official stamps, ATA member certification, and rapid 24-hour turnaround.
          </p>

          {/* Value Bullet Points */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {[
              "100% Acceptance Guarantee (USCIS & Courts)",
              "Fast 24-Hour Digital PDF Delivery (12h Rush Available)",
              "Signed & Stamped Certificate of Accuracy",
              "ATA Corporate Member #274819 Backed",
            ].map((text, idx) => (
              <div key={idx} className="flex items-start gap-2 text-sm font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Heritage Trust Badges */}
          <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
              <Award className="w-4 h-4 text-[#f59e0b]" />
              Enterprise Heritage:
            </div>
            <div className="flex items-center gap-4 grayscale opacity-70 hover:opacity-100 transition-opacity">
              <span className="font-extrabold text-xs text-slate-700">PUL Global Partners</span>
              <span className="text-slate-300">•</span>
              <span className="font-extrabold text-xs text-slate-700">PUL Consulting Services</span>
              <span className="text-slate-300">•</span>
              <span className="font-extrabold text-xs text-[#173d40]">5,000+ Verified Clients</span>
            </div>
          </div>
        </div>

        {/* Right Column: Instant Live Order Calculator */}
        <div className="lg:col-span-5" id="order">
          <div className="bg-white rounded-2xl border-2 border-slate-200 p-6 sm:p-8 shadow-xl relative">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#173d40]">Instant Cost Builder</span>
                <h3 className="text-xl font-bold text-slate-900">Calculate &amp; Order</h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-500 block">Starting at</span>
                <span className="text-2xl font-extrabold text-[#173d40]">$24.95</span>
                <span className="text-xs text-slate-500">/page</span>
              </div>
            </div>

            <div className="space-y-4">
              {/* Language Selection Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Source Language</label>
                  <select
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className={`w-full h-11 px-3 rounded-lg border text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all ${
                      !sourceLang ? "text-slate-400 italic border-slate-300 bg-slate-50" : "text-slate-900 font-semibold border-slate-300 bg-white"
                    }`}
                  >
                    <option value="" disabled>Select Language</option>
                    <optgroup label="Popular Languages">
                      {POPULAR_LANGUAGES.map((l) => (
                        <option key={`src-${l.code}`} value={l.name}>
                          {l.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="All Languages (A to Z)">
                      {ALL_LANGUAGES.map((l) => (
                        <option key={`src-all-${l.code}`} value={l.name}>
                          {l.name}
                        </option>
                      ))}
                    </optgroup>
                    <option value="other">Other / Language Not Listed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Target Language</label>
                  <select
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className={`w-full h-11 px-3 rounded-lg border text-sm focus:ring-2 focus:ring-teal-500 outline-none transition-all ${
                      !targetLang ? "text-slate-400 italic border-slate-300 bg-slate-50" : "text-slate-900 font-semibold border-slate-300 bg-white"
                    }`}
                  >
                    <option value="" disabled>Select Language</option>
                    <optgroup label="Popular Languages">
                      {POPULAR_LANGUAGES.map((l) => (
                        <option key={`tgt-${l.code}`} value={l.name}>
                          {l.name}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="All Languages (A to Z)">
                      {ALL_LANGUAGES.map((l) => (
                        <option key={`tgt-all-${l.code}`} value={l.name}>
                          {l.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Other Language Input */}
              {sourceLang === "other" && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specify Source Language *</label>
                  <input
                    type="text"
                    placeholder="e.g. Kurdish Sorani, Tigrinya, Fulani"
                    value={customSourceLang}
                    onChange={(e) => setCustomSourceLang(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-teal-500 bg-teal-50 text-sm outline-none font-medium"
                    required
                  />
                </div>
              )}

              {/* Page Counter */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-slate-700">Page Count (250 words/page)</label>
                  <span className="text-xs text-slate-500 font-medium">${(pageCount * 24.95).toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPageCount(Math.max(1, pageCount - 1))}
                    className="w-11 h-11 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-lg transition-colors flex items-center justify-center"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={pageCount}
                    onChange={(e) => setPageCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="flex-grow h-11 text-center font-bold text-slate-900 border border-slate-300 rounded-lg outline-none text-base"
                  />
                  <button
                    type="button"
                    onClick={() => setPageCount(pageCount + 1)}
                    className="w-11 h-11 rounded-lg border border-slate-300 bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-lg transition-colors flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Add-ons Checkboxes */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isRush}
                      onChange={(e) => setIsRush(e.target.checked)}
                      className="w-4 h-4 text-[#173d40] rounded focus:ring-teal-500"
                    />
                    <span className="font-semibold text-slate-800">12-Hour Priority Express Rush</span>
                  </div>
                  <span className="font-bold text-slate-700">+$14.95</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isNotarized}
                      onChange={(e) => setIsNotarized(e.target.checked)}
                      className="w-4 h-4 text-[#173d40] rounded focus:ring-teal-500"
                    />
                    <span className="font-semibold text-slate-800">Notarized Certificate &amp; Seal</span>
                  </div>
                  <span className="font-bold text-slate-700">+$19.95</span>
                </label>

                <label className="flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer transition-colors text-xs">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isHardCopy}
                      onChange={(e) => setIsHardCopy(e.target.checked)}
                      className="w-4 h-4 text-[#173d40] rounded focus:ring-teal-500"
                    />
                    <span className="font-semibold text-slate-800">Wet-Ink Physical Hard Copy via Priority Mail</span>
                  </div>
                  <span className="font-bold text-slate-700">+$12.50</span>
                </label>
              </div>

              {/* Total & Action Button */}
              <div className="pt-3 border-t border-slate-200">
                <div className="flex items-baseline justify-between mb-3">
                  <div>
                    <span className="text-xs text-slate-500 block">Total Quote Estimate</span>
                    <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Delivery: {price.estimatedDeliveryHours} Hours
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold text-[#173d40]">
                    ${price.totalAmount.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={handleStartOrder}
                  className="w-full bg-[#173d40] hover:bg-[#123032] text-white font-extrabold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-98"
                >
                  Start Order Now
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
