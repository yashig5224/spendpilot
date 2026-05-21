"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap } from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative py-28 px-4">
      {/* Glow backdrop */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[300px] rounded-full bg-cyan-400/[0.05] blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-12 text-center backdrop-blur-sm"
        >
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 border border-cyan-400/20 mb-6 mx-auto">
            <Zap className="h-6 w-6 text-cyan-400" />
          </div>

          <h2 className="font-display text-4xl md:text-5xl font-700 tracking-tight text-white mb-4">
            Find your savings
            <br />
            <span className="text-cyan-400">in 3 minutes</span>
          </h2>

          <p className="text-white/50 text-lg mb-8 max-w-md mx-auto">
            No account. No credit card. Just paste in your AI tools and see exactly where your money is going.
          </p>

          <Link
            href="/audit"
            className="group inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-8 py-4 text-sm font-600 text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] active:scale-[0.98]"
          >
            Start free audit
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>

          <p className="mt-4 text-xs text-white/25">Free forever · No sign-up required · Results in minutes</p>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="mt-16 text-center text-xs text-white/20">
        © {new Date().getFullYear()} SpendPilot. Built for startups who hate waste.
      </div>
    </section>
  );
}
