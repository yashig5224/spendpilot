"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 pt-4">
        <motion.nav
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white/95 px-6 py-3.5 shadow-[0_2px_16px_rgba(0,0,0,0.06)] backdrop-blur-xl"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-600 shadow-sm transition-transform group-hover:scale-105">
              <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-display text-[15px] font-700 tracking-tight text-gray-900">
              Spend<span className="text-blue-600">Pilot</span>
            </span>
          </Link>

          {/* Nav Links — center */}
          <div className="hidden md:flex items-center gap-0.5 rounded-xl border border-gray-100 bg-gray-50 p-1">
            {[
              { href: "/", label: "Home" },
              { href: "/audit", label: "Audit" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-4 py-1.5 rounded-lg text-sm font-500 transition-all duration-200",
                  pathname === href
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-500 hover:text-gray-800 hover:bg-white/60"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Subtle badge */}
          

            {/* CTA Button */}
            <Link
              href="/audit"
              className="group flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-600 text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.97]"
            >
              Start Audit
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </motion.nav>
      </div>
    </header>
  );
}
