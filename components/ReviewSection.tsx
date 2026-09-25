"use client";

import React, { useEffect, useState } from "react";
import {
  Star,
  MessageSquare,
  Send,
  CheckCircle2,
  ShieldCheck,
  Clock,
  AlertCircle,
  Loader2,
  Lock,
  ThumbsUp,
  Check,
  X,
} from "lucide-react";
import { INITIAL_REVIEWS, ReviewMock } from "@/lib/mock-data";
import { inputClass, labelClass, textareaClass } from "@/lib/ui";
import {
  SectionHeading,
  SECTION_PADDING,
  SECTION_FOOTNOTE_GAP,
} from "@/components/ui/SectionHeading";

interface PendingReview {
  id: string;
  orderNumber?: string;
  clientName: string;
  initials: string;
  location: string;
  languagePair: string;
  useCase: string;
  rating: number;
  comments: string;
  dateAgo: string;
  isVerified?: boolean;
  isApproved?: boolean;
}

export const ReviewSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewMock[]>(INITIAL_REVIEWS);
  const [showReviewGate, setShowReviewGate] = useState(false);

  // Step 1: Verification Form State
  const [orderNumber, setOrderNumber] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [verificationInfo, setVerificationInfo] = useState<string | null>(null);
  const [verifiedOrder, setVerifiedOrder] = useState<{
    orderNumber: string;
    clientName: string;
    clientEmail: string;
    languagePair: string;
    serviceType: string;
    status: string;
  } | null>(null);

  // Step 2: Review Form State (unlocked after verification)
  const [location, setLocation] = useState("");
  const [useCase, setUseCase] = useState("Official USCIS & Regulatory Submission");
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  // Load approved reviews from API
  const loadReviews = async () => {
    try {
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (data.success && Array.isArray(data.reviews)) {
        setReviews(data.reviews);
      }
    } catch {
      // Fallback to initial reviews
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const handleVerifyOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber || !clientEmail) return;

    setIsVerifying(true);
    setVerificationError(null);
    setVerificationInfo(null);
    setVerifiedOrder(null);

    try {
      const res = await fetch("/api/reviews/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, clientEmail }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Could not verify order.");
      }

      if (!data.eligible) {
        if (data.reason === "too_recent") {
          setVerificationInfo(
            data.message ||
              "Order was delivered recently. To ensure you have inspected your translations, reviews unlock 24 hours after delivery."
          );
        } else if (data.reason === "in_progress") {
          setVerificationInfo(
            data.message ||
              "Your order is currently in progress. Reviews unlock 24 hours after final translation delivery."
          );
        } else {
          setVerificationError(data.message || "Order is not eligible for review.");
        }
        return;
      }

      setVerifiedOrder(data.order);
      setVerificationError(null);
      setVerificationInfo(null);
    } catch (err) {
      setVerificationError(err instanceof Error ? err.message : "Error verifying order.");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleSubmitVerifiedReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifiedOrder || !comments || comments.length < 10) return;

    setIsSubmitting(true);
    setVerificationError(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: verifiedOrder.orderNumber,
          clientEmail: verifiedOrder.clientEmail,
          clientName: verifiedOrder.clientName,
          location: location || "United States",
          languagePair: verifiedOrder.languagePair,
          useCase,
          rating,
          comments,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review.");
      }

      setSubmitSuccess(
        `Thank you ${verifiedOrder.clientName}! Your verified review for Order #${verifiedOrder.orderNumber} has been received and submitted for QA moderation. Once approved, it will appear on our verified reviews wall.`
      );
      setComments("");
      setVerifiedOrder(null);
      setOrderNumber("");
      setClientEmail("");
    } catch (err) {
      setVerificationError(err instanceof Error ? err.message : "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ratingDescriptions: Record<number, string> = {
    5: "5.0 / 5.0 (Excellent)",
    4: "4.0 / 5.0 (Very Good)",
    3: "3.0 / 5.0 (Good)",
    2: "2.0 / 5.0 (Fair)",
    1: "1.0 / 5.0 (Poor)",
  };

  return (
    <section className={`${SECTION_PADDING} bg-white border-b border-slate-200`} id="reviews">
      <div className="max-w-7xl mx-auto px-4">
        
        <SectionHeading
          eyebrow="Verified Client Feedback"
          title="Trusted by 5,000+ Clients Worldwide"
          description="Read verified feedback from immigration attorneys, academic evaluators, and corporate clients across 65+ language pairs."
          className="mb-6 sm:mb-8"
        />

        {/* Reviews Grid - Beautifully organized, compact, 3 columns x 2 rows */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4 mb-6 sm:mb-8">
          {reviews.slice(0, 6).map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 sm:p-4 flex flex-col justify-between hover:bg-white hover:border-[#173d40]/40 hover:shadow-md transition-all duration-200"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-teal-100 text-[#173d40] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                      {rev.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                        {rev.clientName}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded leading-none mt-0.5">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                        Verified Order
                      </span>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-[#173d40] bg-white border border-slate-200 px-2 py-0.5 rounded-full flex-shrink-0 text-right leading-tight shadow-2xs">
                    {rev.languagePair}
                  </span>
                </div>

                {/* Rating & Case */}
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center text-[#f59e0b]">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  {rev.useCase && (
                    <span className="text-[11px] font-medium text-slate-500 truncate max-w-[170px]" title={rev.useCase}>
                      {rev.useCase}
                    </span>
                  )}
                </div>

                <p className="text-xs sm:text-[13px] text-slate-700 leading-snug line-clamp-3 italic mb-1">
                  &ldquo;{rev.comments}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/70 pt-2 mt-2">
                <span>{rev.location}</span>
                <span>{rev.dateAgo}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Compact Interactive Verified Review Card */}
        <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5 shadow-2xs">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3.5">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-teal-100 text-[#173d40] flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">
                  Completed an Order? Leave a Verified Review
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Verified reviews unlock 1 day after final delivery via your order code.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  setShowReviewGate(!showReviewGate);
                  setSubmitSuccess(null);
                }}
                className="w-full sm:w-auto bg-[#173d40] hover:bg-[#123032] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-all shadow-2xs flex items-center justify-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                {showReviewGate ? "Close Review Gate" : "Write Verified Review"}
              </button>
            </div>
          </div>

          {/* Review Gate Content */}
          {showReviewGate && (
            <div className="mt-6 pt-6 border-t border-slate-200 animate-fade-in space-y-6">
              {submitSuccess ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                  <h4 className="text-base sm:text-lg font-bold text-emerald-900">
                    Review Submitted for Quality Approval
                  </h4>
                  <p className="text-sm text-emerald-800 max-w-lg mx-auto leading-relaxed">
                    {submitSuccess}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitSuccess(null);
                      setShowReviewGate(false);
                    }}
                    className="mt-2 bg-[#173d40] text-white font-bold text-xs px-5 py-2.5 rounded-lg"
                  >
                    Done
                  </button>
                </div>
              ) : !verifiedOrder ? (
                /* Step 1: Order Verification */
                <form onSubmit={handleVerifyOrder} className="space-y-4">
                  <div className="bg-teal-50/70 border border-teal-200 rounded-xl p-4">
                    <span className="text-xs font-extrabold text-[#173d40] uppercase tracking-wider block mb-1">
                      Step 1: Order Verification &amp; Security
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      Please enter your <strong>Order Number</strong> and <strong>Email Address</strong>. Review access unlocks exactly <strong>24 hours (1 day) after final delivery</strong> so you have sufficient time to inspect your completed translation.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>Order Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. LP-2026-8941"
                        value={orderNumber}
                        onChange={(e) => setOrderNumber(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Billing Email *</label>
                      <input
                        type="email"
                        required
                        placeholder="name@example.com"
                        value={clientEmail}
                        onChange={(e) => setClientEmail(e.target.value)}
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {verificationError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm text-red-700">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{verificationError}</span>
                    </div>
                  )}

                  {verificationInfo && (
                    <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs sm:text-sm text-amber-800">
                      <Clock className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-600" />
                      <span>{verificationInfo}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isVerifying}
                    className="w-full sm:w-auto bg-[#173d40] hover:bg-[#123032] disabled:opacity-60 text-white font-extrabold text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Verifying Order…
                      </>
                    ) : (
                      "Verify Order & Unlock Review"
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: Review Submission Form (Unlocked for verified order) */
                <form onSubmit={handleSubmitVerifiedReview} className="space-y-4 animate-fade-in">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-emerald-900">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span>
                        Verified Order #{verifiedOrder.orderNumber} • {verifiedOrder.languagePair}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-800 bg-white border border-emerald-200 px-2.5 py-1 rounded-full">
                      Client: {verifiedOrder.clientName}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={labelClass}>City &amp; State / Country</label>
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. Los Angeles, CA"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Purpose / Case Type</label>
                      <input
                        type="text"
                        value={useCase}
                        onChange={(e) => setUseCase(e.target.value)}
                        placeholder="e.g. USCIS I-485 / Academic / Legal"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Rating *</label>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center text-[#f59e0b]">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => setRating(val)}
                            className="p-1 hover:scale-115 transition-transform"
                            aria-label={`Rate ${val} out of 5`}
                            aria-pressed={val === rating}
                          >
                            <Star className={`w-5 h-5 ${val <= rating ? "fill-current" : "text-slate-300"}`} />
                          </button>
                        ))}
                      </div>
                      <span className="text-xs sm:text-sm font-bold text-emerald-800 ml-2">
                        {ratingDescriptions[rating]}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>Your Review / Comments * (min 10 characters)</label>
                    <textarea
                      required
                      rows={3}
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Describe your translation quality, speed, layout accuracy, and certification acceptance..."
                      className={textareaClass}
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting || comments.trim().length < 10}
                      className="bg-[#173d40] hover:bg-[#123032] disabled:opacity-60 text-white font-extrabold text-sm px-6 py-3 rounded-xl transition-all flex items-center justify-center gap-2 w-full sm:w-auto shadow-md"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Submitting Review…
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          Submit Verified Review
                        </>
                      )}
                    </button>
                    <span className="text-xs text-slate-500">
                      Reviews go through QA approval before appearing publicly to prevent spam.
                    </span>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
