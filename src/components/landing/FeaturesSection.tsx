"use client";

import { motion } from "framer-motion";
import { Search, Cpu, BarChart3, Share2, Mail, ShieldCheck } from "lucide-react";

const FEATURES = [
  {
    icon: Search,
    title: "Instant spend audit",
    description: "Enter your AI tools, plans, and seat counts. We analyse every line item for savings opportunities.",
    color: "text-cyan-400",
    bg: "bg-cyan-400/[0.08]",
    border: "border-cyan-400/20",
  },
  {
    icon: Cpu,
    title: "Rules-based engine",
    description: "Deterministic logic — not guesswork. We apply precise pricing rules for every plan and tier.",
    color: "text-purple-400",
    bg: "bg-purple-400/[0.08]",
    border: "border-purple-400/20",
  },
  {
    icon: BarChart3,
    title: "Savings breakdown",
    description: "See exactly which tools to downgrade, switch, or consolidate — with dollar amounts per recommendation.",
    color: "text-green-400",
    bg: "bg-green-400/[0.08]",
    border: "border-green-400/20",
  },
  {
    icon: Share2,
    title: "Shareable reports",
    description: "Every audit gets a public URL. Share with your CFO, finance team, or investors in one click.",
    color: "text-yellow-400",
    bg: "bg-yellow-400/[0.08]",
    border: "border-yellow-400/20",
  },
  {
    icon: Mail,
    title: "Email summary",
    description: "Get your savings report delivered to your inbox. Clean, concise, and actionable.",
    color: "text-orange-400",
    bg: "bg-orange-400/[0.08]",
    border: "border-orange-400/20",
  },
  {
    icon: ShieldCheck,
    title: "No account needed",
    description: "Zero sign-up friction. Run your audit instantly and share results without creating an account.",
    color: "text-blue-400",
    bg: "bg-blue-400/[0.08]",
    border: "border-blue-400/20",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-xs text-cyan-400 uppercase tracking-widest font-500 mb-3">How it works</p>
          <h2 className="font-display text-4xl md:text-5xl font-700 tracking-tight text-white mb-4">
            Everything you need to
            <br />
            <span className="text-white/40">right-size your AI stack</span>
          </h2>
          <p className="text-white/40 text-lg max-w-md mx-auto">
            A complete audit workflow, from input to actionable savings, in minutes.
          </p>
        </motion.div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, description, color, bg, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="gradient-border group rounded-xl border border-white/[0.06] bg-white/[0.02] p-6 transition-all hover:bg-white/[0.04]"
            >
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-lg border ${border} ${bg} mb-4`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="font-display text-base font-600 text-white mb-2">{title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
