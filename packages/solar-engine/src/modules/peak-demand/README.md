# Peak Demand Engine

The Peak Demand Engine calculates electrical demand scenarios for engineering system sizing.

It is a domain-specific module within `@ogwusearch/solar-engine` and uses the shared engineering foundation for validation, assumptions, calculation execution, results, and traceability.

---

## Responsibilities

The Peak Demand Engine is responsible for:

* Individual demand calculation
* Demand factor application
* System diversity adjustment
* Starting demand
* Surge demand
* Peak demand determination
* Design demand margin
* Demand-specific validation
* Demand-specific assumptions
* Demand calculation trace

---

## Boundary

The Load module owns load definitions and load-level electrical characteristics.

The Energy module determines energy consumption over time.

The Peak Demand Engine determines electrical operating demand and peak demand for system sizing.

```text
Load
 ├── Load characteristics
 └── Running power
        │
        ├───────────────┐
        ↓               ↓
     Energy        Peak Demand
        │               │
        ↓               ↓
 Daily / Monthly    Peak / Design
 Annual Energy         Demand
```

Peak Demand does not own:

* load definitions
* power factor
* energy consumption
* PV sizing
* battery sizing
* inverter sizing
* cable sizing

---

## Core Formulas

### Individual Demand

```text
Individual Demand
=
Running Power × Demand Factor
```

### Normal Coincident Demand

```text
Coincident Demand
=
Σ Individual Demand / Diversity Factor
```

### Starting Demand

```text
Starting Demand
=
Explicit Starting Power

OR

Running Power × Surge Factor
```

### Design Demand

```text
Design Demand
=
Peak Demand × (1 + Demand Margin)
```

The authoritative formulas above must remain unchanged.

---

## Engineering Rules

* Demand factor must be greater than `0` and less than or equal to `1`.
* Diversity factor must be greater than or equal to `1`.
* Surge factor must be greater than or equal to `1`.
* Starting power must not be less than running power.
* Demand margin must be between `0` and `1`.
* Load IDs must be unique.
* Numeric inputs must be finite.
* Calculations must be deterministic.
* Input data must be treated as immutable.
* Input load order must be preserved.

Invalid engineering inputs must produce validation issues rather than being silently corrected.

---

## Demand Factors Are Distinct Concepts

Demand factor, diversity factor, and surge factor represent different engineering concepts.

They must not be collapsed into one generic multiplication or division factor.

```text
Demand Factor
    ↓
Individual Demand

Diversity Factor
    ↓
Coincident Demand

Surge Factor
    ↓
Starting Demand

Demand Margin
    ↓
Design Demand
```

Each factor has its own engineering meaning, validation rule, and position in the calculation.

---

# Architecture

Peak Demand follows the shared engineering lifecycle provided by:

```text
@ogwusearch/engineering-core
```

The architecture separates the pure engineering calculation from lifecycle orchestration.

```text
                 Input
                   │
                   ↓
          validatePeakDemand()
                   │
                   ↓
       createPeakDemandAssumptions()
                   │
                   ↓
          calculatePeakDemand()
                   │
                   ↓
          Calculation Trace
                   │
                   ↓
          executeCalculation()
                   │
                   ↓
     CalculationResult<PeakDemandOutput>
```

The lifecycle is conceptually:

```text
Input
  ↓
Validation
  ↓
Assumptions
  ↓
Calculation
  ↓
Warnings / Errors
  ↓
Trace
  ↓
CalculationResult
```

---

## Pure Calculation

The pure calculation is responsible only for engineering mathematics.

```ts
calculatePeakDemand(
  input,
): PeakDemandOutput
```

It:

* calculates demand values
* preserves deterministic behavior
* does not mutate input
* does not construct the lifecycle result
* does not own application or UI concerns

---

## Lifecycle Runner

The lifecycle runner exposes the engineering calculation through the shared core infrastructure.

```ts
runPeakDemand(
  input,
): CalculationResult<PeakDemandOutput>
```

The runner uses:

```ts
defineCalculation()
```

and:

```ts
executeCalculation()
```

from `@ogwusearch/engineering-core`.

Conceptually:

```ts
const definition = defineCalculation<
  PeakDemandInput,
  PeakDemandOutput
>({
  name: "Peak Demand",

  validate(input) {
    return validatePeakDemand(input);
  },

  assumptions(input) {
    return createPeakDemandAssumptions(input);
  },

  calculate: calculatePeakDemand,
});

return executeCalculation(
  definition,
  input,
);
```

This keeps lifecycle behavior consistent with Energy Analysis and other engineering modules.

---

# Calculation Result

The lifecycle API returns:

```ts
CalculationResult<PeakDemandOutput>
```

The result contains the engineering lifecycle state:

```text
CalculationResult
├── status
├── valid
├── value
├── errors
├── warnings
├── assumptions
├── trace
└── metadata
```

The calculated Peak Demand output is available through:

```ts
result.value
```

The pure calculation does not need to reproduce this lifecycle wrapper.

---

# Validation

Validation occurs before calculation.

Peak Demand validation is responsible for:

* required input
* load collection
* unique load IDs
* non-empty load IDs
* finite numeric values
* demand factor range
* diversity factor range
* surge factor range
* starting power
* demand margin

Validation produces engineering issues using the shared engineering validation contracts.

The module must not silently modify invalid values.

---

# Assumptions

Peak Demand exposes its engineering assumptions explicitly.

Assumptions use the shared:

```ts
EngineeringAssumption
```

contract from:

```text
@ogwusearch/engineering-types
```

Typical assumptions include:

* demand factor
* diversity factor
* surge factor
* demand margin
* starting-demand behavior

Assumptions must remain auditable and separate from the mathematical implementation.

---

# Trace

Peak Demand supports deterministic calculation tracing.

The intended calculation trace is:

```text
Peak Demand Input
       ↓
Individual Demand
       ↓
Normal Coincident Demand
       ↓
Starting Demand
       ↓
Peak Demand
       ↓
Design Demand
       ↓
Peak Demand Output
```

Trace steps use the shared:

```ts
CalculationTraceStep
```

contract.

Lifecycle execution receives trace infrastructure through the engineering-core execution context.

Trace information should therefore participate in the same `CalculationResult` returned by the lifecycle runner.

---

# Determinism

For identical valid inputs and identical assumptions:

```text
same input
+
same assumptions
=
same output
```

Peak Demand must not depend on:

* random values
* current time
* network requests
* database state
* browser state
* mutable global state

This makes the engine suitable for:

* regression testing
* engineering review
* reproducible calculations
* auditing

---

# Input Immutability

Peak Demand does not modify caller-owned input.

The following must remain unchanged:

```text
input
input.loads
individual load records
```

Calculations should use non-mutating operations such as:

```text
map()
reduce()
```

when processing load collections.

---

# Module Structure

```text
peak-demand/
├── README.md
├── constants.ts
├── calculation.ts
├── run.ts
├── index.ts
│
├── assumptions/
│   ├── peak-demand-assumptions.ts
│   └── index.ts
│
├── calculation/
│   ├── calculate-individual-demand.ts
│   ├── calculate-normal-coincident-demand.ts
│   ├── calculate-starting-demand.ts
│   ├── calculate-peak-demand.ts
│   ├── calculate-design-demand.ts
│   └── index.ts
│
├── types/
│   ├── peak-demand-input.ts
│   ├── peak-demand-output.ts
│   └── index.ts
│
├── validation/
│   ├── rules.ts
│   ├── validate-peak-demand.ts
│   └── index.ts
│
├── trace/
│   ├── peak-demand-trace.ts
│   └── index.ts
│
└── __tests__/
    ├── calculation.test.ts
    ├── regression.test.ts
    └── validation.test.ts
```

---

# Public API

The module exposes its intentional public contracts through:

```text
index.ts
```

Expected exports include:

### Types

```ts
PeakDemandInput
PeakDemandOutput
```

### Calculation

```ts
calculatePeakDemand
calculateIndividualDemand
calculateNormalCoincidentDemand
calculateStartingDemand
calculateDesignDemand
```

### Validation

```ts
validatePeakDemand
```

### Assumptions

```ts
createPeakDemandAssumptions
```

### Trace

```ts
createPeakDemandTrace
```

### Lifecycle

```ts
runPeakDemand
```

Internal implementation details should not be exposed unnecessarily.

---

# Unit Convention

Electrical power is represented using watts (`W`) as the canonical calculation unit.

```text
1 kW = 1,000 W
```

Unit conversion should use:

```text
@ogwusearch/engineering-units
```

rather than implementing a second unit-conversion system inside Peak Demand.

---

# Testing

Peak Demand tests should protect both engineering behavior and architecture.

## Calculation Tests

Test:

* individual demand
* normal coincident demand
* starting demand
* peak demand
* design demand
* multiple loads
* deterministic results
* input-order preservation

## Validation Tests

Test:

* missing input
* empty loads
* duplicate load IDs
* invalid demand factor
* invalid diversity factor
* invalid surge factor
* invalid starting power
* invalid demand margin
* non-finite numeric values

## Regression Tests

Regression tests must protect the authoritative formulas:

```text
Individual Demand
Normal Coincident Demand
Starting Demand
Peak Demand
Design Demand
```

Changes to these formulas require deliberate engineering review.

---

# Dependency Direction

Peak Demand is part of the solar-engine domain layer.

```text
engineering-types
       ↑
engineering-units
engineering-validation
engineering-core
       ↑
solar-engine
       ↑
peak-demand
```

`engineering-core` must remain domain-independent.

Peak Demand must not introduce solar-domain dependencies into the foundation packages.

---

# Relationship to Energy Analysis

Energy Analysis and Peak Demand solve different engineering problems.

```text
Energy
──────
Running Power
×
Operating Hours
↓
Daily Energy
↓
Monthly Energy
↓
Annual Energy
```

```text
Peak Demand
───────────
Running Power
×
Demand Factor
↓
Individual Demand
↓
Coincident Demand
↓
Starting Demand
↓
Peak Demand
↓
Design Demand
```

Energy determines **energy consumption over time**.

Peak Demand determines **electrical demand for system sizing**.

Neither calculation should silently replace the other.

---

# Design Principles

The Peak Demand Engine is designed to be:

* **Deterministic**
* **Traceable**
* **Validated**
* **Assumption-aware**
* **Unit-aware**
* **Immutable**
* **Modular**
* **Reusable**
* **Auditable**

The core engineering principle is:

> Demand factor, diversity factor, surge factor, and design margin are distinct engineering concepts and must remain distinct throughout the calculation lifecycle.

---

# Acceptance Criteria

Peak Demand is structurally complete when:

* [ ] Core formulas are preserved.
* [ ] Input and output contracts are explicit.
* [ ] Validation occurs before calculation.
* [ ] Assumptions are explicit.
* [ ] Pure calculation returns `PeakDemandOutput`.
* [ ] Lifecycle runner returns `CalculationResult<PeakDemandOutput>`.
* [ ] `engineering-core` owns lifecycle execution.
* [ ] Calculation trace participates in the lifecycle result.
* [ ] Input is immutable.
* [ ] Load order is deterministic.
* [ ] Demand factors remain distinct.
* [ ] Calculation tests pass.
* [ ] Validation tests pass.
* [ ] Regression tests pass.
* [ ] TypeScript typecheck passes.
* [ ] Package build passes.

---

# Summary

The Peak Demand Engine provides the demand-analysis layer required for engineering system sizing.

Its pure calculation flow is:

```text
Running Power
      ↓
Individual Demand
      ↓
Normal Coincident Demand
      ↓
Starting Demand
      ↓
Peak Demand
      ↓
Design Demand
```

Its engineering lifecycle is:

```text
Input
 ↓
Validation
 ↓
Assumptions
 ↓
Calculation
 ↓
Warnings / Errors
 ↓
Trace
 ↓
CalculationResult
```

The module therefore remains focused on its engineering responsibility while relying on `@ogwusearch/engineering-core` for shared calculation lifecycle infrastructure.
