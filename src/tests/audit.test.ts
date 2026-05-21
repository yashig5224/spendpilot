import { describe, it, expect } from "vitest";
import { runAudit } from "@/lib/audit";
import { getPlanPrice, getToolPlans, TOOL_PRICING } from "@/lib/pricing";
import type { ToolEntry } from "@/lib/types";

function entry(overrides: Partial<ToolEntry> & { tool: ToolEntry["tool"]; plan: string }): ToolEntry {
  return {
    id: "test-id",
    monthlySpend: 0,
    seats: 1,
    teamSize: 5,
    useCase: "coding",
    ...overrides,
  };
}

// ─── Pricing data ──────────────────────────────────────────────────────────────

describe("pricing data", () => {
  it("all tools have at least one plan", () => {
    for (const [tool, data] of Object.entries(TOOL_PRICING)) {
      const plans = Object.keys(data.plans);
      expect(plans.length, `${tool} should have plans`).toBeGreaterThan(0);
    }
  });

  it("getToolPlans returns correct plans for cursor", () => {
    const plans = getToolPlans("cursor");
    expect(plans).toContain("free");
    expect(plans).toContain("pro");
    expect(plans).toContain("business");
  });

  it("getPlanPrice returns correct price", () => {
    expect(getPlanPrice("cursor", "pro")).toBe(20);
    expect(getPlanPrice("cursor", "business")).toBe(40);
    expect(getPlanPrice("chatgpt", "plus")).toBe(20);
    expect(getPlanPrice("chatgpt", "team")).toBe(30);
    expect(getPlanPrice("github-copilot", "individual")).toBe(10);
    expect(getPlanPrice("github-copilot", "enterprise")).toBe(39);
  });

  it("free plans have $0 price", () => {
    expect(getPlanPrice("cursor", "free")).toBe(0);
    expect(getPlanPrice("chatgpt", "free")).toBe(0);
    expect(getPlanPrice("gemini", "free")).toBe(0);
  });
});

// ─── Cursor ────────────────────────────────────────────────────────────────────

describe("cursor audit", () => {
  it("recommends downgrade from business to pro for small teams", () => {
    const result = runAudit([
      entry({ tool: "cursor", plan: "business", seats: 2, monthlySpend: 80 }),
    ]);
    const rec = result.recommendations[0];
    expect(rec.action).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("pro");
    expect(rec.estimatedMonthlySavings).toBeGreaterThan(0);
  });

  it("recommends keep for pro plan individual developer", () => {
    const result = runAudit([
      entry({ tool: "cursor", plan: "pro", seats: 1, monthlySpend: 20, useCase: "coding" }),
    ]);
    const rec = result.recommendations[0];
    expect(rec.action).toBe("keep");
  });

  it("calculates correct savings for business->pro with 3 seats", () => {
    const result = runAudit([
      entry({ tool: "cursor", plan: "business", seats: 3, monthlySpend: 120 }),
    ]);
    const rec = result.recommendations[0];
    // (40-20) * 3 = $60/mo
    expect(rec.estimatedMonthlySavings).toBe(60);
    expect(rec.estimatedYearlySavings).toBe(720);
  });
});

// ─── GitHub Copilot ────────────────────────────────────────────────────────────

describe("github-copilot audit", () => {
  it("recommends downgrade from enterprise if seats < 150", () => {
    const result = runAudit([
      entry({ tool: "github-copilot", plan: "enterprise", seats: 10, monthlySpend: 390 }),
    ]);
    const rec = result.recommendations[0];
    expect(rec.action).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("business");
    expect(rec.estimatedMonthlySavings).toBe((39 - 19) * 10);
  });

  it("recommends downgrade from business for tiny teams", () => {
    const result = runAudit([
      entry({ tool: "github-copilot", plan: "business", seats: 3, teamSize: 4, monthlySpend: 57 }),
    ]);
    const rec = result.recommendations[0];
    expect(rec.action).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("individual");
  });

  it("keeps enterprise for large orgs", () => {
    const result = runAudit([
      entry({ tool: "github-copilot", plan: "enterprise", seats: 200, monthlySpend: 7800 }),
    ]);
    const rec = result.recommendations[0];
    expect(rec.action).not.toBe("downgrade");
  });
});

// ─── ChatGPT ───────────────────────────────────────────────────────────────────

describe("chatgpt audit", () => {
  it("recommends downgrade from team to plus for solo users", () => {
    const result = runAudit([
      entry({ tool: "chatgpt", plan: "team", seats: 1, monthlySpend: 30 }),
    ]);
    const rec = result.recommendations[0];
    expect(rec.action).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("plus");
    expect(rec.estimatedMonthlySavings).toBe(10);
  });

  it("recommends downgrade from enterprise for small orgs", () => {
    const result = runAudit([
      entry({ tool: "chatgpt", plan: "enterprise", seats: 20, monthlySpend: 1200 }),
    ]);
    const rec = result.recommendations[0];
    expect(rec.action).toBe("downgrade");
    expect(rec.estimatedMonthlySavings).toBe((60 - 30) * 20);
  });
});

// ─── Claude ────────────────────────────────────────────────────────────────────

describe("claude audit", () => {
  it("recommends downgrade from team for low-collaboration solo use", () => {
    const result = runAudit([
      entry({ tool: "claude", plan: "team", seats: 1, teamSize: 2, useCase: "coding", monthlySpend: 30 }),
    ]);
    const rec = result.recommendations[0];
    expect(rec.action).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("pro");
    expect(rec.estimatedMonthlySavings).toBe(10);
  });

  it("keeps team plan for writing teams with 5+ seats", () => {
    const result = runAudit([
      entry({ tool: "claude", plan: "team", seats: 6, teamSize: 8, useCase: "writing", monthlySpend: 180 }),
    ]);
    const rec = result.recommendations[0];
    expect(rec.action).toBe("keep");
  });
});

// ─── API tools ─────────────────────────────────────────────────────────────────

describe("anthropic-api audit", () => {
  it("recommends downgrade from opus to sonnet for high spend", () => {
    const result = runAudit([
      entry({ tool: "anthropic-api", plan: "claude-opus", seats: 1, monthlySpend: 500 }),
    ]);
    const rec = result.recommendations[0];
    expect(rec.action).toBe("downgrade");
    expect(rec.recommendedPlan).toBe("claude-sonnet");
    expect(rec.estimatedMonthlySavings).toBeGreaterThan(0);
  });

  it("suggests subscription for very low API spend", () => {
    const result = runAudit([
      entry({ tool: "anthropic-api", plan: "claude-sonnet", seats: 1, monthlySpend: 8 }),
    ]);
    const rec = result.recommendations[0];
    expect(rec.action).toBe("switch");
  });
});

describe("openai-api audit", () => {
  it("recommends gpt-4o-mini for high gpt-4-turbo spend", () => {
    const result = runAudit([
      entry({ tool: "openai-api", plan: "gpt-4-turbo", seats: 1, monthlySpend: 200 }),
    ]);
    const rec = result.recommendations[0];
    expect(rec.action).toBe("downgrade");
    expect(rec.estimatedMonthlySavings).toBeGreaterThan(0);
  });
});

// ─── Aggregate calculations ────────────────────────────────────────────────────

describe("aggregate savings", () => {
  it("totalMonthlySavings is sum of all recommendation savings", () => {
    const result = runAudit([
      entry({ tool: "cursor", plan: "business", seats: 2, monthlySpend: 80 }),
      entry({ id: "id2", tool: "chatgpt", plan: "team", seats: 1, monthlySpend: 30 }),
    ]);
    const expected = result.recommendations.reduce((s, r) => s + r.estimatedMonthlySavings, 0);
    expect(result.totalMonthlySavings).toBe(expected);
  });

  it("totalYearlySavings is 12x monthly", () => {
    const result = runAudit([
      entry({ tool: "cursor", plan: "business", seats: 3, monthlySpend: 120 }),
    ]);
    expect(result.totalYearlySavings).toBe(result.totalMonthlySavings * 12);
  });

  it("optimizedMonthlySpend is never negative", () => {
    const result = runAudit([
      entry({ tool: "cursor", plan: "free", seats: 1, monthlySpend: 0, useCase: "coding" }),
    ]);
    expect(result.optimizedMonthlySpend).toBeGreaterThanOrEqual(0);
  });

  it("handles single tool with no savings gracefully", () => {
    const result = runAudit([
      entry({ tool: "cursor", plan: "pro", seats: 1, monthlySpend: 20, useCase: "coding" }),
    ]);
    expect(result.recommendations).toHaveLength(1);
    expect(result.recommendations[0].action).toBe("keep");
    expect(result.totalMonthlySavings).toBe(0);
  });

  it("handles empty tool list", () => {
    const result = runAudit([]);
    expect(result.recommendations).toHaveLength(0);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalYearlySavings).toBe(0);
  });
});

// ─── Windsurf ──────────────────────────────────────────────────────────────────

describe("windsurf audit", () => {
  it("recommends downgrade from teams to pro for small devs", () => {
    const result = runAudit([
      entry({ tool: "windsurf", plan: "teams", seats: 2, monthlySpend: 70 }),
    ]);
    const rec = result.recommendations[0];
    expect(rec.action).toBe("downgrade");
    expect(rec.estimatedMonthlySavings).toBe((35 - 15) * 2);
  });
});
