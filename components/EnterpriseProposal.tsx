"use client";

import React, { useState } from "react";
import { Percent, UserCheck, ShieldCheck, FileSpreadsheet, Phone, Loader2, CheckCircle2, AlertCircle, Send } from "lucide-react";
import { SITE } from "@/lib/site";
import { IconTile } from "@/components/ui/IconTile";
import { Select } from "@/components/ui/Select";
import { inputClass, labelClass, textareaClass } from "@/lib/ui";
import { SECTION_PADDING } from "@/components/ui/SectionHeading";

const BENEFITS = [
  { icon: Percent, title: "Volume Discounts", body: "Save up to 30% on high-volume projects" },
  { icon: UserCheck, title: "Dedicated Account Director", body: "Single point of contact & QA lead" },
  { icon: ShieldCheck, title: "Bilateral NDAs & HIPAA Aligned", body: "Enterprise data confidentiality" },
  { icon: FileSpreadsheet, title: "Flexible Corporate Terms", body: "Net-30 monthly invoicing" },
];

const CALLBACK_TIMES = [
  "Immediate / Urgent (Next 30 Mins)",
  "Morning (9:00 AM – 12:00 PM EST)",
  "Afternoon (1:00 PM – 5:00 PM EST)",
];

const VOLUME_SCOPES = [
  "10 – 50 Pages (Batch Project)",
  "50 – 200 Pages (High-Volume)",
  "200+ Pages (Enterprise Scale)",
  "Ongoing Monthly Corporate Retainer",
];

export const EnterpriseProposal: React.FC = () => {
  const [contactName, setContactName] = useState("");
  const [corporateEmail, setCorporateEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [preferredTime, setPreferredTime] = useState(CALLBACK_TIMES[0]);
  const [volumeScope, setVolumeScope] = useState(VOLUME_SCOPES[0]);
  const [targetLanguages, setTargetLanguages] = useState("");
  const [projectNotes, setProjectNotes] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/rfp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contactName,
          corporateEmail,
          phone,
          preferredTime,
          volumeScope,
          targetLanguages,
          projectNotes,
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success || !result.inquiry) {
        throw new Error(result.error || "We could not record your request.");
      }

      setReference(result.inquiry.referenceNumber);
    } catch (err) {
      setError(
        err instanceof Error
          ? `${err.message} Please try again or call ${SITE.phone}.`
          : `Something went wrong. Please call ${SITE.phone}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className={`${SECTION_PADDING} bg-[#0f172a] text-white border-b border-slate-800`}
      id="enterprise-proposal"
    >
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left: value proposition */}
        <div className="lg:col-span-5 space-y-6">
          <span className="inline-block text-[11px] sm:text-xs font-bold text-[#f59e0b] uppercase tracking-[0.12em] bg-amber-500/10 px-3.5 py-1.5 rounded-full border border-amber-500/30">
            High-Volume Projects &amp; RFPs
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-[2.125rem] font-extrabold tracking-tight leading-[1.2]">
            Large Document Volume or Recurring Translation?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Get volume-tiered pricing, a dedicated project lead, and strict NDA-protected workflows. Custom proposal &amp; callback within 1 business hour.
          </p>

          <ul className="space-y-3 pt-1">
            {BENEFITS.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <li key={benefit.title} className="flex items-start gap-3.5">
                  <IconTile icon={Icon} tone="inverse" size="md" />
                  <div>
                    <span className="text-sm font-bold block">{benefit.title}</span>
                    <span className="text-xs text-slate-400">{benefit.body}</span>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="pt-4 border-t border-slate-700 text-xs text-slate-400">
            Immediate assistance? Call Account Services:
            <a
              href={SITE.phoneHref}
              className="mt-1.5 flex items-center gap-2 text-white font-extrabold text-sm hover:text-[#f59e0b] transition-colors"
            >
              <Phone className="w-4 h-4 text-[#f59e0b]" strokeWidth={2.25} />
              {SITE.phone} ({SITE.accountServicesExt})
            </a>
          </div>
        </div>

        {/* Right: RFP form */}
        <div className="lg:col-span-7 w-full bg-white text-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
          {reference ? (
            <div className="text-center py-10 space-y-3">
              <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-extrabold text-slate-900">Proposal Request Received</h3>
              <p className="text-sm text-slate-600 max-w-sm mx-auto">
                Your reference is <strong className="text-[#173d40]">{reference}</strong>. An account director will call{" "}
                <strong>{phone}</strong> within 1 business hour.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">Request a Custom Proposal</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Fill out your project parameters below to receive our custom quote and direct callback.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rfp-name" className={labelClass}>
                    Contact Name *
                  </label>
                  <input
                    id="rfp-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Jonathan Reyes"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="rfp-email" className={labelClass}>
                    Corporate Email *
                  </label>
                  <input
                    id="rfp-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={corporateEmail}
                    onChange={(e) => setCorporateEmail(e.target.value)}
                    placeholder="name@company.com"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rfp-phone" className={labelClass}>
                    Direct Callback Phone *
                  </label>
                  <input
                    id="rfp-phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label htmlFor="rfp-time" className={labelClass}>
                    Preferred Callback Time
                  </label>
                  <Select
                    id="rfp-time"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                  >
                    {CALLBACK_TIMES.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="rfp-volume" className={labelClass}>
                    Estimated Volume Scope
                  </label>
                  <Select
                    id="rfp-volume"
                    value={volumeScope}
                    onChange={(e) => setVolumeScope(e.target.value)}
                  >
                    {VOLUME_SCOPES.map((scope) => (
                      <option key={scope} value={scope}>
                        {scope}
                      </option>
                    ))}
                  </Select>
                </div>
                <div>
                  <label htmlFor="rfp-languages" className={labelClass}>
                    Target Language(s)
                  </label>
                  <input
                    id="rfp-languages"
                    type="text"
                    value={targetLanguages}
                    onChange={(e) => setTargetLanguages(e.target.value)}
                    placeholder="e.g. Spanish, Arabic, Ukrainian"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="rfp-notes" className={labelClass}>
                  Project Details / Deadline Notes
                </label>
                <textarea
                  id="rfp-notes"
                  rows={3}
                  value={projectNotes}
                  onChange={(e) => setProjectNotes(e.target.value)}
                  placeholder="Document types, deadlines, recurring volume, compliance requirements…"
                  className={textareaClass}
                />
              </div>

              {error && (
                <p
                  role="alert"
                  className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-px" />
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#173d40] hover:bg-[#123032] disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-sm px-6 py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-98 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending Request…
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Request Custom Proposal &amp; Callback
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
