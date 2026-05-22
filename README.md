# SpendPilot

> Audit your AI software spend. Discover hidden savings in minutes.

SpendPilot is a modern SaaS platform that helps startups and teams analyze AI software spending across tools like Cursor, ChatGPT, Claude, GitHub Copilot, Gemini, and more.

The platform uses a deterministic rules-based audit engine to identify:

* overspending,
* unnecessary plans,
* cheaper alternatives,
* optimization opportunities,
* estimated monthly and annual savings.

---

## Features

### AI Spend Audit

Analyze subscriptions and API usage across popular AI tools.

### Deterministic Audit Engine

No AI hallucinations in calculations. All recommendations are generated using hardcoded business rules and pricing logic.

### Personalized Recommendations

Get actionable recommendations with estimated savings and reasoning.

### AI-Generated Executive Summary

Generate concise audit summaries using Google Gemini AI.

### Shareable Public Reports

Create shareable audit URLs with public-safe report views.

### Lead Capture + Email Delivery

Capture leads and send audit summaries using Resend.

### Modern SaaS UI

Responsive dark-mode-first experience inspired by Linear, Vercel, and Perplexity.

---

# Tech Stack

| Layer         | Technology            |
| ------------- | --------------------- |
| Framework     | Next.js 15 App Router |
| Language      | TypeScript            |
| Styling       | TailwindCSS           |
| UI Components | shadcn/ui             |
| Animation     | Framer Motion         |
| Forms         | React Hook Form + Zod |
| Database      | Supabase              |
| AI Summary    | Google Gemini         |
| Email         | Resend                |
| Charts        | Recharts              |
| Testing       | Vitest                |
| CI/CD         | GitHub Actions        |
| Deployment    | Vercel                |

---

# Project Structure

```txt
src/
├── app/
│   ├── page.tsx
│   ├── audit/
│   ├── results/
│   ├── audit/[id]/
│   └── api/
│
├── components/
│   ├── landing/
│   ├── ui/
│   └── shared/
│
├── lib/
│   ├── audit.ts
│   ├── pricing.ts
│   ├── supabase.ts
│   ├── types.ts
│   └── utils.ts
│
└── tests/
```

---

# Core Architecture

The application intentionally uses a simple and maintainable architecture optimized for rapid iteration and readability.

## Audit Engine

The audit engine is fully deterministic and implemented in:

```txt
src/lib/audit.ts
```

Responsibilities:

* recommendation generation,
* savings calculations,
* pricing comparisons,
* reasoning generation,
* confidence scoring.

No AI is used for calculations.

---

## Pricing Data

Pricing configuration is centralized in:

```txt
src/lib/pricing.ts
```

This includes:

* monthly subscription pricing,
* API pricing assumptions,
* seat-based calculations,
* optimization thresholds.

---

## AI Summary Layer

Google Gemini is used only for:

* summarizing results,
* generating concise executive summaries.

AI does not influence:

* pricing,
* calculations,
* recommendation logic.

---

# Supported AI Tools

SpendPilot currently supports auditing for:

* Cursor
* ChatGPT
* Claude
* GitHub Copilot
* Gemini
* Windsurf
* OpenAI API
* Anthropic API

---
# Screenshots of the project 
## 1. Landing Page
<img src="" width=200px>

## 2.Audit Form Page
<img src="" width=200px>

## 3.Audit Review Page
<img src="" width=200px>

## 4.Downloaded pdf 
<img src="" width=200px>

## 5.Email form 
<img src="" width=200px>


---
# Local Development

## 1. Clone Repository

```bash
git clone https://github.com/your-username/spendpilot.git
cd spendpilot
```

---

## 2. Install Dependencies

```bash
npm install
```

---

## 3. Configure Environment Variables

Create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

Add values:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Gemini
GEMINI_API_KEY=your_gemini_api_key

# Resend
RESEND_API_KEY=your_resend_api_key
RESEND_FROM_EMAIL=your_verified_email

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 4. Setup Database

Run the SQL schema from:

```txt
supabase/schema.sql
```

inside the Supabase SQL editor.

---

## 5. Start Development Server

```bash
npm run dev
```

---

# Testing

Run tests:

```bash
npm run test
```

Current coverage includes:

* pricing calculations,
* recommendation logic,
* savings calculations,
* edge cases,
* deterministic audit behavior.

---

# Deployment

Deploy using Vercel:

```bash
npx vercel --prod
```

After deployment:

* configure environment variables,
* update `NEXT_PUBLIC_APP_URL`,
* redeploy.

---

# Performance Goals

The application is optimized for:

* Lighthouse Performance ≥ 85
* Accessibility ≥ 90
* Best Practices ≥ 90

Key optimizations:

* semantic HTML,
* responsive rendering,
* minimal abstractions,
* accessible components,
* lightweight architecture.

---

# Design Philosophy

SpendPilot intentionally prioritizes:

* simplicity,
* maintainability,
* readability,
* realistic startup architecture,
* production-quality UX.

The codebase avoids:

* overengineering,
* unnecessary abstractions,
* large service layers,
* complex state management,
* excessive dependencies.

---

# Future Improvements

Potential future enhancements:

* real usage analytics integrations,
* Stripe billing insights,
* Slack notifications,
* historical spend tracking,
* multi-user collaboration,
* CSV import/export,
* automated SaaS optimization alerts.

---

# License

MIT License

---

# Author

Built as part of a startup engineering assignment focused on:

* product thinking,
* engineering quality,
* maintainable architecture,
* deterministic business logic,
* modern SaaS UX.
