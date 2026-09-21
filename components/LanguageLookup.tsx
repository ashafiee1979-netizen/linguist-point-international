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
}

const POPULAR_PAIRS = [
  "Spanish to English",
  "French to English",
  "Ukrainian to English",
  "Arabic to English",
  "German to English",
  "Chinese to English",
  "Russian to English",
  "Dari / Pashto to English",
];

export const LanguageLookup: React.FC<LanguageLookupProps> = ({ onOpenOrder }) => {
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
        onOpenOrder({ sourceLang: resolved, targetLang: "English" });
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
      <div className="max-w-5xl mx-auto px-4">
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
                  placeholder="Type your language (e.g. Spanish, Farsi, Ukrainian, Dari)…"
                  className={`${inputClass} pl-11 ${query ? "pr-11" : ""}`}
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
                          className={`w-full text-left px-4 py-2.5 text-sm font-semibold transition-colors flex items-center justify-between gap-3 ${
                            idx === activeIndex
                              ? "bg-teal-50 text-[#173d40]"
                              : "text-slate-700 hover:bg-slate-50"
                          }`}
                        >
                          <span>{match.language.name}</span>
                          {match.via && (
                            <span className="text-[11px] font-medium text-slate-400 whitespace-nowrap">
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
                className={`mt-2.5 text-xs font-semibold flex items-start gap-1.5 ${
                  notFound ? "text-amber-700" : "text-emerald-700"
                }`}
                role="status"
              >
                {notFound ? (
                  <>
                    <Info className="w-3.5 h-3.5 flex-shrink-0 mt-px" strokeWidth={2.25} />
                    Not in the list? We still translate it &mdash; pick &ldquo;Other / Language Not
                    Listed&rdquo; when you order.
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-px" strokeWidth={2.25} />
                    {resolved
                      ? `${resolved} to English — available in 24h with 100% USCIS Acceptance Guarantee`
                      : "Available in 24h with 100% USCIS Acceptance Guarantee"}
                  </>
                )}
              </p>
            </div>

            <button
              onClick={() =>
                onOpenOrder(resolved ? { sourceLang: resolved, targetLang: "English" } : undefined)
              }
              className="h-12 flex-shrink-0 bg-[#173d40] hover:bg-[#123032] text-white font-extrabold text-sm px-7 rounded-xl flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg active:scale-98"
            >
              Start Order
              <ArrowRight className="w-4 h-4" strokeWidth={2.25} />
            </button>
          </div>

          <div className="mt-7 pt-6 border-t border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Popular Language Pairs
            </h3>
            <ul className="flex flex-wrap gap-2">
              {POPULAR_PAIRS.map((pair) => (
                <li key={pair}>
                  <button
                    onClick={() =>
                      onOpenOrder({
                        sourceLang: pair.replace(" to English", ""),
                        targetLang: "English",
                      })
                    }
                    className="text-xs font-semibold text-[#173d40] bg-white border border-slate-200 hover:border-teal-400 hover:bg-teal-50 px-3.5 py-2 rounded-full transition-colors"
                  >
                    {pair}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
