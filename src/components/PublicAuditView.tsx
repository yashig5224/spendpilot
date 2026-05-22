"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import type { AuditResult } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getToolLabel } from "@/lib/pricing";

export function PublicAuditView({ audit }: { audit: AuditResult }) {
  const isOptimized = audit.totalMonthlySavings < 100;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050816] pt-28 pb-24 px-4 text-white">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.14),transparent_30%)]" />

      <div className="absolute top-0 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[120px]" />

      <div className="relative mx-auto max-w-2xl">

        {/* Shared Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl px-5 py-2 text-xs text-gray-300 shadow-[0_0_30px_rgba(255,255,255,0.04)]">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            Shared audit report ·{" "}
            {new Date(audit.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mb-8 overflow-hidden rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8 text-center shadow-[0_10px_60px_rgba(0,0,0,0.45)]"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.06] to-transparent pointer-events-none" />

          {isOptimized ? (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-green-400 to-emerald-600 shadow-[0_0_40px_rgba(16,185,129,0.45)]">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>

              <h1 className="mb-3 text-4xl font-black tracking-tight text-white">
                Spend is optimized
              </h1>

              <p className="mx-auto max-w-md text-sm leading-relaxed text-gray-300">
                Less than{" "}
                <span className="font-bold text-green-400">
                  {formatCurrency(100)}/mo
                </span>{" "}
                in potential savings detected.
              </p>
            </>
          ) : (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_0_40px_rgba(59,130,246,0.45)]">
                <TrendingDown className="h-8 w-8 text-white" />
              </div>

              <p className="mb-3 text-xs uppercase tracking-[0.35em] text-blue-300">
                Potential Savings
              </p>

              <h1 className="mb-2 bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-400 bg-clip-text text-6xl font-black tracking-tight text-transparent">
                {formatCurrency(audit.totalMonthlySavings)}
              </h1>

              <p className="text-base text-gray-300">
                per month ·{" "}
                <span className="font-semibold text-white">
                  {formatCurrency(audit.totalYearlySavings)}/year
                </span>
              </p>
            </>
          )}
        </motion.div>

        {/* AI Summary */}
        {audit.aiSummary && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mb-6 overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-indigo-500/10 backdrop-blur-xl p-6 shadow-[0_10px_40px_rgba(168,85,247,0.12)]"
          >
            <div className="absolute top-0 right-0 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl" />

            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
              AI Summary
            </p>

            <p className="relative text-sm leading-7 text-gray-200">
              {audit.aiSummary}
            </p>
          </motion.div>
        )}

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="mb-8"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Recommendations
            </h2>

            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent ml-4" />
          </div>

          <div className="space-y-4">
            {audit.recommendations.map((rec, i) => (
              <motion.div
                key={rec.toolEntryId}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.3,
                  delay: 0.3 + i * 0.06,
                }}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                }}
                className="group rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-5 transition-all duration-300 hover:border-blue-500/30 hover:bg-white/[0.06] hover:shadow-[0_15px_40px_rgba(59,130,246,0.12)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-bold text-white">
                      {getToolLabel(rec.tool)}
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-widest text-gray-400">
                      {rec.action}
                    </p>
                  </div>

                  {rec.estimatedMonthlySavings > 0 && (
                    <span className="shrink-0 rounded-xl border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-bold text-green-400">
                      {formatCurrency(rec.estimatedMonthlySavings)}/mo
                    </span>
                  )}
                </div>

                <div className="mt-4 h-px w-full bg-gradient-to-r from-white/10 to-transparent" />

                <p className="mt-4 text-sm leading-7 text-gray-300">
                  {rec.reasoning}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="relative overflow-hidden rounded-[30px] border border-blue-500/20 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 backdrop-blur-2xl p-8 text-center shadow-[0_10px_50px_rgba(59,130,246,0.14)]"
        >
          <div className="absolute top-0 left-1/2 h-32 w-32 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

          <h3 className="mb-3 text-2xl font-bold text-white">
            Audit Your AI Stack
          </h3>

          <p className="mx-auto mb-6 max-w-md text-sm leading-7 text-gray-300">
            Discover hidden subscription waste, optimize spending, and save
            money every month — completely free.
          </p>

          <Link
            href="/audit"
            className="group inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-7 py-3.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-[0_10px_35px_rgba(59,130,246,0.45)]"
          >
            Start my free audit

            <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}