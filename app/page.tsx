"use client";

import React, { useState } from "react";
import { Header } from "@/components/Header";
import { LanguageRibbon } from "@/components/LanguageRibbon";
import { HeroCalculator } from "@/components/HeroCalculator";
import { TrustBar } from "@/components/TrustBar";
import { ServicesSection } from "@/components/ServicesSection";
import { HowItWorks } from "@/components/HowItWorks";
import { LanguageLookup } from "@/components/LanguageLookup";
import { IndustriesSection } from "@/components/IndustriesSection";
import { StatutorySection } from "@/components/StatutorySection";
import { EnterpriseHeritage } from "@/components/EnterpriseHeritage";
import { EnterpriseProposal } from "@/components/EnterpriseProposal";
import { ReviewSection } from "@/components/ReviewSection";
import { FaqSection } from "@/components/FaqSection";
import { Footer } from "@/components/Footer";
import { OrderModal } from "@/components/OrderModal";
import type { OrderDraft } from "@/lib/order";
import type { ServiceType } from "@/lib/pricing";

export default function Home() {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [modalInitialData, setModalInitialData] = useState<Partial<OrderDraft> | null>(null);
  // Owned here so the pricing cards can switch the hero calculator's mode.
  const [serviceType, setServiceType] = useState<ServiceType>("certified");

  const handleOpenOrder = (data?: Partial<OrderDraft>) => {
    setModalInitialData(data ?? { serviceType });
    setIsOrderModalOpen(true);
  };

  // The pricing cards both set the calculator's mode and open checkout in it.
  const handleOrderServiceType = (type: ServiceType) => {
    setServiceType(type);
    setModalInitialData({ serviceType: type });
    setIsOrderModalOpen(true);
  };

  return (
    <main className="min-h-screen flex flex-col bg-white">
      {/* 1. Header & Top Announcement */}
      <Header onOpenOrder={() => handleOpenOrder()} />

      {/* 2. Global Languages Ribbon */}
      <LanguageRibbon />

      {/* 3. Hero & Instant Order Calculator */}
      <HeroCalculator
        onOpenOrder={handleOpenOrder}
        serviceType={serviceType}
        onServiceTypeChange={setServiceType}
      />

      {/* 4. Trust Bar */}
      <TrustBar />

      {/* 5. Services & Transparent Pricing */}
      <ServicesSection onOpenOrder={handleOrderServiceType} />

      {/* 6. How It Works (3 Steps) */}
      <HowItWorks onOpenOrder={() => handleOpenOrder()} />

      {/* 7. Language Availability Lookup */}
      <LanguageLookup onOpenOrder={handleOpenOrder} />

      {/* 8. Specialized Industry Solutions */}
      <IndustriesSection onOpenOrder={() => handleOpenOrder()} />

      {/* 9. ATA Accreditation & Statutory Recognition */}
      <StatutorySection onOpenOrder={() => handleOpenOrder()} />

      {/* 10. Enterprise Multilateral Heritage (PUL & Key Logos) */}
      <EnterpriseHeritage />

      {/* 11. Enterprise RFP & Volume Proposal */}
      <EnterpriseProposal />

      {/* 12. Client Feedback & Interactive Review Form */}
      <ReviewSection />

      {/* 13. Comprehensive Accordion FAQ */}
      <FaqSection onOpenOrder={() => handleOpenOrder()} />

      {/* 14. Conversion Strip */}
      <section className="py-16 sm:py-20 text-center text-white bg-gradient-to-br from-[#0f172a] via-[#173d40] to-[#1e293b]">
        <div className="max-w-4xl mx-auto px-4 space-y-5">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
            Ready to Translate Your Documents Today?
          </h2>
          <p className="text-sm sm:text-base text-teal-100/90 max-w-2xl mx-auto">
            Experience the fastest, most reliable certified document translation service. 100% acceptance guaranteed or your money back.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-1">
            <button
              onClick={() => handleOpenOrder()}
              className="bg-[#f59e0b] hover:bg-[#d97706] text-slate-950 font-extrabold px-8 py-3.5 rounded-xl text-sm transition-all shadow-lg active:scale-95"
            >
              Order Certified Translation Now
            </button>
            <a
              href="#enterprise-proposal"
              className="border-2 border-white/40 hover:border-white hover:bg-white/10 text-white font-extrabold px-8 py-3.5 rounded-xl text-sm transition-all flex items-center justify-center"
            >
              Request Enterprise Proposal
            </a>
          </div>
        </div>
      </section>

      {/* 15. Footer */}
      <Footer />

      {/* 16. Interactive Order Modal */}
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        initialData={modalInitialData}
      />
    </main>
  );
}
