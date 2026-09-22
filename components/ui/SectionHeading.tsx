import React from "react";

interface SectionHeadingProps {
  eyebrow: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  /** Use on dark backgrounds. */
  inverse?: boolean;
  className?: string;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  inverse = false,
  className = "",
}) => {
  return (
    <div className={`text-center max-w-3xl mx-auto ${SECTION_HEADING_GAP} ${className}`}>
      <span
        className={`inline-block text-xs font-extrabold uppercase tracking-[0.14em] px-4 py-1.5 rounded-full border ${
          inverse
            ? "text-[#f59e0b] bg-amber-500/10 border-amber-500/30"
            : "text-[#173d40] bg-teal-50 border-teal-200"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight mt-4 leading-[1.2] ${
          inverse ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </h2>
      {description && (
        <p className={`text-base sm:text-lg leading-relaxed mt-4 ${inverse ? "text-slate-300" : "text-slate-600"}`}>
          {description}
        </p>
      )}
    </div>
  );
};

/** Vertical padding shared by every full-width section. */
export const SECTION_PADDING = "py-12 sm:py-14 lg:py-16";

/** Space between a section heading block and the content beneath it. */
export const SECTION_HEADING_GAP = "mb-8 sm:mb-10";

/** Space between the content grid and the closing call-to-action line. */
export const SECTION_FOOTNOTE_GAP = "mt-8 sm:mt-10";
