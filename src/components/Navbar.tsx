"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center justify-between rounded-2xl border border-gray-200 bg-white/90 px-5 py-3 shadow-sm backdrop-blur-xl"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-display text-md font-800 tracking-tight text-gray-900">
              Spend<span className="text-blue-600">Pilot</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {[
              { href: "/", label: "Home" },
              { href: "/audit", label: "Audit" },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-md font-500 transition-all duration-200",
                  pathname === href
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/audit"
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-md font-600 text-white transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
          >
            Start Audit
          </Link>
        </motion.nav>
      </div>
    </header>
  );
}
