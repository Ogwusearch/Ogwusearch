# @ogwusearch/engineering-types

Shared TypeScript contracts for the OGWUSEARCH engineering ecosystem.

## Purpose

`@ogwusearch/engineering-types` defines the common contracts used by engineering calculations, validation systems, calculation runners, and domain engines.

This package provides **types and interfaces**, not engineering calculations.

The goal is to give every engineering engine a consistent language for:

* Inputs
* Outputs
* Results
* Errors
* Warnings
* Assumptions
* Metadata
* Validation
* Calculation traces
* Engineering modules

---

## Core Principle

Engineering calculations should produce structured, traceable results rather than returning an unstructured number.

Instead of:

```ts
const result = 4.8;
```

an engineering engine should be able to return information such as:

```ts
{
  ok: true,
  value: 4.8,
  warnings: [],
  errors: [],
  metadata: {
    engine: "solar-engine",
    module: "pv-sizing",
    version: "1.0.0"
  }
}
```

This allows applications to display, store, audit, reproduce, and inspect engineering calculations.

---

## Responsibilities

This package defines shared contracts for:

```text
EngineeringInput
EngineeringOutput
EngineeringResult
EngineeringError
EngineeringWarning
EngineeringAssumption
EngineeringMetadata
CalculationTrace
ValidationResult
EngineeringModule
```

The contracts should remain generic enough to be reused by different engineering domains.

---

# Engineering Result

The primary output of an engineering calculation is an `EngineeringResult`.

Conceptually:

```ts
type EngineeringResult<T> = {
  ok: boolean;
  value?: T;
  errors: EngineeringError[];
  warnings: EngineeringWarning[];
  metadata: EngineeringMetadata;
  trace?: CalculationTrace;
};
```

A successful calculation may look like:

```ts
{
  ok: true,
  value: {
    requiredPower: 5500
  },
  errors: [],
  warnings: [],
  metadata: {
    engine: "solar-engine",
    module: "pv-sizing",
    version: "1.0.0"
  }
}
```

A failed calculation may look like:

```ts
{
  ok: false,
  errors: [
    {
      code: "INVALID_INPUT",
      message: "peakSunHours must be greater than zero"
    }
  ],
  warnings: [],
  metadata: {
    engine: "solar-engine",
    module: "pv-sizing",
    version: "1.0.0"
  }
}
```

---

# Engineering Error

Errors represent conditions that prevent a calculation from producing a valid result.

Conceptually:

```ts
type EngineeringError = {
  code: string;
  message: string;
  field?: string;
  value?: unknown;
};
```

Examples:

```text
INVALID_INPUT
MISSING_VALUE
INVALID_UNIT
OUT_OF_RANGE
INVALID_CONFIGURATION
CALCULATION_ERROR
INCOMPATIBLE_DIMENSIONS
```

Errors should be structured and machine-readable.

Applications may use the error code while displaying the human-readable message to the user.

---

# Engineering Warning

Warnings indicate conditions that do not necessarily prevent calculation but should be communicated to the user.

Conceptually:

```ts
type EngineeringWarning = {
  code: string;
  message: string;
  field?: string;
  value?: unknown;
};
```

Examples:

```text
LOW_SUN_HOURS
HIGH_CURRENT
HIGH_VOLTAGE_DROP
LOW_BATTERY_MARGIN
UNUSUAL_CONFIGURATION
ASSUMED_VALUE
```

Warnings must not be confused with errors.

```text
Error
  ↓
Calculation cannot safely produce a valid result

Warning
  ↓
Calculation can proceed, but attention is required
```

---

# Engineering Assumption

Engineering calculations frequently depend on assumptions.

Assumptions should be explicit rather than hidden inside formulas.

Conceptually:

```ts
type EngineeringAssumption = {
  name: string;
  value: unknown;
  reason?: string;
  source?: string;
};
```

Example:

```ts
{
  name: "systemEfficiency",
  value: 0.75,
  reason: "Default system efficiency",
  source: "solar-engine default"
}
```

This makes calculation results easier to audit.

---

# Engineering Metadata

Metadata identifies the calculation that produced a result.

Conceptually:

```ts
type EngineeringMetadata = {
  engine: string;
  module: string;
  version: string;
  timestamp?: string;
};
```

Example:

```ts
{
  engine: "solar-engine",
  module: "pv-sizing",
  version: "1.0.0"
}
```

Metadata allows applications to determine:

* Which engine produced the result
* Which module produced the result
* Which version produced the result
* When the calculation was executed

---

# Calculation Trace

Engineering calculations should be traceable.

A calculation trace records important intermediate steps.

Conceptually:

```ts
type CalculationTrace = {
  steps: CalculationStep[];
};
```

A step may contain:

```ts
type CalculationStep = {
  name: string;
  formula?: string;
  inputs?: Record<string, unknown>;
  output?: unknown;
};
```

Example:

```text
PV Sizing

Step 1
dailyEnergy = 12 kWh/day

Step 2
peakSunHours = 5 h/day

Step 3
systemEfficiency = 0.75

Step 4
requiredPV =
12 / (5 × 0.75)

Step 5
requiredPV = 3.2 kW
```

The trace provides transparency without forcing the domain engine to expose its internal implementation.

---

# Validation Result

Validation results provide a common contract between validation packages and calculation runners.

Conceptually:

```ts
type ValidationResult = {
  valid: boolean;
  errors: EngineeringError[];
};
```

Example:

```ts
{
  valid: false,
  errors: [
    {
      code: "REQUIRED",
      field: "dailyEnergy",
      message: "dailyEnergy is required"
    }
  ]
}
```

Validation should be completed before a domain calculation executes.

---

# Engineering Module

An engineering module represents a reusable calculation.

Conceptually:

```ts
interface EngineeringModule<I, V, O> {
  validate(input: I): ValidationResult;
  calculate(input: V): O;
}
```

Where:

```text
I = raw input
V = validated input
O = calculation output
```

This separation prevents calculation code from being responsible for all input validation.

---

# Calculation Flow

The common engineering execution model is:

```text
                 Input
                   │
                   ▼
             ┌────────────┐
             │ Validation │
             └─────┬──────┘
                   │
          ┌────────┴────────┐
          │                 │
        Invalid            Valid
          │                 │
          ▼                 ▼
       Errors          Calculation
                            │
                  ┌─────────┴─────────┐
                  │                   │
               Warnings             Trace
                  │                   │
                  └─────────┬─────────┘
                            ▼
                  EngineeringResult
```

---

# Generic Domain Support

The contracts must not assume that the system is only for solar engineering.

They should support:

```text
Solar Engineering
Electrical Engineering
Circuit Analysis
Mining Engineering
Mechanical Engineering
Energy Systems
Power Systems
```

Example domain engines:

```text
@ogwusearch/solar-engine
@ogwusearch/electrical-engine
@ogwusearch/circuit-engine
```

Future engines can use the same contracts without changing the foundation.

---

# Type Safety

The package should use TypeScript generics where appropriate.

Example:

```ts
EngineeringResult<PVSystem>
```

or:

```ts
EngineeringResult<BatterySizingResult>
```

or:

```ts
EngineeringResult<CircuitAnalysisResult>
```

This allows the result framework to remain generic while retaining strong type information.

---

# Units

Unit definitions should not be duplicated inside this package.

For example, the type package may describe:

```ts
type Quantity = {
  value: number;
  unit: string;
};
```

but actual unit definitions and conversions belong to:

```text
@ogwusearch/engineering-units
```

Dependency direction:

```text
engineering-types
       ↑
engineering-units
       ↑
engineering-validation
       ↑
engineering-core
       ↑
domain engines
```

The exact package dependency graph should remain acyclic.

---

# Separation of Responsibilities

## engineering-types

Defines contracts.

```text
"What shape does the data have?"
```

## engineering-units

Defines units and conversions.

```text
"What does this number represent?"
```

## engineering-validation

Checks input validity.

```text
"Is this input acceptable?"
```

## engineering-core

Runs engineering modules.

```text
"How should the calculation execute?"
```

## Domain engines

Perform engineering calculations.

```text
"What is the engineering result?"
```

---

# What Does Not Belong Here

Do not put engineering formulas in this package.

For example:

```ts
const current = power / voltage;
```

does not belong here.

Neither does:

```ts
const pvSize =
  dailyEnergy / (peakSunHours * efficiency);
```

Those calculations belong in domain engines.

This package should remain a stable contract layer.

---

# Recommended Package Structure

```text
engineering-types/
│
├── src/
│   ├── index.ts
│   │
│   ├── result/
│   │   ├── engineering-result.ts
│   │   └── result-status.ts
│   │
│   ├── errors/
│   │   └── engineering-error.ts
│   │
│   ├── warnings/
│   │   └── engineering-warning.ts
│   │
│   ├── assumptions/
│   │   └── engineering-assumption.ts
│   │
│   ├── metadata/
│   │   └── engineering-metadata.ts
│   │
│   ├── trace/
│   │   ├── calculation-trace.ts
│   │   └── calculation-step.ts
│   │
│   ├── validation/
│   │   └── validation-result.ts
│   │
│   ├── module/
│   │   └── engineering-module.ts
│   │
│   └── __tests__/
│       ├── result.test.ts
│       ├── metadata.test.ts
│       ├── trace.test.ts
│       └── module.test.ts
│
└── README.md
```

---

# Testing Requirements

Because this package defines contracts, tests should focus on type behavior and runtime helpers where applicable.

Test:

* Successful results
* Failed results
* Error structures
* Warning structures
* Metadata
* Assumptions
* Calculation traces
* Validation results
* Generic result types
* Engineering module contracts

Example:

```ts
const result: EngineeringResult<number> = {
  ok: true,
  value: 1500,
  errors: [],
  warnings: [],
  metadata: {
    engine: "electrical-engine",
    module: "power",
    version: "1.0.0"
  }
};
```

---

# Design Requirements

The package should maintain:

* Strong TypeScript typing
* Generic contracts
* Stable public interfaces
* Deterministic data structures
* Explicit errors
* Explicit warnings
* Explicit assumptions
* Explicit metadata
* Traceable calculations
* No domain-specific formulas
* No database dependencies
* No UI dependencies
* No framework dependencies
* No circular dependencies

---

# Stability

`engineering-types` is a foundational package.

Changes to its public contracts can affect every engineering engine.

Therefore:

```text
engineering-types
       │
       ├── engineering-units
       ├── engineering-validation
       ├── engineering-core
       ├── solar-engine
       ├── electrical-engine
       └── circuit-engine
```

Public type changes should be treated as architecture-level changes.

Prefer additive changes over breaking changes.

---

# Summary

`@ogwusearch/engineering-types` is the shared contract layer of the OGWUSEARCH engineering ecosystem.

Its responsibility is to define the common language used by engineering software:

```text
Input
  ↓
Validation
  ↓
Calculation
  ↓
Errors
Warnings
Assumptions
Metadata
Trace
  ↓
EngineeringResult
```

It provides the contracts.

`engineering-units` provides unit infrastructure.

`engineering-validation` validates inputs.

`engineering-core` orchestrates execution.

Domain engines provide the engineering mathematics.
