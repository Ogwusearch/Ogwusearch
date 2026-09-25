# SolarAudit — Load Engine

This module contains the load engineering logic for SolarAudit.

## Responsibilities

* Define typed load inputs
* Validate engineering inputs
* Calculate connected load
* Calculate running load
* Calculate demand load
* Calculate apparent power
* Calculate load-level daily energy
* Calculate load-level monthly energy
* Aggregate load-audit results
* Report structured engineering warnings and errors
* Define explicit engineering assumptions
* Provide calculation trace information
* Avoid UI-specific logic
* Avoid direct database access

## Boundary

```text
Load Input
    |
    v
Validation
    |
    v
Assumptions
    |
    v
Load Calculation
    |
    v
Energy / Demand Aggregation
    |
    v
Load Audit Result
    |
    v
Trace
```

## Rules

* TypeScript only
* No React
* No UI logic
* No database access
* No HTTP/API calls
* No browser APIs
* Deterministic calculations
* Explicit engineering units
* Explicit engineering assumptions
* Structured errors and warnings
* No silent input mutation
* No silent clamping
* No silent unit conversion
* Pure calculation functions where practical

## Load Scope

The Load Engine is responsible for characterizing electrical loads and producing the Load Audit result.

It is responsible for:

* Connected load
* Running load
* Demand load
* Apparent power
* Load-level energy
* Daily energy
* Monthly energy
* Peak-demand aggregation
* Design-margin application
* Load input validation

It is **not** responsible for:

* Solar PV sizing
* PV array sizing
* PV string configuration
* Battery sizing
* Inverter sizing
* Charge-controller sizing
* Cable sizing
* Voltage-drop analysis
* Protection sizing
* Earthing design
* Costing

Those responsibilities belong to subsequent engineering modules.

## Load Input

The canonical load model is:

```ts
interface Load {
  readonly id: string;
  readonly name: string;
  readonly category: LoadCategory;
  readonly quantity: number;
  readonly ratedPowerW: number;
  readonly powerFactor: number;
  readonly efficiency?: number;
  readonly operatingHoursPerDay: number;
  readonly operatingDaysPerMonth: number;
  readonly demandFactor?: number;
  readonly diversityFactor?: number;
  readonly phase: LoadPhase;
  readonly description?: string;
}
```

### Load Categories

Supported categories include:

```text
LIGHTING
HVAC
MOTOR
PUMP
APPLIANCE
OFFICE
IT
INDUSTRIAL
OTHER
```

### Load Phases

```text
SINGLE_PHASE
THREE_PHASE
```

## Load Audit Input

```ts
interface LoadAuditInput {
  readonly loads: readonly Load[];
  readonly designMargin?: number;
}
```

The load collection is read-only and must not be mutated by the calculation engine.

## Load Calculation

The fundamental connected-load calculation is:

```text
Connected Load
    =
Quantity × Rated Power
```

The running-load calculation uses the configured efficiency assumption:

```text
Running Load
    =
Connected Load / Efficiency
```

Demand load is calculated using the configured demand and diversity factors:

```text
Demand Load
    =
Running Load × Demand Factor / Diversity Factor
```

Apparent power is calculated from demand load and power factor:

```text
Apparent Power
    =
Demand Load / Power Factor
```

Load-level energy is calculated from running load:

```text
Daily Energy
    =
Running Load × Operating Hours/Day
```

```text
Monthly Energy
    =
Daily Energy × Operating Days/Month
```

## Engineering Units

| Quantity         | Unit       |
| ---------------- | ---------- |
| Rated power      | W          |
| Connected load   | W          |
| Running load     | W          |
| Demand load      | W          |
| Apparent power   | VA         |
| Energy           | Wh         |
| Large energy     | kWh        |
| Operating time   | h/day      |
| Operating days   | days/month |
| Power factor     | ratio      |
| Efficiency       | ratio      |
| Demand factor    | ratio      |
| Diversity factor | ratio      |
| Design margin    | ratio      |

Conversion:

```text
1 kW = 1000 W
1 kVA = 1000 VA
1 kWh = 1000 Wh
```

No silent unit conversion is performed.

## Validation

Load validation must reject invalid engineering inputs rather than silently modifying them.

Validation includes:

* Required load identity
* Non-empty load name
* Valid category
* Positive quantity
* Valid rated power
* Valid power factor
* Valid efficiency when provided
* Valid operating hours
* Valid operating days
* Valid demand factor when provided
* Valid diversity factor when provided
* Valid phase
* Duplicate load-ID detection
* Valid design margin

Engineering issues are returned using the foundation `EngineeringIssue` contract.

## Design Margin

The Load Audit accepts an optional design margin:

```text
0 ≤ designMargin ≤ 1
```

The margin is applied to the calculated peak demand.

Conceptually:

```text
Design Peak Demand
    =
Peak Demand × (1 + Design Margin)
```

The exact engineering result remains explicitly represented in the Load Audit output.

## Defaults

Load defaults are defined centrally in:

```text
load/constants.ts
```

Examples include default values for:

* efficiency
* demand factor
* diversity factor
* design margin

Defaults must remain explicit and deterministic.

## Assumptions

Engineering assumptions are represented using the foundation:

```ts
EngineeringAssumption
```

The current Load Audit assumption includes:

```text
LOAD_DESIGN_MARGIN
```

Assumptions use the foundation fields:

```text
code
name
value
unit
description
source
reference
```

The Load module does not define a separate assumption model.

## Calculation Trace

Load calculation trace steps are defined in:

```text
load/trace/
```

The current trace is:

```text
Load Input
    |
    v
Load Calculation
    |
    v
Energy Calculation
    |
    v
Peak Demand
```

Trace steps use the foundation:

```ts
CalculationTraceStep
```

No Load-specific trace model is introduced.

## Output

Individual load results contain:

```ts
interface LoadResult {
  readonly loadId: string;
  readonly connectedLoadW: number;
  readonly runningLoadW: number;
  readonly demandLoadW: number;
  readonly apparentPowerVA: number;
  readonly dailyEnergyWh: number;
  readonly monthlyEnergyWh: number;
}
```

The Load Audit aggregates these into:

```ts
interface LoadAuditOutput {
  readonly loads: readonly LoadResult[];

  readonly totalConnectedLoadW: number;
  readonly totalRunningLoadW: number;
  readonly totalDemandLoadW: number;
  readonly totalApparentPowerVA: number;

  readonly dailyEnergyWh: number;
  readonly monthlyEnergyWh: number;

  readonly peakDemandW: number;
  readonly peakDemandVA: number;

  readonly designMargin: number;
  readonly designPeakDemandW: number;
  readonly designPeakDemandVA: number;
}
```

## Architecture

```text
@ogwusearch/engineering-types
              |
              v
@ogwusearch/engineering-units
              |
              v
@ogwusearch/engineering-validation
              |
              v
@ogwusearch/engineering-core
              |
              v
@ogwusearch/solar-engine
              |
              v
          Load Engine
```

The Load Engine must not introduce reverse dependencies into the foundation packages.

## Determinism

For identical inputs, the Load Engine must produce identical:

* validation issues
* assumptions
* calculation results
* engineering output
* trace ordering

The engine must not depend on:

* current time
* random values
* network state
* database state
* UI state
* browser APIs
* mutable global state

## Input Immutability

Load calculations must not mutate:

* the `LoadAuditInput`
* the `loads` array
* individual `Load` objects

Given the same input object, repeated calculations must produce the same result.

## Load Order

Output load results preserve the order of the supplied load list.

Given:

```text
[A, B, C]
```

the output remains:

```text
[A, B, C]
```

unless an explicitly documented operation requires another ordering.

## Testing

The Load Engine must test:

### Calculation

* Connected load
* Running load
* Demand load
* Apparent power
* Daily energy
* Monthly energy
* Multiple loads
* Design margin
* Default assumptions

### Validation

* Missing/invalid identifiers
* Invalid quantity
* Invalid rated power
* Invalid power factor
* Invalid efficiency
* Invalid operating hours
* Invalid operating days
* Invalid demand factor
* Invalid diversity factor
* Duplicate load IDs
* Invalid design margin

### Regression

* Deterministic results
* Input-order preservation
* Input immutability
* Boundary values
* Default assumptions

## Module Structure

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
│   ├── calculate-energy.ts
│   ├── calculate-load.ts
│   ├── calculate-peak-demand.ts
│   └── index.ts
│
├── constants.ts
├── index.ts
├── run.ts
│
├── trace/
│   ├── load-trace.ts
│   └── index.ts
│
├── types/
│   ├── load-audit.ts
│   ├── load-input.ts
│   ├── load-output.ts
│   ├── load.ts
│   └── index.ts
│
└── validation/
    ├── rules.ts
    ├── validate-load.ts
    ├── validate-load-list.ts
    └── index.ts
```

## Public API

The Load Engine public API is exposed through:

```text
load/index.ts
```

Primary exports include:

```text
Load
LoadCategory
LoadPhase
LoadAudit
LoadAuditInput
LoadResult
LoadAuditOutput

validateLoad
validateLoadList

calculateLoad
calculateDailyEnergy
calculateMonthlyEnergy
calculatePeakDemand
calculateLoadAudit

createLoadAssumptions
createLoadTrace

runLoadAudit
```

Internal implementation files should not be imported directly by applications.

## Relationship With Energy Analysis

Load Audit is Phase 01.

Energy Analysis is Phase 02.

The architectural boundary is:

```text
Load Audit
    |
    | runningLoadW
    | operatingHoursPerDay
    | operatingDaysPerMonth
    v
Energy Analysis
```

Energy Analysis should receive an explicit projection of the required Load information rather than duplicating the complete Load model.

The Energy module therefore owns energy analysis while the Load module owns load characterization.

## Phase

SolarAudit Engineering Phase:

```text
01 Load Audit       ← CURRENT FOUNDATION MODULE
02 Energy Analysis
03 Peak Demand
04 Solar PV Sizing
05 PV Array
06 PV String
07 Battery Sizing
08 Inverter Sizing
...
```

The Load Engine establishes the load foundation consumed by subsequent engineering modules.

## Acceptance Criteria

The Load Engine is considered complete when:

* Public contracts compile
* Load inputs are validated
* Calculations are deterministic
* Engineering units are explicit
* Assumptions are explicit
* Trace information is available
* Inputs remain immutable
* Load order is preserved
* Structured issues are returned
* Unit tests pass
* Regression tests pass
* Type checking passes
* No UI dependency exists
* No database dependency exists
* No network dependency exists
* The public API is documented here
