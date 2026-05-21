import { TOOL_PRICING, getPlanPrice } from "./pricing";
import type { ToolEntry, Recommendation, Alternative, AuditResult } from "./types";
import { nanoid } from "./utils";

// ─── Rule helpers ─────────────────────────────────────────────────────────────

function calcMonthlySpend(entry: ToolEntry): number {
  const planPrice = getPlanPrice(entry.tool, entry.plan);
  if (TOOL_PRICING[entry.tool].isApiTool) return entry.monthlySpend;
  return planPrice * entry.seats;
}

function calcExpectedSpend(entry: ToolEntry): number {
  return calcMonthlySpend(entry);
}

// Returns how much they overpay vs what they should pay
function overpayCost(entry: ToolEntry): number {
  const expected = calcExpectedSpend(entry);
  return Math.max(0, entry.monthlySpend - expected);
}

// ─── Per-tool audit rules ──────────────────────────────────────────────────────

function auditCursor(entry: ToolEntry): Recommendation {
  const alternatives: Alternative[] = [];
  let action: Recommendation["action"] = "keep";
  let recommendedPlan: string | null = null;
  let savings = 0;
  let reasoning = "";
  let confidence = 0.7;

  if (entry.plan === "business" && entry.seats <= 3) {
    recommendedPlan = "pro";
    savings = (40 - 20) * entry.seats;
    action = "downgrade";
    reasoning = `With only ${entry.seats} seat(s), the Business plan's SSO and admin features are unnecessary. Pro gives full AI power at half the price.`;
    confidence = 0.9;
  } else if (entry.plan === "pro" && entry.useCase === "coding" && entry.seats >= 1) {
    reasoning = "Pro is the optimal plan for individual developers. Your spend looks well-calibrated.";
    confidence = 0.85;
  } else {
    reasoning = "Cursor usage looks appropriately matched to your plan and team size.";
  }

  alternatives.push({
    tool: "windsurf",
    plan: "pro",
    monthlyPerSeat: 15,
    reason: "Windsurf Pro offers comparable AI coding at $15/seat vs Cursor Pro's $20/seat.",
  });

  return buildRec(entry, action, recommendedPlan, savings, reasoning, confidence, alternatives);
}

function auditGithubCopilot(entry: ToolEntry): Recommendation {
  const alternatives: Alternative[] = [];
  let action: Recommendation["action"] = "keep";
  let recommendedPlan: string | null = null;
  let savings = 0;
  let reasoning = "";
  let confidence = 0.75;

  if (entry.plan === "enterprise" && entry.seats < 150) {
    recommendedPlan = "business";
    savings = (39 - 19) * entry.seats;
    action = "downgrade";
    reasoning = `Enterprise requires 150+ seats to justify cost. At ${entry.seats} seats, Business plan covers all team needs.`;
    confidence = 0.95;
  } else if (entry.plan === "business" && entry.seats <= 5 && entry.teamSize <= 8) {
    recommendedPlan = "individual";
    savings = (19 - 10) * entry.seats;
    action = "downgrade";
    reasoning = `Small teams under 8 rarely need Business plan's policy management. Individual plan saves $9/seat/mo.`;
    confidence = 0.8;
  } else if (entry.plan === "individual" && entry.seats > 1) {
    recommendedPlan = "business";
    action = "upgrade";
    savings = 0;
    reasoning = `With multiple seats, upgrading to Business plan adds team controls and audit logs worth the extra $9/seat.`;
    confidence = 0.6;
  } else {
    reasoning = "GitHub Copilot plan is well-matched to your team.";
  }

  alternatives.push({
    tool: "cursor",
    plan: "pro",
    monthlyPerSeat: 20,
    reason: "Cursor's chat-first interface often yields higher productivity for complex refactors.",
  });

  return buildRec(entry, action, recommendedPlan, savings, reasoning, confidence, alternatives);
}

function auditClaude(entry: ToolEntry): Recommendation {
  const alternatives: Alternative[] = [];
  let action: Recommendation["action"] = "keep";
  let recommendedPlan: string | null = null;
  let savings = 0;
  let reasoning = "";
  let confidence = 0.75;

  const isLowCollaboration = entry.teamSize <= 3 || entry.useCase !== "writing";

  if (entry.plan === "team" && isLowCollaboration && entry.seats < 5) {
    recommendedPlan = "pro";
    savings = (30 - 20) * entry.seats;
    action = "downgrade";
    reasoning = `Team plan requires 5+ seats and is designed for collaborative workflows. At ${entry.seats} seat(s) with ${entry.useCase} use case, Pro delivers the same AI capability at $10 less per seat.`;
    confidence = 0.88;
  } else if (entry.plan === "pro" && entry.useCase === "coding") {
    alternatives.push({
      tool: "anthropic-api",
      plan: "claude-sonnet",
      monthlyPerSeat: 0,
      reason: "Direct API access to Claude 3.5 Sonnet may be cheaper for high-volume coding workflows.",
    });
    reasoning = "Claude Pro is solid for individual coding workflows. Consider API access if usage is high.";
    confidence = 0.7;
  } else {
    reasoning = "Claude plan is well-matched to your team size and use case.";
  }

  return buildRec(entry, action, recommendedPlan, savings, reasoning, confidence, alternatives);
}

function auditChatGPT(entry: ToolEntry): Recommendation {
  const alternatives: Alternative[] = [];
  let action: Recommendation["action"] = "keep";
  let recommendedPlan: string | null = null;
  let savings = 0;
  let reasoning = "";
  let confidence = 0.75;

  if (entry.plan === "team" && entry.seats <= 2) {
    recommendedPlan = "plus";
    savings = (30 - 20) * entry.seats;
    action = "downgrade";
    reasoning = `With only ${entry.seats} seat(s), ChatGPT Team's shared workspace features aren't utilized. Plus gives identical model access at $10 less.`;
    confidence = 0.9;
  } else if (entry.plan === "enterprise" && entry.seats < 150) {
    recommendedPlan = "team";
    savings = (60 - 30) * entry.seats;
    action = "downgrade";
    reasoning = `Enterprise plan is designed for 150+ seat orgs with compliance needs. Team plan covers your ${entry.seats} seat(s) effectively.`;
    confidence = 0.95;
  } else if (entry.plan === "plus" && entry.useCase === "coding") {
    alternatives.push({
      tool: "cursor",
      plan: "pro",
      monthlyPerSeat: 20,
      reason: "Cursor is purpose-built for coding with IDE integration — far more productive for devs.",
    });
    reasoning = "For coding use cases, a dedicated coding AI tool would serve you better.";
    confidence = 0.72;
  } else {
    reasoning = "ChatGPT plan aligns with your team structure.";
  }

  return buildRec(entry, action, recommendedPlan, savings, reasoning, confidence, alternatives);
}

function auditAnthropicApi(entry: ToolEntry): Recommendation {
  const alternatives: Alternative[] = [];
  let action: Recommendation["action"] = "keep";
  let recommendedPlan: string | null = null;
  let savings = 0;
  let reasoning = "";
  let confidence = 0.7;

  if (entry.plan === "claude-opus" && entry.monthlySpend > 100) {
    const estimatedSonnetCost = entry.monthlySpend * 0.2; // Sonnet is ~5x cheaper
    savings = entry.monthlySpend - estimatedSonnetCost;
    recommendedPlan = "claude-sonnet";
    action = "downgrade";
    reasoning = `Claude Opus costs ~5x more than Sonnet. For most tasks, Sonnet 3.5 matches Opus quality. Switching could save ~80% of API spend.`;
    confidence = 0.82;
  } else if (entry.plan === "claude-sonnet" && entry.monthlySpend < 20) {
    action = "switch";
    recommendedPlan = null;
    reasoning = `Low API spend (<$20/mo) suggests you might be better served by a Claude Pro subscription ($20/mo flat) with predictable costs.`;
    confidence = 0.78;
    alternatives.push({
      tool: "claude",
      plan: "pro",
      monthlyPerSeat: 20,
      reason: "Claude Pro subscription offers unlimited usage without per-token anxiety.",
    });
  } else {
    reasoning = "API usage looks well-calibrated for your needs.";
  }

  return buildRec(entry, action, recommendedPlan, savings, reasoning, confidence, alternatives);
}

function auditOpenAiApi(entry: ToolEntry): Recommendation {
  const alternatives: Alternative[] = [];
  let action: Recommendation["action"] = "keep";
  let recommendedPlan: string | null = null;
  let savings = 0;
  let reasoning = "";
  let confidence = 0.7;

  if (entry.plan === "gpt-4-turbo" && entry.monthlySpend > 50) {
    const estimatedGpt4oMiniCost = entry.monthlySpend * 0.06;
    savings = entry.monthlySpend - estimatedGpt4oMiniCost;
    recommendedPlan = "gpt-4o-mini";
    action = "downgrade";
    reasoning = `GPT-4 Turbo is ~40x more expensive than GPT-4o mini. For most production tasks, GPT-4o mini achieves 90%+ of the quality at a fraction of the cost.`;
    confidence = 0.8;
  } else if (entry.plan === "gpt-4o" && entry.monthlySpend > 200) {
    const estimatedSavings = entry.monthlySpend * 0.4;
    savings = estimatedSavings;
    recommendedPlan = "gpt-4o-mini";
    action = "consolidate";
    reasoning = `High GPT-4o spend detected. Consider routing simpler tasks to GPT-4o mini and reserving GPT-4o for complex reasoning. Could reduce costs by ~40%.`;
    confidence = 0.75;
  } else if (entry.monthlySpend < 15) {
    action = "switch";
    reasoning = `Low API spend suggests a ChatGPT Plus subscription may offer better value at flat $20/mo.`;
    alternatives.push({
      tool: "chatgpt",
      plan: "plus",
      monthlyPerSeat: 20,
      reason: "Flat-rate Plus subscription with no per-token surprises.",
    });
    confidence = 0.72;
  } else {
    reasoning = "OpenAI API usage looks well-optimized for your current workload.";
  }

  return buildRec(entry, action, recommendedPlan, savings, reasoning, confidence, alternatives);
}

function auditGemini(entry: ToolEntry): Recommendation {
  const alternatives: Alternative[] = [];
  let action: Recommendation["action"] = "keep";
  let recommendedPlan: string | null = null;
  let savings = 0;
  let reasoning = "";
  let confidence = 0.7;

  if (entry.plan === "workspace-business" && !["writing", "research"].includes(entry.useCase)) {
    recommendedPlan = "advanced";
    savings = (30 - 19.99) * entry.seats;
    action = "downgrade";
    reasoning = `Workspace Business plan is optimized for Google Workspace integration. For ${entry.useCase} use, Gemini Advanced gives equivalent AI at lower cost.`;
    confidence = 0.8;
  } else if (entry.plan === "advanced" && entry.seats > 1) {
    reasoning = "Gemini Advanced is correctly scoped. For multi-seat needs, consider Workspace Business for admin controls.";
    action = "upgrade";
    confidence = 0.65;
  } else {
    reasoning = "Gemini plan is appropriate for your current use case.";
  }

  alternatives.push({
    tool: "claude",
    plan: "pro",
    monthlyPerSeat: 20,
    reason: "Claude Pro often outperforms Gemini Advanced for writing and analysis tasks.",
  });

  return buildRec(entry, action, recommendedPlan, savings, reasoning, confidence, alternatives);
}

function auditWindsurf(entry: ToolEntry): Recommendation {
  const alternatives: Alternative[] = [];
  let action: Recommendation["action"] = "keep";
  let recommendedPlan: string | null = null;
  let savings = 0;
  let reasoning = "";
  let confidence = 0.75;

  if (entry.plan === "teams" && entry.seats <= 3) {
    recommendedPlan = "pro";
    savings = (35 - 15) * entry.seats;
    action = "downgrade";
    reasoning = `Windsurf Teams adds management overhead without value for under 4 developers. Pro covers all AI features at less than half the cost.`;
    confidence = 0.88;
  } else if (entry.plan === "pro" && entry.useCase === "coding") {
    reasoning = "Windsurf Pro is the sweet spot for individual coding workflows.";
    alternatives.push({
      tool: "cursor",
      plan: "pro",
      monthlyPerSeat: 20,
      reason: "Cursor has more mature multi-model support and a larger ecosystem.",
    });
    confidence = 0.8;
  } else {
    reasoning = "Windsurf plan looks appropriately chosen.";
  }

  return buildRec(entry, action, recommendedPlan, savings, reasoning, confidence, alternatives);
}

// ─── Build recommendation object ──────────────────────────────────────────────

function buildRec(
  entry: ToolEntry,
  action: Recommendation["action"],
  recommendedPlan: string | null,
  monthlySavings: number,
  reasoning: string,
  confidenceScore: number,
  alternatives: Alternative[]
): Recommendation {
  // Clamp overpay into savings if user typed a wrong amount
  const overpay = overpayCost(entry);
  const totalMonthlySavings = Math.round(monthlySavings + overpay);

  return {
    toolEntryId: entry.id,
    tool: entry.tool,
    currentPlan: entry.plan,
    recommendedPlan,
    action,
    reasoning,
    estimatedMonthlySavings: totalMonthlySavings,
    estimatedYearlySavings: totalMonthlySavings * 12,
    confidenceScore,
    alternatives,
  };
}

// ─── Dispatch ─────────────────────────────────────────────────────────────────

function auditTool(entry: ToolEntry): Recommendation {
  switch (entry.tool) {
    case "cursor":
      return auditCursor(entry);
    case "github-copilot":
      return auditGithubCopilot(entry);
    case "claude":
      return auditClaude(entry);
    case "chatgpt":
      return auditChatGPT(entry);
    case "anthropic-api":
      return auditAnthropicApi(entry);
    case "openai-api":
      return auditOpenAiApi(entry);
    case "gemini":
      return auditGemini(entry);
    case "windsurf":
      return auditWindsurf(entry);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function runAudit(entries: ToolEntry[]): Omit<AuditResult, "id" | "createdAt" | "shareSlug" | "aiSummary" | "email"> {
  const recommendations = entries.map(auditTool);

  const totalMonthlySavings = recommendations.reduce(
    (sum, r) => sum + r.estimatedMonthlySavings,
    0
  );

  const currentMonthlySpend = entries.reduce((sum, e) => {
    if (TOOL_PRICING[e.tool].isApiTool) return sum + e.monthlySpend;
    return sum + getPlanPrice(e.tool, e.plan) * e.seats;
  }, 0);

  // Use user-reported spend as fallback for API tools
  const reportedSpend = entries.reduce((sum, e) => sum + e.monthlySpend, 0);
  const spend = Math.max(currentMonthlySpend, reportedSpend);

  return {
    toolEntries: entries,
    recommendations,
    totalMonthlySavings,
    totalYearlySavings: totalMonthlySavings * 12,
    currentMonthlySpend: spend,
    optimizedMonthlySpend: Math.max(0, spend - totalMonthlySavings),
  };
}
