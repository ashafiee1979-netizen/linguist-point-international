import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta",
});

export const metadata: Metadata = {
  title: "Linguist Point International | Official Certified Document Translation Services",
  description: "Certified document translations from 65+ languages to English. 100% acceptance guaranteed by USCIS, academic institutions, courts, and government agencies. Fast 24-hour turnaround.",
  icons: {
    icon: "/assets/Linguist Point-04.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={plusJakarta.variable}>
      <body className="font-sans antialiased text-slate-800 bg-white">
        {children}
      </body>
    </html>
  );
}
