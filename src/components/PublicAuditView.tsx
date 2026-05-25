"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  Sparkles,
  Calendar,
  Shield,
} from "lucide-react";

import type { AuditResult } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getToolLabel } from "@/lib/pricing";

const ACTION_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  downgrade:   { label: "Downgrade",      color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200" },
  upgrade:     { label: "Upgrade",        color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200" },
  switch:      { label: "Switch tool",    color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  consolidate: { label: "Consolidate",    color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200" },
  keep:        { label: "Well optimized", color: "text-teal-700",   bg: "bg-teal-50",   border: "border-teal-200" },
};

export function PublicAuditView({ audit }: { audit: AuditResult }) {
  const isOptimized = audit.totalMonthlySavings < 100;
  const savingsPct = audit.currentMonthlySpend > 0
    ? Math.round((audit.totalMonthlySavings / audit.currentMonthlySpend) * 100)
    : 0;

  return (
    <div className="relative min-h-screen bg-gray-50 pt-28 pb-24 px-4">
      {/* Subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-blue-50/80 to-transparent pointer-events-none" />

      <div className="relative mx-auto max-w-2xl space-y-4">

        {/* ── Shared badge ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex justify-center mb-2"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-500 text-gray-500 shadow-sm">
            <Calendar className="h-3 w-3 text-gray-400" />
            Shared audit ·{" "}
            {new Date(audit.createdAt).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </span>
        </motion.div>

        {/* ── Hero card ─────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-3xl border border-gray-200 bg-white p-8 text-center shadow-sm overflow-hidden relative"
        >
          {/* Top accent bar */}
          <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500" />

          {isOptimized ? (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-100 border border-green-200">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="font-display text-3xl font-700 text-gray-900 mb-2">
                Spend is optimized ✓
              </h1>
              <p className="text-gray-500 text-sm max-w-sm mx-auto">
                Less than <span className="font-600 text-green-600">{formatCurrency(100)}/mo</span> in potential savings detected. This team is running lean.
              </p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-600 text-blue-700 mb-5">
                <TrendingDown className="h-3 w-3" />
                Potential savings found
              </div>

              <div className="mb-2">
                <span className="font-display text-6xl font-800 text-gray-900">
                  {formatCurrency(audit.totalMonthlySavings)}
                </span>
                <span className="text-gray-400 text-lg font-400">/mo</span>
              </div>

              <p className="text-gray-500 text-sm mb-6">
                {formatCurrency(audit.totalYearlySavings)} saved per year · {savingsPct}% reduction
              </p>

              {/* Mini stat row */}
              <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                  <p className="text-xs text-gray-400 mb-0.5">Current spend</p>
                  <p className="font-display text-base font-700 text-gray-700">
                    {formatCurrency(audit.currentMonthlySpend)}<span className="text-xs font-400 text-gray-400">/mo</span>
                  </p>
                </div>
                <div className="rounded-xl border border-green-100 bg-green-50 p-3">
                  <p className="text-xs text-gray-400 mb-0.5">After savings</p>
                  <p className="font-display text-base font-700 text-green-600">
                    {formatCurrency(audit.optimizedMonthlySpend)}<span className="text-xs font-400 text-gray-400">/mo</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* ── AI Summary ────────────────────────────────────── */}
        {audit.aiSummary && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-purple-200 bg-purple-50 p-5 shadow-sm"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-100 border border-purple-200">
                <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              </div>
              <span className="text-sm font-600 text-gray-900">AI Summary</span>
              <span className="ml-auto text-xs text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5">
                Claude
              </span>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{audit.aiSummary}</p>
          </motion.div>
        )}

        {/* ── Recommendations ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <h2 className="font-display text-lg font-700 text-gray-900">Recommendations</h2>
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-xs text-gray-400 font-500">{audit.recommendations.length} tools</span>
          </div>

          <div className="space-y-3">
            {audit.recommendations.map((rec, i) => {
              const cfg = ACTION_CONFIG[rec.action] ?? ACTION_CONFIG.keep;
              const hasSavings = rec.estimatedMonthlySavings > 0;

              return (
                <motion.div
                  key={rec.toolEntryId}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.06 }}
                  className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5 shadow-sm`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-600 text-gray-900 text-sm">{getToolLabel(rec.tool)}</p>
                      <span className={`inline-block mt-1 text-xs font-600 px-2 py-0.5 rounded-full bg-white/70 border ${cfg.border} ${cfg.color}`}>
                        {cfg.label}
                      </span>
                    </div>
                    {hasSavings && (
                      <div className="text-right shrink-0">
                        <p className="font-display text-lg font-700 text-green-600">
                          {formatCurrency(rec.estimatedMonthlySavings)}
                          <span className="text-xs font-400 text-gray-400">/mo</span>
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatCurrency(rec.estimatedYearlySavings)}/yr
                        </p>
                      </div>
                    )}
                  </div>

                  {rec.recommendedPlan && (
                    <div className="flex items-center gap-2 mb-3 text-xs bg-white/70 rounded-lg px-3 py-1.5 border border-white w-fit">
                      <span className="text-gray-400">{rec.currentPlan}</span>
                      <ArrowRight className="h-3 w-3 text-gray-300" />
                      <span className="text-blue-600 font-600">{rec.recommendedPlan}</span>
                    </div>
                  )}

                  <p className="text-xs text-gray-600 leading-relaxed">{rec.reasoning}</p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── CTA ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="rounded-3xl border border-blue-200 bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 text-center shadow-sm relative overflow-hidden"
        >
          {/* Decorative circles */}
          <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-blue-100/60" />
          <div className="absolute -bottom-4 -left-4 h-16 w-16 rounded-full bg-indigo-100/60" />

          <div className="relative">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-sm mb-4 mx-auto">
              <Shield className="h-6 w-6 text-white" />
            </div>

            <h3 className="font-display text-2xl font-700 text-gray-900 mb-2">
              Audit your own AI stack
            </h3>

            <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm mx-auto">
              Discover hidden subscription waste and find savings in under 3 minutes. Free, no account needed.
            </p>

            <Link
              href="/audit"
              className="group inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-600 text-white shadow-sm transition-all hover:bg-blue-700 hover:shadow-md active:scale-[0.98]"
            >
              Start free audit
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <p className="mt-3 text-xs text-gray-400">Free forever · No sign-up · Results in minutes</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}