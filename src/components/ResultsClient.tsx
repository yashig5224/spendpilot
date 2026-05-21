"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  TrendingDown, ArrowRight, Share2, Mail, Sparkles,
  CheckCircle2, AlertTriangle, ArrowDownCircle, RefreshCw,
  ExternalLink, Copy, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuditResult, Recommendation } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { getToolLabel } from "@/lib/pricing";
import { saveAudit, saveLeadEmail } from "@/lib/supabase";
import { toast } from "@/components/ui/toaster";

const ACTION_CONFIG = {
  downgrade: { label: "Downgrade", icon: ArrowDownCircle, color: "text-green-400", bg: "bg-green-400/10", border: "border-green-400/20" },
  upgrade: { label: "Upgrade", icon: ArrowRight, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-400/20" },
  switch: { label: "Switch tool", icon: RefreshCw, color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
  consolidate: { label: "Consolidate", icon: TrendingDown, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-400/20" },
  keep: { label: "Well optimized", icon: CheckCircle2, color: "text-cyan-400", bg: "bg-cyan-400/10", border: "border-cyan-400/20" },
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
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!id) { router.push("/audit"); return; }
    const raw = sessionStorage.getItem(`audit_${id}`);
    if (!raw) { router.push("/audit"); return; }
    const parsed: AuditResult = JSON.parse(raw);
    setAudit(parsed);
    // Save to Supabase in background
    saveAudit(parsed).then(() => setSaved(true)).catch(() => {});
    // Fetch AI summary
    fetchSummary(parsed);
  }, [id, router]);

  const fetchSummary = async (auditData: AuditResult) => {
    setSummaryLoading(true);
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      if (data.summary) setAiSummary(data.summary);
    } catch {
      // silent fail — summary is optional
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleShareCopy = useCallback(() => {
    if (!audit) return;
    const url = `${window.location.origin}/audit/${audit.shareSlug}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({ title: "Link copied!", description: "Share your audit results." });
    });
  }, [audit]);

  const handleEmailSubmit = useCallback(async () => {
    if (!email || !audit) return;
    setEmailLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, auditId: audit.id, audit }),
      });
      if (res.ok) {
        setEmailSent(true);
        await saveLeadEmail(email, audit.id);
        toast({ title: "Report sent!", description: "Check your inbox." });
      }
    } catch {
      toast({ title: "Something went wrong", description: "Please try again." });
    } finally {
      setEmailLoading(false);
    }
  }, [email, audit]);

  if (!audit) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/10 border-t-cyan-400" />
          <p className="text-sm text-white/40">Loading your results…</p>
        </div>
      </div>
    );
  }

  const savingsPercent = formatPercent(audit.totalMonthlySavings, audit.currentMonthlySpend);
  const isOptimized = audit.totalMonthlySavings < 100;
  const isHighSavings = audit.totalMonthlySavings > 500;

  return (
    <div className="relative min-h-screen pt-28 pb-24 px-4">
      <div className="gradient-mesh" />
      <div className="relative mx-auto max-w-3xl">

        {/* ── Hero savings ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.04] p-8 text-center"
        >
          <p className="text-xs text-cyan-400 uppercase tracking-widest font-500 mb-3">Audit complete</p>
          {isOptimized ? (
            <>
              <CheckCircle2 className="h-10 w-10 text-green-400 mx-auto mb-3" />
              <h1 className="font-display text-4xl font-700 text-white mb-2">
                Already optimized 🎉
              </h1>
              <p className="text-white/50">
                Your AI spend is under {formatCurrency(100)}/mo in potential savings. You&apos;re doing great.
              </p>
            </>
          ) : (
            <>
              <h1 className="font-display text-6xl font-800 text-cyan-400 text-glow mb-1">
                {formatCurrency(audit.totalMonthlySavings)}
              </h1>
              <p className="text-white/50 text-lg mb-4">potential monthly savings ({savingsPercent} of spend)</p>
              <div className="inline-flex items-center gap-2 rounded-xl bg-white/[0.04] border border-white/[0.06] px-5 py-2.5">
                <span className="text-sm text-white/40">Yearly savings</span>
                <span className="font-display text-xl font-700 text-green-400">
                  {formatCurrency(audit.totalYearlySavings)}
                </span>
              </div>
            </>
          )}
        </motion.div>

        {/* ── Spend breakdown bar ───────────────────────────── */}
        <SpendBreakdown audit={audit} />

        {/* ── AI Summary ────────────────────────────────────── */}
        <AiSummaryCard summary={aiSummary} loading={summaryLoading} />

        {/* ── Recommendations ───────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="font-display text-xl font-600 text-white mb-4">Recommendations</h2>
          <div className="space-y-3">
            {audit.recommendations.map((rec, i) => (
              <RecommendationCard key={rec.toolEntryId} rec={rec} index={i} />
            ))}
          </div>
        </motion.div>

        {/* ── High savings CTA ───────────────────────────────── */}
        {isHighSavings && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-8 rounded-xl border border-yellow-400/20 bg-yellow-400/[0.04] p-6"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-5 w-5 text-yellow-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-600 text-white mb-1">Significant savings detected</h3>
                <p className="text-sm text-white/50 mb-3">
                  You could save over {formatCurrency(audit.totalMonthlySavings)}/mo. Book a 20-min consultation to implement these changes with expert guidance.
                </p>
                <a
                  href="mailto:hello@spendpilot.io?subject=AI Spend Consultation"
                  className="inline-flex items-center gap-1.5 text-sm text-yellow-400 hover:underline"
                >
                  Book free consultation <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Email capture ──────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mb-6 rounded-xl border border-white/[0.07] bg-white/[0.02] p-6"
        >
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4 text-white/40" />
            <h3 className="font-600 text-white text-sm">Email your report</h3>
          </div>
          <p className="text-xs text-white/35 mb-4">Get a clean summary delivered to your inbox.</p>
          {emailSent ? (
            <div className="flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle2 className="h-4 w-4" />
              Report sent! Check your inbox.
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleEmailSubmit}
                disabled={!email || emailLoading}
                size="default"
              >
                {emailLoading ? "Sending…" : "Send"}
              </Button>
            </div>
          )}
        </motion.div>

        {/* ── Share + Actions ────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <Button variant="outline" onClick={handleShareCopy} className="flex-1 gap-2">
            {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy share link"}
          </Button>
          <Button
            variant="ghost"
            onClick={() => router.push("/audit")}
            className="flex-1 gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Start new audit
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SpendBreakdown({ audit }: { audit: AuditResult }) {
  const pct = Math.min(100, Math.round((audit.optimizedMonthlySpend / audit.currentMonthlySpend) * 100));
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="mb-8 rounded-xl border border-white/[0.07] bg-white/[0.02] p-5"
    >
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className="text-white/40">Monthly spend</span>
        <div className="flex items-center gap-4">
          <span className="text-white/50 line-through text-xs">{formatCurrency(audit.currentMonthlySpend)}</span>
          <span className="text-green-400 font-600">{formatCurrency(audit.optimizedMonthlySpend)}</span>
        </div>
      </div>
      <div className="h-2 w-full rounded-full bg-white/[0.05] overflow-hidden">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-green-400 to-cyan-400"
        />
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-white/25">
        <span>Optimized spend</span>
        <span>{pct}% of current</span>
      </div>
    </motion.div>
  );
}

function AiSummaryCard({ summary, loading }: { summary: string | null; loading: boolean }) {
  if (!loading && !summary) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8 rounded-xl border border-purple-400/20 bg-purple-400/[0.04] p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-purple-400" />
        <span className="text-sm font-600 text-white">AI Summary</span>
        <span className="ml-auto text-xs text-white/25">Powered by Claude</span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-3 w-full rounded-full bg-white/[0.05] shimmer" />
          <div className="h-3 w-4/5 rounded-full bg-white/[0.05] shimmer" />
          <div className="h-3 w-3/5 rounded-full bg-white/[0.05] shimmer" />
        </div>
      ) : (
        <p className="text-sm text-white/60 leading-relaxed">{summary}</p>
      )}
    </motion.div>
  );
}

function RecommendationCard({ rec, index }: { rec: Recommendation; index: number }) {
  const cfg = ACTION_CONFIG[rec.action];
  const Icon = cfg.icon;
  const hasSavings = rec.estimatedMonthlySavings > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, delay: index * 0.07 }}
      className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${cfg.border} ${cfg.bg}`}>
            <Icon className={`h-4 w-4 ${cfg.color}`} />
          </div>
          <div>
            <p className="font-600 text-white text-sm">{getToolLabel(rec.tool)}</p>
            <p className={`text-xs font-500 ${cfg.color}`}>{cfg.label}</p>
          </div>
        </div>
        {hasSavings && (
          <div className="text-right shrink-0">
            <p className="font-display text-lg font-700 text-green-400">
              {formatCurrency(rec.estimatedMonthlySavings)}<span className="text-xs font-400 text-white/30">/mo</span>
            </p>
            <p className="text-xs text-white/30">{formatCurrency(rec.estimatedYearlySavings)}/yr</p>
          </div>
        )}
      </div>

      {rec.recommendedPlan && (
        <div className="flex items-center gap-2 mb-3 text-xs">
          <span className="text-white/30">{rec.currentPlan}</span>
          <ArrowRight className="h-3 w-3 text-white/20" />
          <span className="text-cyan-400 font-500">{rec.recommendedPlan}</span>
        </div>
      )}

      <p className="text-xs text-white/40 leading-relaxed mb-3">{rec.reasoning}</p>

      {/* Confidence */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/25">Confidence</span>
        <div className="flex-1 h-1 rounded-full bg-white/[0.05]">
          <div
            className="h-full rounded-full bg-cyan-400/50"
            style={{ width: `${rec.confidenceScore * 100}%` }}
          />
        </div>
        <span className="text-xs text-white/25">{Math.round(rec.confidenceScore * 100)}%</span>
      </div>

      {/* Alternatives */}
      {rec.alternatives.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/[0.05]">
          <p className="text-xs text-white/25 mb-2">Alternatives</p>
          <div className="space-y-1.5">
            {rec.alternatives.map((alt) => (
              <div key={`${alt.tool}-${alt.plan}`} className="flex items-start gap-2">
                <span className="text-xs text-cyan-400/70 shrink-0 mt-0.5">→</span>
                <span className="text-xs text-white/35">
                  <span className="text-white/50">{getToolLabel(alt.tool)} {alt.plan}</span>
                  {alt.monthlyPerSeat > 0 && ` ($${alt.monthlyPerSeat}/seat)`} — {alt.reason}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
