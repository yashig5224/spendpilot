# REFLECTION

## 1. The hardest bug I hit this week

The hardest bug I faced was related to GitHub Actions CI failing during production builds even though the project worked locally. At first I thought the issue was related to TypeScript or ESLint errors because the logs mentioned build failures. So I ran `npm run lint` `npm run test` and `npm run build` locally to see if the issue could be reproduced on my machine. Everything passed locally which made me suspect that the CI environment was missing some configuration.

My next idea was that environment variables were unavailable inside GitHub Actions. I checked the workflow file. Noticed the build step required Supabase, Gemini and Resend environment variables. The repository had no configured GitHub Secrets so the build was failing during server-side execution. I added repository secrets manually inside GitHub Settings. Reran the workflow. The build succeeded afterward.

This taught me the importance of understanding differences between CI environments. I also learned that debugging becomes easier when I test my ideas systematically of randomly changing code. GitHub Actions CI and the project worked locally. I had to figure out why GitHub Actions CI was failing.

## 2. A decision I reversed mid-week

Initially I planned to add authentication using Supabase Auth because I thought SaaS products required user accounts to feel complete. After implementing some auth flows I realized it introduced unnecessary complexity for the assignment scope. Protected routes, session handling, middleware configuration and auth UI significantly slowed development.

Mid-week I decided to remove authentication and focus instead on the deterministic audit engine and overall product experience. The assignment emphasized product thinking, architecture quality and maintainability more than enterprise-scale features. Removing authentication simplified the application architecture considerably. It also improved onboarding because users could immediately run an audit without account creation friction.

Of accounts I used lightweight lead capture and shareable public audit URLs to preserve the startup SaaS feel. This reversal taught me the value of scope management and prioritization. Building features with higher quality was ultimately more effective than attempting to implement every possible SaaS feature. I had to remove authentication to focus on the audit engine and the overall product experience.

## 3. What I would build in week 2

If I had another week I would focus primarily on analytics and real integrations. Currently the audit engine uses pricing assumptions and manually entered usage information. The next major improvement would be integrating directly with AI providers or billing exports to automate spend analysis.

I would also add spend tracking and trend visualizations so users could monitor how their AI spending changes over time. Another improvement would be team dashboards where organizations could manage audits across departments. On the product side I would improve the recommendation engine with confidence scoring, optimization priority richer benchmarking insights comparing teams against industry averages.

Technically I would improve test coverage add caching strategies and implement stronger analytics around user behavior inside the audit flow. I would also polish the public report system with OG images and PDF export functionality. Overall week 2 would focus less on MVP functionality and more on automation, analytics depth and scalability. I would build features to improve the product.

## 4. How I used AI tools

I primarily used Cursor, Claude Sonnet and ChatGPT during development. AI tools were most helpful for scaffolding UI components improving Tailwind layouts debugging TypeScript issues generating documentation structure and speeding up implementation tasks.

However I intentionally avoided trusting AI with business logic decisions. The audit engine, pricing assumptions, recommendation rules and architecture decisions were manually. Refined because deterministic accuracy was critical for the product’s credibility. I used AI tools to help me with development. I did not trust AI with important decisions.

One specific case where AI was wrong involved GitHub Actions configuration. An AI-generated workflow file referenced environment variables incorrectly. Caused the CI pipeline to fail repeatedly. After reviewing the logs I realized the issue was not the YAML syntax but missing GitHub Secrets configuration. The AI kept suggesting workflow changes instead of identifying the actual root cause.

This experience reinforced the importance of verifying AI-generated outputs. AI significantly accelerated development. Manual engineering judgment remained essential for correctness and architectural quality. I had to be careful when using AI tools.

## 5. Self-rating

### Discipline. 8/10

I maintained progress throughout the project and consistently prioritized the most important features instead of endlessly adding scope. I worked hard to finish the project.

### Code Quality. 7/10

The codebase is clean and maintainable overall though there are still areas where abstractions and testing could be improved further. I tried to write code.

### Design Sense. 8/10

I focused heavily on SaaS UI patterns, responsiveness and product polish while keeping the interface minimal and readable. I wanted the product to look good.

### Problem Solving. 8/10

I was able to debug deployment, CI/CD and architecture issues while adapting project scope when necessary. I solved problems as they came up.

### Entrepreneurial Thinking. 9/10

I intentionally approached the assignment, like a real SaaS MVP by emphasizing lead capture, product positioning, user experience and believable business logic. I tried to think like an entrepreneur.