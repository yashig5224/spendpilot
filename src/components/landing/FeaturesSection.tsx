"use client";

import { motion } from "framer-motion";
import { Search, Cpu, BarChart3, Share2, Mail, ShieldCheck } from "lucide-react";

const FEATURES = [
  { icon: Search, title: "Instant spend audit", description: "Enter your AI tools, plans, and seat counts. We analyse every line item for savings opportunities.", color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
  { icon: Cpu, title: "Rules-based engine", description: "Deterministic logic — not guesswork. We apply precise pricing rules for every plan and tier.", color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-200" },
  { icon: BarChart3, title: "Savings breakdown", description: "See exactly which tools to downgrade, switch, or consolidate — with dollar amounts per recommendation.", color: "text-green-600", bg: "bg-green-50", border: "border-green-200" },
  { icon: Share2, title: "Shareable reports", description: "Every audit gets a public URL. Share with your CFO, finance team, or investors in one click.", color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  { icon: Mail, title: "Email summary", description: "Get your savings report delivered to your inbox. Clean, concise, and actionable.", color: "text-pink-600", bg: "bg-pink-50", border: "border-pink-200" },
  { icon: ShieldCheck, title: "No account needed", description: "Zero sign-up friction. Run your audit instantly and share results without creating an account.", color: "text-teal-600", bg: "bg-teal-50", border: "border-teal-200" },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative py-28 px-4 bg-gray-50">
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >

          <h2 className="font-display text-4xl md:text-5xl font-700 tracking-tight text-gray-900 mb-4">
            Everything you need to
            <br />
            <span className="text-gray-400">right-size your AI stack</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-md mx-auto">
            A complete audit workflow, from input to actionable savings, in minutes.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, description, color, bg, border }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-hover rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${border} ${bg} mb-4`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <h3 className="font-display text-base font-600 text-gray-900 mb-2">{title}</h3>
              <p className="text-sl text-gray-500 leading-relaxed">{description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
