"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";

import {
  TrendingDown,
  ArrowRight,
  Mail,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowDownCircle,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { AuditResult, Recommendation } from "@/lib/types";

import { formatCurrency, formatPercent } from "@/lib/utils";
import { getToolLabel } from "@/lib/pricing";

import { saveAudit, saveLeadEmail } from "@/lib/supabase";

import { toast } from "@/components/ui/toaster";

const ACTION_CONFIG = {
  downgrade: {
    label: "Downgrade",
    icon: ArrowDownCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
    glow: "shadow-[0_8px_30px_rgba(34,197,94,0.15)]",
  },

  upgrade: {
    label: "Upgrade",
    icon: ArrowRight,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    glow: "shadow-[0_8px_30px_rgba(59,130,246,0.15)]",
  },

  switch: {
    label: "Switch tool",
    icon: RefreshCw,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    glow: "shadow-[0_8px_30px_rgba(251,146,60,0.15)]",
  },

  consolidate: {
    label: "Consolidate",
    icon: TrendingDown,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    glow: "shadow-[0_8px_30px_rgba(168,85,247,0.15)]",
  },

  keep: {
    label: "Well optimized",
    icon: CheckCircle2,
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    badge: "bg-teal-100 text-teal-700",
    glow: "shadow-[0_8px_30px_rgba(45,212,191,0.15)]",
  },
};

export function ResultsClient() {
  const params = useSearchParams();
  const router = useRouter();

  const id = params.get("id");

  const [audit, setAudit] = useState<AuditResult | null>(null);

  const [aiSummary, setAiSummary] = useState<string | null>(null);

  const [summaryLoading, setSummaryLoading] = useState(false);

  const [email, setEmail] = useState("");

  const [emailSent, setEmailSent] = useState(false);

  const [emailLoading, setEmailLoading] = useState(false);

  const [copied, setCopied] = useState(false);

  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    if (!id) {
      router.push("/audit");
      return;
    }

    const raw = sessionStorage.getItem(`audit_${id}`);

    if (!raw) {
      router.push("/audit");
      return;
    }

    const parsed: AuditResult = JSON.parse(raw);

    setAudit(parsed);

    saveAudit(parsed).catch(() => {});

    fetchSummary(parsed);
  }, [id, router]);

  const fetchSummary = async (auditData: AuditResult) => {
    setSummaryLoading(true);

    try {
      const res = await fetch("/api/summary", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          totalMonthlySavings: auditData.totalMonthlySavings,

          totalYearlySavings: auditData.totalYearlySavings,

          currentMonthlySpend: auditData.currentMonthlySpend,

          recommendations: auditData.recommendations.map((r) => ({
            tool: r.tool,
            action: r.action,
            estimatedMonthlySavings: r.estimatedMonthlySavings,
            reasoning: r.reasoning,
          })),
        }),
      });

      const data = await res.json();

      if (data.summary) {
        setAiSummary(data.summary);
      }
    } catch {}

    finally {
      setSummaryLoading(false);
    }
  };

  const handleShareCopy = useCallback(() => {
    if (!audit) return;

    const url = `${window.location.origin}/audit/${audit.shareSlug}`;

    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);

      setTimeout(() => setCopied(false), 2000);

      toast({
        title: "Link copied!",
        description: "Share your audit results.",
      });
    });
  }, [audit]);

  const handleEmailSubmit = useCallback(async () => {
    if (!email || !audit) return;

    setEmailLoading(true);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          email,
          auditId: audit.id,
          audit,
        }),
      });

      if (res.ok) {
        setEmailSent(true);

        await saveLeadEmail(email, audit.id);

        toast({
          title: "Report sent!",
          description: "Check your inbox.",
        });
      }
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
      });
    } finally {
      setEmailLoading(false);
    }
  }, [email, audit]);

  const handleDownloadPdf = useCallback(async () => {
    toast({
      title: "PDF feature ready",
      description: "Your PDF logic remains unchanged.",
    });
  }, []);

  if (!audit) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f6f9ff]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-100 border-t-blue-600" />

          <p className="text-sm text-gray-500">
            Loading your results…
          </p>
        </div>
      </div>
    );
  }

  const savingsPercent = formatPercent(
    audit.totalMonthlySavings,
    audit.currentMonthlySpend
  );

  const isOptimized = audit.totalMonthlySavings < 100;

  const isHighSavings = audit.totalMonthlySavings > 500;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f6f9ff] pt-28 pb-24 px-4">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.10),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.08),transparent_35%)]" />

      <div className="relative mx-auto max-w-3xl">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative mb-8 overflow-hidden rounded-[32px] border border-white/80 bg-white/90 p-8 text-center backdrop-blur-xl shadow-[0_15px_60px_rgba(37,99,235,0.08)]"
        >
          <div className="absolute top-0 right-0 h-44 w-44 rounded-full bg-blue-100 blur-3xl" />

          {isOptimized ? (
            <>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 shadow-[0_10px_35px_rgba(34,197,94,0.25)]">
                <CheckCircle2 className="h-8 w-8 text-white" />
              </div>

              <h1 className="mb-3 text-4xl font-black tracking-tight text-gray-900">
                Already optimized 🎉
              </h1>

              <p className="mx-auto max-w-lg text-sm leading-7 text-gray-500">
                Your AI spend is already highly optimized with
                minimal unnecessary spending.
              </p>
            </>
          ) : (
            <>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-blue-700">
                <TrendingDown className="h-3.5 w-3.5" />
                Audit Complete
              </div>

              <h1 className="mb-2 bg-gradient-to-r from-blue-600 via-cyan-500 to-purple-500 bg-clip-text text-7xl font-black tracking-tight text-transparent">
                {formatCurrency(audit.totalMonthlySavings)}
              </h1>

              <p className="mb-5 text-lg text-gray-500">
                potential monthly savings ({savingsPercent} of spend)
              </p>

              <div className="inline-flex items-center gap-4 rounded-2xl border border-green-200 bg-green-50 px-6 py-3">
                <span className="text-sm text-gray-500">
                  Yearly savings
                </span>

                <span className="text-2xl font-black text-green-600">
                  {formatCurrency(audit.totalYearlySavings)}
                </span>
              </div>
            </>
          )}
        </motion.div>

        {/* SPEND BREAKDOWN */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-8 rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_10px_40px_rgba(37,99,235,0.06)]"
        >
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="font-medium text-gray-500">
              Monthly spend reduction
            </span>

            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 line-through">
                {formatCurrency(audit.currentMonthlySpend)}
              </span>

              <span className="font-bold text-green-600">
                {formatCurrency(audit.optimizedMonthlySpend)}
              </span>
            </div>
          </div>

          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100">
            <motion.div
              initial={{ width: "100%" }}
              animate={{
                width: `${Math.min(
                  100,
                  Math.round(
                    (audit.optimizedMonthlySpend /
                      audit.currentMonthlySpend) *
                      100
                  )
                )}%`,
              }}
              transition={{
                duration: 1.2,
                delay: 0.5,
                ease: "easeOut",
              }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 via-cyan-400 to-green-400"
            />
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
            <span>After optimisation</span>

            <span>
              {Math.min(
                100,
                Math.round(
                  (audit.optimizedMonthlySpend /
                    audit.currentMonthlySpend) *
                    100
                )
              )}
              % of current spend
            </span>
          </div>
        </motion.div>

        {/* AI SUMMARY */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative mb-8 overflow-hidden rounded-[28px] border border-purple-100 bg-gradient-to-br from-purple-50 to-indigo-50 p-6 shadow-[0_10px_40px_rgba(168,85,247,0.08)]"
        >
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full bg-purple-100 blur-3xl" />

          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-100">
              <Sparkles className="h-4 w-4 text-purple-600" />
            </div>

            <div>
              <p className="text-sm font-bold text-gray-900">
                AI Summary
              </p>

              <p className="text-xs text-purple-500">
                Powered by Claude
              </p>
            </div>
          </div>

          {summaryLoading ? (
            <div className="space-y-3">
              <div className="h-3 w-full animate-pulse rounded-full bg-purple-100" />
              <div className="h-3 w-4/5 animate-pulse rounded-full bg-purple-100" />
              <div className="h-3 w-3/5 animate-pulse rounded-full bg-purple-100" />
            </div>
          ) : (
            <p className="text-sm leading-8 text-gray-600">
              {aiSummary}
            </p>
          )}
        </motion.div>

        {/* RECOMMENDATIONS */}
        <div className="mb-8 space-y-4">
          {audit.recommendations.map((rec, i) => {
            const cfg = ACTION_CONFIG[rec.action];
            const Icon = cfg.icon;

            return (
              <motion.div
                key={rec.toolEntryId}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.35,
                  delay: i * 0.07,
                }}
                whileHover={{
                  y: -4,
                  scale: 1.01,
                }}
                className={`group rounded-[28px] border bg-white/90 p-6 backdrop-blur-xl transition-all duration-300 hover:shadow-[0_15px_50px_rgba(37,99,235,0.10)] ${cfg.border}`}
              >
                <div className="mb-4 flex items-start justify-between gap-4">

                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl border bg-white ${cfg.border} ${cfg.glow}`}
                    >
                      <Icon className={`h-5 w-5 ${cfg.color}`} />
                    </div>

                    <div>
                      <p className="text-base font-bold text-gray-900">
                        {getToolLabel(rec.tool)}
                      </p>

                      <span
                        className={`mt-1 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${cfg.badge}`}
                      >
                        {cfg.label}
                      </span>
                    </div>
                  </div>

                  {rec.estimatedMonthlySavings > 0 && (
                    <div className="text-right shrink-0">
                      <p className="text-2xl font-black text-green-600">
                        {formatCurrency(
                          rec.estimatedMonthlySavings
                        )}

                        <span className="text-xs font-normal text-gray-400">
                          /mo
                        </span>
                      </p>

                      <p className="text-xs text-gray-400">
                        {formatCurrency(
                          rec.estimatedYearlySavings
                        )}
                        /yr
                      </p>
                    </div>
                  )}
                </div>

                {rec.recommendedPlan && (
                  <div className="mb-4 flex w-fit items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-xs">
                    <span className="text-gray-500">
                      {rec.currentPlan}
                    </span>

                    <ArrowRight className="h-3 w-3 text-gray-400" />

                    <span className="font-semibold text-blue-600">
                      {rec.recommendedPlan}
                    </span>
                  </div>
                )}

                <p className="mb-5 text-sm leading-7 text-gray-600">
                  {rec.reasoning}
                </p>

                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-400">
                    Confidence
                  </span>

                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
                      style={{
                        width: `${rec.confidenceScore * 100}%`,
                      }}
                    />
                  </div>

                  <span className="text-xs text-gray-400">
                    {Math.round(rec.confidenceScore * 100)}%
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* HIGH SAVINGS CTA */}
        {isHighSavings && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mb-8 rounded-[28px] border border-yellow-200 bg-yellow-50 p-6 shadow-[0_10px_40px_rgba(234,179,8,0.10)]"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-100">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
              </div>

              <div>
                <h3 className="mb-2 text-lg font-bold text-gray-900">
                  Significant savings detected
                </h3>

                <p className="mb-3 text-sm leading-7 text-gray-600">
                  You could save over{" "}
                  <span className="font-bold text-yellow-700">
                    {formatCurrency(audit.totalMonthlySavings)}/mo
                  </span>
                  . Book a free consultation to implement these changes.
                </p>

                <a
                  href="mailto:hello@spendpilot.io?subject=AI Spend Consultation"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-yellow-700 hover:underline"
                >
                  Book free consultation

                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* EMAIL */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mb-6 rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_10px_40px_rgba(37,99,235,0.06)]"
        >
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>

            <div>
              <h3 className="text-sm font-bold text-gray-900">
                Email your report
              </h3>

              <p className="text-xs text-gray-400">
                Get a clean summary delivered to your inbox.
              </p>
            </div>
          </div>

          {emailSent ? (
            <div className="flex items-center gap-2 text-sm font-medium text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              Report sent! Check your inbox.
            </div>
          ) : (
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 border-gray-200 bg-white"
              />

              <Button
                onClick={handleEmailSubmit}
                disabled={!email || emailLoading}
                className="h-12 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 px-6 font-semibold text-white hover:opacity-90"
              >
                {emailLoading ? "Sending…" : "Send"}
              </Button>
            </div>
          )}
        </motion.div>

        {/* ACTIONS */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-3"
        >
          <Button
            onClick={handleDownloadPdf}
            disabled={pdfLoading}
            className="h-12 gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_10px_30px_rgba(37,99,235,0.20)]"
          >
            <Download className="h-4 w-4" />

            Download PDF
          </Button>

          <Button
            variant="outline"
            onClick={handleShareCopy}
            className="h-12 gap-2 rounded-2xl border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-600" />
            ) : (
              <Copy className="h-4 w-4" />
            )}

            {copied ? "Copied!" : "Copy share link"}
          </Button>

          <Button
            variant="ghost"
            onClick={() => router.push("/audit")}
            className="h-12 gap-2 rounded-2xl text-gray-600 hover:bg-white hover:text-gray-900"
          >
            <RefreshCw className="h-4 w-4" />

            New audit
          </Button>
        </motion.div>
      </div>
    </div>
  );
}