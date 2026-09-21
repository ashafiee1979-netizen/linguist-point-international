import React from "react";
import { Building2, Globe2 } from "lucide-react";

interface ClientLogo {
  name: string;
  src: string;
  widthClass?: string;
  heightClass?: string;
}

const PARTNER_CLIENTS: ClientLogo[] = [
  { name: "United Nations", src: "/assets/client-un.svg", widthClass: "max-w-[150px]", heightClass: "max-h-[46px]" },
  { name: "USAID", src: "/assets/client-usaid.png", widthClass: "max-w-[150px]", heightClass: "max-h-[46px]" },
  { name: "The World Bank", src: "/assets/client-world-bank.png", widthClass: "max-w-[140px]", heightClass: "max-h-[46px]" },
  { name: "Asian Development Bank", src: "/assets/client-adb.png", widthClass: "max-w-[130px]", heightClass: "max-h-[44px]" },
  { name: "The Asia Foundation", src: "/assets/client-asia-foundation.svg", widthClass: "max-w-[160px]", heightClass: "max-h-[44px]" },
  { name: "Tetra Tech", src: "/assets/client-tetra-tech.png", widthClass: "max-w-[150px]", heightClass: "max-h-[42px]" },
  { name: "DAI", src: "/assets/client-dai.jpg", widthClass: "max-w-[130px]", heightClass: "max-h-[40px]" },
  { name: "Etisalat", src: "/assets/client-etisalat-wide.png", widthClass: "max-w-[145px]", heightClass: "max-h-[42px]" },
];

export const EnterpriseHeritage: React.FC = () => {
  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200" id="heritage">
      <div className="max-w-7xl mx-auto px-4">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#b45309] uppercase tracking-wider bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
            Enterprise Heritage
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 mt-3">
            Backed by Strategic Multilateral Pedigree
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Linguist Point International is backed by the proven track record of <strong>PUL Global Partners</strong> and <strong>PUL Consulting Services</strong>—trusted leaders delivering mission-critical translation and interpretation to premier international institutions.
          </p>
        </div>

        {/* 2 Parent Partner Entities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-5">
            <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center p-2 bg-slate-50 rounded-xl border border-slate-100">
              <img src="/assets/pul-global-partners.png" alt="PUL Global Partners" className="max-h-16 w-auto object-contain" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-[#173d40] bg-teal-50 px-2 py-0.5 rounded">
                Strategic Parent Partner
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-1">PUL Global Partners</h4>
              <p className="text-xs text-slate-600 mt-1">
                Directing international public-sector partnerships, bilateral missions, and complex cross-border translation operations with strict regulatory oversight and NDA compliance.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-5">
            <div className="w-24 h-24 flex-shrink-0 flex items-center justify-center p-2 bg-slate-50 rounded-xl border border-slate-100">
              <img src="/assets/pul-consulting.jpg" alt="PUL Consulting Services" className="max-h-16 w-auto object-contain rounded" />
            </div>
            <div>
              <span className="text-[11px] font-extrabold uppercase text-[#173d40] bg-teal-50 px-2 py-0.5 rounded">
                Strategic Parent Partner
              </span>
              <h4 className="text-base font-bold text-slate-900 mt-1">PUL Consulting Services</h4>
              <p className="text-xs text-slate-600 mt-1">
                Over 14 years of institutional management, capacity building, and mission-critical translation &amp; interpretation for top prime contractors and multilateral entities.
              </p>
            </div>
          </div>
        </div>

        {/* Key Client Logos Showcase (Watermark Hover Bloom) */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
              Key Institutions Served with Enterprise Translation &amp; Interpretation
            </h4>
            <span className="text-[11px] font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
              Hover over logos to view in full color
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {PARTNER_CLIENTS.map((client, idx) => (
              <div
                key={idx}
                className="watermark-box bg-slate-50 hover:bg-white border border-slate-200 hover:border-teal-400 rounded-xl p-4 flex flex-col items-center justify-center min-h-[105px] transition-all cursor-pointer hover:shadow-md"
                title={client.name}
              >
                <div className="h-12 flex items-center justify-center w-full mb-2">
                  <img
                    src={client.src}
                    alt={client.name}
                    className={`watermark-logo ${client.widthClass || "max-w-[140px]"} ${client.heightClass || "max-h-[44px]"} object-contain`}
                  />
                </div>
                <span className="text-[11px] font-bold text-slate-500 text-center leading-tight">
                  {client.name}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
