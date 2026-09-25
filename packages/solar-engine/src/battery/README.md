# SolarAudit — Battery Engine

This module contains the battery engineering logic for SolarAudit.

The Battery Engine is responsible for sizing and characterizing battery banks used by solar and renewable-energy systems.

It owns battery-specific engineering calculations, validation, assumptions, warnings, and calculation trace information.

---

## Responsibilities

* Define typed battery sizing inputs
* Define typed battery sizing outputs
* Validate battery engineering inputs
* Calculate required battery energy
* Calculate adjusted battery energy
* Calculate required battery capacity
* Calculate series battery count
* Calculate parallel battery strings
* Calculate total battery units
* Calculate installed battery capacity
* Calculate installed battery energy
* Report structured engineering warnings and errors
* Define explicit engineering assumptions
* Provide calculation trace information
* Avoid UI-specific logic
* Avoid direct database access

---

## Boundary

```text
Battery Input
     |
     v
Validation
     |
     v
Assumptions
     |
     v
Battery Calculation
     |
     v
Battery Configuration
     |
     v
BatterySizingOutput
     |
     v
Engineering Core
     |
     v
CalculationResult<BatterySizingOutput>
```

The Battery Engine owns battery-specific engineering mathematics.

The shared engineering foundation owns calculation execution, result contracts, assumptions, issues, metadata, and trace contracts.

---

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
* Structured engineering issues
* No silent input mutation
* No silent clamping
* No silent unit conversion
* Pure calculation functions where practical

---

## Battery Scope

The Battery Engine is responsible for:

* Required battery energy
* Battery energy adjustment
* Depth-of-discharge adjustment
* Battery-efficiency adjustment
* Design-margin application
* Required battery capacity
* Series battery configuration
* Parallel string configuration
* Total battery quantity
* Installed battery capacity
* Installed battery-bank energy
* Battery input validation
* Battery-specific warnings
* Battery calculation trace

It is **not** responsible for:

* Load characterization
* Load auditing
* Solar PV sizing
* PV array sizing
* PV string configuration
* Inverter sizing
* Charge-controller sizing
* Cable sizing
* Voltage-drop analysis
* Protection sizing
* Earthing design
* Generator sizing
* Project costing
* Procurement workflows

Those responsibilities belong to other engineering modules.

---

## Battery Input

The canonical Battery sizing input is:

```ts
export interface BatterySizingInput {
  readonly dailyEnergyKWh: number;
  readonly autonomyDays: number;
  readonly systemVoltageV: number;
  readonly depthOfDischarge: number;
  readonly batteryEfficiency: number;
  readonly designMargin: number;
  readonly batteryUnitVoltageV?: number;
  readonly batteryUnitCapacityAh?: number;
}
```

### Required Inputs

| Quantity           | Field               | Unit    |
| ------------------ | ------------------- | ------- |
| Daily energy       | `dailyEnergyKWh`    | kWh/day |
| Autonomy           | `autonomyDays`      | days    |
| System voltage     | `systemVoltageV`    | V       |
| Depth of discharge | `depthOfDischarge`  | ratio   |
| Battery efficiency | `batteryEfficiency` | ratio   |
| Design margin      | `designMargin`      | ratio   |

### Optional Battery Unit Inputs

| Quantity              | Field                   | Unit |
| --------------------- | ----------------------- | ---- |
| Battery unit voltage  | `batteryUnitVoltageV`   | V    |
| Battery unit capacity | `batteryUnitCapacityAh` | Ah   |

Physical battery-bank configuration is calculated only when both optional battery-unit values are supplied.

The input object is read-only and must not be mutated.

---

## Battery Output

The Battery Engine owns the domain output contract:

```ts
export interface BatterySizingOutput {
  readonly requiredBatteryEnergyKWh: number;
  readonly adjustedBatteryEnergyKWh: number;
  readonly requiredBatteryCapacityAh: number;

  readonly batteryUnitVoltageV?: number;
  readonly batteryUnitCapacityAh?: number;

  readonly seriesBatteries?: number;
  readonly parallelStrings?: number;
  readonly totalBatteryUnits?: number;

  readonly installedBatteryCapacityAh?: number;
  readonly installedBatteryEnergyKWh?: number;
}
```

This is the domain calculation output only.

The Battery Engine does not define its own result envelope.

Execution returns the foundation contract:

```ts
CalculationResult<BatterySizingOutput>
```

provided by:

```text
@ogwusearch/engineering-types
@ogwusearch/engineering-core
```

---

## Battery Calculation

The existing Battery calculation model is preserved.

### Required Battery Energy

```text
Required Battery Energy

    =

Daily Energy × Autonomy
```

```text
requiredBatteryEnergyKWh
=
dailyEnergyKWh × autonomyDays
```

### Adjusted Battery Energy

The required energy is adjusted for battery efficiency, allowable depth of discharge, and design margin.

```text
Adjusted Battery Energy

    =

(Required Battery Energy
 /
 Battery Efficiency
 /
 Depth of Discharge)
×
(1 + Design Margin)
```

```text
adjustedBatteryEnergyKWh
=
(requiredBatteryEnergyKWh
 /
 batteryEfficiency
 /
 depthOfDischarge)
×
(1 + designMargin)
```

### Required Battery Capacity

```text
Required Battery Capacity

    =

Adjusted Battery Energy × 1000
/
System Voltage
```

```text
requiredBatteryCapacityAh
=
(adjustedBatteryEnergyKWh × 1000)
/
systemVoltageV
```

### Series Battery Count

When battery-unit voltage is supplied:

```text
Series Batteries

    =

ceil(System Voltage / Battery Unit Voltage)
```

```text
seriesBatteries
=
ceil(systemVoltageV / batteryUnitVoltageV)
```

### Parallel Battery Strings

When battery-unit capacity is supplied:

```text
Parallel Strings

    =

ceil(Required Battery Capacity / Battery Unit Capacity)
```

```text
parallelStrings
=
ceil(
  requiredBatteryCapacityAh
  /
  batteryUnitCapacityAh
)
```

### Total Battery Units

```text
Total Battery Units

    =

Series Batteries × Parallel Strings
```

```text
totalBatteryUnits
=
seriesBatteries × parallelStrings
```

### Installed Battery Capacity

```text
Installed Battery Capacity

    =

Parallel Strings × Battery Unit Capacity
```

```text
installedBatteryCapacityAh
=
parallelStrings × batteryUnitCapacityAh
```

### Installed Battery Energy

```text
Installed Battery Energy

    =

Total Battery Units
× Battery Unit Voltage
× Battery Unit Capacity
/
1000
```

```text
installedBatteryEnergyKWh
=
(
  totalBatteryUnits
  × batteryUnitVoltageV
  × batteryUnitCapacityAh
)
/
1000
```

These formulas are part of the current Battery engineering behavior and must remain unchanged during architectural migration.

---

## Engineering Units

| Quantity           | Unit    |
| ------------------ | ------- |
| Daily energy       | kWh/day |
| Battery energy     | kWh     |
| Battery capacity   | Ah      |
| Battery voltage    | V       |
| System voltage     | V       |
| Autonomy           | days    |
| Depth of discharge | ratio   |
| Battery efficiency | ratio   |
| Design margin      | ratio   |
| Battery quantity   | units   |

Conversions:

```text
1 kWh = 1000 Wh
1 kW = 1000 W
```

The Battery Engine must not silently convert incompatible units.

The input contract explicitly defines energy in kWh and battery capacity in Ah.

---

## Validation

Battery validation uses the shared foundation contract:

```ts
EngineeringIssue
```

Validation must reject invalid engineering inputs rather than silently modifying them.

Validation includes:

* Valid daily energy
* Valid autonomy
* Valid system voltage
* Valid depth of discharge
* Valid battery efficiency
* Valid design margin
* Valid battery-unit voltage when supplied
* Valid battery-unit capacity when supplied
* Positive engineering quantities
* Valid finite numerical values

Validation issues use the foundation fields:

```text
code
severity
message
path
actual
```

Blocking validation errors use:

```text
severity = "ERROR"
```

Non-blocking engineering warnings use:

```text
severity = "WARNING"
```

The existing Battery validation behavior is preserved during migration.

---

## Warnings

Battery-specific warnings use the foundation warning contract:

```ts
EngineeringWarning
```

Current Battery warnings include:

```text
HIGH_DEPTH_OF_DISCHARGE
NO_DESIGN_MARGIN
NON_INTEGER_SERIES_CONFIGURATION
VERIFY_BATTERY_CONFIGURATION
```

The first three can be identified from the Battery input during validation.

`VERIFY_BATTERY_CONFIGURATION` depends on calculated output and therefore occurs after the Battery calculation rather than being treated as a pre-calculation validation error.

Warnings must not silently invalidate an otherwise valid calculation.

---

## Design Margin

The Battery Engine accepts an explicit design margin.

The current validation behavior rejects negative values:

```text
designMargin >= 0
```

The existing Battery calculation applies the margin as:

```text
Adjusted Battery Energy
=
Base Adjusted Energy
×
(1 + Design Margin)
```

No new design-margin constraint should be introduced during architectural migration without an explicit engineering-model change.

---

## Assumptions

Engineering assumptions use the foundation contract:

```ts
EngineeringAssumption
```

The Battery module does not define a separate assumption model.

Current Battery sizing assumptions include:

```text
Daily energy is represented in kWh/day.

Autonomy is represented in days.

Depth of discharge and battery efficiency are represented
as decimals between 0 and 1.

Design margin is represented as a decimal.

Battery capacity is calculated from nominal system voltage.

Physical battery configuration is calculated only when
battery unit voltage and capacity are supplied.

Series and parallel quantities are rounded up to whole units.
```

Assumptions are defined in:

```text
battery/assumptions/battery-assumptions.ts
```

and exported through:

```text
battery/assumptions/index.ts
```

---

## Calculation Trace

Battery trace information uses the foundation:

```ts
CalculationTrace
CalculationTraceStep
```

No Battery-specific trace contract is introduced.

The foundation trace is:

```ts
interface CalculationTrace {
  readonly steps: CalculationTraceStep[];
}
```

Each Battery trace step can provide:

```text
id
name
description
formula
inputs
outputs
unit
sequence
metadata
```

The Battery calculation trace represents:

```text
Battery Input
     |
     v
Required Battery Energy
     |
     v
Adjusted Battery Energy
     |
     v
Required Battery Capacity
     |
     v
Series Configuration
     |
     v
Parallel Configuration
     |
     v
Installed Battery Capacity
     |
     v
Installed Battery Energy
```

Trace generation is implemented under:

```text
battery/trace/
```

The Battery Engine does not define a duplicate trace result type.

---

## Execution

Battery execution uses the shared engineering-core lifecycle:

```text
Input
  ↓
Validation
  ↓
Assumptions
  ↓
Calculation
  ↓
CalculationResult
```

The public runner is:

```ts
runBatterySizing(input)
```

The runner uses:

```text
@ogwusearch/engineering-core
```

through:

```ts
defineCalculation()
executeCalculation()
```

The runner returns:

```ts
CalculationResult<BatterySizingOutput>
```

The Battery Engine therefore does not implement its own:

```text
BatterySizingResult
```

envelope.

---

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
        Battery Engine
```

The Battery Engine must not introduce reverse dependencies into foundation packages.

Foundation packages must not depend on:

```text
solar-engine
```

or on the Battery module.

---

## Determinism

For identical inputs, the Battery Engine must produce identical:

* Validation issues
* Assumptions
* Calculation results
* Engineering output
* Trace ordering

The engine must not depend on:

* Current time
* Random values
* Network state
* Database state
* UI state
* Browser APIs
* Mutable global state

---

## Input Immutability

Battery calculations must not mutate:

* The `BatterySizingInput`
* The input object supplied to the runner
* Optional battery-unit configuration

Given the same input object, repeated calculations must produce the same result.

---

## Optional Physical Configuration

Battery-unit configuration is optional.

When:

```text
batteryUnitVoltageV
batteryUnitCapacityAh
```

are not supplied, the module calculates:

```text
requiredBatteryEnergyKWh
adjustedBatteryEnergyKWh
requiredBatteryCapacityAh
```

When both are supplied, the module additionally calculates:

```text
seriesBatteries
parallelStrings
totalBatteryUnits
installedBatteryCapacityAh
installedBatteryEnergyKWh
```

The calculation must not invent missing battery-unit values.

---

## Rounding

Physical battery quantities represent discrete equipment.

The following quantities are rounded upward:

```text
seriesBatteries
parallelStrings
```

using:

```text
Math.ceil(...)
```

No silent clamping or additional hidden rounding should be introduced.

---

## Testing

The Battery Engine tests are separated by responsibility.

### Calculation

* Required battery energy
* Adjusted battery energy
* Required battery capacity
* Series battery count
* Parallel string count
* Total battery units
* Installed battery capacity
* Installed battery energy
* Autonomy changes
* Depth-of-discharge changes
* Battery-efficiency changes
* Design-margin changes
* Optional physical battery configuration

### Validation

* Invalid daily energy
* Invalid autonomy
* Invalid system voltage
* Invalid depth of discharge
* Invalid battery efficiency
* Invalid design margin
* Invalid battery-unit voltage
* Invalid battery-unit capacity
* Foundation `EngineeringIssue` shape
* Error/warning severity
* Multiple simultaneous validation issues

### Regression

* Deterministic results
* Existing Battery formulas
* Existing expected output values
* Optional battery configuration behavior
* Boundary values
* Input immutability
* Runner behavior
* Foundation result contract

---

## Module Structure

```text
battery/

├── __tests__/
│   ├── calculation.test.ts
│   ├── regression.test.ts
│   └── validation.test.ts
│
├── assumptions/
│   ├── battery-assumptions.ts
│   └── index.ts
│
├── calculation/
│   ├── calculate-capacity.ts
│   ├── calculate-energy.ts
│   ├── calculate-parallel-count.ts
│   ├── calculate-series-count.ts
│   ├── calculate-battery.ts
│   └── index.ts
│
├── index.ts
├── run.ts
│
├── trace/
│   ├── battery-trace.ts
│   └── index.ts
│
├── types/
│   ├── battery-input.ts
│   ├── battery-output.ts
│   └── index.ts
│
└── validation/
    ├── rules.ts
    ├── validate-battery.ts
    └── index.ts
```

Legacy compatibility files should not remain once their responsibilities have been fully migrated to the foundation-aligned structure.

---

## Public API

The Battery Engine public API is exposed through:

```text
battery/index.ts
```

Primary domain exports include:

```text
BatterySizingInput
BatterySizingOutput

calculateBatterySizing
calculateRequiredBatteryEnergyKWh
calculateAdjustedBatteryEnergyKWh
calculateRequiredBatteryCapacityAh
calculateSeriesBatteries
calculateParallelStrings

validateBatterySizing
createBatterySizingAssumptions
createBatterySizingTrace

runBatterySizing
```

The final result contract is provided by the foundation:

```text
CalculationResult<BatterySizingOutput>
```

Applications should consume the Battery Engine through its public API rather than importing internal implementation files directly.

---

## Relationship With Other Engineering Modules

Battery Sizing consumes an explicitly defined energy requirement.

Conceptually:

```text
Load Audit
     |
     v
Energy Analysis
     |
     v
Peak Demand / System Requirements
     |
     v
PV Sizing
     |
     v
Battery Sizing
     |
     v
Inverter / Controller / Cable / Protection
```

Battery Sizing does not reimplement Load Audit or Energy Analysis internally.

---

## Phase

SolarAudit Engineering Phase:

```text
01 Load Audit

02 Energy Analysis

03 Peak Demand

04 Solar PV Sizing

05 PV Array

06 PV String

07 Battery Sizing        ← CURRENT BATTERY MODULE

08 Inverter Sizing

09 Charge Controller

10 Cable

11 Voltage Drop

12 Protection

13 Earthing

14 Generator

15 BOM

16 Costing

17 System Validation

18 Reports
```

---

## Acceptance Criteria

The Battery Engine is considered complete when:

* Public contracts compile
* Battery inputs are validated
* Calculations are deterministic
* Engineering units are explicit
* Assumptions use `EngineeringAssumption`
* Validation uses `EngineeringIssue`
* Results use `CalculationResult<BatterySizingOutput>`
* Trace uses `CalculationTrace`
* Inputs remain immutable
* Optional battery configuration is handled explicitly
* Series and parallel quantities are rounded correctly
* Structured errors and warnings are returned
* Unit tests pass
* Regression tests pass
* Type checking passes
* No UI dependency exists
* No database dependency exists
* No network dependency exists
* Existing Battery formulas remain unchanged
* Existing Battery behavior remains unchanged during migration
* The public API is documented here
