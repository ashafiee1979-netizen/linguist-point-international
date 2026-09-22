"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { X, Upload, CheckCircle2, Loader2, AlertCircle, FileText, Trash2, Clock } from "lucide-react";
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

const ADD_ONS = [
  { key: "rush", label: "12-Hour Priority Rush", fee: PRICING.rushFee },
  { key: "notarized", label: "Notarized Certificate & Seal", fee: PRICING.notarizationFee },
  { key: "hardCopy", label: "Physical Wet-Ink Hard Copy", fee: PRICING.shippingFee },
] as const;

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

  const addOnState: Record<string, [boolean, (value: boolean) => void]> = {
    rush: [isRush, setIsRush],
    notarized: [isNotarized, setIsNotarized],
    hardCopy: [isHardCopy, setIsHardCopy],
  };

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
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-hidden animate-fade-in"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="order-modal-title"
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl relative flex flex-col max-h-[92vh] sm:max-h-[88vh] overflow-hidden animate-modal-in border border-slate-200"
      >
        {/* Pinned Header */}
        <div className="px-5 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between flex-shrink-0 bg-white">
          <div className="flex items-center gap-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200/60">
              Fast Checkout
            </span>
            <h3 id="order-modal-title" className="text-base sm:text-lg font-extrabold text-slate-900">
              {confirmation ? "Order Confirmation" : "Upload & Place Translation Order"}
            </h3>
          </div>
          <button
            ref={closeButtonRef}
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
            aria-label="Close order form"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {confirmation ? (
          <div className="p-6 sm:p-8 text-center space-y-3 overflow-y-auto flex-1 flex flex-col justify-center items-center">
            <CheckCircle2 className="w-14 h-14 sm:w-16 sm:h-16 text-emerald-600 mx-auto" />
            <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900">
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
              className="mt-3 bg-[#173d40] hover:bg-[#123032] text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg transition-colors shadow-sm"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleOrderSubmit} className="flex flex-col flex-1 min-h-0 overflow-hidden">
            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-3.5">
              {/* Service type segmented switcher */}
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
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        active ? "bg-white text-[#173d40] shadow-xs" : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {option.label}{" "}
                      <span className={active ? "text-teal-700 font-semibold" : "text-slate-400"}>({option.price})</span>
                    </button>
                  );
                })}
              </div>

              {/* Document Upload Area - compact */}
              <div>
                <div className="border border-dashed border-teal-300 bg-teal-50/20 hover:bg-teal-50/60 rounded-xl px-4 py-3 text-center transition-colors cursor-pointer relative group">
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.docx"
                    onChange={handleFileSelect}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    aria-label="Attach documents to translate"
                  />
                  <div className="flex items-center justify-center gap-2.5 text-xs text-slate-700">
                    <Upload className="w-4 h-4 text-[#173d40] flex-shrink-0 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-[#173d40]">Drag &amp; drop files</span>
                    <span className="text-slate-400">or click to browse (PDF, JPG, PNG, DOCX up to {MAX_FILE_MB}MB)</span>
                  </div>
                </div>

                {uploadedFiles.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {uploadedFiles.map((file, i) => (
                      <li
                        key={`${file.name}-${i}`}
                        className="text-xs font-semibold text-emerald-800 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200"
                      >
                        <FileText className="w-3.5 h-3.5 flex-shrink-0" />
                        <span className="truncate max-w-[180px]">{file.name}</span>
                        <span className="text-[10px] text-emerald-600">
                          ({(file.size / 1024).toFixed(0)} KB)
                        </span>
                        <button
                          type="button"
                          onClick={() => removeFile(i)}
                          className="text-emerald-700 hover:text-red-600 transition-colors ml-0.5"
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

              {/* Name & Email in 2 columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="order-name" className="block text-xs font-bold text-slate-700 mb-1">
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
                    className={`${inputClass} text-xs sm:text-sm py-2`}
                  />
                </div>
                <div>
                  <label htmlFor="order-email" className="block text-xs font-bold text-slate-700 mb-1">
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
                    className={`${inputClass} text-xs sm:text-sm py-2`}
                  />
                </div>
              </div>

              {/* Languages & Page Count in 3 columns on sm screens */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <div>
                  <label htmlFor="order-source" className="block text-xs font-bold text-slate-700 mb-1">
                    Source Language
                  </label>
                  <Select
                    id="order-source"
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    className="text-xs sm:text-sm py-2"
                  >
                    {sourceLang && !ALL_LANGUAGE_OPTIONS.some((l) => l.name === sourceLang) && (
                      <option value={sourceLang}>{sourceLang}</option>
                    )}
                    {renderLanguageOptions("m-src")}
                  </Select>
                </div>
                <div>
                  <label htmlFor="order-target" className="block text-xs font-bold text-slate-700 mb-1">
                    Target Language
                  </label>
                  <Select
                    id="order-target"
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    className="text-xs sm:text-sm py-2"
                  >
                    {renderLanguageOptions("m-tgt")}
                  </Select>
                </div>
                <div>
                  {serviceType === "certified" ? (
                    <>
                      <label htmlFor="order-pages" className="block text-xs font-bold text-slate-700 mb-1">
                        Pages (250 wds/pg)
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
                        className={`${inputClass} no-spinner text-center font-bold text-xs sm:text-sm py-2`}
                      />
                    </>
                  ) : (
                    <>
                      <label htmlFor="order-words" className="block text-xs font-bold text-slate-700 mb-1">
                        Words (${PRICING.standardMinimum.toFixed(0)} min)
                      </label>
                      <input
                        id="order-words"
                        type="number"
                        inputMode="numeric"
                        min={50}
                        step={50}
                        value={words}
                        onChange={(e) => setWords(Math.max(0, parseInt(e.target.value, 10) || 0))}
                        className={`${inputClass} no-spinner text-center font-bold text-xs sm:text-sm py-2`}
                      />
                    </>
                  )}
                </div>
              </div>

              {/* Optional Services in a responsive 3-column card grid */}
              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  Optional Services &amp; Expedited Delivery
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {ADD_ONS.map((addOn) => {
                    const [checked, setChecked] = addOnState[addOn.key];
                    return (
                      <label
                        key={addOn.key}
                        className={`flex flex-col justify-between p-2.5 rounded-xl border cursor-pointer transition-colors ${
                          checked
                            ? "border-teal-500 bg-teal-50/70 shadow-2xs"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <span className="flex items-start gap-2">
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) => setChecked(e.target.checked)}
                            className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 accent-[#173d40] rounded"
                          />
                          <span className="font-semibold text-slate-800 text-xs leading-snug">
                            {addOn.label}
                          </span>
                        </span>
                        <span className="text-[11px] font-extrabold text-teal-800 mt-2 text-right">
                          +${addOn.fee.toFixed(2)}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {submitError && (
                <p
                  role="alert"
                  className="text-xs font-semibold text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 flex items-start gap-2"
                >
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-px" />
                  {submitError}
                </p>
              )}
            </div>

            {/* Pinned Sticky Footer */}
            <div className="px-5 sm:px-6 py-3 bg-slate-50 border-t border-slate-200 flex-shrink-0 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider leading-none">
                    Total Cost
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-[#173d40] leading-tight">
                    ${price.totalAmount.toFixed(2)}
                  </span>
                </div>
                <div className="hidden sm:block text-[11px] text-slate-500 border-l border-slate-200 pl-3 leading-snug">
                  <div>
                    Base: <strong className="text-slate-700">${price.basePrice.toFixed(2)}</strong>
                    {price.addOnsPrice > 0 && (
                      <span className="text-teal-700"> • Add-ons: +${price.addOnsPrice.toFixed(2)}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-slate-700 font-semibold mt-0.5">
                    <Clock className="w-3 h-3 text-[#173d40]" />
                    <span>Est: {price.turnaround}</span>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#173d40] hover:bg-[#123032] disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm px-6 py-2.5 sm:py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 flex-shrink-0 active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
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
