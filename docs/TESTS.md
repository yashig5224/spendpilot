# TESTS

## Overview

Vitest was used for unit testing the deterministic audit engine and pricing logic.

The primary focus of testing was ensuring:

* pricing calculations are accurate,
* savings estimates are deterministic,
* recommendation logic behaves consistently,
* edge cases do not break the audit flow.

---

## Test Coverage

### Pricing Validation

Tests verify:

* correct monthly pricing values,
* yearly savings calculations,
* pricing lookup consistency.

### Audit Engine Logic

Tests verify:

* downgrade recommendations,
* duplicate subscription detection,
* optimization calculations,
* recommendation reasoning generation.

### Edge Cases

Tested scenarios include:

* zero spend,
* empty form input,
* unsupported tools,
* unusually high API usage,
* missing optional fields.

---

## Example Test Cases

* Cursor Business → Pro downgrade for small teams
* ChatGPT Team → Plus recommendation for solo users
* GPT-4 Turbo → GPT-4o Mini API savings estimation
* No recommendations when stack is already optimized

---

## Testing Philosophy

The audit engine was prioritized because it represents the core business logic of the application.

UI testing was intentionally kept lightweight to focus development time on:

* deterministic calculations,
* recommendation reliability,
* maintainable business logic.

---

## Commands

Run tests locally:

```bash
npm run test
```

Run lint checks:

```bash
npm run lint
```

Run production build validation:

```bash
npm run build
```
