import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Providers } from "@/providers/providers";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MediProofDocs - Online Medical Certificate | Apply, Verify & Download",
  description: "Get authentic medical certificates online from registered Indian doctors. Apply for sick leave, fitness, work from home, fit-to-fly certificates. Quick digital delivery in 30 minutes. NMC compliant.",
  keywords: "medical certificate, online medical certificate, sick leave certificate, fitness certificate, doctor certificate, medical certificate verification, work from home certificate, fit to fly certificate, digital medical certificate, online doctor consultation, medical certificate India, NMC compliant certificate",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${inter.variable} font-[family-name:var(--font-inter)] antialiased bg-neubg text-neutext`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
