"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Zap, TrendingDown, DollarSign, Shield } from "lucide-react";

const TOOLS = ["Cursor", "Copilot", "Claude", "ChatGPT", "Gemini", "Windsurf", "OpenAI API", "Anthropic API"];

const STAT_CARDS = [
  { value: "$840", label: "Avg. yearly savings", icon: DollarSign, bg: "bg-green-50", border: "border-green-200", color: "text-green-600", iconBg: "bg-green-100" },
  { value: "3 min", label: "Time to complete audit", icon: Zap, bg: "bg-blue-50", border: "border-blue-200", color: "text-blue-600", iconBg: "bg-blue-100" },
  { value: "62%", label: "Teams are overpaying", icon: TrendingDown, bg: "bg-purple-50", border: "border-purple-200", color: "text-purple-600", iconBg: "bg-purple-100" },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-28 pb-20 px-4 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-60" />
      <div className="gradient-mesh" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] rounded-full bg-blue-100/40 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-5xl w-full">
        {/* Badge */}

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center mb-6"
        >
          <h1 className="font-display text-5xl md:text-7xl font-800 leading-[1.05] tracking-tight text-gray-900">
            Stop{" "}
            <span className="gradient-text">overpaying</span>
            <br />
            for AI tools
          </h1>
        </motion.div>

        {/* Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center text-gray-500 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed font-300"
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
            className="group flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-600 text-white transition-all hover:bg-blue-700 shadow-blue hover:shadow-lg active:scale-[0.98]"
          >
            Audit my AI spend
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#features"
            className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3.5 text-sm font-500 text-gray-600 transition-all hover:border-gray-300 hover:text-gray-900 hover:shadow-sm"
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
          {STAT_CARDS.map(({ value, label, icon: Icon, bg, border, color, iconBg }) => (
            <div key={label} className={`rounded-2xl border ${border} ${bg} p-4 text-center shadow-sm`}>
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${iconBg} mb-3 mx-auto`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div className={`font-display text-2xl font-1000 ${color} mb-0.5`}>{value}</div>
              <div className="text-xs text-gray-500">{label}</div>
            </div>
          ))}
        </motion.div>

        {/* Tool logos */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="text-center"
        >
          <p className="text-xl text-black-400 uppercase tracking-widest mb-4 font-400">Supports all major AI tools</p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {TOOLS.map((tool) => (
              <span key={tool} className="rounded-full border border-gray-200 bg-white px-3 py-1 text-md text-black-500 shadow-xl font-500">
                {tool}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
