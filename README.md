# SpendPilot

> Check your AI software spending. Find out where you can save money in a few minutes.

SpendPilot is a platform that helps small companies and teams keep track of how much they spend on AI software tools like Cursor, ChatGPT, Claude, GitHub Copilot, Gemini and more.

The platform uses an engine to find:

* when you are spending too much money,

* plans that you do not need,

* cheaper options,

* ways to optimize your spending

* how much you can save each month and year.

---

## Features

### AI Spend Audit

Look at your subscriptions. How you use AI tools.

### Deterministic Audit Engine

We do not use AI to make guesses. Our recommendations are based on rules and pricing logic.

### Personalized Recommendations

Get advice on how to save money with explanations.

### AI-Generated Executive Summary

Make a summary of your audit using Google Gemini AI.

### Shareable Public Reports

Create a link to share your audit report with others.

### Lead Capture + Email Delivery

Get people to sign up and send them a summary of their audit using Resend.

### Modern SaaS UI

Our user interface is easy to use and looks good like Linear, Vercel and Perplexity.

---

# Tech Stack

| Layer         | Technology            |

| ------------- | --------------------- |

| Framework     | Next.js 15 App Router |

| Language      | TypeScript            |

Styling       | TailwindCSS           |

| UI Components | shadcn/ui             |

| Animation     | Framer Motion         |

| Forms         | React Hook Form + Zod |

| Database      | Supabase              |

| AI Summary    | Google Gemini         |

Email         | Resend                |

| Charts        | Recharts              |

| Testing       | Vitest

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

We made the application simple and easy to maintain so we can make changes quickly and it is easy to read.

## Audit Engine

The audit engine is in:

```txt

src/lib/audit.ts

```

It does the following:

* generates recommendations

* calculates savings,

* compares prices

* explains the reasoning,

* scores the confidence.

We do not use AI for calculations.

---

## Pricing Data

Pricing information is in:

```txt

src/lib/pricing.ts

```

This includes:

* subscription prices,

* API pricing assumptions,

* seat-based calculations

* optimization thresholds.

---

## AI Summary Layer

Google Gemini is only used for:

* summarizing results

* making summaries.

AI does not affect:

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

## Documentation

- [Architecture](docs/ARCHITECTURE.md)

- [Development Log](docs/DEVLOG.md)

- [Prompts Used](docs/PROMPTS.md)

- [Pricing Research](docs/PRICING_DATA.md)

- [User Interviews](docs/USER_INTERVIEWS.md)

- [Testing Strategy](docs/TESTS.md)

- [Reflection](docs/REFLECTION.md)

- [Go-To-Market](docs/GTM.md)

- [Economics](docs/ECONOMICS.md)

- [Deployment Notes](docs/DEPLOYMENT.md)

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

cp.env.local.example.env.local

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

* update `NEXT_PUBLIC_APP_URL`

* redeploy.

---

# Performance Goals

The application is optimized for:

* Lighthouse Performance ≥ 85

* Accessibility ≥ 90

* Best Practices ≥ 90

optimizations:

* semantic HTML,

* responsive rendering,

* minimal abstractions,

* accessible components,

* lightweight architecture.

---

# Design Philosophy

SpendPilot is designed to be:

* simple,

* maintainable,

* readable,

* realistic, for startups,

* production-quality UX.

The codebase avoids:

* overengineering,

* unnecessary abstractions,

* service layers,

* complex state management,

* excessive dependencies.

---

# Future Improvements

Potential future enhancements:

* real usage analytics integrations,

* Stripe billing insights,

* Slack notifications,

* historical spend tracking,

* multi-user collaboration

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