import React from "react";
import { Phone, Mail, ShieldCheck } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold text-base tracking-tight">LINGUIST POINT INTERNATIONAL</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Official, accredited certified document translations engineered for 100% acceptance by USCIS, academic evaluators, and state/federal judicial courts across 65+ languages.
            </p>
            <div className="text-[11px] text-slate-500">
              Corporate Member: <strong>American Translators Association (ATA #274819)</strong>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Translation Services</h4>
            <ul className="space-y-2">
              <li><a href="#order" className="hover:text-white transition-colors">USCIS Certified Translation</a></li>
              <li><a href="#order" className="hover:text-white transition-colors">Notarized Legal Translation</a></li>
              <li><a href="#order" className="hover:text-white transition-colors">Academic Credential Evaluation</a></li>
              <li><a href="#order" className="hover:text-white transition-colors">Medical &amp; Hospital Records</a></li>
              <li><a href="#order" className="hover:text-white transition-colors">Business &amp; Commercial Contracts</a></li>
            </ul>
          </div>

          {/* Parent Heritage */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Enterprise Heritage</h4>
            <ul className="space-y-2">
              <li><a href="#heritage" className="hover:text-white transition-colors">PUL Global Partners</a></li>
              <li><a href="#heritage" className="hover:text-white transition-colors">PUL Consulting Services</a></li>
              <li><a href="#heritage" className="hover:text-white transition-colors">United Nations (UN) Missions</a></li>
              <li><a href="#heritage" className="hover:text-white transition-colors">The World Bank Documentation</a></li>
              <li><a href="#heritage" className="hover:text-white transition-colors">Asian Development Bank (ADB)</a></li>
            </ul>
          </div>

          {/* Contact Support */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Direct Contact</h4>
            <div className="space-y-2">
              <p className="flex items-center gap-2 text-white">
                <Phone className="w-3.5 h-3.5 text-[#f59e0b]" />
                +1 (800) 770-2305
              </p>
              <p className="flex items-center gap-2 text-white">
                <Mail className="w-3.5 h-3.5 text-[#f59e0b]" />
                support@linguistpoint.com
              </p>
              <p className="text-slate-500 text-[11px] pt-2">
                Customer Support available Monday – Saturday, 8:00 AM – 8:00 PM EST.
              </p>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            &copy; {new Date().getFullYear()} Linguist Point International. All Rights Reserved. Backed by PUL Global Partners.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>Privacy Policy (HIPAA / GDPR)</span>
            <span>•</span>
            <span>Terms of Service</span>
            <span>•</span>
            <span>USCIS Acceptance Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
