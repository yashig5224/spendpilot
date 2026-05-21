import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      totalMonthlySavings,
      totalYearlySavings,
      currentMonthlySpend,
      recommendations,
    } = body;

    if (!recommendations?.length) {
      return NextResponse.json(
        { summary: null },
        { status: 200 }
      );
    }

    const recLines = recommendations
      .map(
        (
          r: {
            tool: string;
            action: string;
            estimatedMonthlySavings: number;
            reasoning: string;
          }
        ) =>
          `- ${r.tool} (${r.action}): saves $${r.estimatedMonthlySavings}/mo — ${r.reasoning}`
      )
      .join("\n");

    const prompt = `
You are a concise SaaS spend advisor.

Write a professional ~100-word summary for this startup AI spend audit.

Current monthly spend: $${currentMonthlySpend}
Potential monthly savings: $${totalMonthlySavings}
Potential yearly savings: $${totalYearlySavings}

Recommendations:
${recLines}

Write:
- concise
- actionable
- professional
- plain prose only
- no markdown
- no bullet points
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent(prompt);

    const summary = result.response.text();

    return NextResponse.json({
      summary,
    });
  } catch (err) {
    console.error("Gemini summary error:", err);

    return NextResponse.json({
      summary:
        "Your AI stack shows multiple optimization opportunities that could reduce monthly software spend while maintaining team productivity.",
    });
  }
}