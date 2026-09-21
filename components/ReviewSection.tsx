"use client";

import React, { useState } from "react";
import { Star, MessageSquare, Send, CheckCircle2 } from "lucide-react";
import { INITIAL_REVIEWS, ReviewMock } from "@/lib/mock-data";
import { inputClass, labelClass, textareaClass } from "@/lib/ui";
import {
  SectionHeading,
  SECTION_PADDING,
  SECTION_FOOTNOTE_GAP,
} from "@/components/ui/SectionHeading";

export const ReviewSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewMock[]>(INITIAL_REVIEWS);
  const [showForm, setShowForm] = useState<boolean>(false);
  
  // Form State
  const [name, setName] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [languagePair, setLanguagePair] = useState<string>("");
  const [useCase, setUseCase] = useState<string>("");
  const [rating, setRating] = useState<number>(5);
  const [comments, setComments] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !comments) return;

    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase() || "VC";

    const newReview: ReviewMock = {
      id: `rev-${Date.now()}`,
      clientName: name,
      initials,
      location: location || "United States",
      languagePair: languagePair || "Certified Translation",
      useCase: useCase || "Official Regulatory Submission",
      rating,
      comments,
      dateAgo: "Just now",
    };

    setReviews([newReview, ...reviews]);
    setIsSubmitted(true);
    setName("");
    setLocation("");
    setLanguagePair("");
    setUseCase("");
    setComments("");

    setTimeout(() => {
      setShowForm(false);
      setIsSubmitted(false);
    }, 3500);
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
          description="Read verified feedback from immigration attorneys, academic evaluators, and individuals across 65+ language pairs."
        />

        {/* 6 Compact Review Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10 sm:mb-12">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:bg-white hover:border-teal-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-teal-100 text-[#173d40] font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                      {rev.initials}
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 leading-tight truncate">{rev.clientName}</h3>
                      <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                        ✓ Verified Order
                      </span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-[#173d40] bg-white border border-slate-200 px-2 py-0.5 rounded-full flex-shrink-0 text-right leading-tight">
                    {rev.languagePair}
                  </span>
                </div>

                {/* Stars */}
                <div className="flex items-center text-[#f59e0b] mb-1.5">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>

                <p className="text-xs text-slate-600 line-clamp-4 leading-relaxed mb-2">
                  "{rev.comments}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-200/60 pt-2 mt-1">
                <span>{rev.location}</span>
                <span>{rev.dateAgo}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Interactive Leave a Review Card */}
        <div className="max-w-3xl mx-auto bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-[#173d40] flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Have You Used Our Services? Leave a Review</h3>
                <p className="text-xs text-slate-500">Share your translation experience with future clients and help us maintain excellence.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowForm(!showForm)}
              className="w-full sm:w-auto bg-[#173d40] hover:bg-[#123032] text-white font-bold text-xs px-4 py-2.5 rounded-lg transition-colors flex-shrink-0"
            >
              {showForm ? "Close Form" : "Write Review"}
            </button>
          </div>

          {/* Form Content */}
          {showForm && (
            <form onSubmit={handleSubmit} className="mt-6 pt-6 border-t border-slate-200 space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Your Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maria Gonzalez"
                    className={inputClass}
                  />
                </div>
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Language Pair Translated *</label>
                  <input
                    type="text"
                    required
                    value={languagePair}
                    onChange={(e) => setLanguagePair(e.target.value)}
                    placeholder="e.g. Spanish to English"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Purpose / Case Type</label>
                  <input
                    type="text"
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    placeholder="e.g. USCIS I-485 / Academic Credential"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className={labelClass}>Your Rating *</label>
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
                  <span className="text-xs font-bold text-emerald-700 ml-2">
                    {ratingDescriptions[rating]}
                  </span>
                </div>
              </div>

              <div>
                <label className={labelClass}>Your Review / Comments *</label>
                <textarea
                  required
                  rows={3}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  placeholder="Describe your experience regarding accuracy, delivery speed, formatting, or certification acceptance..."
                  className={textareaClass}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <button
                  type="submit"
                  className="bg-[#173d40] hover:bg-[#123032] text-white font-bold text-xs px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <Send className="w-3.5 h-3.5" /> Submit Review
                </button>
                {isSubmitted && (
                  <span role="status" className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> Thank you! Your review has been added above.
                  </span>
                )}
              </div>
            </form>
          )}
        </div>

      </div>
    </section>
  );
};
