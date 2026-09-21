"use client";

import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -240 : 240;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <div className="bg-slate-50 border-b border-slate-200 py-2.5">
      <div className="max-w-7xl mx-auto px-4 flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700 whitespace-nowrap flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true"></span>
          <span className="hidden sm:inline">Global Languages:</span>
          <span className="sm:hidden">Languages:</span>
        </div>

        <button
          onClick={() => scroll("left")}
          className="hidden sm:block p-1 rounded-full text-slate-500 hover:bg-slate-200 transition-colors flex-shrink-0"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center gap-2 overflow-x-auto no-scrollbar scroll-smooth flex-grow min-w-0 py-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {POPULAR_FLAGS.map((item) => (
            <div
              key={item.code}
              className="flex-shrink-0 p-1.5 bg-white hover:bg-teal-50 border border-slate-200 hover:border-teal-400 rounded-md shadow-2xs transition-all cursor-pointer hover:scale-110"
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

        <button
          onClick={() => scroll("right")}
          className="hidden sm:block p-1 rounded-full text-slate-500 hover:bg-slate-200 transition-colors flex-shrink-0"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
