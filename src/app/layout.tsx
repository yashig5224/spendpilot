import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "SpendPilot — Audit Your AI Software Spend",
  description: "Stop overpaying for AI tools. SpendPilot audits your AI subscriptions and finds hidden savings in minutes.",
  openGraph: {
    title: "SpendPilot — Audit Your AI Software Spend",
    description: "Stop overpaying for AI tools. Find hidden savings in minutes.",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SpendPilot — Audit Your AI Software Spend",
    description: "Stop overpaying for AI tools. Find hidden savings in minutes.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-gray-50">
        <Navbar />
        <main>{children}</main>
        <Toaster />
      </body>
    </html>
  );
}
