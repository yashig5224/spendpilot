"use client";

import { useEffect, useState, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  TrendingDown, ArrowRight, Mail, Sparkles,
  CheckCircle2, AlertTriangle, ArrowDownCircle, RefreshCw,
  ExternalLink, Copy, Check, Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AuditResult, Recommendation } from "@/lib/types";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { getToolLabel } from "@/lib/pricing";
import { saveAudit, saveLeadEmail } from "@/lib/supabase";
import { toast } from "@/components/ui/toaster";

const ACTION_CONFIG = {
  downgrade: { label: "Downgrade", icon: ArrowDownCircle, color: "text-green-700", bg: "bg-green-50", border: "border-green-200", badge: "bg-green-100 text-green-700" },
  upgrade: { label: "Upgrade", icon: ArrowRight, color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
  switch: { label: "Switch tool", icon: RefreshCw, color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", badge: "bg-orange-100 text-orange-700" },
  consolidate: { label: "Consolidate", icon: TrendingDown, color: "text-purple-700", bg: "bg-purple-50", border: "border-purple-200", badge: "bg-purple-100 text-purple-700" },
  keep: { label: "Well optimized", icon: CheckCircle2, color: "text-teal-700", bg: "bg-teal-50", border: "border-teal-200", badge: "bg-teal-100 text-teal-700" },
};

// ─── PDF generator using browser print ───────────────────────────────────────

function generatePdfHtml(audit: AuditResult, aiSummary: string | null): string {
  const recs = audit.recommendations.map((r) => {
    const bgColor = r.action === "downgrade" ? "#f0fdf4"
      : r.action === "upgrade" ? "#eff6ff"
        : r.action === "switch" ? "#fff7ed"
          : r.action === "consolidate" ? "#f5f3ff"
            : "#f0fdfa";
    const borderColor = r.action === "downgrade" ? "#bbf7d0"
      : r.action === "upgrade" ? "#bfdbfe"
        : r.action === "switch" ? "#fed7aa"
          : r.action === "consolidate" ? "#ddd6fe"
            : "#99f6e4";

    return `
      <div style="background:${bgColor};border:1px solid ${borderColor};border-radius:12px;padding:16px;margin-bottom:10px;page-break-inside:avoid;">
        <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:8px;">
          <div>
            <div style="font-size:14px;font-weight:700;color:#111827;">${getToolLabel(r.tool)}</div>
            <span style="display:inline-block;margin-top:4px;font-size:10px;font-weight:600;text-transform:uppercase;letter-spacing:0.06em;color:#6b7280;background:#fff;border:1px solid ${borderColor};border-radius:999px;padding:2px 8px;">${r.action}</span>
            ${r.recommendedPlan ? `<div style="margin-top:6px;font-size:11px;color:#6b7280;">${r.currentPlan} <span style="color:#9ca3af;">→</span> <span style="color:#2563eb;font-weight:600;">${r.recommendedPlan}</span></div>` : ""}
          </div>
          ${r.estimatedMonthlySavings > 0 ? `
            <div style="text-align:right;flex-shrink:0;margin-left:12px;">
              <div style="font-size:18px;font-weight:800;color:#16a34a;">${formatCurrency(r.estimatedMonthlySavings)}<span style="font-size:11px;font-weight:400;color:#9ca3af;">/mo</span></div>
              <div style="font-size:11px;color:#6b7280;">${formatCurrency(r.estimatedYearlySavings)}/yr</div>
            </div>` : ""}
        </div>
        <div style="font-size:12px;color:#4b5563;line-height:1.65;">${r.reasoning}</div>
        ${r.alternatives.length > 0 ? `
          <div style="margin-top:10px;padding-top:10px;border-top:1px solid ${borderColor};">
            <div style="font-size:10px;font-weight:600;color:#9ca3af;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:6px;">Alternatives</div>
            ${r.alternatives.map(a => `<div style="font-size:11px;color:#6b7280;margin-bottom:3px;">→ <span style="font-weight:600;color:#374151;">${getToolLabel(a.tool)} ${a.plan}</span>${a.monthlyPerSeat > 0 ? ` ($${a.monthlyPerSeat}/seat)` : ""} — ${a.reason}</div>`).join("")}
          </div>` : ""}
      </div>`;
  }).join("");

  const tableRows = [
    ["Current monthly spend", formatCurrency(audit.currentMonthlySpend), "#374151"],
    ["Optimised monthly spend", formatCurrency(audit.optimizedMonthlySpend), "#16a34a"],
    ["Monthly savings", formatCurrency(audit.totalMonthlySavings), "#2563eb"],
    ["Yearly savings", formatCurrency(audit.totalYearlySavings), "#7c3aed"],
  ].map(([label, value, color], i) => `
    <div style="display:flex;justify-content:space-between;padding:9px 12px;background:${i % 2 === 0 ? "#f9fafb" : "#ffffff"};border-bottom:1px solid #f3f4f6;">
      <span style="font-size:13px;color:#6b7280;">${label}</span>
      <span style="font-size:13px;font-weight:700;color:${color};">${value}</span>
    </div>`).join("");

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SpendPilot Audit — ${new Date(audit.createdAt).toLocaleDateString()}</title>
  <style>
    * { margin:0; padding:0; box-sizing:border-box; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    body { font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif; background:#ffffff; color:#111827; padding:32px; max-width:680px; margin:0 auto; font-size:14px; }
    @media print { body { padding:20px; } @page { margin:12mm; size:A4; } }
  </style>
</head>
<body>
  <!-- Header -->
  <div style="background:#2563eb;border-radius:14px;padding:22px 26px;margin-bottom:20px;">
    <div style="font-size:10px;font-weight:600;letter-spacing:0.12em;color:rgba(255,255,255,0.6);text-transform:uppercase;margin-bottom:6px;">AI Spend Audit Report</div>
    <div style="font-size:24px;font-weight:800;color:#ffffff;margin-bottom:2px;">SpendPilot</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.65);">Generated ${new Date(audit.createdAt).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</div>
  </div>

  <!-- Savings hero -->
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:14px;padding:20px 24px;margin-bottom:16px;display:flex;justify-content:space-between;align-items:center;">
    <div>
      <div style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Potential Monthly Savings</div>
      <div style="font-size:38px;font-weight:800;color:#16a34a;line-height:1;">${formatCurrency(audit.totalMonthlySavings)}</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:11px;font-weight:600;color:#6b7280;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:4px;">Yearly Savings</div>
      <div style="font-size:26px;font-weight:800;color:#2563eb;line-height:1;">${formatCurrency(audit.totalYearlySavings)}</div>
    </div>
  </div>

  <!-- Spend summary table -->
  <div style="border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;margin-bottom:16px;">
    <div style="padding:12px 14px;background:#f3f4f6;border-bottom:1px solid #e5e7eb;">
      <span style="font-size:13px;font-weight:700;color:#111827;">Spend Summary</span>
    </div>
    ${tableRows}
  </div>

  ${aiSummary ? `
  <!-- AI Summary -->
  <div style="background:#f5f3ff;border:1px solid #ddd6fe;border-radius:12px;padding:16px 18px;margin-bottom:16px;">
    <div style="font-size:11px;font-weight:700;color:#7c3aed;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:8px;">✦ AI Summary · Claude</div>
    <div style="font-size:13px;color:#4b5563;line-height:1.7;">${aiSummary}</div>
  </div>` : ""}

  <!-- Recommendations -->
  <div style="font-size:15px;font-weight:700;color:#111827;margin-bottom:12px;padding-bottom:8px;border-bottom:2px solid #f3f4f6;">
    Recommendations <span style="font-size:12px;font-weight:500;color:#9ca3af;">(${audit.recommendations.length} tools)</span>
  </div>
  ${recs}

  <!-- Footer -->
  <div style="margin-top:28px;padding-top:14px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;">
    <div style="font-size:11px;color:#9ca3af;">SpendPilot · spendpilot.io</div>
    <div style="font-size:11px;color:#9ca3af;">Free AI spend audits for startups</div>
  </div>

  <script>
    window.addEventListener('load', function() {
      setTimeout(function() { window.print(); }, 500);
    });
  </script>
</body>
</html>`;
}

// ─── Main component ───────────────────────────────────────────────────────────

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
    if (!id) { router.push("/audit"); return; }
    const raw = sessionStorage.getItem(`audit_${id}`);
    if (!raw) { router.push("/audit"); return; }
    const parsed: AuditResult = JSON.parse(raw);
    setAudit(parsed);
    saveAudit(parsed).catch(() => { });
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
            tool: r.tool, action: r.action,
            estimatedMonthlySavings: r.estimatedMonthlySavings,
            reasoning: r.reasoning,
          })),
        }),
      });
      const data = await res.json();
      if (data.summary) setAiSummary(data.summary);
    } catch { }
    finally { setSummaryLoading(false); }
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
    } finally { setEmailLoading(false); }
  }, [email, audit]);

  const handleDownloadPdf = useCallback(() => {
    if (!audit) return;
    setPdfLoading(true);

    const recs = audit.recommendations.map((r) => `
    <div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:14px;margin-bottom:10px;">
      <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
        <div>
          <strong style="font-size:13px;color:#111827;">${getToolLabel(r.tool)}</strong>
          <span style="margin-left:8px;font-size:10px;text-transform:uppercase;color:#6b7280;">${r.action}</span>
        </div>
        ${r.estimatedMonthlySavings > 0 ? `<strong style="color:#16a34a;font-size:14px;">${formatCurrency(r.estimatedMonthlySavings)}/mo</strong>` : ""}
      </div>
      <div style="font-size:12px;color:#4b5563;line-height:1.6;">${r.reasoning}</div>
    </div>`).join("");

    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SpendPilot Audit Report</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;padding:32px;max-width:680px;margin:0 auto;color:#111827;}
    @media print{@page{margin:12mm;size:A4;}}
  </style>
</head>
<body>
  <div style="background:#2563eb;border-radius:12px;padding:20px 24px;margin-bottom:20px;">
    <div style="font-size:20px;font-weight:800;color:#fff;">SpendPilot — Audit Report</div>
    <div style="font-size:12px;color:rgba(255,255,255,0.7);margin-top:4px;">
      ${new Date(audit.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
    </div>
  </div>

  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px;margin-bottom:16px;display:flex;justify-content:space-between;">
    <div>
      <div style="font-size:11px;color:#6b7280;margin-bottom:4px;">MONTHLY SAVINGS</div>
      <div style="font-size:36px;font-weight:800;color:#16a34a;">${formatCurrency(audit.totalMonthlySavings)}</div>
    </div>
    <div style="text-align:right;">
      <div style="font-size:11px;color:#6b7280;margin-bottom:4px;">YEARLY SAVINGS</div>
      <div style="font-size:24px;font-weight:800;color:#2563eb;">${formatCurrency(audit.totalYearlySavings)}</div>
    </div>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:16px;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;">
    ${[["Current spend", formatCurrency(audit.currentMonthlySpend)], ["Optimised spend", formatCurrency(audit.optimizedMonthlySpend)], ["Monthly savings", formatCurrency(audit.totalMonthlySavings)], ["Yearly savings", formatCurrency(audit.totalYearlySavings)]]
        .map(([l, v], i) => `<tr style="background:${i % 2 === 0 ? "#f9fafb" : "#fff"};"><td style="padding:9px 12px;font-size:13px;color:#6b7280;">${l}</td><td style="padding:9px 12px;font-size:13px;font-weight:700;color:#111827;text-align:right;">${v}</td></tr>`).join("")}
  </table>

  <div style="font-size:15px;font-weight:700;color:#111827;margin-bottom:10px;">Recommendations</div>
  ${recs}

  <div style="margin-top:24px;padding-top:12px;border-top:1px solid #e5e7eb;display:flex;justify-content:space-between;">
    <span style="font-size:11px;color:#9ca3af;">SpendPilot · spendpilot.io</span>
    <span style="font-size:11px;color:#9ca3af;">Free AI spend audits</span>
  </div>
  <script>window.addEventListener('load',function(){setTimeout(function(){window.print();},400);});</script>
</body>
</html>`;

    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) {
      toast({ title: "Popup blocked!", description: "Allow popups for localhost in your browser settings, then try again." });
      setPdfLoading(false);
      return;
    }
    w.document.write(html);
    w.document.close();
    toast({ title: "Print dialog opening…", description: "Select 'Save as PDF' as the printer." });
    setPdfLoading(false);
  }, [audit, aiSummary]);

  if (!audit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
          <p className="text-sm text-gray-500">Loading your results…</p>
        </div>
      </div>
    );
  }

  const savingsPercent = formatPercent(audit.totalMonthlySavings, audit.currentMonthlySpend);
  const isOptimized = audit.totalMonthlySavings < 100;
  const isHighSavings = audit.totalMonthlySavings > 500;

  return (
    <div className="relative min-h-screen pt-28 pb-24 px-4 bg-gray-50">
      <div className="gradient-mesh" />
      <div className="relative mx-auto max-w-3xl">

        {/* ── Hero savings ─────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
          className="mb-6 rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm"
        >
          {isOptimized ? (
            <>
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 mx-auto mb-4">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <h1 className="font-display text-4xl font-700 text-gray-900 mb-2">Already optimized 🎉</h1>
              <p className="text-gray-500">Your AI spend is under {formatCurrency(100)}/mo in potential savings.</p>
            </>
          ) : (
            <>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-600 text-blue-700 mb-4">
                <TrendingDown className="h-3 w-3" /> Audit complete
              </div>
              <h1 className="font-display text-6xl font-800 text-blue-600 mb-1">{formatCurrency(audit.totalMonthlySavings)}</h1>
              <p className="text-gray-500 text-lg mb-4">potential monthly savings ({savingsPercent} of spend)</p>
              <div className="inline-flex items-center gap-3 rounded-xl bg-green-50 border border-green-200 px-5 py-2.5">
                <span className="text-sm text-gray-500 font-500">Yearly savings</span>
                <span className="font-display text-xl font-700 text-green-600">{formatCurrency(audit.totalYearlySavings)}</span>
              </div>
            </>
          )}
        </motion.div>

        {/* ── Spend breakdown ───────────────────────────────── */}
        <SpendBreakdown audit={audit} />

        {/* ── AI Summary ────────────────────────────────────── */}
        <AiSummaryCard summary={aiSummary} loading={summaryLoading} />

        {/* ── Recommendations ───────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }} className="mb-6">
          <h2 className="font-display text-xl font-700 text-gray-900 mb-4">Recommendations</h2>
          <div className="space-y-3">
            {audit.recommendations.map((rec, i) => <RecommendationCard key={rec.toolEntryId} rec={rec} index={i} />)}
          </div>
        </motion.div>

        {/* ── High savings CTA ───────────────────────────────── */}
        {isHighSavings && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}
            className="mb-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-5 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div className="h-8 w-8 rounded-lg bg-yellow-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-600 text-gray-900 mb-1">Significant savings detected</h3>
                <p className="text-sm text-gray-600 mb-2">You could save over {formatCurrency(audit.totalMonthlySavings)}/mo. Book a free consultation.</p>
                <a href="mailto:hello@spendpilot.io?subject=AI Spend Consultation" className="inline-flex items-center gap-1 text-sm text-yellow-700 font-600 hover:underline">
                  Book free consultation <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Email capture ──────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }}
          className="mb-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4 text-gray-400" />
            <h3 className="font-600 text-gray-900 text-sm">Email your report</h3>
          </div>
          <p className="text-xs text-gray-400 mb-4">Get a clean summary delivered to your inbox.</p>
          {emailSent ? (
            <div className="flex items-center gap-2 text-green-600 text-sm font-500">
              <CheckCircle2 className="h-4 w-4" /> Report sent! Check your inbox.
            </div>
          ) : (
            <div className="flex gap-2">
              <Input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1" />
              <Button onClick={handleEmailSubmit} disabled={!email || emailLoading}>
                {emailLoading ? "Sending…" : "Send"}
              </Button>
            </div>
          )}
        </motion.div>

        {/* ── Actions ────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-3"
        >
          <Button onClick={handleDownloadPdf} disabled={pdfLoading} className="gap-2 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
            {pdfLoading
              ? <><div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Generating…</>
              : <><Download className="h-4 w-4" /> Download PDF</>
            }
          </Button>

          <Button variant="outline" onClick={handleShareCopy} className="gap-2">
            {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied!" : "Copy share link"}
          </Button>

          <Button variant="ghost" onClick={() => router.push("/audit")} className="gap-2">
            <RefreshCw className="h-4 w-4" /> New audit
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SpendBreakdown({ audit }: { audit: AuditResult }) {
  const pct = Math.min(100, audit.currentMonthlySpend > 0
    ? Math.round((audit.optimizedMonthlySpend / audit.currentMonthlySpend) * 100)
    : 100);
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
      className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
    >
      <div className="flex items-center justify-between mb-3 text-sm">
        <span className="text-gray-500 font-500">Monthly spend reduction</span>
        <div className="flex items-center gap-3">
          <span className="text-gray-400 line-through text-xs">{formatCurrency(audit.currentMonthlySpend)}</span>
          <span className="text-green-600 font-700">{formatCurrency(audit.optimizedMonthlySpend)}</span>
        </div>
      </div>
      <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          initial={{ width: "100%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, delay: 0.5, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-green-500"
        />
      </div>
      <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
        <span>After optimisation</span>
        <span>{pct}% of current spend</span>
      </div>
    </motion.div>
  );
}

function AiSummaryCard({ summary, loading }: { summary: string | null; loading: boolean }) {
  if (!loading && !summary) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-6 rounded-2xl border border-purple-200 bg-purple-50 p-5 shadow-sm"
    >
      <div className="flex items-center gap-2 mb-3">
        <div className="h-7 w-7 rounded-lg bg-purple-100 flex items-center justify-center">
          <Sparkles className="h-3.5 w-3.5 text-purple-600" />
        </div>
        <span className="text-sm font-600 text-gray-900">AI Summary</span>
        <span className="ml-auto text-xs text-gray-400 bg-white border border-gray-200 rounded-full px-2 py-0.5">Powered by Claude</span>
      </div>
      {loading ? (
        <div className="space-y-2">
          <div className="h-3 w-full rounded-full shimmer" />
          <div className="h-3 w-4/5 rounded-full shimmer" />
          <div className="h-3 w-3/5 rounded-full shimmer" />
        </div>
      ) : (
        <p className="text-sm text-gray-600 leading-relaxed">{summary}</p>
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
      initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35, delay: index * 0.07 }}
      className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5 shadow-sm`}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-3">
          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white border ${cfg.border} shadow-sm`}>
            <Icon className={`h-4 w-4 ${cfg.color}`} />
          </div>
          <div>
            <p className="font-600 text-gray-900 text-sm">{getToolLabel(rec.tool)}</p>
            <span className={`inline-block text-xs font-600 px-2 py-0.5 rounded-full mt-0.5 ${cfg.badge}`}>{cfg.label}</span>
          </div>
        </div>
        {hasSavings && (
          <div className="text-right shrink-0">
            <p className="font-display text-lg font-700 text-green-600">
              {formatCurrency(rec.estimatedMonthlySavings)}<span className="text-xs font-400 text-gray-400">/mo</span>
            </p>
            <p className="text-xs text-gray-400">{formatCurrency(rec.estimatedYearlySavings)}/yr</p>
          </div>
        )}
      </div>

      {rec.recommendedPlan && (
        <div className="flex items-center gap-2 mb-3 text-xs bg-white/70 rounded-lg px-3 py-1.5 border border-white w-fit">
          <span className="text-gray-500">{rec.currentPlan}</span>
          <ArrowRight className="h-3 w-3 text-gray-300" />
          <span className="text-blue-600 font-600">{rec.recommendedPlan}</span>
        </div>
      )}

      <p className="text-xs text-gray-600 leading-relaxed mb-3">{rec.reasoning}</p>

      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-400">Confidence</span>
        <div className="flex-1 h-1.5 rounded-full bg-white/80 border border-gray-200">
          <div className="h-full rounded-full bg-blue-400" style={{ width: `${rec.confidenceScore * 100}%` }} />
        </div>
        <span className="text-xs text-gray-400">{Math.round(rec.confidenceScore * 100)}%</span>
      </div>

      {rec.alternatives.length > 0 && (
        <div className="mt-3 pt-3 border-t border-white/60">
          <p className="text-xs text-gray-400 mb-2 font-500">Alternatives</p>
          <div className="space-y-1.5">
            {rec.alternatives.map((alt) => (
              <div key={`${alt.tool}-${alt.plan}`} className="flex items-start gap-2">
                <span className="text-xs text-blue-500 shrink-0 mt-0.5 font-600">→</span>
                <span className="text-xs text-gray-500">
                  <span className="font-500 text-gray-700">{getToolLabel(alt.tool)} {alt.plan}</span>
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
