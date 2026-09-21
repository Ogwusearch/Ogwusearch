# @ogwusearch/engineering-core

Execution foundation for deterministic engineering calculations.

## Purpose

`@ogwusearch/engineering-core` provides the execution and orchestration layer for the OGWUSEARCH engineering ecosystem.

It connects:

* Engineering types
* Validation
* Engineering modules
* Calculation execution
* Results
* Warnings
* Errors
* Assumptions
* Metadata
* Calculation traces

The core package provides the **execution framework**.

It does not contain domain-specific engineering formulas.

---

## Calculation Flow

Every engineering calculation follows a consistent execution pipeline:

```text
Input
  ↓
Validation
  ↓
Calculation
  ↓
Warnings
  ↓
Result
  ↓
Trace
```

More explicitly:

```text
                    Engineering Input
                           │
                           ▼
                    ┌──────────────┐
                    │  Validation  │
                    └──────┬───────┘
                           │
                ┌──────────┴──────────┐
                │                     │
             Invalid                 Valid
                │                     │
                ▼                     ▼
             Errors              Calculation
                                      │
                         ┌────────────┼────────────┐
                         │            │            │
                         ▼            ▼            ▼
                      Result       Warnings      Trace
                         │            │            │
                         └────────────┴────────────┘
                                      │
                                      ▼
                           EngineeringResult
```

---

## Responsibilities

`engineering-core` is responsible for:

* Engineering module execution
* Calculation orchestration
* Validation orchestration
* Result construction
* Error propagation
* Warning collection
* Assumption collection
* Metadata handling
* Calculation trace handling
* Consistent execution behavior

---

## Engineering Module

An engineering module represents one deterministic engineering calculation.

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

Example:

```text
PV Sizing Module

Input
  ↓
PVSizingInput
  ↓
Validation
  ↓
ValidatedPVSizingInput
  ↓
Calculation
  ↓
PVSizingResult
```

---

## Calculation Runner

The calculation runner is the main execution mechanism.

Conceptually:

```ts
runEngineeringModule(
  input,
  module,
  metadata,
);
```

The runner is responsible for:

1. Receiving input
2. Running validation
3. Collecting validation errors
4. Stopping invalid calculations
5. Executing valid calculations
6. Collecting warnings
7. Creating the engineering result
8. Attaching metadata
9. Attaching assumptions
10. Attaching calculation trace

The runner should not contain domain-specific engineering formulas.

---

## Validation

Validation occurs before calculation.

```text
Input
  ↓
Validation
  ↓
Valid?
```

If validation fails:

```text
Input
  ↓
Validation
  ↓
Errors
  ↓
EngineeringResult
```

The calculation itself must not execute with invalid input.

Validation logic belongs primarily to:

```text
@ogwusearch/engineering-validation
```

The core package orchestrates validation but does not replace the validation package.

---

## Error Handling

Engineering errors should be structured.

Example:

```ts
{
  ok: false,
  errors: [
    {
      code: "INVALID_INPUT",
      field: "systemVoltage",
      message: "systemVoltage must be one of 12, 24, 36, or 48"
    }
  ],
  warnings: [],
  metadata: {
    engine: "solar-engine",
    module: "battery-sizing",
    version: "1.0.0"
  }
}
```

The runner should preserve the original error information.

It should not silently discard validation failures.

---

## Warnings

Warnings represent conditions that do not necessarily prevent calculation.

Example:

```text
Input
  ↓
Validation
  ↓
Valid
  ↓
Calculation
  ↓
Warning
  ↓
Result
```

Example warning:

```ts
{
  code: "HIGH_VOLTAGE_DROP",
  message: "Calculated voltage drop exceeds the recommended limit"
}
```

Warnings should remain separate from errors.

```text
Error
→ Calculation cannot produce a valid result

Warning
→ Calculation completed, but attention is required
```

---

## Assumptions

Engineering calculations often require assumptions.

The core execution layer should provide a consistent mechanism for recording them.

Example:

```ts
{
  name: "systemEfficiency",
  value: 0.75,
  reason: "Default system efficiency",
  source: "solar-engine"
}
```

Assumptions should be visible in the final engineering result.

This improves:

* Auditability
* Reproducibility
* Engineering review
* Report generation

---

## Metadata

Every engineering result should identify the calculation that produced it.

Example:

```ts
{
  engine: "solar-engine",
  module: "pv-sizing",
  version: "1.0.0"
}
```

Metadata may also include:

```text
Engine
Module
Version
Timestamp
Calculation ID
```

Metadata allows results to be traced back to their originating calculation module.

---

## Calculation Trace

The core package supports calculation traceability.

Conceptually:

```text
Calculation
    │
    ├── Step 1
    ├── Step 2
    ├── Step 3
    └── Step 4
```

Example:

```text
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

The trace makes engineering results easier to inspect and audit.

The domain engine defines the engineering steps.

The core package provides the execution infrastructure for carrying the trace.

---

## Result Construction

The core package should produce a consistent result shape.

Conceptually:

```ts
type EngineeringResult<T> = {
  ok: boolean;
  value?: T;
  errors: EngineeringError[];
  warnings: EngineeringWarning[];
  assumptions?: EngineeringAssumption[];
  metadata: EngineeringMetadata;
  trace?: CalculationTrace;
};
```

Successful calculation:

```ts
{
  ok: true,
  value: result,
  errors: [],
  warnings: [],
  assumptions: [],
  metadata,
  trace
}
```

Failed calculation:

```ts
{
  ok: false,
  errors,
  warnings: [],
  metadata
}
```

---

## Dependency Direction

The core package sits above the shared contracts and validation infrastructure.

```text
              engineering-types
                 ↑      ↑
                 │      │
                 │      └────────────┐
                 │                   │
        engineering-units    engineering-validation
                                      │
                                      ▼
                              engineering-core
                                      │
                     ┌────────────────┼────────────────┐
                     ▼                ▼                ▼
               solar-engine   electrical-engine   circuit-engine
```

The important architectural rule is:

> Foundation packages must never depend on domain engines.

Therefore:

```text
engineering-core → solar-engine
```

is forbidden.

Instead:

```text
solar-engine → engineering-core
```

is correct.

---

## Separation of Responsibilities

### `engineering-types`

Defines shared contracts.

```text
"What shape does the data have?"
```

### `engineering-units`

Defines quantities, dimensions, and conversions.

```text
"What unit does this value represent?"
```

### `engineering-validation`

Validates engineering inputs.

```text
"Is this input valid?"
```

### `engineering-core`

Executes engineering modules.

```text
"How should this calculation execute?"
```

### Domain engines

Perform engineering mathematics.

```text
"What is the engineering result?"
```

---

## Example: Solar Calculation

A solar calculation should look conceptually like:

```text
solar-engine
     │
     ▼
PV Sizing Module
     │
     ▼
engineering-core
     │
     ├── validate
     │
     ├── calculate
     │
     ├── warnings
     │
     ├── assumptions
     │
     ├── metadata
     │
     └── trace
     │
     ▼
EngineeringResult
```

The solar formula remains inside:

```text
@ogwusearch/solar-engine
```

The execution framework remains inside:

```text
@ogwusearch/engineering-core
```

---

## Example: Generic Module

```ts
const module: EngineeringModule<
  Input,
  ValidatedInput,
  Output
> = {
  validate(input) {
    return validateInput(input);
  },

  calculate(input) {
    return calculateEngineeringResult(input);
  },
};
```

Execution:

```ts
const result = runEngineeringModule(
  input,
  module,
  metadata,
);
```

The runner provides consistent execution regardless of the engineering domain.

---

## Determinism

Engineering calculations must be deterministic.

Given:

```text
Same input
+
Same module version
+
Same assumptions
+
Same constants
```

the calculation should produce the same result.

The core execution layer should avoid:

* Random values
* Hidden mutable state
* Uncontrolled external dependencies
* Non-deterministic execution

---

## Side Effects

The calculation core should remain as close to pure execution as possible.

It should not directly:

* Access databases
* Make HTTP requests
* Modify application state
* Write files
* Depend on UI frameworks

Persistence and application integration belong outside the engineering core.

---

## Testing

The core package should test:

### Successful execution

```text
Valid input
  ↓
Validation passes
  ↓
Calculation executes
  ↓
Result returned
```

### Validation failure

```text
Invalid input
  ↓
Validation fails
  ↓
Calculation does not execute
  ↓
Errors returned
```

### Warning propagation

```text
Valid input
  ↓
Calculation
  ↓
Warning
  ↓
Result contains warning
```

### Metadata propagation

Verify that calculation metadata is preserved.

### Trace propagation

Verify that calculation traces are preserved.

### Generic typing

Verify that:

```ts
EngineeringResult<T>
```

correctly retains the calculation output type.

---

## Recommended Package Structure

```text
engineering-core/
│
├── src/
│   ├── index.ts
│   │
│   ├── runner/
│   │   ├── run-engineering-module.ts
│   │   └── runner-types.ts
│   │
│   ├── result/
│   │   └── result-builder.ts
│   │
│   ├── warnings/
│   │   └── warning-collector.ts
│   │
│   ├── assumptions/
│   │   └── assumption-collector.ts
│   │
│   ├── trace/
│   │   └── trace-builder.ts
│   │
│   └── __tests__/
│       ├── runner.test.ts
│       ├── result.test.ts
│       ├── warnings.test.ts
│       └── trace.test.ts
│
└── README.md
```

---

## Quality Requirements

`@ogwusearch/engineering-core` should maintain:

* Strong TypeScript typing
* Deterministic execution
* Consistent result construction
* Structured errors
* Structured warnings
* Explicit assumptions
* Calculation metadata
* Calculation traceability
* No domain-specific formulas
* No UI dependencies
* No database dependencies
* No circular dependencies

---

## Summary

`@ogwusearch/engineering-core` is the execution foundation of the OGWUSEARCH engineering ecosystem.

Its responsibility is to provide a consistent calculation lifecycle:

```text
Input
  ↓
Validation
  ↓
Calculation
  ↓
Warnings
  ↓
Assumptions
  ↓
Metadata
  ↓
Trace
  ↓
EngineeringResult
```

The package provides the execution framework.

The shared types package defines the contracts.

The validation package validates inputs.

The units package manages quantities and conversions.

The domain engines contain the actual engineering mathematics.
