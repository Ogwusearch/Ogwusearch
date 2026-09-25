# Energy Analysis

## Overview

The Energy Analysis module is **Phase 02** of the SolarAudit engineering engine.

It converts the electrical load-analysis projection into deterministic daily, monthly, and annual energy consumption, then applies explicit system-loss and design-margin assumptions.

The module is intentionally independent of the Load domain. It receives the load characteristics required for energy calculation rather than importing and duplicating the complete `Load` model.

---

## Engineering Flow

```text
Load Audit
    │
    │ EnergyLoadInput
    ▼
Energy Analysis
    │
    ├── Daily Energy
    ├── Monthly Energy
    ├── Annual Energy
    ├── System Loss Adjustment
    └── Design Margin
    │
    ▼
Energy Output
    │
    ▼
Peak Demand / Solar Sizing
```

---

## Responsibilities

Energy Analysis is responsible for:

* calculating daily energy consumption
* calculating monthly energy consumption
* calculating annual energy consumption
* aggregating energy across loads
* applying system-loss adjustment
* applying energy design margin
* validating Energy Analysis inputs
* exposing explicit engineering assumptions
* providing deterministic calculation trace steps
* preserving input order
* avoiding mutation of caller-owned input

Energy Analysis does **not** own:

* load definitions
* load categories
* power-factor calculations
* demand factors
* diversity factors
* peak-demand calculations
* solar PV sizing
* battery sizing
* inverter sizing
* cable sizing

Those responsibilities belong to their respective engineering modules.

---

## Input Contract

Energy receives a projection of the required load information:

```ts
export interface EnergyLoadInput {
  readonly loadId: string;
  readonly runningLoadW: number;
  readonly operatingHoursPerDay: number;
  readonly operatingDaysPerMonth: number;
}

export interface EnergyInput {
  readonly loads: readonly EnergyLoadInput[];
  readonly systemLossFactor?: number;
  readonly designMargin?: number;
}
```

The Energy module therefore does not depend directly on the complete Load model.

### Input relationships

```text
runningLoadW
      ×
operatingHoursPerDay
      =
dailyEnergyWh
```

```text
dailyEnergyWh
      ×
operatingDaysPerMonth
      =
monthlyEnergyWh
```

```text
monthlyEnergyWh
      ×
12
      =
annualEnergyWh
```

---

## Output Contract

The module produces:

```ts
export interface EnergyLoadResult {
  readonly loadId: string;
  readonly dailyEnergyWh: number;
  readonly monthlyEnergyWh: number;
  readonly annualEnergyWh: number;
}
```

and:

```ts
export interface EnergyOutput {
  readonly loads: readonly EnergyLoadResult[];

  readonly totalDailyEnergyWh: number;
  readonly totalDailyEnergyKWh: number;

  readonly totalMonthlyEnergyWh: number;
  readonly totalMonthlyEnergyKWh: number;

  readonly totalAnnualEnergyWh: number;
  readonly totalAnnualEnergyKWh: number;

  readonly adjustedDailyEnergyWh: number;
  readonly adjustedMonthlyEnergyWh: number;
  readonly adjustedAnnualEnergyWh: number;

  readonly designDailyEnergyWh: number;
  readonly designMonthlyEnergyWh: number;
  readonly designAnnualEnergyWh: number;

  readonly adjustmentFactor: number;
}
```

---

## System Loss Adjustment

System losses are represented as a fractional loss:

```text
0 ≤ systemLossFactor < 1
```

The adjustment factor is:

```text
adjustmentFactor = 1 / (1 - systemLossFactor)
```

Therefore:

```text
adjustedEnergy
    =
energy × adjustmentFactor
```

For example, with a 20% loss:

```text
systemLossFactor = 0.20

adjustmentFactor
    = 1 / (1 - 0.20)
    = 1.25
```

The calculation does not silently clamp invalid loss values. Validation rejects values outside the permitted range.

---

## Design Margin

Design margin is represented as a ratio:

```text
0 ≤ designMargin ≤ 1
```

The design energy is:

```text
designEnergy
    =
adjustedEnergy × (1 + designMargin)
```

For example:

```text
adjustedEnergy = 1,250 kWh
designMargin   = 0.20

designEnergy
    = 1,250 × 1.20
    = 1,500 kWh
```

---

## Defaults

Energy defaults are defined centrally in:

```text
energy/constants.ts
```

Current defaults:

```ts
export const ENERGY_DEFAULTS = {
  systemLossFactor: 0,
  designMargin: 0,
  monthsPerYear: 12,
  wattHoursPerKilowattHour: 1000,
  maxOperatingDaysPerMonth: 31,
  maxOperatingHoursPerDay: 24,
};
```

Defaults are explicit and deterministic.

---

## Validation

Energy validation is located under:

```text
energy/validation/
```

Validation covers:

### Load collection

* input exists
* loads collection exists
* at least one load
* duplicate load IDs

### Load energy parameters

* `loadId` must be non-empty
* `runningLoadW` must be finite
* `runningLoadW` must not be negative
* operating hours must be between `0` and `24`
* operating days must be between `0` and `31`

### Energy assumptions

* system loss factor must be finite
* system loss factor must satisfy `0 ≤ x < 1`
* design margin must be finite
* design margin must satisfy `0 ≤ x ≤ 1`

Invalid input produces deterministic engineering issues rather than silently modifying the input.

---

## Assumptions

Explicit assumptions are defined in:

```text
energy/assumptions/
```

The public factory is:

```ts
createEnergyAssumptions(
  systemLossFactor,
  designMargin,
)
```

Current assumption codes:

```text
ENERGY_SYSTEM_LOSS_FACTOR
ENERGY_DESIGN_MARGIN
```

The assumptions conform to the foundation contract:

```ts
EngineeringAssumption
```

using:

```text
code
name
value
unit
description
source
reference
```

The module does not introduce an alternative assumption model.

---

## Calculation Trace

Calculation trace steps are defined in:

```text
energy/trace/
```

The current trace is:

```text
Energy Input
      │
      ▼
Daily Energy
      │
      ▼
Monthly Energy
      │
      ▼
Annual Energy
      │
      ▼
System Loss Adjustment
      │
      ▼
Energy Design Margin
      │
      ▼
Energy Output
```

Trace steps use the foundation:

```ts
CalculationTraceStep
```

No Energy-specific trace model is introduced.

---

## Module Structure

```text
energy/
├── __tests__/
│   ├── calculation.test.ts
│   ├── regression.test.ts
│   └── validation.test.ts
│
├── assumptions/
│   ├── energy-assumptions.ts
│   └── index.ts
│
├── calculation/
│   ├── calculate-adjusted-energy.ts
│   ├── calculate-annual-energy.ts
│   ├── calculate-daily-energy.ts
│   ├── calculate-energy-profile.ts
│   ├── calculate-monthly-energy.ts
│   └── index.ts
│
├── calculation.ts
├── constants.ts
├── index.ts
├── run.ts
│
├── trace/
│   ├── energy-trace.ts
│   └── index.ts
│
├── types/
│   ├── energy-input.ts
│   ├── energy-output.ts
│   └── index.ts
│
└── validation/
    ├── rules.ts
    ├── validate-energy.ts
    └── index.ts
```

---

## Public API

The Energy module exposes its public API through:

```text
energy/index.ts
```

Primary exports include:

```ts
EnergyInput
EnergyLoadInput
EnergyOutput
EnergyLoadResult

ENERGY_DEFAULTS

calculateEnergy

calculateDailyEnergy
calculateMonthlyEnergy
calculateAnnualEnergy
calculateAdjustedEnergy

validateEnergy

createEnergyAssumptions
createEnergyTrace

runEnergyAnalysis
```

Internal implementation files should not be imported directly by applications.

---

## Determinism Requirements

Energy calculations must be deterministic.

For identical inputs:

```text
same input
    ↓
same validation issues
    ↓
same assumptions
    ↓
same calculation results
    ↓
same output
```

The module must not depend on:

* current time
* random values
* network access
* database state
* UI state
* mutable global state
* external services

---

## Input Immutability

Energy calculations must not mutate the supplied input.

For:

```ts
const input = {
  loads: [...],
};
```

the calculation must treat `input` and its load records as read-only.

---

## Load Order

Output load results preserve the order of the supplied Energy input.

Given:

```text
[A, B, C]
```

the result must remain:

```text
[A, B, C]
```

The module must not reorder loads as a side effect of calculation.

---

## Energy Profile

`calculate-energy-profile.ts` is reserved for a future explicit energy-profile contract.

The current Energy input contains:

```text
runningLoadW
operatingHoursPerDay
operatingDaysPerMonth
```

but does not contain:

* start time
* stop time
* hourly schedule
* weekday schedule
* monthly schedule
* seasonal profile
* interval measurements

Therefore the module must not invent a 24-hour or hourly energy profile from insufficient information.

---

## Testing

Energy tests are located under:

```text
energy/__tests__/
```

Tests should cover:

### Calculation

* daily energy
* monthly energy
* annual energy
* multiple loads
* system-loss adjustment
* design margin
* zero operating hours

### Validation

* empty loads
* duplicate load IDs
* negative power
* invalid operating hours
* invalid operating days
* invalid system-loss factor
* invalid design margin

### Regression

* deterministic output
* input-order preservation
* input immutability

---

## Engineering Unit Conventions

Energy calculations use:

```text
Power:
W

Energy:
Wh

Large energy values:
kWh

Operating time:
h/day

Operating days:
days/month

Loss and margin:
ratio
```

Conversion:

```text
1 kWh = 1000 Wh
```

No silent unit coercion is performed.

---

## Dependency Direction

The Energy module follows the SolarAudit foundation dependency direction:

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

Energy may use foundation packages but must not introduce dependencies from foundation packages back into SolarAudit.

---

## Design Principles

The Energy module follows these rules:

1. **Explicit contracts**
2. **Deterministic calculations**
3. **Pure calculation functions where practical**
4. **No hidden mutable state**
5. **No silent unit conversion**
6. **No silent clamping**
7. **Explicit assumptions**
8. **Deterministic validation**
9. **Deterministic trace ordering**
10. **No duplicated Load domain model**
11. **No UI dependencies**
12. **No network dependencies**
13. **No database dependencies**
14. **Tests for every public calculation behavior**

---

## Phase Boundary

Energy Analysis is responsible for transforming load operating characteristics into energy consumption.

The intended engineering sequence is:

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
04 Solar PV Sizing
      │
      ▼
05 PV Array
      │
      ▼
06 PV String
      │
      ▼
07 Battery Sizing
      │
      ▼
08 Inverter Sizing
```

Each module should consume explicit contracts from the preceding engineering stage rather than reaching into another module's internal implementation.

---

## Implementation Status

### Implemented

* Energy input contract
* Energy output contract
* Daily energy calculation
* Monthly energy calculation
* Annual energy calculation
* System-loss adjustment
* Design-margin calculation
* Input validation
* Energy assumptions
* Energy calculation trace
* Public Energy API
* Deterministic regression tests

### Reserved

* Hourly energy profile
* Seasonal energy profile
* Time-series energy analysis
* Meter-data integration

These features require explicit input contracts before implementation.

---

## Acceptance Criteria

Energy Analysis is considered complete when:

* all public contracts compile
* all calculations are deterministic
* invalid inputs produce engineering issues
* assumptions are explicit
* calculation trace is available
* input objects remain immutable
* load order is preserved
* unit conventions are explicit
* tests pass
* type checking passes
* no duplicate Load model exists inside Energy
* no UI/database/network dependency exists
* the module integrates cleanly with `engineering-core`
* the public API is documented here
