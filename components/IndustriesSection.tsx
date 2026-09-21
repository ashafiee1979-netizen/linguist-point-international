"use client";

import React from "react";
import { Stamp, Scale, GraduationCap } from "lucide-react";
import { IconTile } from "@/components/ui/IconTile";
import {
  SectionHeading,
  SECTION_PADDING,
  SECTION_FOOTNOTE_GAP,
} from "@/components/ui/SectionHeading";

interface IndustriesSectionProps {
  onOpenOrder: () => void;
}

const INDUSTRIES = [
  {
    icon: Stamp,
    title: "Immigration & USCIS",
    body: "Certified translations format-matched to satisfy USCIS, NVC, consular, and adjustment of status petitions.",
    documents: ["Birth Certificate", "Marriage License", "Asylum Declaration", "Police Clearance"],
  },
  {
    icon: Scale,
    title: "Legal & Court Proceedings",
    body: "Court-admissible translations prepared for international litigation, arbitrations, and contractual disputes.",
    documents: ["Court Pleadings", "Commercial Contracts", "Depositions", "Power of Attorney"],
  },
  {
    icon: GraduationCap,
    title: "Academic & University Admissions",
    body: "Rigorous format-matched translations approved by WES, ECE, universities, and professional licensing boards.",
    documents: ["Transcripts", "Diplomas & Degrees", "Course Syllabus", "Letters of Reference"],
  },
];

export const IndustriesSection: React.FC<IndustriesSectionProps> = ({ onOpenOrder }) => {
  return (
    <section className={`${SECTION_PADDING} bg-slate-50 border-b border-slate-200`} id="industries">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeading
          eyebrow="Accredited Subject-Matter Linguists"
          title="Specialized Solutions for Regulated Sectors"
          description="Our translators possess deep sector expertise in legal codes, clinical trials, academic credentials, and immigration regulations."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {INDUSTRIES.map((industry) => {
            const Icon = industry.icon;
            return (
              <div
                key={industry.title}
                className="bg-white border border-slate-200 rounded-2xl p-7 shadow-sm hover:border-teal-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
              >
                <IconTile icon={Icon} size="lg" tone="light" className="mb-5" />
                <h3 className="text-[15px] font-bold text-slate-900">{industry.title}</h3>
                <p className="text-[13px] text-slate-600 leading-relaxed mt-2 flex-grow">{industry.body}</p>
                <ul className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-slate-100">
                  {industry.documents.map((doc) => (
                    <li
                      key={doc}
                      className="text-[11px] font-semibold text-[#173d40] bg-slate-50 border border-slate-200 px-2 py-1 rounded-md"
                    >
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className={`${SECTION_FOOTNOTE_GAP} text-center`}>
          <p className="text-sm text-slate-600">
            Need specialized sector translation for immigration, courts, or university admissions?{" "}
            <button
              onClick={onOpenOrder}
              className="font-extrabold text-[#173d40] underline underline-offset-4 hover:text-[#f59e0b] transition-colors"
            >
              Start Order
            </button>
          </p>
        </div>
      </div>
    </section>
  );
};
