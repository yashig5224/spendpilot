export type AiTool =
  | "cursor"
  | "github-copilot"
  | "claude"
  | "chatgpt"
  | "anthropic-api"
  | "openai-api"
  | "gemini"
  | "windsurf";

export type UseCase =
  | "coding"
  | "writing"
  | "research"
  | "customer-support"
  | "data-analysis"
  | "general";

export interface ToolEntry {
  id: string;
  tool: AiTool;
  plan: string;
  monthlySpend: number;
  seats: number;
  teamSize: number;
  useCase: UseCase;
}

export interface Recommendation {
  toolEntryId: string;
  tool: AiTool;
  currentPlan: string;
  recommendedPlan: string | null;
  action: "downgrade" | "upgrade" | "switch" | "keep" | "consolidate";
  reasoning: string;
  estimatedMonthlySavings: number;
  estimatedYearlySavings: number;
  confidenceScore: number; // 0–1
  alternatives: Alternative[];
}

export interface Alternative {
  tool: AiTool;
  plan: string;
  monthlyPerSeat: number;
  reason: string;
}

export interface AuditResult {
  id: string;
  createdAt: string;
  toolEntries: ToolEntry[];
  recommendations: Recommendation[];
  totalMonthlySavings: number;
  totalYearlySavings: number;
  currentMonthlySpend: number;
  optimizedMonthlySpend: number;
  aiSummary?: string;
  email?: string;
  shareSlug: string;
}

export interface LeadCapture {
  email: string;
  auditId: string;
}
