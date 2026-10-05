# Solar Engine — Domain & Data Contract

**Version:** 1.0.0
**Status:** Contract Draft — Phase 01/02 Foundation
**Scope:** Load → Energy → Peak Demand → Load Audit

---

## 1. Contract Principles

The Solar Engine is an engineering calculation domain.

Its contracts define:

* what an engineering concept means;
* what data enters a calculation;
* what data leaves a calculation;
* which module owns each responsibility;
* which assumptions are permitted;
* how validation is performed;
* how calculations remain deterministic and traceable.

### 1.1 Domain-first design

Engineering concepts must be defined before implementation details.

The implementation must not redefine the meaning of a domain concept.

### 1.2 Data contracts are explicit

Inputs and outputs must use explicit TypeScript contracts.

A calculation must not depend on undocumented object properties or implicit data transformations.

### 1.3 Deterministic calculations

Given the same valid input and the same defined assumptions, a calculation must produce the same result.

Calculations must not depend on:

* UI state;
* database state;
* network state;
* current time;
* random values;
* hidden mutable state.

### 1.4 Immutable inputs

Calculation functions must treat their inputs as immutable.

A calculation may produce new values, but it must not mutate the supplied input.

### 1.5 Validation before calculation

Invalid engineering inputs must be detected before calculation.

The engine must not silently correct invalid values.

Examples:

* negative rated power;
* power factor greater than 1;
* operating hours greater than 24;
* demand factor greater than 1;
* diversity factor below 1.

### 1.6 Warnings are not errors

Warnings represent conditions that are technically calculable but deserve engineering attention.

Errors represent conditions under which a valid engineering result cannot be produced.

### 1.7 Foundation separation

Generic engineering concepts belong in the foundation packages.

Solar-specific concepts belong in `solar-engine`.

The solar engine must not move solar-domain assumptions into generic foundation packages.

### 1.8 Domain ownership

Each engineering concept must have one clear owner.

Other modules may consume a projection of that concept but must not reimplement its ownership logic.

---

# 2. Load Domain

## 2.1 Responsibility

The Load domain defines individual electrical loads used by a solar-system assessment.

Load owns:

* load identity;
* load name;
* load category;
* quantity;
* rated power;
* power factor;
* efficiency information;
* operating hours;
* operating days;
* demand factor;
* electrical phase.

Load is responsible for characterizing the equipment.

Load does not own:

* energy aggregation;
* peak-demand calculation;
* PV sizing;
* battery sizing;
* inverter sizing;
* cable sizing;
* protection calculations.

---

## 2.2 Load contract

The current public Load contract is:

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
  readonly demandFactor?: number;
  readonly phase: LoadPhase;
  readonly description?: string;
}
```

### Required engineering meaning

`quantity` represents the number of identical units represented by the Load record.

`ratedPowerW` represents the rated electrical power assigned to each unit.

Therefore:

```text
connectedLoadW =
    quantity × ratedPowerW
```

---

## 2.3 Power factor

Power factor belongs to the Load domain.

It is used to derive apparent power:

```text
apparentPowerVA =
    runningLoadW / powerFactor
```

Power factor must be:

```text
0 < powerFactor <= 1
```

A power factor below the defined engineering warning threshold may produce a warning without making the calculation invalid.

---

## 2.4 Efficiency

Efficiency is part of the Load data model.

For Contract v1, efficiency is **informational**.

It does not modify `runningLoadW`.

Therefore:

```text
connectedLoadW =
    quantity × ratedPowerW

runningLoadW =
    connectedLoadW
```

The current implementation and documentation must eventually be aligned with this contract.

Future efficiency-aware modelling may introduce a separate engineering concept rather than silently changing the meaning of `runningLoadW`.

---

## 2.5 Operating schedule

The Load domain stores:

```text
operatingHoursPerDay
operatingDaysPerMonth
```

These values are consumed by Energy.

Load owns the operating characteristics.

Energy owns the resulting energy calculation.

---

# 3. LoadResult

`LoadResult` represents the calculated electrical characteristics of an individual Load.

```ts
export interface LoadResult {
  readonly loadId: string;
  readonly connectedLoadW: number;
  readonly runningLoadW: number;
  readonly apparentPowerVA: number;
}
```

## 3.1 Connected load

```text
connectedLoadW =
    quantity × ratedPowerW
```

## 3.2 Running load

For Contract v1:

```text
runningLoadW =
    connectedLoadW
```

Efficiency does not automatically modify this value.

## 3.3 Apparent power

```text
apparentPowerVA =
    runningLoadW / powerFactor
```

## 3.4 Result identity

`loadId` must preserve the identity of the source Load.

A consumer must be able to map a `LoadResult` back to its originating Load.

---

# 4. Energy Projection

Energy does not consume the complete Load object.

Load projects the required information into an Energy-specific input.

```ts
export interface EnergyLoadInput {
  readonly loadId: string;
  readonly runningLoadW: number;
  readonly operatingHoursPerDay: number;
  readonly operatingDaysPerMonth: number;
}
```

This projection creates a clean boundary between Load and Energy.

## 4.1 Energy consumes

Energy consumes:

* Load identity;
* running power;
* operating hours;
* operating days.

## 4.2 Energy does not consume

Energy does not require:

* load category;
* phase;
* power factor;
* demand factor;
* diversity factor;
* starting power;
* surge factor.

Those concepts belong elsewhere.

## 4.3 Energy assumptions

Energy may additionally accept:

```ts
systemLossFactor?: number;
designMargin?: number;
```

These assumptions belong to Energy.

They must not be confused with Peak Demand assumptions.

---

# 5. Energy Result

Energy produces per-load and aggregate energy results.

```ts
export interface EnergyLoadResult {
  readonly loadId: string;
  readonly dailyEnergyWh: number;
  readonly monthlyEnergyWh: number;
  readonly annualEnergyWh: number;
}
```

The aggregate result contains:

```text
totalDailyEnergyWh
totalDailyEnergyKWh

totalMonthlyEnergyWh
totalMonthlyEnergyKWh

totalAnnualEnergyWh
totalAnnualEnergyKWh

adjustedDailyEnergyWh
adjustedMonthlyEnergyWh
adjustedAnnualEnergyWh

designDailyEnergyWh
designMonthlyEnergyWh
designAnnualEnergyWh

adjustmentFactor
```

## 5.1 Daily energy

```text
dailyEnergyWh =
    runningLoadW × operatingHoursPerDay
```

## 5.2 Monthly energy

```text
monthlyEnergyWh =
    dailyEnergyWh × operatingDaysPerMonth
```

## 5.3 Annual energy

```text
annualEnergyWh =
    monthlyEnergyWh × 12
```

## 5.4 Loss adjustment

For system loss factor `L`:

```text
adjustmentFactor =
    1 / (1 - L)
```

with:

```text
0 <= L < 1
```

Adjusted energy:

```text
adjustedEnergy =
    energy × adjustmentFactor
```

## 5.5 Design energy

Where an Energy design margin `M` is explicitly supplied:

```text
designEnergy =
    adjustedEnergy × (1 + M)
```

Energy design margin is independent from Peak Demand demand margin.

---

# 6. Peak Demand Projection

Peak Demand does not consume the complete Load object.

Load projects the required information into a Peak Demand-specific input.

```ts
export interface PeakDemandLoadInput {
  readonly loadId: string;
  readonly runningPowerW: number;
  readonly demandFactor?: number;
  readonly startingPowerW?: number;
  readonly surgeFactor?: number;
}
```

## 6.1 Peak Demand consumes

Peak Demand consumes:

* load identity;
* running power;
* demand factor;
* starting power;
* surge factor.

## 6.2 Peak Demand does not own

Peak Demand does not own:

* load definitions;
* load categories;
* power factor;
* energy consumption;
* PV sizing;
* battery sizing;
* inverter sizing;
* cable sizing.

## 6.3 Power factor

Power factor is a Load-domain characteristic.

If it exists in an internal Peak Demand projection, it must not be treated as Peak Demand-owned engineering data.

The unused `powerFactor` field currently present in the Peak Demand input contract should therefore be reviewed and removed from the public projection when the API cleanup phase begins.

---

# 7. Peak Demand Result

Peak Demand produces per-load demand information and aggregate demand scenarios.

The result contains:

```text
loadId
runningPowerW
demandFactor
individualDemandW

startingPowerW
surgeFactor
startingDemandW
```

The aggregate result contains:

```text
totalRunningPowerW
totalIndividualDemandW

diversityFactor
normalCoincidentDemandW

startingDemandW
peakDemandW
peakDemandKW

demandMargin
designPeakDemandW
designPeakDemandKW
```

## 7.1 Individual demand

```text
individualDemandW =
    runningPowerW × demandFactor
```

## 7.2 Normal coincident demand

```text
normalCoincidentDemandW =
    totalIndividualDemandW / diversityFactor
```

The diversity factor must satisfy:

```text
diversityFactor >= 1
```

## 7.3 Starting demand

Where an explicit starting power is provided:

```text
startingPowerW =
    supplied starting power
```

Otherwise:

```text
startingPowerW =
    runningPowerW × surgeFactor
```

## 7.4 Peak demand

Peak Demand compares the normal coincident operating condition with the starting-demand scenario.

The current implementation uses a conservative system-level starting-demand model.

That behavior is part of the current implementation contract until explicit multi-start scenario semantics are introduced.

## 7.5 Design peak demand

```text
designPeakDemandW =
    peakDemandW × (1 + demandMargin)
```

with:

```text
0 <= demandMargin <= 1
```

---

# 8. Load Audit Orchestration

Load Audit is the orchestration layer connecting Load, Energy and Peak Demand.

It is not a fourth engineering calculation domain.

## 8.1 Input

```ts
export interface LoadAuditInput {
  readonly loads: readonly Load[];
  readonly diversityFactor?: number;
  readonly designMargin?: number;
}
```

## 8.2 Processing sequence

The orchestration follows:

```text
LoadAuditInput
      │
      ▼
Validate Load Audit
      │
      ▼
Calculate LoadResult[]
      │
      ├───────────────┐
      │               │
      ▼               ▼
Energy projection   Peak Demand projection
      │               │
      ▼               ▼
EnergyOutput       PeakDemandOutput
      │               │
      └───────┬───────┘
              ▼
       LoadAuditOutput
```

## 8.3 Load Audit responsibilities

Load Audit:

* coordinates domain calculations;
* maps Load data into Energy inputs;
* maps Load data into Peak Demand inputs;
* combines domain outputs;
* preserves source identities;
* exposes a convenient Load Audit result.

Load Audit must not duplicate:

* Energy formulas;
* Peak Demand formulas;
* Load electrical calculations.

## 8.4 Current output

The current public output contains:

```ts
export interface LoadAuditOutput {
  readonly loads: readonly LoadResult[];

  readonly totalConnectedLoadW: number;
  readonly totalRunningLoadW: number;
  readonly normalCoincidentDemandW: number;
  readonly totalApparentPowerVA: number;

  readonly dailyEnergyWh: number;
  readonly monthlyEnergyWh: number;

  readonly peakDemandW: number;
  readonly designMargin: number;
  readonly designPeakDemandW: number;
}
```

The current field:

```text
normalCoincidentDemandW
```

represents:

```text
normalCoincidentDemandW
```

This naming should be reviewed during a controlled public-API cleanup.

---

# 9. Naming Conventions

Engineering names must communicate physical meaning.

## 9.1 Power

Use:

```text
*W
*KW
```

Examples:

```text
ratedPowerW
runningPowerW
connectedLoadW
peakDemandW
designPeakDemandW
```

## 9.2 Energy

Use:

```text
*Wh
*kWh
```

Examples:

```text
dailyEnergyWh
monthlyEnergyWh
annualEnergyWh
totalDailyEnergyKWh
```

## 9.3 Apparent power

Use:

```text
*VA
*kVA
```

## 9.4 Input/output naming

Use:

```text
XInput
XOutput
XResult
```

where the distinction is meaningful.

## 9.5 Projection naming

A projection is a domain-specific subset of another domain's data.

Examples:

```text
EnergyLoadInput
PeakDemandLoadInput
```

A projection must not expose unrelated source-domain fields.

## 9.6 Margin naming

Margins must identify their purpose.

Use:

```text
demandMargin
energyDesignMargin
```

rather than a generic `designMargin` when multiple margins coexist.

---

# 10. Ownership Boundaries

## 10.1 Load

Owns:

```text
Load identity
Load characteristics
Rated power
Quantity
Power factor
Efficiency metadata
Operating schedule
Demand factor
Phase
```

Does not own:

```text
Energy totals
Peak demand
PV sizing
Battery sizing
Inverter sizing
Cable sizing
```

## 10.2 Energy

Owns:

```text
Daily energy
Monthly energy
Annual energy
Energy aggregation
System-loss adjustment
Energy design margin
```

Does not own:

```text
Load identity definitions
Demand factors
Diversity factors
Starting demand
Peak demand
PV sizing
```

## 10.3 Peak Demand

Owns:

```text
Individual demand
Demand factor application
Diversity adjustment
Starting demand
Surge demand
Peak demand
Demand design margin
```

Does not own:

```text
Energy consumption
Load definitions
PV sizing
Battery sizing
Cable sizing
```

## 10.4 Load Audit

Owns:

```text
Orchestration
Projection
Aggregation of domain results
Audit-level result composition
```

Does not own:

```text
Independent engineering formulas
```

## 10.5 Foundation

Foundation owns generic engineering infrastructure:

```text
engineering-types
engineering-units
engineering-validation
engineering-core
```

Foundation must not depend on:

```text
solar-engine
```

---

# 11. Calculation Lifecycle

Every production engineering calculation should follow:

```text
Input
  ↓
Validation
  ↓
Assumptions
  ↓
Calculation
  ↓
Warnings
  ↓
Result
  ↓
Trace
```

## 11.1 Input

Receive a typed engineering input.

## 11.2 Validation

Validate:

* required values;
* numeric values;
* ranges;
* engineering constraints;
* relationships between fields;
* collection-level constraints.

## 11.3 Assumptions

Resolve documented defaults.

Defaults must be explicit and traceable.

Examples:

```text
default efficiency
default diversity factor
default demand factor
default surge factor
default design margin
```

A default must never be confused with user-provided data.

## 11.4 Calculation

Perform pure engineering calculations.

Calculations must be deterministic.

## 11.5 Warnings

Attach engineering warnings without silently modifying the result.

## 11.6 Result

Return structured engineering data.

The result must preserve source identity where applicable.

## 11.7 Trace

Record enough information to explain:

* what was calculated;
* which assumptions were used;
* which inputs were involved;
* which calculation steps were performed;
* which warnings occurred.

---

# 12. Contract Invariants

The following invariants apply to Contract v1.

## 12.1 Input immutability

Inputs must not be mutated.

## 12.2 Determinism

Equal valid inputs must produce equal engineering results.

## 12.3 Stable identity

A calculated result must preserve the source `loadId`.

## 12.4 Stable ordering

Where an input collection has an order, the corresponding result collection preserves that order unless a domain contract explicitly states otherwise.

## 12.5 No silent correction

Invalid input must produce an error.

The engine must not silently convert:

```text
-10 W → 0 W
1.5 power factor → 1
25 hours → 24
```

or similar invalid values.

## 12.6 Valid ranges

Load:

```text
quantity > 0
ratedPowerW > 0
0 < powerFactor <= 1
0 < efficiency <= 1, when supplied
0 <= operatingHoursPerDay <= 24
0 <= operatingDaysPerMonth <= 31
0 < demandFactor <= 1, when supplied
```

Peak Demand:

```text
diversityFactor >= 1
0 <= demandMargin <= 1
surgeFactor >= 1
startingPowerW >= runningPowerW
```

Energy:

```text
0 <= systemLossFactor < 1
0 <= designMargin <= 1
operatingHoursPerDay <= 24
operatingDaysPerMonth <= 31
```

## 12.7 Unit clarity

Engineering quantities must communicate their unit through the type, field name, or foundation quantity abstraction.

## 12.8 Traceability

Important engineering results must be traceable to their source inputs and assumptions.

## 12.9 Domain isolation

A module must not take ownership of calculations belonging to another domain.

## 12.10 Dependency direction

The dependency direction remains:

```text
engineering-types
       ↓
engineering-units
       ↓
engineering-validation
       ↓
engineering-core
       ↓
solar-engine
```

Domain modules must not introduce reverse dependencies into foundation packages.

---

# 13. Known Future Extensions

The following capabilities are intentionally **not part of Contract v1**.

They may be introduced through controlled contract revisions.

## 13.1 Time-based load profiles

Future Load/Energy contracts may support:

```text
hourly profiles
15-minute profiles
seasonal schedules
weekday/weekend schedules
```

## 13.2 Seasonal energy

Future Energy contracts may distinguish:

```text
monthly seasonal consumption
seasonal operating schedules
seasonal production assumptions
```

## 13.3 Explicit starting-demand scenarios

Peak Demand may eventually support explicit scenarios such as:

```text
single motor start
multiple motor starts
sequential starts
simultaneous starts
generator transition
inverter surge scenario
```

This should replace implicit conservative assumptions when the scenario model is mature.

## 13.4 Separate energy and demand margins

Future Load Audit contracts may explicitly expose:

```text
demandMargin
energyDesignMargin
```

rather than using a generic `designMargin`.

## 13.5 PV sizing

Future PV sizing consumes Energy results and environmental/system assumptions.

It does not belong inside Load, Energy or Peak Demand.

## 13.6 Battery sizing

Battery sizing will consume:

```text
energy demand
autonomy
battery voltage
depth of discharge
efficiency
reserve requirements
```

It remains a separate domain.

## 13.7 Inverter sizing

Inverter sizing will consume:

```text
continuous demand
peak demand
starting/surge requirements
power factor
system voltage
```

It remains separate from Peak Demand.

## 13.8 Cable sizing

Cable sizing will consume electrical design requirements such as:

```text
current
voltage
length
conductor characteristics
installation conditions
allowable voltage drop
```

It remains a separate domain.

## 13.9 Protection

Protection will eventually address:

```text
overcurrent protection
short-circuit considerations
disconnect requirements
DC protection
AC protection
coordination
```

It remains separate from cable sizing.

## 13.10 System validation

A higher-level System Validation domain may eventually validate relationships across:

```text
Load
Energy
Peak Demand
PV
Battery
Inverter
Cable
Protection
Earthing
```

This cross-domain validation must not be pushed into individual domain modules.

---

# Contract Freeze Rule

This document defines the intended **Solar Engine Contract v1**.

Implementation changes must not silently change the meaning of a contract.

When a contract must change:

1. identify the affected domain;
2. document the reason;
3. update the contract;
4. update tests;
5. update implementation;
6. update dependent projections;
7. verify the full vertical slice;
8. record the change in the project history.

The implementation is subordinate to the engineering contract.

Tests must enforce the contract.

Documentation must describe the contract.

The three must remain aligned.

---

# Current Contract Status

```text
Load                  DEFINED
LoadResult            DEFINED
Energy Projection     DEFINED
Energy Result         DEFINED
Peak Demand Projection DEFINED
Peak Demand Result    DEFINED
Load Audit             DEFINED
Naming                 DEFINED
Ownership              DEFINED
Lifecycle              DEFINED
Invariants             DEFINED
Future Extensions      DEFINED
```

## Known implementation reconciliation items

The following are deliberately **not silently changed** by this contract:

1. `LoadResult.runningLoadW` currently has an implementation/documentation mismatch concerning efficiency.
2. `PeakDemandLoadInput.powerFactor` exists but is not owned or consumed by Peak Demand.
3. `LoadAuditOutput.normalCoincidentDemandW` is less precise than `normalCoincidentDemandW`.
4. `LoadAuditInput.designMargin` is currently used as Peak Demand's demand margin.
5. Energy has its own design-margin capability but Load Audit currently does not project the Load Audit margin into Energy.

These are controlled reconciliation items for the next implementation phase.

---

# Contract v1 Boundary

The current flagship vertical slice is:

```text
Load
  ↓
LoadResult
  ├──────────────→ EnergyLoadInput
  │                     ↓
  │                EnergyOutput
  │
  └──────────────→ PeakDemandLoadInput
                        ↓
                   PeakDemandOutput
                        │
                        ▼
                  LoadAuditOutput
```

No PV, battery, inverter, cable, protection, costing, reporting, API, MCP, or AI behavior is included in this contract.

Those domains will consume stable outputs from this foundation rather than redefining Load, Energy, or Peak Demand.
