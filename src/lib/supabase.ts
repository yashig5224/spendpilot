import { createClient } from "@supabase/supabase-js";
import type { AuditResult } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─── Audit storage ────────────────────────────────────────────────────────────

export async function saveAudit(audit: AuditResult): Promise<string | null> {
  const { data, error } = await supabase
    .from("audits")
    .upsert(
      {
        id: audit.id,
        share_slug: audit.shareSlug,
        tool_entries: audit.toolEntries,
        recommendations: audit.recommendations,
        total_monthly_savings: audit.totalMonthlySavings,
        total_yearly_savings: audit.totalYearlySavings,
        current_monthly_spend: audit.currentMonthlySpend,
        optimized_monthly_spend: audit.optimizedMonthlySpend,
        ai_summary: audit.aiSummary ?? null,
        email: audit.email ?? null,
        created_at: audit.createdAt,
      },
      { onConflict: "id,share_slug", ignoreDuplicates: true }
    )
    .select("id")
    .single();

  if (error) {
    console.error("Failed to save audit:", error.message);
    return null;
  }

  return data.id;
}

export async function getAuditBySlug(slug: string): Promise<AuditResult | null> {
  const { data, error } = await supabase
    .from("audits")
    .select("*")
    .eq("share_slug", slug)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    createdAt: data.created_at,
    shareSlug: data.share_slug,
    toolEntries: data.tool_entries,
    recommendations: data.recommendations,
    totalMonthlySavings: data.total_monthly_savings,
    totalYearlySavings: data.total_yearly_savings,
    currentMonthlySpend: data.current_monthly_spend,
    optimizedMonthlySpend: data.optimized_monthly_spend,
    aiSummary: data.ai_summary,
    email: data.email,
  };
}

// ─── Lead capture ─────────────────────────────────────────────────────────────

export async function saveLeadEmail(email: string, auditId: string): Promise<boolean> {
  const { error } = await supabase
    .from("leads")
    .upsert({ email, audit_id: auditId, created_at: new Date().toISOString() });

  if (error) {
    console.error("Failed to save lead:", error.message);
    return false;
  }

  return true;
}
