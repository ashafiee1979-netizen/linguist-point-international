"use client";

import React from "react";
import { UploadCloud, Languages, FileCheck2 } from "lucide-react";
import { IconTile } from "@/components/ui/IconTile";
import {
  SectionHeading,
  SECTION_PADDING,
  SECTION_FOOTNOTE_GAP,
} from "@/components/ui/SectionHeading";

interface HowItWorksProps {
  onOpenOrder: () => void;
}

const STEPS = [
  {
    icon: UploadCloud,
    title: "Upload Documents & Configure",
    body: "Upload clear scans, photos, or digital files (PDF, DOCX, JPG). Choose from 65+ language pairs, select standard 24h or 12h express turnaround, and add optional notary seals.",
  },
  {
    icon: Languages,
    title: "Human Translation & Dual Review",
    body: "An accredited native linguist specialized in your industry translates every line with cultural precision. A senior editor rigorously checks layout, terminology, and formatting.",
  },
  {
    icon: FileCheck2,
    title: "Receive Certified Documents",
    body: "Download your signed, stamped Certificate of Translation Accuracy in digital high-res PDF. Request unlimited free revisions, or track physical hard copies shipped to your address.",
  },
];

export const HowItWorks: React.FC<HowItWorksProps> = ({ onOpenOrder }) => {
  return (
    <section className={`${SECTION_PADDING} bg-white border-b border-slate-200`} id="how-it-works">
      <div className="max-w-7xl mx-auto px-4">
        <SectionHeading
          eyebrow="Streamlined 3-Step Flow"
          title="How Our Translation Process Works"
          description="Experience our frictionless turnaround from file upload to certified delivery."
        />

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <li
                key={step.title}
                className="relative bg-slate-50 border border-slate-200 rounded-2xl p-7 flex flex-col gap-4 hover:bg-white hover:border-teal-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                {/* Connector between steps, wide screens only. */}
                {idx < STEPS.length - 1 && (
                  <span
                    aria-hidden="true"
                    className="hidden md:block absolute top-14 -right-3 w-6 h-px bg-slate-300"
                  />
                )}
                <div className="flex items-center justify-between">
                  <IconTile icon={Icon} size="lg" />
                  <span className="text-4xl font-extrabold text-slate-200/90 leading-none select-none tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="text-[15px] font-bold text-slate-900">{step.title}</h3>
                  <p className="text-[13px] text-slate-600 leading-relaxed mt-2">{step.body}</p>
                </div>
              </li>
            );
          })}
        </ol>

        <div className={`${SECTION_FOOTNOTE_GAP} text-center`}>
          <p className="text-sm text-slate-600">
            Ready to translate? Upload your files in 60 seconds and receive certified delivery within 24 hours.{" "}
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
