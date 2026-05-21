import type { AiTool } from "./types";

export interface PlanInfo {
  name: string;
  monthlyPerSeat: number;
  minSeats: number;
  maxSeats?: number;
  features: string[];
  bestFor: string[];
}

export interface ToolPricing {
  label: string;
  plans: Record<string, PlanInfo>;
  isApiTool: boolean;
  apiPricing?: {
    inputPer1kTokens: number;
    outputPer1kTokens: number;
    freeMonthlyLimit?: number;
  };
}

export const TOOL_PRICING: Record<AiTool, ToolPricing> = {
  cursor: {
    label: "Cursor",
    isApiTool: false,
    plans: {
      free: {
        name: "Free",
        monthlyPerSeat: 0,
        minSeats: 1,
        features: ["2000 completions/mo", "50 slow requests"],
        bestFor: ["hobbyists", "evaluation"],
      },
      pro: {
        name: "Pro",
        monthlyPerSeat: 20,
        minSeats: 1,
        features: ["Unlimited completions", "500 fast requests", "10 Claude Opus"],
        bestFor: ["individual developers", "freelancers"],
      },
      business: {
        name: "Business",
        monthlyPerSeat: 40,
        minSeats: 1,
        features: ["Everything in Pro", "SSO", "centralized billing", "admin dashboard"],
        bestFor: ["teams", "enterprises"],
      },
    },
  },
  "github-copilot": {
    label: "GitHub Copilot",
    isApiTool: false,
    plans: {
      free: {
        name: "Free",
        monthlyPerSeat: 0,
        minSeats: 1,
        features: ["2000 completions/mo", "50 chat messages"],
        bestFor: ["evaluation", "light use"],
      },
      individual: {
        name: "Individual",
        monthlyPerSeat: 10,
        minSeats: 1,
        features: ["Unlimited completions", "Unlimited chat", "CLI support"],
        bestFor: ["solo developers"],
      },
      business: {
        name: "Business",
        monthlyPerSeat: 19,
        minSeats: 1,
        features: ["Everything in Individual", "policy management", "audit logs"],
        bestFor: ["small to medium teams"],
      },
      enterprise: {
        name: "Enterprise",
        monthlyPerSeat: 39,
        minSeats: 1,
        features: ["Everything in Business", "fine-tuning", "PR summaries", "security features"],
        bestFor: ["large enterprises", "compliance-heavy orgs"],
      },
    },
  },
  claude: {
    label: "Claude (Anthropic)",
    isApiTool: false,
    plans: {
      free: {
        name: "Free",
        monthlyPerSeat: 0,
        minSeats: 1,
        features: ["Limited messages", "Claude 3.5 Sonnet"],
        bestFor: ["evaluation", "occasional use"],
      },
      pro: {
        name: "Pro",
        monthlyPerSeat: 20,
        minSeats: 1,
        features: ["5x more usage", "Priority access", "Projects", "Claude 3 Opus"],
        bestFor: ["power users", "individuals"],
      },
      team: {
        name: "Team",
        monthlyPerSeat: 30,
        minSeats: 5,
        features: ["Everything in Pro", "Collaboration", "Admin console", "SSO"],
        bestFor: ["teams with 5+ members", "collaborative workflows"],
      },
    },
  },
  chatgpt: {
    label: "ChatGPT (OpenAI)",
    isApiTool: false,
    plans: {
      free: {
        name: "Free",
        monthlyPerSeat: 0,
        minSeats: 1,
        features: ["GPT-4o mini", "Limited GPT-4o"],
        bestFor: ["casual use", "evaluation"],
      },
      plus: {
        name: "Plus",
        monthlyPerSeat: 20,
        minSeats: 1,
        features: ["GPT-4o", "Advanced data analysis", "DALL·E", "Custom GPTs"],
        bestFor: ["power users", "individuals"],
      },
      team: {
        name: "Team",
        monthlyPerSeat: 30,
        minSeats: 2,
        features: ["Everything in Plus", "Shared workspace", "Admin console", "No data training"],
        bestFor: ["small teams", "2–149 members"],
      },
      enterprise: {
        name: "Enterprise",
        monthlyPerSeat: 60,
        minSeats: 150,
        features: ["Everything in Team", "SSO", "Custom data retention", "Dedicated support"],
        bestFor: ["large enterprises", "150+ members"],
      },
    },
  },
  "anthropic-api": {
    label: "Anthropic API",
    isApiTool: true,
    plans: {
      "claude-haiku": {
        name: "Claude 3 Haiku",
        monthlyPerSeat: 0,
        minSeats: 1,
        features: ["$0.25/MTok input", "$1.25/MTok output", "Fastest"],
        bestFor: ["high-volume tasks", "cost-sensitive workloads"],
      },
      "claude-sonnet": {
        name: "Claude 3.5 Sonnet",
        monthlyPerSeat: 0,
        minSeats: 1,
        features: ["$3/MTok input", "$15/MTok output", "Best balance"],
        bestFor: ["general use", "coding", "analysis"],
      },
      "claude-opus": {
        name: "Claude 3 Opus",
        monthlyPerSeat: 0,
        minSeats: 1,
        features: ["$15/MTok input", "$75/MTok output", "Most capable"],
        bestFor: ["complex reasoning", "nuanced tasks"],
      },
    },
    apiPricing: {
      inputPer1kTokens: 0.003,
      outputPer1kTokens: 0.015,
    },
  },
  "openai-api": {
    label: "OpenAI API",
    isApiTool: true,
    plans: {
      "gpt-4o-mini": {
        name: "GPT-4o mini",
        monthlyPerSeat: 0,
        minSeats: 1,
        features: ["$0.15/MTok input", "$0.60/MTok output", "Fastest"],
        bestFor: ["high-volume", "simple tasks"],
      },
      "gpt-4o": {
        name: "GPT-4o",
        monthlyPerSeat: 0,
        minSeats: 1,
        features: ["$2.50/MTok input", "$10/MTok output"],
        bestFor: ["balanced performance", "general tasks"],
      },
      "gpt-4-turbo": {
        name: "GPT-4 Turbo",
        monthlyPerSeat: 0,
        minSeats: 1,
        features: ["$10/MTok input", "$30/MTok output"],
        bestFor: ["complex reasoning", "large context"],
      },
    },
    apiPricing: {
      inputPer1kTokens: 0.0025,
      outputPer1kTokens: 0.01,
    },
  },
  gemini: {
    label: "Google Gemini",
    isApiTool: false,
    plans: {
      free: {
        name: "Free",
        monthlyPerSeat: 0,
        minSeats: 1,
        features: ["Gemini 1.5 Flash", "Limited Gemini 1.5 Pro"],
        bestFor: ["casual use", "evaluation"],
      },
      advanced: {
        name: "Advanced",
        monthlyPerSeat: 19.99,
        minSeats: 1,
        features: ["Gemini Ultra 1.0", "2TB storage", "Priority access"],
        bestFor: ["power users", "Google Workspace users"],
      },
      "workspace-business": {
        name: "Workspace Business",
        monthlyPerSeat: 30,
        minSeats: 1,
        features: ["Gemini in all Workspace apps", "Admin controls", "Security"],
        bestFor: ["business teams", "Google Workspace orgs"],
      },
    },
  },
  windsurf: {
    label: "Windsurf (Codeium)",
    isApiTool: false,
    plans: {
      free: {
        name: "Free",
        monthlyPerSeat: 0,
        minSeats: 1,
        features: ["Unlimited completions", "5 premium requests/day"],
        bestFor: ["evaluation", "students"],
      },
      pro: {
        name: "Pro",
        monthlyPerSeat: 15,
        minSeats: 1,
        features: ["Unlimited completions", "Unlimited Cascade Base", "500 premium credits/mo"],
        bestFor: ["individual developers"],
      },
      teams: {
        name: "Teams",
        monthlyPerSeat: 35,
        minSeats: 1,
        features: ["Everything in Pro", "Team management", "Analytics", "Priority support"],
        bestFor: ["development teams"],
      },
    },
  },
};

export function getToolPlans(tool: AiTool): string[] {
  return Object.keys(TOOL_PRICING[tool].plans);
}

export function getPlanPrice(tool: AiTool, plan: string): number {
  return TOOL_PRICING[tool].plans[plan]?.monthlyPerSeat ?? 0;
}

export function getToolLabel(tool: AiTool): string {
  return TOOL_PRICING[tool].label;
}
