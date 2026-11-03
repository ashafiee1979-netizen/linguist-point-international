"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Star,
  ShieldCheck,
  ArrowLeft,
  Search,
  Filter,
  CheckCircle2,
  Lock,
  MessageSquare,
  Home as HomeIcon,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { OrderModal } from "@/components/OrderModal";
import { ChatConcierge } from "@/components/ChatConcierge";
import { INITIAL_REVIEWS, ReviewMock } from "@/lib/mock-data";
import { SITE } from "@/lib/site";
import type { OrderDraft } from "@/lib/order";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<ReviewMock[]>(INITIAL_REVIEWS);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Partial<OrderDraft> | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");

  useEffect(() => {
    const fetchLiveReviews = async () => {
      try {
        const res = await fetch("/api/reviews");
        const data = await res.json();
        if (data.success && Array.isArray(data.reviews)) {
          setReviews(data.reviews);
        }
      } catch {
        // Fallback to initial mock reviews
      }
    };
    fetchLiveReviews();
  }, []);

  const handleOpenOrder = (data?: Partial<OrderDraft>) => {
    setModalInitialData(data ?? { serviceType: "certified", sourceLang: "", targetLang: "English" });
    setIsOrderModalOpen(true);
  };

  // Filter reviews
  const filteredReviews = reviews.filter((rev) => {
    const matchesSearch =
      searchQuery === "" ||
      rev.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.comments.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.useCase.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rev.languagePair.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesLanguage =
      selectedLanguage === "all" || rev.languagePair.toLowerCase().includes(selectedLanguage.toLowerCase());

    const matchesRating =
      selectedRating === "all" || rev.rating === Number(selectedRating);

    return matchesSearch && matchesLanguage && matchesRating;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-teal-100 selection:text-teal-900">
      <Header onOpenOrder={() => handleOpenOrder()} />

      <main className="flex-1">
        {/* Hero Section */}
        <div className="bg-[#173d40] text-white py-12 sm:py-16 border-b border-teal-800">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-teal-200 mb-4">
              <Link href="/" className="hover:text-white inline-flex items-center gap-1 transition-colors">
                <HomeIcon className="w-3.5 h-3.5" />
                Home
              </Link>
              <span>/</span>
              <span className="text-white font-semibold">Client Reviews</span>
            </div>

            <div className="max-w-3xl">
              <span className="inline-block text-[11px] sm:text-xs font-bold text-amber-300 uppercase tracking-[0.12em] bg-teal-900/60 border border-teal-700/60 px-3 py-1 rounded-full mb-3">
                Verified Client Feedback &amp; Case Studies
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                All Client Reviews &amp; Testimonials
              </h1>
              <p className="text-sm sm:text-base text-teal-100 mt-3 leading-relaxed">
                Explore authentic case studies and client feedback spanning 65+ language pairs and official USCIS, academic, legal, and commercial submissions. Backed by 5,000+ pages translated across institutional engagements by parent entity PUL Consulting Services.
              </p>

              {/* Rating Metric Summary Card */}
              <div className="mt-6 flex flex-wrap items-center gap-4 bg-teal-900/40 border border-teal-700/50 rounded-xl p-4 sm:p-5 backdrop-blur-xs">
                <div className="flex items-center gap-1.5 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-white">{SITE.rating}</span>
                    <span className="text-xs font-semibold text-teal-200">Overall Satisfaction</span>
                  </div>
                  <p className="text-xs text-teal-200/90 mt-0.5">
                    Based on 100+ verified client orders &amp; regulatory case studies
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white border-b border-slate-200 sticky top-0 z-20 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Input */}
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by client name, document type, city, language..."
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#173d40] focus:border-transparent transition-all"
                />
              </div>

              {/* Dropdown Filters */}
              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg pl-3 pr-8 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#173d40] cursor-pointer"
                  >
                    <option value="all">All Languages</option>
                    <option value="Spanish">Spanish</option>
                    <option value="French">French</option>
                    <option value="Arabic">Arabic</option>
                    <option value="Dari">Dari</option>
                    <option value="Pashto">Pashto</option>
                    <option value="Persian">Persian (Farsi)</option>
                    <option value="Russian">Russian</option>
                    <option value="Ukrainian">Ukrainian</option>
                    <option value="German">German</option>
                    <option value="Chinese">Chinese</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Urdu">Urdu</option>
                    <option value="Italian">Italian</option>
                    <option value="Portuguese">Portuguese</option>
                    <option value="Japanese">Japanese</option>
                  </select>
                </div>

                <div className="relative">
                  <select
                    value={selectedRating}
                    onChange={(e) => setSelectedRating(e.target.value)}
                    className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs sm:text-sm font-semibold rounded-lg pl-3 pr-8 py-2 focus:outline-hidden focus:ring-2 focus:ring-[#173d40] cursor-pointer"
                  >
                    <option value="all">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                  </select>
                </div>

                {(searchQuery || selectedLanguage !== "all" || selectedRating !== "all") && (
                  <button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedLanguage("all");
                      setSelectedRating("all");
                    }}
                    className="text-xs text-rose-600 hover:text-rose-800 font-bold px-2 py-1"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="mt-2 text-xs text-slate-500 flex items-center justify-between">
              <span>Showing {filteredReviews.length} of {reviews.length} reviews</span>
              <Link href="/#reviews" className="text-[#173d40] hover:underline font-semibold inline-flex items-center gap-1">
                <ArrowLeft className="w-3 h-3" />
                Back to Home Featured
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Grid */}
        <div className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
          {filteredReviews.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
              <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-900">No matching reviews found</h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Try searching for a different language, document type, or clear your filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedLanguage("all");
                  setSelectedRating("all");
                }}
                className="bg-[#173d40] hover:bg-[#123032] text-white text-xs font-bold px-4 py-2 rounded-lg"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredReviews.map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between hover:border-[#173d40]/40 hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-full bg-teal-100 text-[#173d40] font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs">
                          {rev.initials}
                        </div>
                        <div className="min-w-0">
                          <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight truncate">
                            {rev.clientName}
                          </h3>
                          {rev.isSample ? (
                            <span className="inline-flex items-center gap-1 text-[10px] text-slate-600 font-semibold bg-slate-100 border border-slate-300 px-1.5 py-0.5 rounded leading-none mt-0.5">
                              <ShieldCheck className="w-2.5 h-2.5 text-slate-500" />
                              Representative Case
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-bold bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded leading-none mt-0.5">
                              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600" />
                              Verified Client Order
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="text-[11px] font-bold text-[#173d40] bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full flex-shrink-0 text-right leading-tight shadow-2xs">
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

                    <p className="text-xs sm:text-[13px] text-slate-700 leading-relaxed italic mb-2">
                      &ldquo;{rev.comments}&rdquo;
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 pt-2.5 mt-2">
                    <span>{rev.location}</span>
                    <span>{rev.dateAgo}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialData={modalInitialData ?? undefined}
      />
      <ChatConcierge
        onOpenOrder={(draft) => handleOpenOrder(draft)}
        onSelectLanguage={() => {}}
      />
    </div>
  );
}
