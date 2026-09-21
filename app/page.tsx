"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { LanguageRibbon } from "@/components/LanguageRibbon";
import { HeroCalculator } from "@/components/HeroCalculator";
import { StatutorySection } from "@/components/StatutorySection";
import { EnterpriseHeritage } from "@/components/EnterpriseHeritage";
import { ReviewSection } from "@/components/ReviewSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { OrderModal } from "@/components/OrderModal";

export default function Home() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<any>(null);

  const handleOpenOrder = (data?: any) => {
    setModalInitialData(data || null);
    setIsOrderModalOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* 1. Header & Top Announcement */}
      <Header onOpenOrder={() => handleOpenOrder()} />

      {/* 2. Global Languages Ribbon */}
      <LanguageRibbon />

      {/* 3. Hero & Instant Order Calculator */}
      <HeroCalculator onOpenOrder={handleOpenOrder} />

      {/* 4. Statutory & Regulatory Recognition (10 Executive Cards) */}
      <StatutorySection onOpenOrder={() => handleOpenOrder()} />

      {/* 5. Enterprise Multilateral Heritage (PUL & Key Logos) */}
      <EnterpriseHeritage />

      {/* 6. Client Feedback & Interactive Review Form */}
      <ReviewSection />

      {/* 7. Comprehensive Accordion FAQ */}
      <FaqSection />

      {/* 8. Conversion Strip */}
      <section className="bg-[#173d40] text-white py-12 text-center">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Ready to Translate Your Official Documents?
          </h3>
          <p className="text-sm text-teal-100 max-w-xl mx-auto">
            Join over 5,000 satisfied individuals, law firms, and institutions. Get your official certified translation delivered within 24 hours.
          </p>
          <button
            onClick={() => handleOpenOrder()}
            className="bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-extrabold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-95"
          >
            Start Order Now
          </button>
        </div>
      </section>

      {/* 9. Footer */}
      <Footer />

      {/* 10. Interactive Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialData={modalInitialData}
      />
    </main>
  );
}
