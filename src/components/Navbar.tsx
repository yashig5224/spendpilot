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
          className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-black/40 px-5 py-3 backdrop-blur-xl"
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-400/10 border border-cyan-400/20 group-hover:bg-cyan-400/20 transition-colors">
              <Zap className="h-3.5 w-3.5 text-cyan-400" />
            </div>
            <span className="font-display text-sm font-700 tracking-tight text-white">
              Spend<span className="text-cyan-400">Pilot</span>
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
                  "px-3 py-1.5 rounded-lg text-sm transition-all duration-200",
                  pathname === href
                    ? "text-white bg-white/[0.08]"
                    : "text-white/50 hover:text-white hover:bg-white/[0.05]"
                )}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <Link
            href="/audit"
            className="flex items-center gap-1.5 rounded-lg bg-cyan-400 px-4 py-2 text-xs font-600 text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_20px_rgba(0,212,255,0.3)]"
          >
            <Zap className="h-3 w-3" />
            Start Audit
          </Link>
        </motion.nav>
      </div>
    </header>
  );
}
