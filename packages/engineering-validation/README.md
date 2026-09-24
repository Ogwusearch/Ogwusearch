@ogwusearch/engineering-validation

# `@ogwusearch/engineering-validation`

Reusable, deterministic validation infrastructure for the **Ogwusearch Engineering** foundation.

`engineering-validation` provides the generic validation system used by all engineering calculation engines. It validates inputs, executes reusable rules, collects structured issues, and returns deterministic validation results. It **does not** contain solar, electrical, or domain-specific validation logic.

---

## Purpose

This package owns the validation layer of the engineering foundation.

It is responsible for:

* Validation rule contracts.

* Validation rule execution.

* Generic numeric and structural validation.

* Error and warning collection.

* Deterministic issue ordering.

* Field path preservation.

* Validation result construction.

It is **not** responsible for:

* Engineering calculations.

* Unit conversions.

* Solar-specific rules.

* Battery sizing rules.

* PV sizing rules.

* Database or network validation.

---

## Architecture Position

```
engineering-types
        ↑
engineering-validation
        ↑
engineering-core
        ↑
solar-engine
```

`engineering-validation` depends only on **engineering-types**.

Domain engines consume this package through `engineering-core` or directly when defining domain validation rules.

---

## Package Structure

```
engineering-validation/
├── src/
│   ├── rule/
│   │   ├── rule.ts
│   │   ├── rules.ts
│   │   └── rule-context.ts
│   │
│   ├── validator/
│   │   ├── validate.ts
│   │   ├── validate-all.ts
│   │   └── validation-result.ts
│   │
│   ├── checks/
│   │   ├── required.ts
│   │   ├── numeric.ts
│   │   ├── positive.ts
│   │   ├── non-negative.ts
│   │   ├── integer.ts
│   │   ├── minimum.ts
│   │   ├── maximum.ts
│   │   ├── range.ts
│   │   └── equality.ts
│   │
│   ├── issues/
│   │   ├── create-error.ts
│   │   └── create-warning.ts
│   │
│   ├── helpers/
│   │   ├── combine.ts
│   │   └── paths.ts
│   │
│   └── index.ts
│
├── tests/
├── README.md
├── package.json
└── tsconfig.json
```

---

## Public API

The package exposes only reusable validation infrastructure.

### Rule Contracts

```
ValidationRule<T>
ValidationRuleContext
ValidationRules
```

### Validators

```
validate(...)
validateAll(...)
ValidationResult
```

### Built-in Checks

* `required`

* `numeric`

* `positive`

* `nonNegative`

* `integer`

* `minimum`

* `maximum`

* `range`

* `equality`

### Issue Helpers

```
createError(...)
createWarning(...)
```

### Utilities

```
combineIssues(...)
createPath(...)
```

---

## Validation Execution Model

Every validation follows the same deterministic pipeline.

```
Input
   ↓
Rules
   ↓
Execute
   ↓
Collect Issues
   ↓
Split Errors / Warnings
   ↓
Validation Result
```

Rules never mutate input values.

Validation never performs calculations.

---

## Validation Result Contract

Every validator returns a structured result.

```
ValidationResult<T>
```

Contains:

* `valid`

* `errors`

* `warnings`

* `issues`

* `value` (optional)

* metadata when appropriate.

Errors invalidate the result.

Warnings preserve validity.

---

## Built-in Checks

| Check         | Purpose                            |
| ------------- | ---------------------------------- |
| `required`    | Reject `null` / `undefined`.       |
| `numeric`     | Require finite numeric values.     |
| `positive`    | Require value `> 0`.               |
| `nonNegative` | Require value `>= 0`.              |
| `integer`     | Require a finite integer.          |
| `minimum`     | Inclusive minimum value.           |
| `maximum`     | Inclusive maximum value.           |
| `range`       | Inclusive minimum and maximum.     |
| `equality`    | Deterministic equality validation. |

These checks are generic and reusable across engineering domains.

---

## Design Principles

### Deterministic

Validation produces identical issues for identical input.

### Non-Mutating

Validation never changes user input.

### Serializable

Issues are plain serializable objects.

### Explicit

Validation never silently fixes values.

### Complete

Validation collects all applicable issues rather than failing fast.

---

## Issue Ordering

Issue ordering is deterministic.

Rules execute in supplied order.

Collected issues preserve execution order.

This guarantees stable test snapshots and reproducible engineering reports.

---

## Field Paths

Validation preserves field paths for nested objects.

Examples:

```
loads[0].power
battery.capacity
pv.modules[2].voltage
```

Paths allow applications and reports to identify failing inputs.

---

## Dependency Rules

### Allowed Imports

```
engineering-types
```

### Forbidden Imports

* engineering-core

* engineering-units

* solar-engine

* electrical-engine

* circuit-engine

* React

* Database libraries

* HTTP libraries

* MCP libraries

* AI SDKs

---

## Testing Strategy

Every validation feature must include tests for:

### Contract Tests

* Rule contracts.

* Validation result shape.

### Normal Tests

* Valid input passes.

### Boundary Tests

* Zero.

* Minimum.

* Maximum.

### Failure Tests

* Missing values.

* NaN.

* Infinity.

* Invalid ranges.

* Multiple simultaneous failures.

### Determinism Tests

* Same input.

* Same issue ordering.

* Same output.

---

## Development Workflow

Run package checks during development.

```
pnpm tsc --noEmit
pnpm vitest run
pnpm lint
pnpm build
```

Run workspace validation before merging changes.

```
pnpm -r tsc --noEmit
pnpm -r vitest run
pnpm -r build
```

---

## Coding Rules

* Use pure functions.

* Never mutate issue arrays.

* Preserve deterministic ordering.

* Preserve field paths.

* Keep issue metadata serializable.

* Do not introduce engineering-domain logic.

* Export only intentional public APIs through `src/index.ts`.

---

## Current Phase

**Foundation Phase 03 — Engineering Validation**

This package implements the reusable validation infrastructure required by `engineering-core` and future engineering engines.

Completion criteria for this phase include:

* Generic validation rules implemented.

* Multiple-rule execution supported.

* Error and warning separation implemented.

* Field paths preserved.

* Deterministic validation results.

* Tests, typecheck, lint, and build passing.
