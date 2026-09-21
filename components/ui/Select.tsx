"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { selectClass, selectPlaceholderClass } from "@/lib/ui";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  /** Renders the control in muted "nothing chosen yet" styling. */
  isPlaceholder?: boolean;
  wrapperClassName?: string;
}

/**
 * A native <select> with the platform arrow suppressed and our own chevron
 * drawn on top. Staying native keeps the OS picker on mobile and full keyboard
 * support, while the chevron matches the rest of the design system rather than
 * rendering differently in every browser.
 */
export const Select: React.FC<SelectProps> = ({
  isPlaceholder = false,
  wrapperClassName = "",
  className = "",
  children,
  ...props
}) => {
  return (
    <div className={`relative group ${wrapperClassName}`}>
      <select
        {...props}
        className={`${selectClass} ${isPlaceholder ? selectPlaceholderClass : ""} ${className}`}
      >
        {children}
      </select>
      <ChevronDown
        aria-hidden="true"
        strokeWidth={2.25}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-colors group-focus-within:text-[#173d40] group-hover:text-slate-600"
      />
    </div>
  );
};
