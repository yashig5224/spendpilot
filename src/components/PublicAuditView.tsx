"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, TrendingDown, CheckCircle2 } from "lucide-react";
import type { AuditResult } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getToolLabel } from "@/lib/pricing";

export function PublicAuditView({ audit }: { audit: AuditResult }) {
  const isOptimized = audit.totalMonthlySavings < 100;

  return (
    <div className="relative min-h-screen pt-28 pb-24 px-4">
      <div className="gradient-mesh" />
      <div className="relative mx-auto max-w-2xl">

        {/* Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-white/40">
            Shared audit report · {new Date(audit.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </span>
        </motion.div>

        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8 mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-8 text-center"
        >
          {isOptimized ? (
            <>
              <CheckCircle2 className="h-10 w-10 text-green-400 mx-auto mb-3" />
              <h1 className="font-display text-3xl font-700 text-white mb-2">Spend is optimized</h1>
              <p className="text-white/40">Less than {formatCurrency(100)}/mo in potential savings detected.</p>
            </>
          ) : (
            <>
              <TrendingDown className="h-8 w-8 text-cyan-400 mx-auto mb-3" />
              <p className="text-xs text-cyan-400 uppercase tracking-widest font-500 mb-2">Potential savings</p>
              <h1 className="font-display text-6xl font-800 text-cyan-400 text-glow mb-1">
                {formatCurrency(audit.totalMonthlySavings)}
              </h1>
              <p className="text-white/50 mb-4">per month · {formatCurrency(audit.totalYearlySavings)}/year</p>
            </>
          )}
        </motion.div>

        {/* AI Summary */}
        {audit.aiSummary && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 rounded-xl border border-purple-400/20 bg-purple-400/[0.04] p-5"
          >
            <p className="text-xs text-purple-400 font-500 mb-2">AI Summary</p>
            <p className="text-sm text-white/55 leading-relaxed">{audit.aiSummary}</p>
          </motion.div>
        )}

        {/* Recommendations (read-only) */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-8"
        >
          <h2 className="font-display text-lg font-600 text-white mb-4">Recommendations</h2>
          <div className="space-y-3">
            {audit.recommendations.map((rec, i) => (
              <motion.div
                key={rec.toolEntryId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-600 text-white text-sm">{getToolLabel(rec.tool)}</p>
                    <p className="text-xs text-white/35 mt-0.5 capitalize">{rec.action}</p>
                  </div>
                  {rec.estimatedMonthlySavings > 0 && (
                    <span className="text-green-400 font-600 text-sm shrink-0">
                      {formatCurrency(rec.estimatedMonthlySavings)}/mo
                    </span>
                  )}
                </div>
                <p className="text-xs text-white/35 mt-2 leading-relaxed">{rec.reasoning}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 text-center"
        >
          <p className="text-sm text-white/50 mb-4">Audit your own AI spend — free, no account needed.</p>
          <Link
            href="/audit"
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-600 text-black hover:bg-cyan-300 transition-all"
          >
            Start my free audit <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
