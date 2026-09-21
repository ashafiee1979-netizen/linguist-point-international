import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Linguist Point International | Official Certified Document Translation Services",
  description: "Certified document translations from 65+ languages to English. 100% acceptance guaranteed by USCIS, academic institutions, courts, and government agencies. Fast 24-hour turnaround.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased text-slate-800 bg-white">
        {children}
      </body>
    </html>
  );
}
