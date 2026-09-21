import React from "react";
import { ShieldCheck, Award } from "lucide-react";

interface StatutorySectionProps {
  onOpenOrder: () => void;
}

const ORGANIZATIONS = [
  { code: "USCIS", name: "USCIS", scope: "N-400, I-485, I-130 Petitions, Asylum & SIV Filings", tag: "100% Guaranteed" },
  { code: "DOS", name: "U.S. Dept of State", scope: "Passport Agencies, Consulates & Visa Applications", tag: "Federal Standard" },
  { code: "UN", name: "United Nations", scope: "Diplomatic Submissions & Multilateral Missions", tag: "Institutional Grade" },
  { code: "UNICEF", name: "UNICEF", scope: "Global Field Operations & Official Program Records", tag: "Humanitarian Partner" },
  { code: "WB", name: "The World Bank Group", scope: "Financial Audits, Contracts & Legal Directives", tag: "Institutional Standard" },
  { code: "COURTS", name: "Federal & State Courts", scope: "Affidavits, Depositions, Contracts & Exhibits", tag: "Evidentiary Standard" },
  { code: "SSA", name: "Social Security Admin (SSA)", scope: "Birth Records, Identity & Survivor Benefit Proofs", tag: "Federal Acceptance" },
  { code: "DMV", name: "State DMVs Nationwide", scope: "Foreign Driver's Licenses & ID Verifications", tag: "Real-ID Compliant" },
  { code: "HEALTH", name: "Hospitals & Medical Institutions", scope: "Patient Records, Summaries & Immunizations", tag: "Clinical Grade" },
  { code: "WHO", name: "World Health Organization", scope: "Clinical Registry Translations & Health Guidelines", tag: "Global Health" },
];

export const StatutorySection: React.FC<StatutorySectionProps> = ({ onOpenOrder }) => {
  return (
    <section className="py-16 bg-white border-y border-slate-200" id="institutions">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* ATA Membership Banner */}
        <div className="bg-gradient-to-r from-slate-50 via-teal-50/40 to-slate-50 border-2 border-[#002D62] border-l-8 rounded-xl p-6 mb-12 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#002D62] text-white flex items-center justify-center font-extrabold text-xl shadow-md flex-shrink-0">
              ATA
            </div>
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#b45309] block">
                Official Corporate Member
              </span>
              <h4 className="text-lg font-bold text-[#002D62]">
                American Translators Association (ATA Member #274819)
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Every certified translation includes our official corporate seal, authorized officer signature under penalty of perjury, and Certificate of Accuracy.
              </p>
            </div>
          </div>
          <button
            onClick={onOpenOrder}
            className="px-4 py-2 rounded-lg bg-[#002D62] text-white font-bold text-xs uppercase tracking-wider hover:bg-blue-900 transition-colors flex-shrink-0"
          >
            Verify Credentials
          </button>
        </div>

        {/* 10 Executive Recognition Cards */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#173d40] uppercase tracking-wider bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            Statutory &amp; Institutional Acceptance
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            Recognized by Government, Judicial &amp; Healthcare Authorities
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Our format-engineered certified translations strictly meet federal, state, and international evidentiary standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {ORGANIZATIONS.map((org, idx) => (
            <div
              key={idx}
              className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-teal-400 p-4 rounded-xl shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-2">
                  <span className="font-extrabold text-[11px] text-[#173d40] bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                    {org.code}
                  </span>
                  <span className="text-[10px] text-emerald-700 font-bold">
                    {org.tag}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">{org.name}</h4>
                <p className="text-xs text-slate-500 leading-snug">{org.scope}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
