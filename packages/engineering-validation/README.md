# @ogwusearch/engineering-validation

Reusable validation infrastructure for deterministic engineering calculations.

## Purpose

`@ogwusearch/engineering-validation` provides common validation utilities used by the OGWUSEARCH engineering engines.

It is responsible for validating engineering inputs before calculations are executed.

The package does **not** contain domain-specific engineering formulas.

---

## Responsibilities

The validation package handles:

* Required-field validation
* Numeric validation
* Positive-value validation
* Non-negative-value validation
* Range validation
* Integer validation
* Enumeration validation
* Constraint validation
* Cross-field validation
* Collection of multiple validation errors
* Structured validation results

---

## Design Principles

### 1. Deterministic

The same input must always produce the same validation result.

```text
Input
  ↓
Validation Rules
  ↓
Validation Result
```

No random behavior or hidden state should influence validation.

---

### 2. Side-effect free

Validation functions should not:

* Modify the input
* Write to a database
* Make network requests
* Modify global state
* Perform engineering calculations

Validation should only inspect data and return results.

---

### 3. Collect all errors

Validation should collect applicable errors instead of stopping at the first failure.

Example:

```text
Input:

dailyEnergy = -500
peakSunHours = 0
systemEfficiency = 1.5
```

Expected result:

```text
Errors:
- dailyEnergy must be greater than 0
- peakSunHours must be greater than 0
- systemEfficiency must be between 0 and 1
```

This makes engineering modules easier to debug and improves user feedback.

---

## Validation Flow

```text
Engineering Input
       │
       ▼
┌──────────────────┐
│ Required Fields  │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Type Validation  │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Range Validation │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Rule Validation  │
└────────┬─────────┘
         ▼
┌──────────────────┐
│ Collect Errors   │
└────────┬─────────┘
         ▼
 ValidationResult
```

---

## Example Rules

### Required value

```ts
required("dailyEnergy", input.dailyEnergy);
```

### Positive value

```ts
positive("panelPower", input.panelPower);
```

### Non-negative value

```ts
nonNegative("cableLength", input.cableLength);
```

### Range

```ts
range(
  "systemEfficiency",
  input.systemEfficiency,
  0,
  1,
);
```

### Integer

```ts
integer("panelCount", input.panelCount);
```

### Enumeration

```ts
oneOf(
  "systemVoltage",
  input.systemVoltage,
  [12, 24, 36, 48],
);
```

---

## Validation Result

A validation operation should return a structured result.

Conceptually:

```ts
type ValidationResult = {
  valid: boolean;
  errors: ValidationError[];
};
```

Example:

```ts
{
  valid: false,
  errors: [
    {
      field: "dailyEnergy",
      code: "POSITIVE_REQUIRED",
      message: "dailyEnergy must be greater than 0"
    }
  ]
}
```

---

## Validation Error

A validation error should contain enough information for both developers and applications to identify the problem.

Conceptually:

```ts
type ValidationError = {
  field?: string;
  code: string;
  message: string;
  value?: unknown;
};
```

Recommended error codes include:

```text
REQUIRED
INVALID_TYPE
NOT_NUMBER
NOT_INTEGER
NOT_POSITIVE
NEGATIVE_VALUE
OUT_OF_RANGE
INVALID_OPTION
INVALID_CONSTRAINT
```

---

## Cross-Field Validation

Some engineering rules depend on more than one value.

Example:

```text
minimumVoltage < maximumVoltage
```

or:

```text
minimumSOC <= maximumSOC
```

or:

```text
seriesCount >= 1
parallelCount >= 1
```

These rules should be represented explicitly rather than hidden inside calculation formulas.

---

## Engineering Example

For a PV sizing module:

```text
Input
├── dailyEnergy
├── peakSunHours
├── systemEfficiency
└── panelPower
```

Validation:

```text
dailyEnergy > 0
peakSunHours > 0
0 < systemEfficiency <= 1
panelPower > 0
```

Only after validation succeeds should the calculation engine perform the PV sizing calculation.

---

## Relationship With Other Packages

```text
@ogwusearch/engineering-types
              │
              ▼
@ogwusearch/engineering-validation
              │
              ▼
@ogwusearch/engineering-core
              │
              ▼
       Domain Engines
```

Domain engines include:

```text
@ogwusearch/solar-engine
@ogwusearch/electrical-engine
@ogwusearch/circuit-engine
```

The validation package may depend on shared engineering types.

It must **not** depend on domain engines.

---

## What Does Not Belong Here

Do not put engineering formulas in this package.

For example, this does **not** belong here:

```ts
const pvPower =
  dailyEnergy / (peakSunHours * efficiency);
```

That belongs in the appropriate domain engine.

Similarly:

```ts
const current = power / voltage;
```

belongs in an electrical calculation module.

Validation only determines whether the inputs satisfy the required conditions.

---

## Recommended Package Structure

```text
engineering-validation/
│
├── src/
│   ├── index.ts
│   │
│   ├── errors/
│   │   ├── codes.ts
│   │   └── validation-error.ts
│   │
│   ├── rules/
│   │   ├── required.ts
│   │   ├── numeric.ts
│   │   ├── positive.ts
│   │   ├── non-negative.ts
│   │   ├── range.ts
│   │   ├── integer.ts
│   │   └── one-of.ts
│   │
│   ├── validation/
│   │   ├── validate.ts
│   │   └── validation-result.ts
│   │
│   └── __tests__/
│       ├── required.test.ts
│       ├── numeric.test.ts
│       ├── range.test.ts
│       └── validation.test.ts
│
└── README.md
```

---

## Testing Requirements

Every validation rule should have tests covering:

### Valid input

```text
Expected:
valid === true
errors.length === 0
```

### Invalid input

```text
Expected:
valid === false
errors.length > 0
```

### Boundary values

Test:

```text
minimum
maximum
just below minimum
just above maximum
zero
negative values
```

### Multiple errors

Ensure validation does not stop after the first error.

---

## Quality Requirements

The package should maintain:

* Strong TypeScript typing
* Deterministic behavior
* No hidden state
* No side effects
* Clear error codes
* Clear error messages
* Complete test coverage
* No domain-specific formulas
* No circular dependencies

---

## Summary

`@ogwusearch/engineering-validation` is the reusable validation layer of the engineering ecosystem.

Its job is simple:

```text
Receive engineering input
        ↓
Apply validation rules
        ↓
Collect all validation errors
        ↓
Return structured validation result
        ↓
Allow valid input to reach the calculation engine
```

The package provides the validation infrastructure.

The domain engines provide the engineering mathematics.
