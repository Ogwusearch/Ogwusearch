# @ogwusearch/solar-engine

Solar and renewable-energy engineering calculation engine.

`@ogwusearch/solar-engine` contains the domain-specific engineering mathematics required to analyze, size, validate, and document solar and renewable-energy systems.

The package is responsible for **solar-domain engineering calculations**. Reusable calculation contracts, physical units, validation infrastructure, and calculation execution orchestration belong to the shared engineering foundation packages.

---

# Purpose

The Solar Engine provides deterministic engineering calculations for systems containing components such as:

* Loads
* Energy systems
* PV systems
* PV arrays
* PV strings
* Batteries
* Inverters
* Charge controllers
* Cables
* Voltage-drop systems
* Protection systems
* Earthing systems
* Generators
* Bills of materials
* Cost estimates
* System validation
* Engineering reports

The engine should produce results that are:

* Deterministic
* Traceable
* Unit-aware
* Validated
* Explicit about assumptions
* Suitable for engineering review
* Reusable across applications

---

# Architecture

The Solar Engine is a domain package built on top of the reusable engineering foundation.

```text
@ogwusearch/engineering-types
              ↑
              |
    ┌─────────┴─────────┐
    |                   |
engineering-units   engineering-validation
    |                   |
    └─────────┬─────────┘
              |
    @ogwusearch/engineering-core
              ↑
              |
    @ogwusearch/solar-engine
              |
       ┌──────┴──────┐
       |             |
     modules       shared
```

The dependency direction is intentionally one-way.

Foundation packages must not depend on `solar-engine`.

Solar-specific engineering mathematics belongs inside `solar-engine`.

Generic engineering infrastructure belongs inside the foundation packages.

---

# Package Responsibilities

| Package                              | Responsibility                                                 |
| ------------------------------------ | -------------------------------------------------------------- |
| `@ogwusearch/engineering-types`      | Shared engineering contracts                                   |
| `@ogwusearch/engineering-units`      | Units, quantities, dimensions, conversions                     |
| `@ogwusearch/engineering-validation` | Generic validation infrastructure                              |
| `@ogwusearch/engineering-core`       | Calculation execution, lifecycle, results, trace orchestration |
| `@ogwusearch/solar-engine`           | Solar and renewable-energy engineering mathematics             |

This separation prevents solar-domain logic from leaking into reusable foundation packages.

---

# Directory Architecture

The Solar Engine organizes domain calculations under `src/modules/`.

```text
packages/solar-engine/
├── README.md
├── package.json
├── tsconfig.json
│
└── src/
    ├── modules/
    │   ├── load/
    │   ├── energy/
    │   ├── peak-demand/
    │   ├── pv-sizing/
    │   ├── pv-array/
    │   ├── pv-string/
    │   ├── battery/
    │   ├── inverter/
    │   ├── charge-controller/
    │   ├── cable/
    │   ├── voltage-drop/
    │   ├── protection/
    │   ├── earthing/
    │   ├── generator/
    │   ├── bom/
    │   ├── costing/
    │   ├── system-validation/
    │   └── reports/
    │
    └── shared/
        ├── assumptions/
        ├── constants/
        ├── derating/
        ├── irradiance/
        ├── standards/
        ├── temperature/
        └── warnings/
```

`modules/` contains domain calculation modules.

`shared/` contains reusable **solar-domain** calculations, constants, assumptions, standards, environmental calculations, derating models, and warnings.

`shared/` is not a replacement for the engineering foundation packages.

---

# Modules

The Solar Engine is organized into domain-specific calculation modules.

## Load

Load and demand calculations.

Typical responsibilities:

* Appliance/load analysis
* Connected load
* Operating hours
* Energy consumption
* Load diversity
* Demand factors
* Safety margins
* Daily energy demand
* Load profiles

The Load module owns load-domain mathematics and does not own generic engineering validation infrastructure.

---

## Energy

Energy-system calculations.

Typical responsibilities:

* Daily energy consumption
* Monthly energy consumption
* Annual energy consumption
* Energy production requirements
* System losses
* Performance ratio
* Energy margins
* Battery-to-load energy relationships
* Energy balance calculations

Energy calculations should consume load-analysis results rather than reimplement load characterization.

---

## Peak Demand

Peak-power and demand calculations.

Typical responsibilities:

* Individual demand
* Normal coincident demand
* Peak demand
* Starting/surge demand
* Diversity factors
* Demand margins
* Design demand

The existing peak-demand engineering model is preserved.

The core formulas are:

```text
Individual Demand
=
Running Power × Demand Factor

Normal Coincident Demand
=
Σ Individual Demand / Diversity Factor

Starting Demand
=
Explicit Starting Power
OR
Running Power × Surge Factor

Design Demand
=
Peak Demand × (1 + Demand Margin)
```

These formulas should not be changed as part of architectural cleanup.

---

## PV Sizing

Photovoltaic system sizing.

Typical responsibilities:

* Required PV power
* Panel quantity
* Peak-sun-hour calculations
* PV production
* System losses
* PV derating
* Performance ratio
* Design margins
* PV capacity verification

Generic electrical relationships should use the engineering foundation where appropriate.

PV-specific formulas remain inside the Solar Engine.

---

## PV Array

PV array configuration.

Typical responsibilities:

* Series panel count
* Parallel string count
* Total module count
* Array voltage
* Array current
* Array power
* Array configuration validation
* Array-level compatibility checks

---

## PV String

PV string electrical calculations.

Typical responsibilities:

* String voltage
* String current
* String power
* Open-circuit voltage
* Maximum-power voltage
* Temperature-adjusted voltage
* String compatibility
* MPPT operating limits
* Temperature-dependent voltage checks

---

## Battery

Battery-bank sizing and analysis.

Typical responsibilities:

* Required battery energy
* Adjusted battery energy
* Required battery capacity
* Depth-of-discharge adjustment
* Battery-efficiency adjustment
* Design-margin application
* Series battery count
* Parallel battery count
* Total battery units
* Installed battery capacity
* Installed battery-bank energy
* Battery-specific validation
* Battery-specific warnings
* Battery calculation trace

The Battery Engine has a canonical structure under:

```text
src/modules/battery/
```

Its execution result uses:

```ts
CalculationResult<BatterySizingOutput>
```

from the shared engineering foundation.

Battery calculations must not introduce a separate generic result envelope.

---

## Inverter

Inverter sizing and validation.

Typical responsibilities:

* Continuous power requirement
* Surge requirement
* Inverter capacity
* DC input requirements
* AC output requirements
* Efficiency
* System compatibility
* Load-to-inverter validation
* Environmental derating
* Inverter utilization

Inverter-specific derating belongs to the Solar Engine rather than `engineering-core`.

---

## Charge Controller

Charge-controller sizing.

Typical responsibilities:

* PV charging current
* Controller current requirement
* Controller voltage limits
* MPPT compatibility
* Array-to-controller compatibility
* Controller utilization
* Safety margin
* Environmental constraints

---

## Cable

Cable sizing calculations.

Typical responsibilities:

* Current-carrying requirement
* Conductor sizing
* Cable resistance
* Cable power loss
* Cable voltage drop
* Design current
* Cable derating
* Installation constraints
* Conductor material considerations

Cable-specific derating belongs to the Cable module.

Generic resistance relationships belong in the reusable engineering foundation where appropriate.

---

## Voltage Drop

Voltage-drop calculations.

Typical responsibilities:

* DC voltage drop
* AC voltage drop
* Percentage voltage drop
* Conductor resistance
* Cable length
* Current-dependent losses
* Voltage-drop compliance

The module owns voltage-drop domain calculations.

---

## Protection

Electrical protection calculations.

Typical responsibilities:

* Fuse sizing
* Breaker sizing
* Overcurrent protection
* Short-circuit considerations
* Protection coordination
* DC protection
* AC protection
* PV string protection

Protection calculations should use applicable solar-domain standards and explicit assumptions.

---

## Earthing

Earthing and grounding calculations.

Typical responsibilities:

* Protective earthing
* Grounding requirements
* Earth conductor sizing
* Earth resistance calculations
* Equipment bonding
* System grounding checks

Applicable standards should be represented explicitly through the Solar Engine standards infrastructure.

---

## Generator

Generator sizing and hybrid-system calculations.

Typical responsibilities:

* Generator power requirement
* Generator operating load
* Generator-to-inverter compatibility
* Generator backup sizing
* Hybrid energy-system calculations

---

## BOM

Bill-of-material calculations.

Typical responsibilities:

* Required component quantities
* System component lists
* Cable quantities
* Protection components
* PV modules
* Batteries
* Inverters
* Mounting components
* Accessories

The BOM module should calculate and structure engineering requirements.

It should not handle application-specific purchasing workflows.

---

## Costing

Engineering cost calculations.

Typical responsibilities:

* Component quantities × unit prices
* Material costs
* Installation costs
* Engineering costs
* Subtotals
* Contingency
* Total project cost

Currency and monetary representations should remain compatible with the shared engineering type infrastructure.

Application-specific payment, purchasing, accounting, and transaction workflows do not belong here.

---

## System Validation

Solar-system engineering validation.

Typical responsibilities:

* PV/inverter compatibility
* PV/controller compatibility
* Battery/inverter compatibility
* Voltage limits
* Current limits
* Cable adequacy
* Protection adequacy
* System-level engineering constraints

Validation should collect relevant issues rather than stop at the first error.

The module should use the shared `EngineeringIssue` contract.

---

## Reports

Engineering result and report preparation.

Typical responsibilities:

* Calculation summaries
* Engineering assumptions
* Design parameters
* Component summaries
* Warnings
* Validation results
* Calculation traces
* Engineering recommendations based on calculated results

Report preparation may consume results from other Solar Engine modules.

Application-specific document rendering and presentation should remain outside the core mathematical modules where practical.

---

# Solar Shared Infrastructure

The Solar Engine contains shared infrastructure that is specific to solar and renewable-energy engineering.

```text
src/shared/
├── assumptions/
├── constants/
├── derating/
├── irradiance/
├── standards/
├── temperature/
└── warnings/
```

These utilities remain inside `solar-engine` because their meaning is domain-specific.

Examples include:

### Assumptions

* Peak sun hours
* Performance ratio
* Inverter efficiency
* Battery efficiency
* Battery depth of discharge
* Solar design margins
* Ambient temperature
* Minimum/maximum temperature

### Constants

Solar-specific electrical and engineering constants.

### Derating

Solar-domain derating such as:

* PV temperature derating
* PV soiling loss
* PV wiring loss
* PV mismatch loss
* PV shading loss
* PV inverter efficiency
* Cable environmental derating
* Inverter environmental derating

### Irradiance

* Peak sun hours
* Production ratios
* Solar-resource relationships

### Standards

Solar-domain standards and references, including applicable:

* IEC
* IEEE
* NEC
* Nigerian engineering standards and codes

### Temperature

Solar-specific temperature relationships such as:

* Cell temperature
* Temperature rise
* PV voltage adjustment
* Temperature coefficients
* Reference temperature calculations

### Warnings

Solar-domain warning codes and warning construction.

---

# Calculation Flow

Solar calculations follow the shared engineering execution lifecycle.

Conceptually:

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
Trace
  ↓
CalculationResult
```

The shared engineering core is responsible for execution orchestration.

Each Solar Engine module should clearly separate:

1. Input definition
2. Input validation
3. Assumption resolution
4. Engineering calculation
5. Warning generation
6. Trace generation
7. Result construction

Where the shared execution lifecycle already provides a responsibility, domain modules should use it rather than duplicating it.

---

# Deterministic Calculations

For the same valid input, a calculation should produce the same result.

```text
same input
    ↓
same calculation
    ↓
same result
```

Calculations should not depend on:

* Current time
* Random values
* Network requests
* Database state
* UI state
* Browser APIs
* Mutable global state

unless explicitly required by the engineering model.

---

# Pure Engineering Mathematics

Domain calculations should primarily be pure functions.

Example:

```ts id="uqh0rj"
const result = calculatePvSize(input);
```

A calculation function should not:

* Modify application state
* Write to a database
* Make HTTP requests
* Read browser storage
* Access UI components

This keeps the engineering engine reusable across:

* Web applications
* Desktop applications
* Mobile applications
* APIs
* CLI tools
* Automated engineering reports
* Testing environments

---

# Validation

Validation is built on the shared engineering validation infrastructure.

```text
@ogwusearch/engineering-validation
              ↓
       solar-engine module
              ↓
       domain validation
              ↓
          calculation
```

Generic validation mechanisms belong to:

```text
@ogwusearch/engineering-validation
```

Solar-domain constraints belong to the relevant Solar Engine module.

Examples:

```text
PV voltage > inverter minimum voltage

PV voltage < inverter maximum voltage

Battery voltage compatible with inverter

Controller current within rated limit

Cable voltage drop within design limit
```

Validation should report structured issues using the shared contracts.

Conceptually:

```ts id="f8ntuj"
{
  code: "PV_VOLTAGE_TOO_HIGH",
  severity: "ERROR",
  message:
    "PV string voltage exceeds inverter maximum input voltage.",
  path: "pvStringVoltageV",
  actual: 650
}
```

Modules should collect all relevant validation issues where practical.

---

# Warnings

Not every engineering issue makes a calculation invalid.

For example:

```text
PV array is operating close to the inverter maximum input voltage.
```

may be a warning rather than a blocking calculation error.

Warnings should be explicit and structured.

Examples include:

* High voltage utilization
* High cable voltage drop
* Low battery autonomy
* Low PV production margin
* High inverter utilization
* High controller utilization
* Design operating close to equipment limits
* High depth of discharge
* Non-integer physical configuration before rounding

Warnings should use the foundation warning contract.

---

# Assumptions

Engineering calculations may depend on assumptions.

Examples:

```text
Peak sun hours = 5.0 h/day

PV performance ratio = 75%

Battery depth of discharge = 50%

Battery round-trip efficiency = 90%

Design margin = 25%
```

Assumptions should be represented explicitly using:

```ts
EngineeringAssumption
```

and included in calculation results where applicable.

Solar-domain assumptions belong in:

```text
src/shared/assumptions/
```

or in the relevant module when the assumption is specifically owned by that module.

---

# Units

The Solar Engine uses the shared unit infrastructure:

```text
@ogwusearch/engineering-units
```

Typical quantities include:

| Quantity         | Unit     |
| ---------------- | -------- |
| Voltage          | V        |
| Current          | A        |
| Power            | W        |
| Energy           | Wh / kWh |
| Battery capacity | Ah       |
| Resistance       | Ω        |
| Cable length     | m        |
| Irradiance       | W/m²     |
| Peak sun hours   | h        |
| Temperature      | °C       |
| Percentage       | %        |

The Solar Engine must not silently mix incompatible units.

Generic unit definitions and conversions belong to `engineering-units`.

Solar-specific engineering relationships remain within `solar-engine`.

---

# Engineering Types

Shared engineering contracts belong to:

```text
@ogwusearch/engineering-types
```

Examples include:

* Calculation contexts
* Calculation inputs
* Calculation outputs
* Calculation results
* Engineering errors
* Engineering warnings
* Engineering assumptions
* Engineering metadata
* Calculation traces
* Calculation trace steps
* Engineering identifiers

The Solar Engine should reuse these contracts instead of redefining generic engineering infrastructure.

---

# Engineering Core

Calculation execution orchestration belongs to:

```text
@ogwusearch/engineering-core
```

A typical Solar Engine module can therefore focus on its domain logic:

```text
solar module
     ↓
domain validation
     ↓
assumptions
     ↓
engineering calculation
     ↓
domain output
     ↓
engineering-core
     ↓
CalculationResult
```

The core runner provides the shared calculation lifecycle.

A domain module should not create a parallel result system when the foundation already provides the required contract.

---

# Dependency Direction

The architecture must remain acyclic.

```text
                 engineering-types
                  ↑      ↑      ↑
                  |      |      |
                  |      |      |
       engineering-units | engineering-validation
                  |      |      |
                  └──────┼──────┘
                         ↑
                         |
               engineering-core
                         ↑
                         |
                  solar-engine
                         ↑
                         |
                  Solar Modules
```

The critical rule is:

> **Foundation packages must not depend on `solar-engine`.**

Specifically:

```text
engineering-types
        X→ solar-engine

engineering-units
        X→ solar-engine

engineering-validation
        X→ solar-engine

engineering-core
        X→ solar-engine
```

The dependency direction is:

```text
foundation
    ↓
solar domain
```

Solar-specific engineering mathematics belongs in `solar-engine`.

Reusable engineering infrastructure belongs in the foundation packages.

---

# Separation of Responsibilities

| Package                  | Responsibility                                     |
| ------------------------ | -------------------------------------------------- |
| `engineering-types`      | Shared engineering contracts                       |
| `engineering-units`      | Units, quantities, dimensions, conversions         |
| `engineering-validation` | Validation infrastructure                          |
| `engineering-core`       | Calculation execution and orchestration            |
| `solar-engine`           | Solar and renewable-energy engineering mathematics |

This separation prevents domain-specific calculations from leaking into the foundation.

---

# Example Module

A Solar Engine module may expose a calculation such as:

```ts id="3m7n75"
export interface PvSizingInput {
  dailyEnergyWh: number;
  peakSunHours: number;
  systemEfficiency: number;
  designMargin: number;
}

export interface PvSizingOutput {
  requiredPvPowerW: number;
}
```

The engineering calculation can be expressed as:

```text
required PV power
=
daily energy
/
peak sun hours
/
system efficiency
×
(1 + design margin)
```

For example:

```text
Daily energy = 5,000 Wh/day

Peak sun hours = 5 h/day

System efficiency = 0.75

Design margin = 0.25

PV power
=
5000 / 5 / 0.75 × 1.25
=
1666.67 W
```

The actual implementation should use the project's shared types, validation, units, assumptions, and calculation runner.

---

# Module Structure

The current Solar Engine uses a domain-module architecture:

```text
packages/solar-engine/
├── README.md
├── package.json
├── tsconfig.json
│
└── src/
    ├── modules/
    │   ├── load/
    │   ├── energy/
    │   ├── peak-demand/
    │   ├── pv-sizing/
    │   ├── pv-array/
    │   ├── pv-string/
    │   ├── battery/
    │   ├── inverter/
    │   ├── charge-controller/
    │   ├── cable/
    │   ├── voltage-drop/
    │   ├── protection/
    │   ├── earthing/
    │   ├── generator/
    │   ├── bom/
    │   ├── costing/
    │   ├── system-validation/
    │   └── reports/
    │
    └── shared/
        ├── assumptions/
        ├── constants/
        ├── derating/
        ├── irradiance/
        ├── standards/
        ├── temperature/
        └── warnings/
```

Each module should have a clear public boundary.

A mature module may use a structure such as:

```text
battery/
├── __tests__/
├── assumptions/
├── calculation/
├── index.ts
├── run.ts
├── trace/
├── types/
└── validation/
```

The exact internal structure may vary by module, but public boundaries should remain explicit.

---

# Testing

Every engineering module should have automated tests.

Tests should cover:

## Normal Cases

```text
valid input
    ↓
expected engineering result
```

## Boundary Cases

Examples:

* Minimum valid voltage
* Maximum valid voltage
* Zero design margin
* Maximum allowable current
* Maximum cable length
* Minimum battery capacity
* Equipment operating limits
* Temperature boundaries

## Invalid Cases

Examples:

* Negative power
* Zero peak sun hours
* Invalid efficiency
* Unsupported battery voltage
* PV voltage outside equipment limits
* Invalid cable parameters
* Invalid battery configuration

## Engineering Warnings

Verify that valid-but-concerning designs produce structured warnings.

## Determinism

The same input should always produce the same output and trace ordering.

---

# Quality Requirements

Solar Engine modules should:

* Use explicit inputs and outputs
* Avoid hidden state
* Avoid side effects
* Use shared engineering types
* Use shared units
* Use shared validation infrastructure
* Use the engineering core runner where appropriate
* Validate domain constraints
* Collect relevant validation errors
* Generate structured warnings
* Record important assumptions
* Produce traceable calculations
* Keep formulas readable
* Keep engineering constants explicit
* Test boundary conditions
* Avoid duplicating foundation functionality
* Preserve established engineering formulas unless an explicit model change is approved

---

# What Does Not Belong Here

The following should generally remain outside `solar-engine`.

## UI

```text
React
Vue
HTML
CSS
Dashboard components
Forms
Charts
```

## Persistence

```text
PostgreSQL
SQLite
IndexedDB
ORM models
Repositories
```

## Networking

```text
REST APIs
GraphQL
HTTP clients
WebSockets
```

## Generic Application Infrastructure

```text
Authentication
Authorization
Application routing
Application configuration
UI state management
```

## Generic Engineering Infrastructure

```text
Generic units
Generic dimensions
Generic validation infrastructure
Generic result contracts
Generic calculation orchestration
Generic trace contracts
```

Those responsibilities belong to the appropriate application or foundation package.

---

# Design Goal

The long-term goal is for `solar-engine` to provide a reusable engineering calculation library that can power multiple products.

```text
                       Solar Applications
                              |
               ┌──────────────┼──────────────┐
               ↓              ↓              ↓
            Web App       Desktop App       API
               |              |              |
               └──────────────┼──────────────┘
                              ↓
                  @ogwusearch/solar-engine
                              |
               ┌──────────────┼──────────────┐
               ↓              ↓              ↓
        Engineering Core     Units      Validation
               |              |              |
               └──────────────┼──────────────┘
                              ↓
                     Engineering Types
```

This allows the same engineering calculations to be reused across different applications without duplicating the underlying mathematics.

---

# Engineering Domain Flow

The Solar Engine modules form a domain-level engineering workflow:

```text
Load
  ↓
Energy
  ↓
Peak Demand
  ↓
PV Sizing
  ↓
PV Array
  ↓
PV String
  ↓
Battery
  ↓
Inverter
  ↓
Charge Controller
  ↓
Cable
  ↓
Voltage Drop
  ↓
Protection
  ↓
Earthing
  ↓
Generator
  ↓
BOM
  ↓
Costing
  ↓
System Validation
  ↓
Reports
```

This represents a conceptual engineering workflow, not necessarily a strict compile-time dependency chain between every module.

Modules should depend only on the domain contracts and calculations they actually require.

---

# Current Engineering Foundation Boundary

The reusable foundation currently consists of:

```text
@ogwusearch/engineering-types
@ogwusearch/engineering-units
@ogwusearch/engineering-validation
@ogwusearch/engineering-core
```

The foundation provides reusable engineering infrastructure.

The Solar Engine provides the solar-domain implementation.

```text
                 FOUNDATION
┌──────────────────────────────────────────┐
│ engineering-types                        │
│ engineering-units                        │
│ engineering-validation                   │
│ engineering-core                         │
└────────────────────┬─────────────────────┘
                     │
                     ↓
┌──────────────────────────────────────────┐
│             SOLAR ENGINE                  │
│                                          │
│ Load                                     │
│ Energy                                   │
│ Peak Demand                              │
│ PV Sizing                                │
│ PV Array                                 │
│ PV String                                │
│ Battery                                  │
│ Inverter                                 │
│ Charge Controller                        │
│ Cable                                    │
│ Voltage Drop                             │
│ Protection                               │
│ Earthing                                 │
│ Generator                                │
│ BOM                                      │
│ Costing                                  │
│ System Validation                        │
│ Reports                                  │
└──────────────────────────────────────────┘
```

---

# Summary

`@ogwusearch/solar-engine` is the **solar and renewable-energy engineering domain layer**.

It owns:

* Load calculations
* Energy calculations
* Peak-demand calculations
* PV sizing
* PV array configuration
* PV string calculations
* Battery sizing
* Inverter sizing
* Charge-controller sizing
* Cable sizing
* Voltage-drop calculations
* Protection calculations
* Earthing calculations
* Generator sizing
* BOM calculations
* Costing
* System validation
* Engineering reports

It relies on:

```text
@ogwusearch/engineering-types
@ogwusearch/engineering-units
@ogwusearch/engineering-validation
@ogwusearch/engineering-core
```

The guiding principle is:

> **`solar-engine` owns solar and renewable-energy engineering mathematics; the engineering foundation owns reusable engineering infrastructure.**

The architecture should remain deterministic, traceable, unit-aware, validated, assumption-explicit, and reusable across applications.
