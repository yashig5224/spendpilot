# Pricing Data

## Overview

Pricing information used in SpendPilot was manually researched from official pricing pages of AI software providers.
The pricing data is used by the deterministic audit engine to generate savings recommendations and optimization insights.

---

## Sources

### ChatGPT

Source: https://openai.com/chatgpt/pricing
Verified: May 2026

### Claude

Source: https://www.anthropic.com/pricing
Verified: May 2026

### Cursor

Source: https://cursor.com/pricing
Verified: May 2026

### GitHub Copilot

Source: https://github.com/features/copilot
Verified: May 2026

### Gemini

Source: https://gemini.google/pricing
Verified: May 2026

---

## Pricing Assumptions

The audit engine currently assumes:

* monthly subscription billing,
* standard public pricing,
* small-to-medium team usage,
* average API usage estimates.

Enterprise custom pricing was excluded from calculations because pricing varies significantly between organizations.

---

## Notes

Pricing data is centralized in:

```txt
src/lib/pricing.ts
```

The pricing configuration can be updated easily as vendors change pricing models in the future.
