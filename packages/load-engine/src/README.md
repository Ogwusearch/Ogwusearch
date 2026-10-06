# Solar Engine — Load Analysis

## Overview

The **Load Analysis** module is the first domain calculation module in `@ogwusearch/solar-engine`.

It converts electrical load information into a validated, deterministic load-analysis result that can be consumed by downstream engineering modules such as:

```text
Load Analysis
      │
      ▼
Energy Analysis
      │
      ▼
Peak Demand
      │
      ▼
PV Sizing
```

Load Analysis is responsible for describing the electrical loads of a system and calculating their operating characteristics.

It does **not** perform energy sizing, peak-demand calculations, PV sizing, battery sizing, inverter sizing, cable sizing, or system costing.

---

## Module Responsibilities

The Load module owns:

* load definitions
* load identification
* quantity
* rated power
* running power
* operating hours
* operating days
* load categorization where explicitly defined
* load-level validation
* load-level calculations
* load-analysis assumptions
* deterministic calculation results
* calculation trace information
* preservation of input order
* input immutability

The Load module does **not** own:

* generic validation infrastructure
* generic engineering identifiers
* generic engineering result contracts
* generic unit conversion
* calculation lifecycle orchestration
* energy calculations
* demand factors
* diversity factors
* PV calculations
* battery calculations
* inverter calculations
* cable calculations
* database access
* API controllers
* UI state
* network access

Those responsibilities belong to the appropriate foundation or domain modules.

---

# Engineering Architecture

Load belongs inside the Solar Engine domain layer.

```text
@ogwusearch/engineering-types
              ↑
@ogwusearch/engineering-units
              ↑
@ogwusearch/engineering-validation
              ↑
@ogwusearch/engineering-core
              ↑
@ogwusearch/solar-engine
              │
              ▼
             load
```

The Load module may consume the engineering foundation.

The foundation must never import Load or any other Solar Engine module.

---

# Load Analysis Contract

The Load module should maintain a clear distinction between:

1. the input load definition
2. calculated load characteristics
3. validation
4. assumptions
5. trace
6. final calculation result

The domain model should not duplicate generic foundation contracts.

---

## Input Contract

A Load input represents the information required to describe an electrical load.

A typical load input is:

```ts
export interface Load {
  readonly id: string;
  readonly name: string;

  readonly category: LoadCategory;

  readonly quantity: number;

  readonly ratedPowerW: number;

  readonly powerFactor: number;

  readonly efficiency?: number;

  readonly operatingHoursPerDay: number;

  readonly operatingDaysPerMonth: number;

  /**
   * Per-load demand factor consumed by Peak Demand.
   */
  readonly demandFactor?: number;

  readonly phase: LoadPhase;

  readonly description?: string;
}
```

The exact domain contract may evolve as the Load module is implemented, but the following principles must remain:

* values are explicit
* units are explicit in the contract or domain naming
* optional engineering assumptions are distinguishable from required inputs
* caller-owned objects are treated as read-only
* no hidden defaults are introduced inside formulas

---

# Load Characteristics

The fundamental distinction is between **rated power** and **running power**.

For a load:

```text
Running Power
    =
Rated Power × Quantity
```

Example:

```text
10 W lamp × 4 units
        =
40 W running power
```

The calculation must not silently alter the supplied rated power.

---

# Quantity

Quantity represents the number of identical load units.

For example:

```text
quantity = 6
ratedPowerW = 100 W
```

produces:

```text
runningPowerW = 600 W
```

Quantity must be validated as an appropriate engineering value.

A fractional quantity should not be accepted unless the Load contract explicitly permits fractional quantities.

---

# Operating Time

Load Analysis records operating characteristics but does not convert them into a complete energy profile.

The basic operating fields are:

```text
operatingHoursPerDay
operatingDaysPerMonth
```

These values are later consumed by Energy Analysis.

Load does not invent:

* start times
* stop times
* hourly schedules
* weekday schedules
* seasonal schedules
* interval measurements

unless those concepts are explicitly added to the Load input contract.

---

# Energy Boundary

Load provides the characteristics required by Energy Analysis.

Conceptually:

```text
Load
 │
 ├── runningPowerW
 ├── operatingHoursPerDay
 └── operatingDaysPerMonth
 │
 ▼
Energy
```

Energy Analysis is responsible for converting those characteristics into:

```text
daily energy
monthly energy
annual energy
```

Load must therefore avoid duplicating Energy calculations.

---

# Demand Boundary

The Load module may provide demand-related information required by
Peak Demand, such as:

    runningLoadW
    demandFactor

Load does not calculate aggregate demand.

The Peak Demand module owns:

    Individual Demand
    Normal Coincident Demand
    Diversity Factor
    Starting Demand
    Peak Demand
    Design Demand
    Demand Margin

The aggregate diversity factor is supplied through LoadAuditInput:

    interface LoadAuditInput {
      readonly loads: readonly Load[];
      readonly diversityFactor?: number;
      readonly designMargin?: number;
    }

The established Peak Demand relationships remain:

    Individual Demand
        = Running Power × Demand Factor

    Normal Coincident Demand
        = Σ Individual Demand / Diversity Factor

    Design Demand
        = Peak Demand × (1 + Demand Margin)

Load Audit may orchestrate Peak Demand, but the demand algorithm remains
owned by the Peak Demand domain.

---

# Validation

Load validation must use the shared engineering validation infrastructure.

Generic validation belongs to:

```text
@ogwusearch/engineering-validation
```

Load-specific validation belongs to:

```text
solar-engine/load/validation/
```

Examples of Load validation include:

* required load ID
* required load name
* positive quantity
* positive rated power
* non-negative operating hours
* valid operating days
* finite numeric values
* valid demand factor
* valid surge factor
* valid starting power
* duplicate load IDs

Validation should produce structured engineering issues.

Example:

```ts
{
  code: "LOAD_POWER_INVALID",
  severity: "ERROR",
  message: "Rated power must be greater than zero.",
  path: "loads[0].ratedPowerW",
}
```

Validation must not silently repair invalid values.

For example, do not convert:

```text
-100 W
```

into:

```text
0 W
```

without an explicit engineering rule and documented assumption.

---

# Calculation Lifecycle

Load calculations should use `@ogwusearch/engineering-core`.

The intended lifecycle is:

```text
Load Input
    │
    ▼
Validation
    │
    ├── ERROR ───────────────► Result
    │
    ▼
Assumptions
    │
    ▼
Calculation
    │
    ▼
Trace
    │
    ▼
Result
```

The domain module should not implement its own competing calculation executor.

Use the shared execution infrastructure:

```ts
executeCalculation(...)
```

The Load module owns the domain calculation definition.

The engineering core owns execution orchestration.

---

# Trace

Load calculations must expose deterministic trace information.

Trace steps should describe what the calculation did.

A typical Load trace is:

```text
Load Input
    │
    ▼
Validate Load
    │
    ▼
Calculate Quantity Power
    │
    ▼
Calculate Running Power
    │
    ▼
Preserve Operating Characteristics
    │
    ▼
Load Output
```

A trace step may contain:

```ts
context.trace.add({
  id: "running-power",
  name: "Calculate Running Power",
  description:
    "Calculate total running power from rated power and quantity.",
  formula:
    "runningPowerW = ratedPowerW × quantity",
  inputs: {
    ratedPowerW,
    quantity,
  },
  outputs: {
    runningPowerW,
  },
  unit: "W",
});
```

Trace sequence numbers are assigned by the engineering-core trace context.

The Load module must not manually assign execution sequence numbers unless there is a specific reason to override them.

---

# Assumptions

Load assumptions must be explicit.

Examples may include:

```text
LOAD_DEFAULT_OPERATING_DAYS
LOAD_DEFAULT_DEMAND_FACTOR
LOAD_DEFAULT_SURGE_FACTOR
```

However, defaults must not be silently hidden inside mathematical functions.

An assumption should be represented through the shared:

```ts
EngineeringAssumption
```

contract.

Example:

```ts
{
  code: "LOAD_DEFAULT_DEMAND_FACTOR",
  name: "Default Demand Factor",
  value: 1,
  description:
    "Demand factor applied when no load-specific factor is supplied.",
}
```

Where an assumption materially affects an engineering result, it should be visible in the calculation result.

---

# Determinism

Load calculations must be deterministic.

For identical inputs:

```text
same input
    ↓
same validation issues
    ↓
same assumptions
    ↓
same calculated values
    ↓
same trace sequence
    ↓
same output
```

The calculation must not depend on:

* current time
* random numbers
* network state
* database state
* UI state
* global mutable state
* external services

Execution metadata such as `startedAt` may represent the runtime execution time, but it must not influence the engineering calculation.

---

# Input Immutability

The Load module must never mutate caller-owned input.

Given:

```ts
const input = {
  loads: [
    {
      id: "L1",
      name: "Lighting",
      quantity: 4,
      ratedPowerW: 10,
      operatingHoursPerDay: 6,
      operatingDaysPerMonth: 30,
    },
  ],
};
```

the calculation must not modify:

```ts
input
input.loads
input.loads[0]
```

Do not use sorting, mutation, or in-place transformation on caller-owned arrays.

Prefer:

```ts
const results = input.loads.map(...)
```

over:

```ts
input.loads.sort(...)
```

---

# Load Order

Output results must preserve input order.

Given:

```text
[A, B, C]
```

the result must remain:

```text
[A, B, C]
```

The Load calculation must not reorder loads as a side effect.

This makes calculation output predictable and simplifies traceability between input records and output records.

---

# Duplicate Load IDs

Load identifiers must be unique within a Load Analysis input.

For example:

```text
L1
L2
L3
```

is valid.

While:

```text
L1
L2
L1
```

must produce a validation error.

Duplicate identifiers create ambiguity for:

* traceability
* downstream calculations
* reporting
* audit records
* result mapping

The module must reject ambiguous identity rather than silently renaming records.

---

# Output Contract

A Load calculation should return a structured domain output.

For example:

```ts
export interface LoadResult {
  readonly loadId: string;

  readonly connectedLoadW: number;

  readonly runningLoadW: number;

  readonly apparentPowerVA: number;
}
```

The complete calculation result is provided through the shared:

```ts
CalculationResult<TOutput>
```

contract.

Therefore the module should not introduce a second result envelope containing its own:

```ts
valid
errors
warnings
status
trace
```

model.

Those belong to `engineering-types`.

---

# Public API

The Load module exposes its intentional public API through:

    src/load/index.ts

The implemented public contracts include:

    Load
    LoadCategory
    LoadPhase

    LoadAudit
    LoadAuditInput
    LoadResult
    LoadAuditOutput

    calculateLoad
    calculateLoadAudit

    validateLoad
    validateLoadList

    createLoadAssumptions
    createLoadTrace

    runLoadAudit

Applications and other domain modules should import through the Load
barrel rather than reaching into internal implementation files.

The Load module does not expose legacy load contracts or the
removed legacy calculation implementation.

---

# Module Structure

The intended Load structure is:

```text
load/
├── __tests__/
│   ├── calculation.test.ts
│   ├── regression.test.ts
│   └── validation.test.ts
│
├── assumptions/
│   ├── load-assumptions.ts
│   └── index.ts
│
├── calculation/
│   ├── calculate-running-power.ts
│   ├── calculate-load.ts
│   └── index.ts
│
├── types/
│   ├── load-input.ts
│   ├── load-output.ts
│   └── index.ts
│
├── validation/
│   ├── rules.ts
│   ├── validate-load.ts
│   └── index.ts
│
├── trace/
│   ├── load-trace.ts
│   └── index.ts
│
├── calculation.ts
├── constants.ts
├── run.ts
└── index.ts
```

The exact structure may evolve, but responsibilities should remain separated.

---

# Calculation Functions

Calculation functions should remain small and focused.

For example:

```ts
export function calculateRunningPowerW(
  ratedPowerW: number,
  quantity: number,
): number {
  return ratedPowerW * quantity;
}
```

The mathematical function should not:

* validate unrelated domain rules
* create API responses
* access a database
* create UI state
* access network services
* mutate global state
* execute the complete calculation lifecycle

Validation and orchestration belong to their appropriate layers.

---

# Error Handling

Expected engineering validation failures should become structured validation issues.

Unexpected calculation failures should pass through `engineering-core` and become:

```text
CALCULATION_FAILED
```

Validation exceptions should become:

```text
VALIDATION_FAILED
```

Assumption-resolution failures should become:

```text
INVALID_ASSUMPTION
```

The Load module should not allow raw exceptions to escape from the public calculation execution boundary.

---

# Relationship With Energy Analysis

Load is the source of operating characteristics for Energy Analysis.

```text
LoadAuditOutput
    │
    ├── runningPowerW
    ├── operatingHoursPerDay
    └── operatingDaysPerMonth
    │
    ▼
EnergyInput
    │
    ▼
Energy Analysis
```

Energy should consume the information it needs rather than importing and duplicating the complete Load domain model.

This keeps the domain modules loosely coupled.

---

# Relationship With Peak Demand

Peak Demand consumes load characteristics relevant to demand.

```text
Load
 │
 ├── running power
 ├── demand factor
 ├── surge factor
 └── starting power
 │
 ▼
Peak Demand
```

Peak Demand owns the demand aggregation mathematics.

The Load module must not duplicate those calculations.

---

# Testing Requirements

The Load module must have tests for every public calculation behavior.

## Calculation Tests

Test at minimum:

* single load
* multiple loads
* quantity calculation
* running power
* operating hours
* operating days
* optional starting power
* demand factor
* surge factor
* empty load collection

## Validation Tests

Test:

* missing ID
* duplicate IDs
* missing name where required
* zero quantity
* negative quantity
* zero rated power
* negative rated power
* negative operating hours
* invalid operating days
* invalid demand factor
* invalid surge factor
* invalid starting power
* non-finite numeric values

## Regression Tests

Test:

* deterministic output
* input-order preservation
* input immutability
* repeated execution
* stable validation ordering
* stable trace ordering

## Execution Tests

Test integration with:

```text
engineering-core
```

including:

* successful execution
* validation failure
* warnings
* assumptions
* calculation exception
* calculation trace
* result status

---

# Engineering Unit Conventions

Where values are represented by numeric domain fields, the field names must make units explicit.

Preferred:

```ts
ratedPowerW
runningPowerW
startingPowerW
```

rather than ambiguous:

```ts
ratedPower
runningPower
startingPower
```

Standard conventions include:

```text
Power       W
Energy      Wh
Large Energy kWh
Time        h
Voltage     V
Current     A
Resistance  Ω
```

The Load module must not silently convert units.

Unit-aware quantities from:

```text
@ogwusearch/engineering-units
```

may be used where the broader architecture requires them.

---

# No Hidden Defaults

Defaults must be explicit.

Avoid:

```ts
const hours = input.operatingHoursPerDay || 8;
```

because this silently changes valid values such as `0`.

Prefer explicit resolution:

```ts
const hours =
  input.operatingHoursPerDay ??
  DEFAULT_OPERATING_HOURS_PER_DAY;
```

and expose the default as an engineering assumption where it affects the result.

---

# No Silent Clamping

Do not silently transform invalid engineering values.

Avoid:

```ts
const quantity = Math.max(0, input.quantity);
```

If:

```text
quantity = -2
```

is invalid, validation should report the error.

The calculation should not silently convert it to:

```text
quantity = 0
```

---

# Domain Boundary

The Load module is a domain module.

It should contain Solar Engineering concepts but remain independent of application infrastructure.

It must not directly depend on:

* React
* Next.js
* browser APIs
* Supabase
* SQLite
* FastAPI
* HTTP clients
* MCP
* AI services
* UI components

The domain engine must remain usable offline and independently of the application layer.

---

# Design Principles

The Load module follows these principles:

1. **Explicit contracts**
2. **Deterministic calculations**
3. **Pure calculation functions where practical**
4. **No hidden mutable state**
5. **Explicit units**
6. **No silent unit conversion**
7. **No silent clamping**
8. **Explicit assumptions**
9. **Deterministic validation**
10. **Deterministic trace ordering**
11. **Input immutability**
12. **Input-order preservation**
13. **No duplicated foundation contracts**
14. **No duplicated generic validation**
15. **No duplicated calculation orchestration**
16. **No UI dependencies**
17. **No network dependencies**
18. **No database dependencies**
19. **Tests for every public behavior**

---

# Phase Boundary

Load Analysis is the first domain stage.

```text
01 Load Audit
       │
       ▼
02 Energy Analysis
       │
       ▼
03 Peak Demand
       │
       ▼
04 PV Sizing
```

The Load module answers:

> What electrical loads exist, and what are their operating characteristics?

Energy answers:

> How much energy do those loads consume over time?

Peak Demand answers:

> What demand must the electrical system be designed to support?

PV Sizing answers:

> What PV capacity is required to meet the energy requirement?

Keeping these questions separate prevents domain calculations from becoming one large coupled function.

---

# Definition of Done

The Load module is ready for downstream integration when:

```text
[ ] Load input contract is stable
[ ] Load output contract is stable
[ ] Validation is deterministic
[ ] Duplicate IDs are detected
[ ] Running power is calculated correctly
[ ] Input order is preserved
[ ] Input is not mutated
[ ] Assumptions are explicit
[ ] Trace is deterministic
[ ] engineering-core executes the calculation
[ ] CalculationResult is used as the result envelope
[ ] No duplicate generic contracts exist
[ ] Unit conventions are explicit
[ ] Calculation tests pass
[ ] Validation tests pass
[ ] Regression tests pass
[ ] Integration tests pass
[ ] Typecheck passes
[ ] Lint passes
[ ] Build passes
```

---

# Architectural Principle

The Load module should remain a focused engineering domain module.

```text
engineering-types
        │
        ▼
engineering-units
        │
        ▼
engineering-validation
        │
        ▼
engineering-core
        │
        ▼
solar-engine
        │
        ▼
      Load
        │
        ├────────► Energy
        │
        ├────────► Peak Demand
        │
        └────────► downstream engineering modules
```

The foundation provides the contracts and infrastructure.

The Load module provides the solar-domain meaning.

The application layer eventually provides the user experience.

The calculation engine remains the authoritative source of engineering results.
