"use client";

import React, { useEffect, useState } from "react";
import { Phone, Mail, X, Menu } from "lucide-react";
import { SITE } from "@/lib/site";

interface HeaderProps {
  onOpenOrder: () => void;
}

const NAV_LINKS = [
  { href: "#services", label: "Services" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#industries", label: "Industries" },
  { href: "#reviews", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
];

export const Header: React.FC<HeaderProps> = ({ onOpenOrder }) => {
  const [showBanner, setShowBanner] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // The mobile sheet is a full-width overlay, so stop the page behind it from
  // scrolling while it is open.
  useEffect(() => {
    if (!isMenuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isMenuOpen]);

  return (
    <>
      {showBanner && (
        <div className="bg-[#173d40] text-slate-200 text-xs py-2 border-b border-teal-800">
          <div className="max-w-7xl mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-2">
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center lg:text-left">
              <span className="bg-[#f59e0b] text-slate-950 font-bold px-2 py-0.5 rounded-full text-[11px] whitespace-nowrap">
                Spring Promotion
              </span>
              {/* The full sentence costs three lines on a phone, so small
                  screens get the same offer in one. */}
              <span className="hidden sm:inline">
                Get <strong className="text-white">20% Off</strong> on all certified translation orders over $200 with code{" "}
                <strong className="text-[#f59e0b]">{SITE.promoCode}</strong>
              </span>
              <span className="sm:hidden">
                <strong className="text-white">20% Off</strong> over $200 — code{" "}
                <strong className="text-[#f59e0b]">{SITE.promoCode}</strong>
              </span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 text-slate-300">
              <a
                href={SITE.phoneHref}
                className="hover:text-white flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <Phone className="w-3.5 h-3.5 text-[#f59e0b]" />
                {SITE.phone}
              </a>
              <a
                href={SITE.emailHref}
                className="hover:text-white hidden sm:flex items-center gap-1 transition-colors whitespace-nowrap"
              >
                <Mail className="w-3.5 h-3.5 text-[#f59e0b]" />
                {SITE.email}
              </a>
              <button
                onClick={() => setShowBanner(false)}
                className="text-slate-400 hover:text-white transition-colors p-2 -m-1"
                aria-label="Dismiss promotion banner"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 sm:h-20 flex items-center justify-between gap-4">
          <a href="#" className="flex items-center gap-3 shrink-0" aria-label={`${SITE.name} — home`}>
            <img
              src="/assets/logo-horizontal-cropped.png"
              alt={SITE.name}
              className="h-10 sm:h-14 w-auto object-contain"
            />
          </a>

          <nav className="hidden md:flex items-center gap-5 lg:gap-8 text-sm font-semibold text-slate-700">
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-[#173d40] transition-colors">
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenOrder}
              className="bg-[#173d40] hover:bg-[#123032] text-white font-bold px-4 sm:px-5 py-2.5 rounded-lg text-xs sm:text-sm transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
            >
              Start Order
            </button>
            <button
              onClick={() => setIsMenuOpen((open) => !open)}
              className="md:hidden p-2 -mr-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={isMenuOpen}
              aria-controls="mobile-nav"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile navigation sheet */}
        {isMenuOpen && (
          <nav id="mobile-nav" className="md:hidden border-t border-slate-200 bg-white shadow-lg animate-fade-in">
            <ul className="max-w-7xl mx-auto px-4 py-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href} className="border-b border-slate-100 last:border-b-0">
                  <a
                    href={link.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="block py-3.5 text-sm font-semibold text-slate-700 hover:text-[#173d40] transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="max-w-7xl mx-auto px-4 pb-4 pt-1 flex flex-col gap-2 text-xs font-semibold text-slate-600">
              <a href={SITE.phoneHref} className="flex items-center gap-2 hover:text-[#173d40] transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#f59e0b]" />
                {SITE.phone}
              </a>
              <a href={SITE.emailHref} className="flex items-center gap-2 hover:text-[#173d40] transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#f59e0b]" />
                {SITE.email}
              </a>
            </div>
          </nav>
        )}
      </header>
    </>
  );
};
