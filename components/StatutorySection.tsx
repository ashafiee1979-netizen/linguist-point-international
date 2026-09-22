"use client";

import React from "react";
import { BadgeCheck } from "lucide-react";
import { SITE } from "@/lib/site";
import {
  SectionHeading,
  SECTION_PADDING,
  SECTION_FOOTNOTE_GAP,
} from "@/components/ui/SectionHeading";

interface StatutorySectionProps {
  onOpenOrder: () => void;
}

const ORGANIZATIONS = [
  {
    code: "USCIS",
    name: "U.S. Citizenship & Immigration Services",
    scope: "N-400 Naturalization, I-485 Adjustment of Status, I-130 Petitions, Asylum & SIV Cases",
    tag: "100% Guaranteed",
  },
  {
    code: "U.S. STATE DEPT",
    name: "U.S. Department of State",
    scope: "U.S. Passport Agencies, Consular Affairs, Foreign Visa Applications & DS-260 Filings",
    tag: "Verified Acceptance",
  },
  {
    code: "UNITED NATIONS",
    name: "United Nations (UN)",
    scope: "UN Secretariat, Peacekeeping Missions, Global Procurement & Diplomatic Submissions",
    tag: "Official Acceptance",
  },
  {
    code: "UNICEF",
    name: "United Nations Children's Fund (UNICEF)",
    scope: "Humanitarian Field Operations, Program Evaluation Reports & Official Records",
    tag: "Trusted Partner",
  },
  {
    code: "WORLD BANK",
    name: "The World Bank Group",
    scope: "Multilateral Project Documentation, Financial Audits, Contracts & Legal Directives",
    tag: "Institutional Standard",
  },
  {
    code: "U.S. COURTS",
    name: "U.S. Federal & State Courts",
    scope: "Affidavits, Depositions, Contracts, Evidence Exhibits & Family Court Decrees",
    tag: "Evidentiary Standard",
  },
  {
    code: "SSA",
    name: "Social Security Administration (SSA)",
    scope: "Birth Certificates, Foreign Marriage Records, Identity & Survivor Benefit Proofs",
    tag: "Federal Acceptance",
  },
  {
    code: "STATE DMVs",
    name: "State DMVs Nationwide",
    scope: "Foreign Driver's Licenses, International Permits, ID Verifications & Driving Records",
    tag: "Real-ID Compliant",
  },
  {
    code: "HEALTHCARE",
    name: "Hospitals & Medical Institutions",
    scope: "International Patient Records, Clinical Summaries, Immunization Cards & Medical Affidavits",
    tag: "Clinical Grade",
  },
  {
    code: "WHO",
    name: "World Health Organization (WHO)",
    scope: "International Health Guidelines, Clinical Registry Translations & Field Records",
    tag: "Global Standards",
  },
];

const COMPLIANCE_CHIPS = [
  "USCIS (8 CFR 204.2 Compliant)",
  "U.S. Dept of State & Consulates",
  "WES & Academic Evaluation Boards",
  "Federal & State Judicial Courts",
  "State DMVs (Motor Vehicles)",
  "Complying with ATA & ISO 17100",
];

export const StatutorySection: React.FC<StatutorySectionProps> = ({ onOpenOrder }) => {
  return (
    <section className={`${SECTION_PADDING} bg-white border-y border-slate-200`} id="institutions">
      <div className="max-w-7xl mx-auto px-4">

        {/* ATA Membership Banner */}
        <div
          className="bg-gradient-to-r from-slate-50 via-teal-50/40 to-slate-50 border-2 border-[#002D62] border-l-4 sm:border-l-8 rounded-xl p-5 sm:p-6 mb-12 sm:mb-14 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-5 sm:gap-6"
          id="accreditation"
        >
          <div className="flex items-start sm:items-center gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#002D62] text-white flex flex-col items-center justify-center shadow-md flex-shrink-0 leading-none">
              <span className="font-extrabold text-sm sm:text-base">ATA</span>
              <span className="text-[7px] font-bold tracking-widest mt-0.5">MEMBER</span>
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#b45309] block">
                Official Corporate Member
              </span>
              <h3 className="text-lg sm:text-xl font-bold text-[#002D62]">
                American Translators Association (ATA)
              </h3>
              <p className="text-xs font-semibold text-slate-500 mt-0.5">
                Corporate Membership #{SITE.ataMemberNumber} • Active &amp; Verified Standing
              </p>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                {SITE.name} translates and certifies all foreign documents under strict adherence to{" "}
                <strong className="text-slate-800">ATA Standards for Translation and Certification</strong>. Every document includes our corporate seal, accredited translator certification, and sworn Statement of Accuracy fulfilling{" "}
                <strong className="text-slate-800">8 CFR 204.2(a)(1)(iii)</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenOrder}
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-[#002D62] text-white font-bold text-sm tracking-wide hover:bg-blue-900 transition-colors flex-shrink-0 inline-flex items-center justify-center gap-2 shadow-sm"
          >
            <BadgeCheck className="w-4 h-4" />
            Start Certified Order
          </button>
        </div>

        {/* 10 Executive Recognition Cards */}
        <SectionHeading
          eyebrow="Statutory & Institutional Recognition"
          title="Official Acceptance Guarantee Across Regulatory Bodies & Institutions"
          description="Our certified and notarized translations hold a 100% acceptance record across federal agencies, top universities, medical networks, and global institutions."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {ORGANIZATIONS.map((org) => (
            <div
              key={org.code}
              className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#173d40]/40 p-5 rounded-2xl shadow-2xs hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1.5 mb-2.5 flex-wrap">
                  <span className="font-extrabold text-xs text-[#173d40] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {org.code}
                  </span>
                  <span className="text-xs text-emerald-800 font-bold whitespace-nowrap">✓ {org.tag}</span>
                </div>
                <h3 className="font-bold text-sm sm:text-[15px] text-slate-900 mb-1.5 leading-snug">{org.name}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{org.scope}</p>
              </div>
            </div>
          ))}
        </div>

        <ul className="flex flex-wrap justify-center gap-2.5 mt-10">
          {COMPLIANCE_CHIPS.map((chip) => (
            <li
              key={chip}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 px-3.5 py-1.5 rounded-full shadow-2xs"
            >
              {chip}
            </li>
          ))}
        </ul>

        <div className={`${SECTION_FOOTNOTE_GAP} text-center`}>
          <p className="text-sm sm:text-base text-slate-600">
            Need your documents certified for USCIS, universities, courts, or government bodies?{" "}
            <button
              onClick={onOpenOrder}
              className="font-extrabold text-[#173d40] underline underline-offset-4 hover:text-[#f59e0b] transition-colors"
            >
              Start Order Now
            </button>
          </p>
        </div>

      </div>
    </section>
  );
};
