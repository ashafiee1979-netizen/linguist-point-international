"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Search, CheckCircle2, Info, ArrowRight, X } from "lucide-react";
import { SITE } from "@/lib/site";
import { inputClass } from "@/lib/ui";
import { searchLanguages, resolveExact } from "@/lib/language-search";
import { SectionHeading, SECTION_PADDING } from "@/components/ui/SectionHeading";
import type { OrderDraft } from "@/lib/order";

interface LanguageLookupProps {
  onOpenOrder: (draft?: Partial<OrderDraft>) => void;
  onSelectLanguage?: (sourceLang: string, targetLang?: string) => void;
}

// Organized strictly by international recognition (UN official languages) and global speaker population
const POPULAR_LANGUAGES_ROW_1 = [
  { name: "Chinese", pair: "Chinese to English", code: "zh" },
  { name: "Spanish", pair: "Spanish to English", code: "es" },
  { name: "Hindi", pair: "Hindi to English", code: "hi" },
  { name: "Arabic", pair: "Arabic to English", code: "ar" },
  { name: "French", pair: "French to English", code: "fr" },
  { name: "Russian", pair: "Russian to English", code: "ru" },
];

const POPULAR_LANGUAGES_ROW_2 = [
  { name: "Urdu", pair: "Urdu to English", code: "ur" },
  { name: "German", pair: "German to English", code: "de" },
  { name: "Persian (Farsi)", pair: "Persian (Farsi) to English", code: "fa" },
  { name: "Pashto", pair: "Pashto to English", code: "ps" },
  { name: "Dari", pair: "Dari to English", code: "prs" },
];

export const LanguageLookup: React.FC<LanguageLookupProps> = ({ onOpenOrder, onSelectLanguage }) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const matches = useMemo(() => (selected ? [] : searchLanguages(query)), [query, selected]);
  const exact = useMemo(() => resolveExact(query), [query]);

  const resolved = selected ?? exact?.name ?? null;
  const hasQuery = query.trim().length > 0;
  const notFound = hasQuery && !resolved && matches.length === 0;
  const showList = isOpen && matches.length > 0;

  const handleRouteLanguage = (source: string, target = "English") => {
    if (onSelectLanguage) {
      onSelectLanguage(source, target);
    } else {
      onOpenOrder({ sourceLang: source, targetLang: target });
    }
  };

  useEffect(
    () => () => {
      if (blurTimer.current) clearTimeout(blurTimer.current);
    },
    []
  );

  // Keep the highlighted option in view when arrowing through a long list.
  useEffect(() => {
    if (activeIndex < 0 || !listRef.current) return;
    listRef.current.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const pick = (name: string) => {
    if (blurTimer.current) clearTimeout(blurTimer.current);
    setQuery(name);
    setSelected(name);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const clear = () => {
    setQuery("");
    setSelected(null);
    setIsOpen(false);
    setActiveIndex(-1);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setActiveIndex(-1);
      return;
    }
    if (e.key === "Enter") {
      if (showList && activeIndex >= 0) {
        e.preventDefault();
        pick(matches[activeIndex].language.name);
      } else if (resolved) {
        e.preventDefault();
        handleRouteLanguage(resolved, "English");
      }
      return;
    }
    if (!showList) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % matches.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? matches.length - 1 : i - 1));
    }
  };

  return (
    <section className={`${SECTION_PADDING} bg-white border-b border-slate-200`} id="languages">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeading
          eyebrow="Instant Language Availability"
          title={`Certified Translation in ${SITE.languageCount} World Languages`}
          description="Check your language pair below. Every translation includes a signed & stamped Certificate of Accuracy guaranteed for official acceptance."
        />

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-9 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-3 lg:items-start">
            <div className="flex-grow min-w-0">
              {/* This wrapper holds only the control, so the absolutely
                  positioned icons centre on the input itself rather than on
                  the status line sitting underneath it. */}
              <div className="relative group">
                <label htmlFor="lang-search" className="sr-only">
                  Search for your language
                </label>

                <Search
                  aria-hidden="true"
                  strokeWidth={2.25}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400 transition-colors group-focus-within:text-[#173d40]"
                />

                <input
                  ref={inputRef}
                  id="lang-search"
                  type="text"
                  role="combobox"
                  aria-expanded={showList}
                  aria-controls="lang-suggestions"
                  aria-autocomplete="list"
                  aria-activedescendant={
                    showList && activeIndex >= 0 ? `lang-option-${activeIndex}` : undefined
                  }
                  autoComplete="off"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelected(null);
                    setIsOpen(true);
                    setActiveIndex(-1);
                  }}
                  onFocus={() => setIsOpen(true)}
                  onKeyDown={handleKeyDown}
                  onBlur={() => {
                    // Delay so a click on an option registers before the list closes.
                    blurTimer.current = setTimeout(() => setIsOpen(false), 150);
                  }}
                  placeholder="Type your language (e.g. Persian, Farsi, Urdu, Hindi, Dari, Pashto)…"
                  className={`${inputClass} pl-11 ${query ? "pr-11" : ""} text-sm sm:text-base font-medium`}
                />

                {query && (
                  <button
                    type="button"
                    onClick={clear}
                    aria-label="Clear language search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}

                {showList && (
                  <ul
                    ref={listRef}
                    id="lang-suggestions"
                    role="listbox"
                    aria-label="Matching languages"
                    className="absolute z-20 left-0 right-0 mt-1.5 max-h-64 overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-lg animate-fade-in"
                  >
                    {matches.map((match, idx) => (
                      <li
                        key={match.language.code}
                        id={`lang-option-${idx}`}
                        role="option"
                        aria-selected={idx === activeIndex}
                      >
                        <button
                          type="button"
                          onMouseDown={(e) => e.preventDefault()}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => pick(match.language.name)}
                          className={`w-full text-left px-4 py-3 text-sm sm:text-base font-semibold transition-colors flex items-center justify-between gap-3 ${
                            idx === activeIndex
                              ? "bg-teal-50 text-[#173d40]"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span>{match.language.name}</span>
                          {match.via && (
                            <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                              matched &ldquo;{match.via}&rdquo;
                            </span>
                          )}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <p
                className={`mt-3 text-sm font-semibold flex items-start gap-2 ${
                  notFound ? "text-amber-700" : "text-emerald-700"
                }`}
                role="status"
              >
                {notFound ? (
                  <>
                    <Info className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={2.25} />
                    Not in the list? We still translate it &mdash; pick &ldquo;Other / Language Not
                    Listed&rdquo; when you order.
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" strokeWidth={2.25} />
                    {resolved
                      ? `${resolved} to English — available in 24h with 100% USCIS Acceptance Guarantee`
                      : "Available in 24h with 100% USCIS Acceptance Guarantee"}
                  </>
                )}
              </p>
            </div>

            <button
              onClick={() => {
                if (resolved) {
                  handleRouteLanguage(resolved, "English");
                } else {
                  handleRouteLanguage("Spanish", "English");
                }
              }}
              className="h-12 flex-shrink-0 bg-[#173d40] hover:bg-[#123032] text-white font-extrabold text-sm sm:text-base px-7 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-98"
            >
              Start Order
              <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
            </button>
          </div>

          <div className="mt-8 pt-7 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-3.5">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                Popular Languages (Translated to English)
              </h3>
              <span className="text-[11px] sm:text-xs text-slate-500 font-medium">
                Click any language to auto-populate quote
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {/* Row 1: Global & UN Official Languages */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                {POPULAR_LANGUAGES_ROW_1.map((item) => (
                  <button
                    key={item.pair}
                    onClick={() => handleRouteLanguage(item.name, "English")}
                    className="whitespace-nowrap text-xs sm:text-sm font-semibold text-[#173d40] bg-white border border-slate-200 hover:border-[#173d40] hover:bg-teal-50/80 px-3.5 py-1.5 rounded-full transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 flex-shrink-0"
                    title={`Order ${item.name} to English translation`}
                  >
                    <span>{item.name}</span>
                    <span className="text-[11px] font-normal text-slate-400">→ EN</span>
                  </button>
                ))}
              </div>

              {/* Row 2: Major Regional & Commercial Languages */}
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
                {POPULAR_LANGUAGES_ROW_2.map((item) => (
                  <button
                    key={item.pair}
                    onClick={() => handleRouteLanguage(item.name, "English")}
                    className="whitespace-nowrap text-xs sm:text-sm font-semibold text-[#173d40] bg-white border border-slate-200 hover:border-[#173d40] hover:bg-teal-50/80 px-3.5 py-1.5 rounded-full transition-all shadow-2xs hover:shadow-xs flex items-center gap-1.5 flex-shrink-0"
                    title={`Order ${item.name} to English translation`}
                  >
                    <span>{item.name}</span>
                    <span className="text-[11px] font-normal text-slate-400">→ EN</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
