"use client";

import React, { useState } from "react";
import { X, Upload, CheckCircle2, ShieldAlert } from "lucide-react";
import { POPULAR_LANGUAGES, ALL_LANGUAGES } from "@/lib/languages";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
}

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, initialData }) => {
  if (!isOpen) return null;

  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [sourceLang, setSourceLang] = useState(initialData?.sourceLang || "Spanish");
  const [targetLang, setTargetLang] = useState(initialData?.targetLang || "English");
  const [pages, setPages] = useState(initialData?.pageCount || 1);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const names = Array.from(e.target.files).map((f) => f.name);
      setUploadedFiles([...uploadedFiles, ...names]);
    }
  };

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 3500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-10 space-y-3">
            <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto animate-bounce" />
            <h3 className="text-2xl font-extrabold text-slate-900">Order Received!</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              Your certified translation job has been recorded with reference <strong>LP-{Math.floor(100000 + Math.random() * 900000)}</strong>. A confirmation email has been dispatched.
            </p>
          </div>
        ) : (
          <form onSubmit={handleOrderSubmit} className="space-y-4">
            <div>
              <span className="text-xs font-bold text-[#173d40] uppercase tracking-wider">Fast Checkout</span>
              <h3 className="text-xl font-extrabold text-slate-900">Upload &amp; Confirm Translation</h3>
            </div>

            {/* Document Upload Area */}
            <div className="border-2 border-dashed border-slate-300 rounded-xl p-6 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
              <input
                type="file"
                multiple
                onChange={handleFileDrop}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
              <Upload className="w-8 h-8 text-[#173d40] mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Drag &amp; drop files here or click to browse</p>
              <span className="text-[11px] text-slate-400">PDF, JPG, PNG, DOCX accepted (256-bit encrypted vault)</span>
              
              {uploadedFiles.length > 0 && (
                <div className="mt-3 text-left space-y-1">
                  {uploadedFiles.map((file, i) => (
                    <div key={i} className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                      ✓ {file}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Maria Gonzalez"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs outline-none focus:ring-1 focus:ring-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Source Language</label>
                <select
                  value={sourceLang}
                  onChange={(e) => setSourceLang(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs outline-none font-medium"
                >
                  {ALL_LANGUAGES.map((l) => (
                    <option key={`m-src-${l.code}`} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Target Language</label>
                <select
                  value={targetLang}
                  onChange={(e) => setTargetLang(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-slate-300 text-xs outline-none font-medium"
                >
                  {ALL_LANGUAGES.map((l) => (
                    <option key={`m-tgt-${l.code}`} value={l.name}>{l.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Total Calculated Cost</span>
                <span className="text-xl font-extrabold text-[#173d40]">
                  ${(initialData?.totalAmount || pages * 24.95).toFixed(2)}
                </span>
              </div>
              <button
                type="submit"
                className="bg-[#173d40] hover:bg-[#123032] text-white font-bold text-xs px-6 py-3 rounded-lg transition-colors shadow-sm"
              >
                Confirm &amp; Place Order
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
