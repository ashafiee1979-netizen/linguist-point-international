"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, Upload, CheckCircle2, Loader2, AlertCircle, FileText, Trash2 } from "lucide-react";
import { POPULAR_LANGUAGES, OTHER_LANGUAGES } from "@/lib/languages";
import { calculatePrice, PRICING } from "@/lib/pricing";
import type { ServiceType } from "@/lib/pricing";
import { SITE } from "@/lib/site";
import type { OrderDraft, OrderResponse } from "@/lib/order";
import { Select } from "@/components/ui/Select";
import { inputClass, labelClass } from "@/lib/ui";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<OrderDraft> | null;
}

const MAX_FILE_MB = 25;
const ALL_LANGUAGE_OPTIONS = [...POPULAR_LANGUAGES, ...OTHER_LANGUAGES];

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, initialData }) => {
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [serviceType, setServiceType] = useState<ServiceType>("certified");
  const [sourceLang, setSourceLang] = useState("Spanish");
  const [targetLang, setTargetLang] = useState("English");
  const [pages, setPages] = useState(1);
  const [words, setWords] = useState(250);
  const [isRush, setIsRush] = useState(false);
  const [isNotarized, setIsNotarized] = useState(false);
  const [isHardCopy, setIsHardCopy] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<{ orderNumber: string; turnaround: string } | null>(
    null
  );

  const dialogRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // The modal stays mounted between openings, so the quote configured upstream
  // has to be copied in each time it opens rather than only on first mount.
  // Everything else is reset so a second order never inherits the attachments
  // or the confirmation of the previous one.
  useEffect(() => {
    if (!isOpen) return;
    setServiceType(initialData?.serviceType ?? "certified");
    setSourceLang(initialData?.sourceLang || "Spanish");
    setTargetLang(initialData?.targetLang || "English");
    setPages(initialData?.pageCount ?? 1);
    setWords(initialData?.wordCount ?? 250);
    setIsRush(initialData?.isRush ?? false);
    setIsNotarized(initialData?.isNotarized ?? false);
    setIsHardCopy(initialData?.isHardCopy ?? false);
    setUploadedFiles([]);
    setSubmitError(null);
    setFileError(null);
    setConfirmation(null);
    closeButtonRef.current?.focus();
  }, [isOpen, initialData]);

  // Lock the page behind the overlay while it is open.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Escape closes, and Tab stays inside the dialog.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !dialogRef.current) return;

      const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const picked = Array.from(e.target.files);
    const tooBig = picked.filter((f) => f.size > MAX_FILE_MB * 1024 * 1024);
    const accepted = picked.filter((f) => f.size <= MAX_FILE_MB * 1024 * 1024);

    setFileError(
      tooBig.length > 0
        ? `${tooBig.length} file${tooBig.length > 1 ? "s were" : " was"} over ${MAX_FILE_MB} MB and could not be attached.`
        : null
    );
    setUploadedFiles((current) => [...current, ...accepted]);
    // Allow re-picking the same file after removing it.
    e.target.value = "";
  };

  const removeFile = (index: number) => {
    setUploadedFiles((current) => current.filter((_, i) => i !== index));
  };

  // Priced live from the modal's own fields, so editing the language or volume
  // here updates the total instead of showing the stale figure passed in.
  const price = useMemo(
    () =>
      calculatePrice({
        serviceType,
        pageCount: pages,
        wordCount: words,
        isRush12Hour: isRush,
        isNotarized,
        isHardCopyMail: isHardCopy,
      }),
    [serviceType, pages, words, isRush, isNotarized, isHardCopy]
  );

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientName,
          clientEmail,
          serviceType,
          sourceLanguage: sourceLang,
          targetLanguage: targetLang,
          pageCount: pages,
          wordCount: words,
          isRush12Hour: isRush,
          isNotarized,
          isHardCopyMail: isHardCopy,
          fileNames: uploadedFiles.map((f) => f.name),
        }),
      });

      const result: OrderResponse = await response.json();
      if (!response.ok || !result.success || !result.order) {
        throw new Error(result.error || "We could not record your order.");
      }

      setConfirmation({
        orderNumber: result.order.orderNumber,
        turnaround: result.order.turnaround,
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? `${error.message} Please try again or call ${SITE.phone}.`
          : `Something went wrong. Please call ${SITE.phone}.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBackdropClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!isOpen) return null;

  const renderLanguageOptions = (prefix: string) => (
    <>
      <optgroup label="Popular Languages">
        {POPULAR_LANGUAGES.map((l) => (
          <option key={`${prefix}-${l.code}`} value={l.name}>
            {l.name}
          </option>
        ))}
      </optgroup>
      <optgroup label="All Languages (A to Z)">
        {OTHER_LANGUAGES.map((l) => (
          <option key={`${prefix}-all-${l.code}`} value={l.name}>
            {l.name}
          </option>
        ))}
      </optgroup>
    </>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-start sm:items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-4 sm:my-8 animate-modal-in"
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close order form"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmation ? (
          <div className="text-center py-8 sm:py-10 space-y-3">
            <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 text-emerald-600 mx-auto" />
            <h3 id="order-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Order Received
            </h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Your translation job has been recorded with reference{" "}
              <strong className="text-[#173d40]">{confirmation.orderNumber}</strong>. Expected delivery{" "}
              <strong className="text-[#173d40]">{confirmation.turnaround.toLowerCase()}</strong>. A confirmation
              email is on its way to <strong className="break-all">{clientEmail}</strong>.
            </p>
            <button
              onClick={onClose}
              className="mt-2 bg-[#173d40] hover:bg-[#123032] text-white font-bold text-xs px-6 py-2.5 rounded-lg transition-colors"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleOrderSubmit} className="space-y-5">
            <div className="pr-8">
              <span className="text-xs font-bold text-[#173d40] uppercase tracking-wider">Fast Checkout</span>
              <h3 id="order-modal-title" className="text-lg sm:text-xl font-extrabold text-slate-900">
                Upload &amp; Confirm Translation
              </h3>
            </div>

            {/* Service type */}
            <div
              className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl"
              role="group"
              aria-label="Translation service type"
            >
              {(
                [
                  { type: "certified" as const, label: "Certified", price: `$${PRICING.pricePerPage.toFixed(2)}/pg` },
                  { type: "standard" as const, label: "Standard", price: `$${PRICING.pricePerWord.toFixed(2)}/wd` },
                ]
              ).map((option) => {
                const active = serviceType === option.type;
                return (
                  <button
                    key={option.type}
                    type="button"
                    onClick={() => setServiceType(option.type)}
                    aria-pressed={active}
                    className={`px-2 py-2 rounded-lg text-xs font-bold transition-all ${
                      active ? "bg-white text-[#173d40] shadow-sm" : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {option.label}{" "}
                    <span className={active ? "text-slate-500" : "text-slate-400"}>({option.price})</span>
                  </button>
                );
              })}
            </div>

            {/* Document Upload Area */}
            <div>
              <div className="border-2 border-dashed border-slate-300 rounded-xl p-5 sm:p-6 text-center hover:bg-slate-50 hover:border-teal-400 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.jpg,.jpeg,.png,.docx"
                  onChange={handleFileSelect}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  aria-label="Attach documents to translate"
                />
                <Upload className="w-8 h-8 text-[#173d40] mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">Drag &amp; drop files here or click to browse</p>
                <span className="text-[11px] text-slate-400">
                  PDF, JPG, PNG, DOCX up to {MAX_FILE_MB} MB (256-bit encrypted vault)
                </span>
              </div>

              {uploadedFiles.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {uploadedFiles.map((file, i) => (
                    <li
                      key={`${file.name}-${i}`}
                      className="text-xs font-semibold text-emerald-800 flex items-center gap-2 bg-emerald-50 px-2.5 py-1.5 rounded border border-emerald-200"
                    >
                      <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                      <span className="truncate flex-grow text-left">{file.name}</span>
                      <span className="text-[10px] text-emerald-600 flex-shrink-0">
                        {(file.size / 1024).toFixed(0)} KB
                      </span>
                      <button
                        type="button"
                        onClick={() => removeFile(i)}
                        className="text-emerald-700 hover:text-red-600 transition-colors flex-shrink-0"
                        aria-label={`Remove ${file.name}`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {fileError && (
                <p className="mt-2 text-xs font-semibold text-amber-700 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                  {fileError}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="order-name" className={labelClass}>
                  Your Name *
                </label>
                <input
                  id="order-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Maria Gonzalez"
                  className={inputClass}
                />
              </div>
              <div>
                <label htmlFor="order-email" className={labelClass}>
                  Email Address *
                </label>
                <input
                  id="order-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="name@example.com"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="order-source" className={labelClass}>
                  Source Language
                </label>
                <Select
                  id="order-source"
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                >
                  {/* A language typed into "Other" upstream is not in either
                      list, so it is offered here as its own option. */}
                  {sourceLang && !ALL_LANGUAGE_OPTIONS.some((l) => l.name === sourceLang) && (
                    <option value={sourceLang}>{sourceLang}</option>
                  )}
                  {renderLanguageOptions("m-src")}
                </Select>
              </div>
              <div>
                <label htmlFor="order-target" className={labelClass}>
                  Target Language
                </label>
                <Select
                  id="order-target"
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                >
                  {renderLanguageOptions("m-tgt")}
                </Select>
              </div>
            </div>

            <div>
              {serviceType === "certified" ? (
                <>
                  <label htmlFor="order-pages" className={labelClass}>
                    Page Count (250 words/page)
                  </label>
                  <input
                    id="order-pages"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={PRICING.maxPages}
                    value={pages}
                    onChange={(e) =>
                      setPages(Math.min(PRICING.maxPages, Math.max(1, parseInt(e.target.value, 10) || 1)))
                    }
                    className={`${inputClass} no-spinner text-center font-bold`}
                  />
                </>
              ) : (
                <>
                  <label htmlFor="order-words" className={labelClass}>
                    Total Word Count (${PRICING.standardMinimum.toFixed(2)} minimum)
                  </label>
                  <input
                    id="order-words"
                    type="number"
                    inputMode="numeric"
                    min={50}
                    step={50}
                    value={words}
                    onChange={(e) => setWords(Math.max(0, parseInt(e.target.value, 10) || 0))}
                    className={`${inputClass} no-spinner text-center font-bold`}
                  />
                </>
              )}
            </div>

            {submitError && (
              <p
                role="alert"
                className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2.5 flex items-start gap-2"
              >
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-px" />
                {submitError}
              </p>
            )}

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Total Calculated Cost</span>
                <span className="text-xl font-extrabold text-[#173d40]">
                  ${price.totalAmount.toFixed(2)}
                </span>
                <span className="text-[11px] text-slate-500 block">{price.turnaround}</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#173d40] hover:bg-[#123032] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-xs px-6 py-3 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Placing Order…
                  </>
                ) : (
                  "Confirm & Place Order"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
