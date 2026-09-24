# @ogwusearch/engineering-core

Core engineering calculation infrastructure for the Ogwusearch engineering platform.

`engineering-core` sits between the reusable engineering foundation packages and domain-specific engineering systems such as `solar-engine`.

## Position in the Monorepo

```text
engineering-types
       ↑
engineering-units
       ↑
engineering-validation
       ↑
engineering-core
       ↑
solar-engine
```

The package is responsible for common engineering calculation behavior, execution context, result handling, validation integration, assumptions, and calculation tracing.

It should remain domain-agnostic.

## Responsibilities

`engineering-core` provides the common execution layer for engineering calculations.

Typical responsibilities include:

* calculation execution
* calculation inputs and outputs
* validation before calculation
* calculation status
* assumptions
* calculation traces
* deterministic results
* calculation metadata
* error handling
* reusable calculation helpers

Domain-specific formulas should live in higher-level packages.

For example:

```text
engineering-core
    ↓
solar-engine
    ├── load calculations
    ├── energy calculations
    ├── PV sizing
    ├── battery sizing
    ├── inverter sizing
    ├── cable sizing
    └── voltage drop
```

## Design Goals

### Deterministic

The same valid inputs should produce the same result.

```text
inputs + configuration
        ↓
    calculation
        ↓
     result
```

### Traceable

Calculations should be explainable.

A calculation may record:

```text
Input
  ↓
Validation
  ↓
Assumptions
  ↓
Calculation Steps
  ↓
Intermediate Values
  ↓
Final Result
```

### Validated

Invalid engineering inputs should be detected before calculations are executed.

`engineering-core` integrates with:

```text
@ogwusearch/engineering-validation
```

### Unit-aware

Physical quantities should use:

```text
@ogwusearch/engineering-units
```

instead of passing undocumented raw numbers where practical.

### Domain-independent

Do not place solar-specific, mining-specific, electrical-installation-specific, or other domain formulas directly in this package.

For example, this belongs in `solar-engine`:

```ts
calculatePvArraySize(...)
```

while generic execution behavior belongs here:

```ts
executeCalculation(...)
```

## Expected Package Structure

```text
engineering-core/
├── src/
│   ├── calculation/
│   │   ├── calculate.ts
│   │   ├── execute.ts
│   │   └── result.ts
│   │
│   ├── context/
│   │   └── calculation-context.ts
│   │
│   ├── errors/
│   │   └── calculation-error.ts
│   │
│   ├── assumptions/
│   │   └── assumptions.ts
│   │
│   ├── trace/
│   │   ├── add-step.ts
│   │   └── create-trace.ts
│   │
│   ├── helpers/
│   │   └── result-helpers.ts
│   │
│   └── index.ts
│
├── tests/
├── package.json
├── tsconfig.json
└── README.md
```

## Core Calculation Flow

A calculation should follow a predictable pipeline:

```text
Calculation Request
        │
        ▼
     Normalize
        │
        ▼
     Validate
        │
        ▼
     Assumptions
        │
        ▼
     Calculate
        │
        ▼
   Intermediate Steps
        │
        ▼
    Final Result
        │
        ▼
   Calculation Output
```

Conceptually:

```ts
const result = executeCalculation({
  input,
  rules,
  calculate,
  context,
});
```

The execution layer should handle common concerns while the supplied calculation function performs the domain calculation.

## Calculation Context

A calculation context can carry information required for reproducibility and traceability.

Example:

```ts
interface CalculationContext {
  readonly calculationId?: string;
  readonly projectId?: string;
  readonly auditId?: string;
  readonly module?: string;
  readonly version?: string;
}
```

Context should describe the calculation environment rather than contain domain-specific business logic.

## Validation

Validation is performed using:

```text
@ogwusearch/engineering-validation
```

Typical flow:

```ts
const issues = validate(input, rules, context);

if (issues.length > 0) {
  // calculation should not continue
}
```

This keeps validation rules separate from calculation formulas.

## Units

Physical values should use:

```text
@ogwusearch/engineering-units
```

Examples include:

```text
Voltage
Current
Power
Energy
Resistance
Charge
Time
Length
Temperature
Percentage
```

The core package should not duplicate unit conversion logic.

## Results

Calculation results should preserve enough information to understand what happened.

A result may contain:

```text
status
value
unit
issues
assumptions
trace
metadata
```

Example conceptual result:

```ts
{
  status: "success",
  value: 5.2,
  unit: kW,
  issues: [],
  assumptions: [...],
  trace: [...],
  metadata: {
    module: "solar-sizing"
  }
}
```

## Calculation Status

Typical calculation states include:

```text
PENDING
VALIDATING
CALCULATING
SUCCESS
WARNING
ERROR
```

The exact status model should remain centralized in the engineering foundation types.

## Assumptions

Engineering calculations frequently depend on assumptions.

Examples:

```text
System efficiency = 0.85
Power factor = 0.90
Design margin = 1.20
Peak sun hours = 5.0
```

Assumptions should be recorded explicitly rather than hidden inside formulas.

This allows reports and audits to explain how a result was produced.

## Traceability

A calculation trace should expose meaningful engineering steps.

Example:

```text
Step 1
Daily Energy = 12.4 kWh/day

Step 2
Adjusted Energy = 12.4 / 0.85
                = 14.59 kWh/day

Step 3
PV Capacity = 14.59 / 5.0
            = 2.92 kW

Step 4
Design Capacity = 2.92 × 1.20
                = 3.50 kW
```

The trace should be suitable for:

* debugging
* engineering review
* audit reports
* client reports
* calculation verification

## Error Handling

Errors should be explicit and meaningful.

Examples:

```text
INVALID_INPUT
VALIDATION_FAILED
CALCULATION_FAILED
INCOMPATIBLE_UNITS
INVALID_ASSUMPTION
INVALID_CALCULATION_CONTEXT
```

Avoid silent failures.

Avoid returning `NaN` or `Infinity` as a normal engineering result.

## Dependency Rules

`engineering-core` may depend on foundation packages:

```text
@ogwusearch/engineering-types
@ogwusearch/engineering-units
@ogwusearch/engineering-validation
```

It must not depend on:

```text
solar-engine
```

or other domain-specific engineering packages.

This preserves the dependency direction of the monorepo.

## Domain Boundary

### Belongs in `engineering-core`

```text
calculation execution
validation integration
result handling
calculation context
assumptions
trace handling
calculation errors
generic calculation helpers
```

### Does not belong in `engineering-core`

```text
PV formulas
battery formulas
inverter sizing formulas
solar irradiation models
electrical cable formulas
mining production formulas
inventory logic
business rules
UI components
database repositories
```

Those belong in domain packages.

## Example Architecture

```text
packages/
│
├── engineering-types/
│
├── engineering-units/
│
├── engineering-validation/
│
├── engineering-core/
│
└── solar-engine/
    ├── load/
    ├── energy/
    ├── pv/
    ├── battery/
    ├── inverter/
    ├── cable/
    ├── voltage-drop/
    └── protection/
```

A solar calculation can therefore look conceptually like:

```text
solar-engine
      │
      ├── input
      │
      ▼
engineering-core
      │
      ├── validation
      ├── assumptions
      ├── execution
      ├── trace
      └── result
      │
      ▼
engineering-types
engineering-units
engineering-validation
```

## Example Usage

```ts
import {
  executeCalculation,
} from "@ogwusearch/engineering-core";

const result = executeCalculation({
  input,
  calculate: (input) => {
    return calculateSomething(input);
  },
});
```

The exact public API should remain small and stable.

## Testing

The package should test:

```text
calculation execution
validation failures
successful calculations
warning results
calculation errors
trace generation
assumption handling
context propagation
result creation
```

Run:

```bash
pnpm --filter @ogwusearch/engineering-core typecheck
pnpm --filter @ogwusearch/engineering-core build
pnpm --filter @ogwusearch/engineering-core test
```

## Build

```bash
pnpm --filter @ogwusearch/engineering-core build
```

## Typecheck

```bash
pnpm --filter @ogwusearch/engineering-core typecheck
```

## Tests

```bash
pnpm --filter @ogwusearch/engineering-core test
```

## Architectural Principle

The core principle is:

```text
Foundation packages define
HOW engineering data is represented and validated.

engineering-core defines
HOW engineering calculations are executed and traced.

Domain engines define
WHAT engineering problem is being solved.
```

This separation allows the same calculation infrastructure to be reused across:

```text
Solar
Electrical
Mechanical
Mining
Energy
Civil
Industrial
```

without coupling the foundation to a particular engineering domain.

## Package Scope

`@ogwusearch/engineering-core` should remain:

* reusable
* deterministic
* strongly typed
* unit-aware
* validation-aware
* traceable
* domain-independent
* suitable for offline execution

It is the execution foundation for the Ogwusearch engineering platform.
