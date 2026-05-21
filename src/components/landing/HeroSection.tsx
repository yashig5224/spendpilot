"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, TrendingDown, DollarSign } from "lucide-react";

const TOOLS = ["Cursor", "Copilot", "Claude", "ChatGPT", "Gemini", "Windsurf", "OpenAI API", "Anthropic API"];

const STAT_CARDS = [
  { value: "$840", label: "Avg. yearly savings", icon: DollarSign, color: "text-green-400" },
  { value: "3 min", label: "Time to complete audit", icon: Zap, color: "text-cyan-400" },
  { value: "62%", label: "Teams are overpaying", icon: TrendingDown, color: "text-yellow-400" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-20 px-4">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern" />
      <div className="gradient-mesh" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-cyan-400/[0.04] blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl w-full">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/[0.06] px-4 py-1.5 text-xs font-500 text-cyan-400">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-cyan-400" />
            </span>
            Free AI spend audit — no account required
          </span>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="font-display text-5xl md:text-7xl font-800 leading-[1.05] tracking-tight text-white">
            Stop{" "}
            <span className="relative">
              <span className="text-cyan-400 text-glow">overpaying</span>
            </span>
            <br />
            for AI tools
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-white/50 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-300"
        >
          SpendPilot audits your AI subscriptions, identifies overspend, and surfaces exact savings — in under 3 minutes.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-16"
        >
          <Link
            href="/audit"
            className="group flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3.5 text-sm font-600 text-black transition-all hover:bg-cyan-300 hover:shadow-[0_0_32px_rgba(0,212,255,0.35)] active:scale-[0.98]"
          >
            Audit my AI spend
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 rounded-xl border border-white/10 px-6 py-3.5 text-sm font-500 text-white/70 transition-all hover:border-white/20 hover:text-white hover:bg-white/[0.04]"
          >
            See how it works
          </a>
        </motion.div>

        {/* Stat cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid grid-cols-3 gap-3 max-w-2xl mx-auto mb-16"
        >
          {STAT_CARDS.map(({ value, label, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-center backdrop-blur-sm"
            >
              <Icon className={`h-4 w-4 mx-auto mb-2 ${color}`} />
              <div className={`font-display text-2xl font-700 ${color} mb-0.5`}>{value}</div>
              <div className="text-xs text-white/40">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tool logos scrolling marquee */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-xs text-white/25 uppercase tracking-widest mb-4">Supports all major AI tools</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {TOOLS.map((tool) => (
              <span
                key={tool}
                className="rounded-full border border-white/[0.06] bg-white/[0.03] px-3 py-1 text-xs text-white/35"
              >
                {tool}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
