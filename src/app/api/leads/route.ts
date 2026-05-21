import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import type { AuditResult } from "@/lib/types";
import { getToolLabel } from "@/lib/pricing";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.RESEND_FROM_EMAIL ?? "SpendPilot <hello@spendpilot.io>";

export async function POST(req: NextRequest) {
  try {
    const body: { email: string; auditId: string; audit: AuditResult } = await req.json();
    const { email, audit } = body;

    if (!email || !audit) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const savingsRows = audit.recommendations
      .filter((r) => r.estimatedMonthlySavings > 0)
      .map(
        (r) =>
          `<tr>
            <td style="padding:10px 0;border-bottom:1px solid #1a1f2e;color:#94a3b8;">${getToolLabel(r.tool)}</td>
            <td style="padding:10px 0;border-bottom:1px solid #1a1f2e;color:#94a3b8;text-align:center;text-transform:capitalize;">${r.action}</td>
            <td style="padding:10px 0;border-bottom:1px solid #1a1f2e;color:#00e5a0;font-weight:600;text-align:right;">$${r.estimatedMonthlySavings}/mo</td>
          </tr>`
      )
      .join("");

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "https://spendpilot.io"}/audit/${audit.shareSlug}`;

    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#080c14;font-family:'DM Sans',system-ui,sans-serif;color:#e2e8f0;">
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr><td align="center" style="padding:40px 20px;">
      <table width="100%" style="max-width:560px;">
        <!-- Header -->
        <tr><td style="padding:0 0 32px;">
          <span style="font-size:13px;font-weight:600;color:#00d4ff;letter-spacing:2px;text-transform:uppercase;">SpendPilot</span>
        </td></tr>

        <!-- Hero -->
        <tr><td style="background:#0d1117;border:1px solid rgba(0,212,255,0.2);border-radius:16px;padding:32px;text-align:center;margin-bottom:24px;">
          <p style="color:#94a3b8;font-size:13px;margin:0 0 8px;text-transform:uppercase;letter-spacing:1.5px;">Your AI Spend Audit</p>
          <p style="font-size:48px;font-weight:800;color:#00d4ff;margin:0 0 4px;line-height:1;">$${audit.totalMonthlySavings}</p>
          <p style="color:#94a3b8;margin:0 0 16px;">potential monthly savings</p>
          <p style="font-size:14px;color:#94a3b8;">That&apos;s <strong style="color:#00e5a0;">$${audit.totalYearlySavings}</strong> saved per year</p>
        </td></tr>

        <!-- Recommendations table -->
        <tr><td style="padding:24px 0 0;">
          <p style="font-size:14px;font-weight:600;color:#e2e8f0;margin:0 0 12px;">Recommendations</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <th style="text-align:left;font-size:11px;color:#475569;text-transform:uppercase;padding:0 0 8px;font-weight:500;">Tool</th>
              <th style="text-align:center;font-size:11px;color:#475569;text-transform:uppercase;padding:0 0 8px;font-weight:500;">Action</th>
              <th style="text-align:right;font-size:11px;color:#475569;text-transform:uppercase;padding:0 0 8px;font-weight:500;">Savings</th>
            </tr>
            ${savingsRows}
          </table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="padding:32px 0 0;text-align:center;">
          <a href="${shareUrl}" style="display:inline-block;background:#00d4ff;color:#080c14;font-weight:600;font-size:14px;padding:14px 32px;border-radius:10px;text-decoration:none;">View full report →</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding:32px 0 0;border-top:1px solid #1a1f2e;margin-top:32px;">
          <p style="font-size:12px;color:#334155;margin:0;">© ${new Date().getFullYear()} SpendPilot · Free AI spend audits for startups</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

    const { error } = await resend.emails.send({
      from: FROM,
      to: [email],
      subject: `Your SpendPilot audit — $${audit.totalMonthlySavings}/mo in potential savings`,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Email failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Leads route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
