import React from "react";
import { CheckCircle2 } from "lucide-react";

export const PaymentLogos: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`pt-2 border-t border-slate-100 flex flex-col items-center gap-1.5 ${className}`}>
      {/* Logos Row - Aligned, Professional & Prominent */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap" aria-label="Accepted payment methods">
        {/* Visa */}
        <div className="h-6 w-11 rounded-md border border-slate-200 bg-white shadow-2xs flex items-center justify-center px-1.5 py-0.5" title="Visa">
          <svg className="h-3.5 w-auto" viewBox="0 0 48 16" fill="none">
            <path
              d="M19.34 0.6L12.68 15.4H8.34L5.08 3.68C4.88 2.9 4.7 2.62 4.1 2.3C3.12 1.78 1.46 1.3 0 0.98L0.1 0.6H7.1C8 0.6 8.78 1.2 8.98 2.22L10.7 10.74L15.02 0.6H19.34ZM36.26 10.56C36.28 6.54 30.56 6.32 30.6 4.54C30.62 4 31.1 3.42 32.26 3.26C32.84 3.18 34.42 3.12 36.3 3.98L37.04 0.74C36.02 0.38 34.72 0.04 33.06 0.04C29.02 0.04 26.16 2.14 26.14 5.16C26.1 7.38 28.16 8.62 29.7 9.36C31.28 10.12 31.82 10.6 31.8 11.28C31.78 12.32 30.54 12.78 29.38 12.8C27.34 12.82 26.14 12.24 25.18 11.8L24.42 15.14C25.38 15.56 27.16 15.94 29 15.96C33.26 15.96 36.24 13.88 36.26 10.56ZM47.02 15.4H50.8L47.5 0.6H43.98C43.08 0.6 42.34 1.12 42.02 1.88L35.9 15.4H40.24L41.1 13.06H46.42L47.02 15.4ZM42.3 9.84L44.48 3.84L45.74 9.84H42.3ZM25.04 0.6L21.66 15.4H17.58L20.96 0.6H25.04Z"
              fill="#1434CB"
            />
          </svg>
        </div>

        {/* Mastercard */}
        <div className="h-6 w-11 rounded-md border border-slate-200 bg-white shadow-2xs flex items-center justify-center px-1.5 py-0.5" title="Mastercard">
          <svg className="h-4 w-auto" viewBox="0 0 32 20" fill="none">
            <circle cx="10" cy="10" r="10" fill="#EB001B" />
            <circle cx="22" cy="10" r="10" fill="#F79E1B" fillOpacity="0.9" />
            <path
              d="M16 3.12A10 10 0 0 1 19.8 10A10 10 0 0 1 16 16.88A10 10 0 0 1 12.2 10A10 10 0 0 1 16 3.12Z"
              fill="#FF5F00"
            />
          </svg>
        </div>

        {/* PayPal */}
        <div className="h-6 w-11 rounded-md border border-slate-200 bg-white shadow-2xs flex items-center justify-center px-1.5 py-0.5" title="PayPal">
          <svg className="h-4 w-auto" viewBox="0 0 32 24" fill="none">
            <path
              d="M12.4 20.8L14.6 6.8C14.7 6.1 15.3 5.6 16 5.6H21.2C24.1 5.6 25.8 7 25.4 9.9C24.9 13.1 22.8 14.8 19.8 14.8H17.3L16.2 21.8C16.1 22.3 15.7 22.6 15.2 22.6H12.8C12.3 22.6 12 22.1 12.1 21.6L12.4 20.8Z"
              fill="#003087"
            />
            <path
              d="M10.2 23.2L12.4 9.2C12.5 8.5 13.1 8 13.8 8H19C21.9 8 23.6 9.4 23.2 12.3C22.7 15.5 20.6 17.2 17.6 17.2H15.1L14 24.2C13.9 24.7 13.5 25 13 25H10.6C10.1 25 9.8 24.5 9.9 24L10.2 23.2Z"
              fill="#0079C1"
              fillOpacity="0.85"
            />
          </svg>
        </div>

        {/* Apple Pay */}
        <div className="h-6 w-11 rounded-md border border-slate-200 bg-white shadow-2xs flex items-center justify-center px-1 py-0.5" title="Apple Pay">
          <svg className="h-4 w-auto" viewBox="0 0 50 20" fill="currentColor">
            <path d="M7.4 7.2c-.6.7-1.5 1.3-2.5 1.2-.1-1 .3-2 1-2.6.6-.7 1.6-1.2 2.5-1.2.1 1-.4 2-1 2.6zm2.4 3.7c-.1-.1-1.9-1.1-1.9-3.2 0-2.5 2-3.7 2.1-3.8-1.2-1.7-3-1.9-3.6-2-1.6-.2-3.1 1-3.9 1s-2.1-1-3.4-1c-1.8 0-3.4 1-4.3 2.6-1.9 3.2-.5 8 1.3 10.7.9 1.3 2 2.7 3.4 2.7s1.9-.9 3.4-.9 2 .9 3.4.9c1.5 0 2.4-1.3 3.3-2.6 1-1.5 1.5-3 1.5-3.1-.1 0-1.8-.7-1.9-1.3z" />
            <path d="M19.5 5.5h3.9c1.9 0 3.3 1.3 3.3 3.2 0 1.9-1.4 3.2-3.3 3.2h-2.1v3.6h-1.8V5.5zm1.8 4.9h1.9c1 0 1.7-.7 1.7-1.7s-.7-1.7-1.7-1.7h-1.9v3.4zm14.3 2.1c0-2-1.5-3.1-3.7-3.1-1.8 0-3.2.9-3.5 2.1h1.7c.3-.6.9-1 1.8-1 1.1 0 1.8.5 1.8 1.4v.6c-.6-.1-1.4-.2-2.3-.2-2.2 0-3.6.9-3.6 2.5 0 1.5 1.2 2.4 2.8 2.4 1.3 0 2.2-.6 2.7-1.4v1.3h1.7v-4.1zm-1.8 2.1c0 .8-.7 1.4-1.7 1.4-.8 0-1.4-.4-1.4-1.1 0-.8.6-1.2 1.8-1.2.5 0 1 .1 1.3.2v.7zm7.5-4.2l-2.4 6.7h-1.9l.9-2.3-2.5-6.5h1.9l1.5 4.4 1.5-4.4h1.9l-2.4 6.8c-.3.9-.7 1.2-1.6 1.2h-.7v-1.4h.4c.4 0 .6-.1.8-.6l.1-.3z" />
          </svg>
        </div>

        {/* Stripe Badge */}
        <div className="h-6 w-11 rounded-md border border-slate-200 bg-white shadow-2xs flex items-center justify-center px-1.5 py-0.5" title="Stripe Secure Gateway">
          <svg className="h-3.5 w-auto text-[#635BFF]" viewBox="0 0 60 25" fill="currentColor">
            <path d="M59.64 14.28c0-4.48-2.18-7.98-6.42-7.98-4.26 0-6.85 3.5-6.85 7.94 0 5.27 3.09 7.9 7.42 7.9 2.1 0 3.7-.48 4.9-1.18v-3.32c-1.2.62-2.58.94-4.14.94-1.7 0-3.18-.62-3.38-2.4h8.4c.04-.3.07-.66.07-.88zm-8.4-1.6c0-1.62.98-2.3 2.06-2.3 1.06 0 1.98.68 1.98 2.3h-4.04zm-8.1-6.38c-1.42 0-2.38.68-2.88 1.18l-.2-1h-4.34v19.46l4.68-.98.02-4.72c.5.42 1.34 1 2.66 1 2.8 0 5.6-2.28 5.6-7.44-.02-4.9-2.76-7.5-5.54-7.5zm-1.28 10.96c-.92 0-1.52-.36-1.92-.78l-.02-5.46c.42-.46 1.04-.8 1.94-.8 1.5 0 2.5 1.44 2.5 3.54 0 2.06-.98 3.5-2.5 3.5zm-12.78-8.24h-4.66v12.76h4.66V9.02zm0-2.62h-4.66v-3.7l4.66-.98v4.68zm-7.66 4.74c-.58-.3-1.6-.62-2.7-.62-1.92 0-3.16 1-3.16 2.7 0 3.06 4.22 2.56 4.22 5.24 0 .9-.74 1.44-1.84 1.44-1.32 0-2.72-.56-3.7-1.18l-.82 3.32c1.08.56 2.72.9 4.34.9 2.8 0 4.78-1.38 4.78-3.26 0-3.3-4.24-2.72-4.24-5.26 0-.74.62-1.24 1.62-1.24.98 0 2.22.38 3.08.84l.42-2.88z" />
          </svg>
        </div>
      </div>

      {/* Security & Reassurance Tagline */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 font-medium text-center">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
        <span className="leading-tight">Safe Checkout Powered by Stripe • Pay only upon confirmation</span>
      </div>
    </div>
  );
};
