import React from "react";
import { ShieldCheck, Clock, Award, Lock } from "lucide-react";
import { IconTile } from "@/components/ui/IconTile";

const TRUST_ITEMS = [
  {
    icon: ShieldCheck,
    title: "USCIS Guaranteed",
    body: "100% acceptance by federal agencies, courts, and universities or full refund.",
  },
  {
    icon: Clock,
    title: "Rapid 24-Hour Delivery",
    body: "Standard documents delivered in 24 hours. 12-Hour Rush option available.",
  },
  {
    icon: Award,
    title: "ATA Corporate Member",
    body: "American Translators Association certified linguists & signed affidavits.",
  },
  {
    icon: Lock,
    title: "Bank-Grade Confidentiality",
    body: "256-bit SSL encryption, strict NDA compliance, and total privacy.",
  },
];

export const TrustBar: React.FC = () => {
  return (
    <section className="bg-[#173d40] text-white border-y border-teal-900">
      <div className="max-w-7xl mx-auto px-4 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 lg:gap-8">
        {TRUST_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.title} className="flex items-start gap-3.5">
              <IconTile icon={Icon} tone="inverse" size="md" />
              <div>
                <h3 className="text-sm font-bold text-white">{item.title}</h3>
                <p className="text-xs text-teal-100/75 leading-relaxed mt-1.5">{item.body}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
