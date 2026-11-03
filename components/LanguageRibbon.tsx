"use client";

import React from "react";

interface FlagItem {
  country: string;
  code: string;
}

const POPULAR_FLAGS: FlagItem[] = [
  { country: "United States", code: "us" },
  { country: "United Kingdom", code: "gb" },
  { country: "Canada", code: "ca" },
  { country: "Australia", code: "au" },
  { country: "New Zealand", code: "nz" },
  { country: "Spain", code: "es" },
  { country: "France", code: "fr" },
  { country: "Germany", code: "de" },
  { country: "Italy", code: "it" },
  { country: "Portugal", code: "pt" },
  { country: "Brazil", code: "br" },
  { country: "Saudi Arabia", code: "sa" },
  { country: "United Arab Emirates", code: "ae" },
  { country: "Afghanistan", code: "af" },
  { country: "Ukraine", code: "ua" },
  { country: "China", code: "cn" },
  { country: "Japan", code: "jp" },
  { country: "South Korea", code: "kr" },
  { country: "Russia", code: "ru" },
  { country: "Turkey", code: "tr" },
  { country: "Vietnam", code: "vn" },
  { country: "India", code: "in" },
  { country: "Pakistan", code: "pk" },
  { country: "Netherlands", code: "nl" },
  { country: "Poland", code: "pl" },
];

export const LanguageRibbon: React.FC = () => {
  return (
    <div className="bg-slate-50 border-b border-slate-200 py-2.5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 whitespace-nowrap flex-shrink-0 z-10 bg-slate-50 pr-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
          <span className="hidden sm:inline">Global Languages:</span>
          <span className="sm:hidden">Languages:</span>
        </div>

        {/* Continuous Smooth Infinite Marquee Moving Towards the Left */}
        <div className="relative flex-grow overflow-hidden hover-pause">
          <div className="flex items-center gap-2.5 w-max animate-marquee py-1">
            {/* Set 1 */}
            {POPULAR_FLAGS.map((item, idx) => (
              <div
                key={`flag-1-${item.code}-${idx}`}
                className="flex-shrink-0 p-1.5 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-400 rounded-md shadow-2xs transition-transform cursor-pointer hover:scale-110"
                title={item.country}
              >
                <img
                  src={`/assets/flags/${item.code}.svg`}
                  alt={item.country}
                  className="w-7 h-5 object-cover rounded-xs"
                  loading="lazy"
                />
              </div>
            ))}
            {/* Set 2 (Identical clone for seamless continuous infinite loop) */}
            {POPULAR_FLAGS.map((item, idx) => (
              <div
                key={`flag-2-${item.code}-${idx}`}
                className="flex-shrink-0 p-1.5 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-400 rounded-md shadow-2xs transition-transform cursor-pointer hover:scale-110"
                title={item.country}
              >
                <img
                  src={`/assets/flags/${item.code}.svg`}
                  alt={item.country}
                  className="w-7 h-5 object-cover rounded-xs"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
