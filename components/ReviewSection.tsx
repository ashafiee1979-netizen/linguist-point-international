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
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);

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

  // Load pending reviews for admin
  const loadPendingReviews = async () => {
    try {
      const res = await fetch("/api/reviews/moderate");
      const data = await res.json();
      if (data.success && Array.isArray(data.pending)) {
        setPendingReviews(data.pending);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    loadReviews();
    loadPendingReviews();
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
      loadPendingReviews();
    } catch (err) {
      setVerificationError(err instanceof Error ? err.message : "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModerateAction = async (reviewId: string, action: "approve" | "reject") => {
    try {
      const res = await fetch("/api/reviews/moderate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reviewId, action }),
      });
      const data = await res.json();
      if (data.success) {
        loadPendingReviews();
        loadReviews();
      }
    } catch {
      // ignore
    }
  };

  const fillSampleOrder = (num: string, mail: string) => {
    setOrderNumber(num);
    setClientEmail(mail);
    setVerificationError(null);
    setVerificationInfo(null);
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
        />

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 sm:mb-14">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:bg-white hover:border-[#173d40]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-full bg-teal-100/80 text-[#173d40] font-extrabold text-sm flex items-center justify-center flex-shrink-0 shadow-2xs">
                      {rev.initials}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight truncate">
                        {rev.clientName}
                      </h3>
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded mt-0.5">
                        <ShieldCheck className="w-3 h-3 text-emerald-600" />
                        Verified Order
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#173d40] bg-white border border-slate-200 px-2.5 py-1 rounded-full flex-shrink-0 text-right leading-tight shadow-2xs">
                    {rev.languagePair}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex items-center text-[#f59e0b] mb-2">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {rev.useCase && (
                  <p className="text-xs font-medium text-slate-500 mb-2">
                    Case: <span className="text-slate-700 font-semibold">{rev.useCase}</span>
                  </p>
                )}

                <p className="text-sm sm:text-[15px] text-slate-700 leading-relaxed mb-3">
                  &ldquo;{rev.comments}&rdquo;
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 border-t border-slate-200/80 pt-3 mt-2">
                <span>{rev.location}</span>
                <span>{rev.dateAgo}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Verified Review Card */}
        <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-9 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3.5">
              <div className="w-12 h-12 rounded-full bg-teal-100 text-[#173d40] flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  Completed an Order? Leave a Verified Review
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
                  To eliminate unknown or fake reviews, reviews are unlocked 1 day after final delivery.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => {
                  setShowReviewGate(!showReviewGate);
                  setSubmitSuccess(null);
                }}
                className="w-full sm:w-auto bg-[#173d40] hover:bg-[#123032] text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 flex-shrink-0"
              >
                <Lock className="w-4 h-4" />
                {showReviewGate ? "Close Review Gate" : "Write Verified Review"}
              </button>
            </div>
          </div>

          {/* Admin Moderation Strip button if any pending reviews */}
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setShowAdminModal(true)}
              className="text-xs font-semibold text-slate-500 hover:text-[#173d40] underline underline-offset-4 flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
              Admin Moderation Portal {pendingReviews.length > 0 && `(${pendingReviews.length} pending)`}
            </button>
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

                  {/* Demo test helper */}
                  <div className="bg-slate-100/80 rounded-xl p-3 text-xs text-slate-600 space-y-1.5">
                    <span className="font-bold text-slate-700 block">Try a demo test order:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => fillSampleOrder("LP-2026-8941", "farhad@example.com")}
                        className="bg-white border border-slate-300 hover:border-teal-500 px-2.5 py-1 rounded text-[11px] font-semibold text-slate-800"
                      >
                        LP-2026-8941 (Delivered 3d ago • Eligible)
                      </button>
                      <button
                        type="button"
                        onClick={() => fillSampleOrder("LP-2026-9915", "bilal@example.com")}
                        className="bg-white border border-slate-300 hover:border-amber-500 px-2.5 py-1 rounded text-[11px] font-semibold text-slate-800"
                      >
                        LP-2026-9915 (Delivered 6h ago • Wait 18h)
                      </button>
                      <button
                        type="button"
                        onClick={() => fillSampleOrder("LP-2026-4421", "elena@example.com")}
                        className="bg-white border border-slate-300 hover:border-slate-500 px-2.5 py-1 rounded text-[11px] font-semibold text-slate-800"
                      >
                        LP-2026-4421 (In Translation)
                      </button>
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

        {/* Admin Moderation Modal */}
        {showAdminModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
              <button
                onClick={() => setShowAdminModal(false)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
                aria-label="Close admin modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="pr-8 mb-5">
                <span className="text-xs font-bold text-[#173d40] uppercase tracking-wider">
                  Admin Control Panel
                </span>
                <h3 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  Review Approval &amp; Quality Moderation
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Reviews must be submitted by verified clients and approved by a moderator before publishing to the live wall.
                </p>
              </div>

              {pendingReviews.length === 0 ? (
                <div className="text-center py-10 bg-slate-50 rounded-xl border border-slate-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
                  <p className="text-sm font-bold text-slate-800">All Reviews Up to Date</p>
                  <p className="text-xs text-slate-500 mt-1">
                    There are no pending verified reviews awaiting moderation.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
                  {pendingReviews.map((item) => (
                    <div
                      key={item.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900">{item.clientName}</h4>
                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                              Order #{item.orderNumber}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500">
                            {item.languagePair} • {item.location}
                          </span>
                        </div>
                        <div className="flex items-center text-[#f59e0b]">
                          {[...Array(item.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
                        &ldquo;{item.comments}&rdquo;
                      </p>

                      <div className="flex items-center justify-end gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => handleModerateAction(item.id, "reject")}
                          className="px-3 py-1.5 rounded-lg text-xs font-bold text-red-700 hover:bg-red-50 transition-colors"
                        >
                          Reject
                        </button>
                        <button
                          type="button"
                          onClick={() => handleModerateAction(item.id, "approve")}
                          className="px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve to Live Wall
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
