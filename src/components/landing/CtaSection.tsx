"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight} from "lucide-react";

export function CtaSection() {
  return (
    <section className="relative py-28 px-4 bg-white">
      <div className="relative mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-purple-50 p-12 text-center shadow-sm"
        >
          <h2 className="font-display text-4xl md:text-5xl font-700 tracking-tight text-gray-900 mb-4">
            Find your savings
            <br />
            <span className="gradient-text">in 3 minutes</span>
          </h2>

          <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
            No account. No credit card. Just paste in your AI tools and see exactly where your money is going.
          </p>

          <Link
            href="/audit"
            className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-600 text-white transition-all hover:bg-blue-700 shadow-blue hover:shadow-lg active:scale-[0.98]"
          >
            Start free audit
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </motion.div>
      </div>

      <div className="mt-16 text-center text-sm text-black-400">
        © {new Date().getFullYear()} SpendPilot. Built for startups who hate waste.
      </div>
    </section>
  );
}
