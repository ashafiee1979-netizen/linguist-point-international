import React from "react";
import { Phone, Mail, Clock } from "lucide-react";
import { SITE } from "@/lib/site";
import { PRICING } from "@/lib/pricing";

interface FooterColumn {
  heading: string;
  links: { label: string; href: string }[];
}

const COLUMNS: FooterColumn[] = [
  {
    heading: "Services",
    links: [
      { label: `Certified Translation ($${PRICING.pricePerPage.toFixed(2)}/pg)`, href: "#services" },
      { label: `Standard Translation ($${PRICING.pricePerWord.toFixed(2)}/wd)`, href: "#services" },
      { label: "Notarized Translation", href: "#services" },
      { label: "ATA & 15+ Accepted Orgs", href: "#institutions" },
      { label: "PUL Enterprise Pedigree", href: "#heritage" },
      { label: "Enterprise & RFPs", href: "#enterprise-proposal" },
    ],
  },
  {
    heading: "Industries",
    links: [
      { label: "Immigration & USCIS", href: "#industries" },
      { label: "Legal & Courts", href: "#industries" },
      { label: "Academic & WES", href: "#industries" },
      { label: "Healthcare & HIPAA", href: "#industries" },
      { label: "Financial & Tax", href: "#industries" },
      { label: "Corporate Handbooks", href: "#industries" },
    ],
  },
  {
    heading: "Languages",
    links: [
      { label: "Spanish to English", href: "#languages" },
      { label: "French to English", href: "#languages" },
      { label: "Arabic to English", href: "#languages" },
      { label: "German to English", href: "#languages" },
      { label: "Russian to English", href: "#languages" },
      { label: `Explore All ${SITE.languageCount}`, href: "#languages" },
    ],
  },
];

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs pt-12 sm:pt-16 pb-10 sm:pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-10 sm:mb-12">
          {/* Brand Info */}
          <div className="space-y-3 sm:col-span-2 lg:col-span-2">
            <span className="text-white font-extrabold text-sm sm:text-base tracking-tight block">
              LINGUIST POINT INTERNATIONAL
            </span>
            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              {SITE.name} is a premier translation agency delivering certified, legal, academic, and enterprise translations across {SITE.languageCount} languages with official regulatory compliance.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500 pt-1">
              <span className="font-bold text-slate-300">ATA Member #{SITE.ataMemberNumber}</span>
              <span aria-hidden="true">•</span>
              <span className="font-bold text-slate-300">USCIS Approved</span>
            </div>
          </div>

          {COLUMNS.map((column) => (
            <div key={column.heading}>
              <h2 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
                {column.heading}
              </h2>
              <ul className="space-y-1">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="inline-block py-1 hover:text-white transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-6 border-t border-slate-800">
          <a
            href={SITE.phoneHref}
            className="flex items-center gap-2 text-white hover:text-[#f59e0b] transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-[#f59e0b] flex-shrink-0" />
            {SITE.phone}
          </a>
          <a
            href={SITE.emailHref}
            className="flex items-center gap-2 text-white hover:text-[#f59e0b] transition-colors break-all"
          >
            <Mail className="w-3.5 h-3.5 text-[#f59e0b] flex-shrink-0" />
            {SITE.email}
          </a>
          <span className="flex items-center gap-2 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-[#f59e0b] flex-shrink-0" />
            24/7 Global Client Desk
          </span>
        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div className="text-center sm:text-left">
            &copy; {new Date().getFullYear()} {SITE.name}. All Rights Reserved. Backed by PUL Global Partners.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-slate-500">
            <span>Terms of Service</span>
            <span aria-hidden="true">•</span>
            <span>Privacy Policy (HIPAA / GDPR)</span>
            <span aria-hidden="true">•</span>
            <span>USCIS Guarantee</span>
            <span aria-hidden="true">•</span>
            <span>Security Protocols</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
