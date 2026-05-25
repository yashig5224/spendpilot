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

<img width="1917" height="872" alt="image" src="https://github.com/user-attachments/assets/4024f420-9203-4868-b4cb-d444fe0de021" />
<img width="1919" height="873" alt="image" src="https://github.com/user-attachments/assets/7341e98e-5301-419d-be04-0b5207cd47d3" />
<img width="1918" height="869" alt="image" src="https://github.com/user-attachments/assets/de38474a-aeb9-4867-8a8a-9995c66b11f0" />


## 2.Audit Form Page
<img width="1919" height="912" alt="image" src="https://github.com/user-attachments/assets/31129ffe-ad91-4840-80d2-76c612c21b57" />
<img width="1919" height="913" alt="image" src="https://github.com/user-attachments/assets/613155d1-6f71-4827-95c2-e171495571fe" />
<img width="1916" height="917" alt="image" src="https://github.com/user-attachments/assets/4784e9b7-d878-4213-b76c-d09b8f7f2844" />
<img width="1919" height="900" alt="image" src="https://github.com/user-attachments/assets/0c9d6f3a-c121-4b28-9c72-50a43092389f" />
<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/2b340ddf-267b-41a0-a4e1-c98167e1d149" />

## 3.Audit Review Page
<img width="1919" height="908" alt="image" src="https://github.com/user-attachments/assets/ec02c0c1-4058-423c-a09f-6e9256addd2e" />
<img width="1919" height="911" alt="image" src="https://github.com/user-attachments/assets/c30b61b4-c4f6-45a5-9583-91115d2741e7" />
<img width="1918" height="911" alt="image" src="https://github.com/user-attachments/assets/672ecc6e-d3ef-4934-adb6-862e0398c028" />


## 4.Downloaded pdf
<img width="1007" height="952" alt="image" src="https://github.com/user-attachments/assets/4c07b8ab-72b0-4ed6-826b-05f63a2ea126" />
<img width="1897" height="946" alt="image" src="https://github.com/user-attachments/assets/1036f795-bd8a-4bd6-a1da-7adae69481d5" />

## 5.Email form
<img width="1531" height="764" alt="image" src="https://github.com/user-attachments/assets/f60a796b-9396-4330-8f87-a53a487a14b7" />
<img width="1401" height="623" alt="image" src="https://github.com/user-attachments/assets/10a48cdf-304e-497f-8a19-223f688c00d9" />

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
