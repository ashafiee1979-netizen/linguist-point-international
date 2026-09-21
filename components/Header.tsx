"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Phone, Mail, X } from "lucide-react";

interface HeaderProps {
  onOpenOrder: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenOrder }) => {
  const [showBanner, setShowBanner] = useState(true);

  return (
    <>
      {showBanner && (
        <div className="bg-[#173d40] text-slate-200 text-xs py-2 border-b border-teal-800">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="bg-[#f59e0b] text-slate-950 font-bold px-2 py-0.5 rounded-full text-[11px]">
                Spring Promotion
              </span>
              <span>
                Get <strong className="text-white">20% Off</strong> on all certified translation orders over $200 with code{" "}
                <strong className="text-[#f59e0b]">LPGLOBAL20</strong>
              </span>
            </div>
            <div className="flex items-center gap-4 text-slate-300">
              <a href="tel:+18007702305" className="hover:text-white flex items-center gap-1 transition-colors">
                <Phone className="w-3.5 h-3.5 text-[#f59e0b]" />
                +1 (800) 770-2305
              </a>
              <a href="mailto:support@linguistpoint.com" className="hover:text-white flex items-center gap-1 transition-colors">
                <Mail className="w-3.5 h-3.5 text-[#f59e0b]" />
                support@linguistpoint.com
              </a>
              <button
                onClick={() => setShowBanner(false)}
                className="text-slate-400 hover:text-white ml-2 transition-colors"
                title="Dismiss"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img
              src="/assets/logo-horizontal-cropped.png"
              alt="Linguist Point International"
              className="h-14 w-auto object-contain"
            />
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-700">
            <a href="#services" className="hover:text-[#173d40] transition-colors">Services</a>
            <a href="#how-it-works" className="hover:text-[#173d40] transition-colors">How It Works</a>
            <a href="#institutions" className="hover:text-[#173d40] transition-colors">Recognition</a>
            <a href="#reviews" className="hover:text-[#173d40] transition-colors">Reviews</a>
            <a href="#faq" className="hover:text-[#173d40] transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={onOpenOrder}
              className="bg-[#173d40] hover:bg-[#123032] text-white font-bold px-5 py-2.5 rounded-lg text-sm transition-all shadow-sm hover:shadow active:scale-95"
            >
              Start Order
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
