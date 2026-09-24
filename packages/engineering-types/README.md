# @ogwusearch/engineering-types

Shared type contracts for the Ogwusearch engineering system.

This package defines the common structures used by engineering
calculation engines, validation systems, execution infrastructure,
and engineering applications.

## Responsibility

`@ogwusearch/engineering-types` defines contracts.

It does not perform calculations.

It does not perform unit conversion.

It does not execute calculations.

It does not implement domain-specific engineering rules.

## Scope

The package provides shared contracts for:

- Calculation inputs
- Calculation outputs
- Calculation results
- Calculation status
- Calculation context
- Validation issues
- Validation errors
- Validation warnings
- Calculation traces
- Trace steps
- Engineering assumptions
- Metadata
- Identifiers

## Architecture

```text
@ogwusearch/engineering-types
              │
              ├── engineering-units
              │
              ├── engineering-validation
              │
              └── engineering-core
                         │
                         ▼
                  solar-engine
                         │
                         ▼
                     SolarAudit
````

The dependency direction must remain upward from the
domain layer toward the foundation.

`engineering-types` should remain foundational and should not
depend on any Ogwusearch engineering package.

## Calculation Contracts

A calculation follows this conceptual model:

```text
Input
  ↓
Validation
  ↓
Calculation
  ↓
Result
```

A result may contain:

```text
status
valid
value
errors
warnings
assumptions
trace
metadata
```

## Example

A domain engine can extend the shared contracts:

```ts
import type {
  CalculationInput,
  CalculationOutput,
  CalculationResult,
} from "@ogwusearch/engineering-types";

export interface PvSizingInput extends CalculationInput {
  readonly dailyEnergyWh: number;
  readonly peakSunHours: number;
  readonly systemEfficiency: number;
  readonly designMargin: number;
}

export interface PvSizingOutput extends CalculationOutput {
  readonly requiredPvPowerW: number;
}

export function calculatePvSize(
  input: PvSizingInput,
): CalculationResult<PvSizingOutput> {
  // Domain-specific calculation.
  throw new Error("Not implemented");
}
```

## Design Rules

### 1. Contracts only

This package defines interfaces and types.

Do not add:

* PV formulas
* Battery formulas
* Cable calculations
* Unit conversions
* Database access
* HTTP requests
* React components
* MCP tools
* AI logic

### 2. Domain neutrality

The contracts must work for:

* Solar engineering
* Electrical engineering
* Circuit simulation
* Battery systems
* Motor-control systems
* Future engineering domains

### 3. Deterministic contracts

Types should describe data and lifecycle information without
introducing runtime state or hidden behavior.

### 4. Stable public API

Consumers should import from:

```ts
@ogwusearch/engineering-types
```

rather than internal source files.

## Package Structure

```text
engineering-types/
├── src/
│   ├── calculation/
│   │   ├── input.ts
│   │   ├── output.ts
│   │   ├── result.ts
│   │   ├── status.ts
│   │   └── context.ts
│   │
│   ├── validation/
│   │   ├── issue.ts
│   │   ├── error.ts
│   │   └── warning.ts
│   │
│   ├── trace/
│   │   ├── step.ts
│   │   └── trace.ts
│   │
│   ├── assumptions/
│   │   └── assumption.ts
│   │
│   ├── common/
│   │   ├── metadata.ts
│   │   └── identifier.ts
│   │
│   └── index.ts
│
├── tests/
├── package.json
├── tsconfig.json
├── vitest.config.ts
└── README.md
```

## Build

```bash
npm run build
```

## Type Check

```bash
npm run typecheck
```

## Test

```bash
npm test
```

## Current Status

Phase: Foundation

Package: `@ogwusearch/engineering-types`

Status: Initial contract implementation

````

## Verify the package

From:

```bash
cd /home/ogwu/workspace/ogwusearch/packages/engineering-types
````

run:

```bash
npm run typecheck
npm run build
npm test
```

The intended result at this stage is:

```text
typecheck   ✓
build       ✓
test        ✓
```

Then the next implementation boundary is the remaining source contracts:

```text
src/
├── calculation/
├── validation/
├── trace/
├── assumptions/
├── common/
└── index.ts
```

Once those compile, `engineering-units`, `engineering-validation`, and `engineering-core` can depend on this package cleanly.
