# @ogwusearch/solar-engine

Solar and renewable-energy engineering calculation engine.

`@ogwusearch/solar-engine` contains the domain-specific engineering mathematics required to analyze, size, validate, and document solar and renewable-energy systems.

The package is responsible for **solar-domain calculations**. Reusable calculation infrastructure, units, validation contracts, and execution orchestration belong to the shared engineering foundation packages.

---

## Purpose

The solar engine provides deterministic engineering calculations for systems containing components such as:

* Loads
* Energy systems
* PV arrays
* PV strings
* Batteries
* Inverters
* Charge controllers
* Cables
* Protection
* Earthing
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

## Modules

The solar engine is organized into domain-specific calculation modules.

### Load

Load and demand calculations.

Typical responsibilities:

* Appliance/load analysis
* Connected load
* Operating hours
* Energy consumption
* Load diversity
* Safety margins
* Daily energy demand
* Load profiles

---

### Energy

Energy-system calculations.

Typical responsibilities:

* Daily energy consumption
* Energy production requirements
* System losses
* Performance ratio
* Battery-to-load energy relationships
* Energy balance calculations

---

### Peak Demand

Peak-power and demand calculations.

Typical responsibilities:

* Continuous demand
* Peak demand
* Starting/surge demand
* Diversity factors
* Design demand
* Demand margins

---

### PV Sizing

Photovoltaic system sizing.

Typical responsibilities:

* Required PV power
* Panel quantity
* Peak-sun-hour calculations
* PV production
* System losses
* Design margins
* PV capacity verification

---

### PV Array

PV array configuration.

Typical responsibilities:

* Series panel count
* Parallel string count
* Total module count
* Array voltage
* Array current
* Array power
* Array configuration validation

---

### PV String

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

---

### Battery

Battery-bank sizing and analysis.

Typical responsibilities:

* Required battery capacity
* Usable battery energy
* Depth-of-discharge
* Round-trip efficiency
* Battery voltage
* Series battery count
* Parallel battery count
* Total battery-bank capacity
* Battery-bank energy
* Backup/autonomy calculations

---

### Inverter

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

---

### Charge Controller

Charge-controller sizing.

Typical responsibilities:

* PV charging current
* Controller current requirement
* Controller voltage limits
* MPPT compatibility
* Array-to-controller compatibility
* Safety margin

---

### Cable

Cable sizing calculations.

Typical responsibilities:

* Current-carrying requirement
* Conductor sizing
* Cable resistance
* Cable power loss
* Cable voltage drop
* Design current
* Installation constraints

---

### Voltage Drop

Voltage-drop calculations.

Typical responsibilities:

* DC voltage drop
* AC voltage drop
* Percentage voltage drop
* Conductor resistance
* Cable length
* Current-dependent losses
* Voltage-drop compliance

---

### Protection

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

---

### Earthing

Earthing and grounding calculations.

Typical responsibilities:

* Protective earthing
* Grounding requirements
* Earth conductor sizing
* Earth resistance calculations
* Equipment bonding
* System grounding checks

---

### Generator

Generator sizing and hybrid-system calculations.

Typical responsibilities:

* Generator power requirement
* Generator operating load
* Generator-to-inverter compatibility
* Generator backup sizing
* Hybrid energy-system calculations

---

### BOM

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

The BOM module should calculate and structure engineering requirements rather than handle application-specific purchasing workflows.

---

### Costing

Engineering cost calculations.

Typical responsibilities:

* Component quantities × unit prices
* Material costs
* Installation costs
* Engineering costs
* Subtotals
* Contingency
* Total project cost

Currency handling should remain compatible with the shared engineering type and unit infrastructure.

---

### System Validation

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

Validation should collect all relevant issues rather than stop at the first error.

---

### Reports

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

Report formatting and application-specific document generation should remain outside the core mathematical modules where practical.

---

# Calculation Flow

Solar calculations follow the shared engineering execution model:

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

Each module should clearly separate:

1. Input definition
2. Input validation
3. Engineering calculation
4. Warning generation
5. Result construction
6. Calculation trace

---

# Engineering Principles

## Deterministic Calculations

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
* Hidden global state

unless explicitly required by the domain.

---

## Pure Engineering Mathematics

Domain calculations should primarily be pure functions.

Example:

```ts
const result = calculatePvSize(input);
```

The function should not:

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

Validation is handled using the shared validation infrastructure.

```text
@ogwusearch/engineering-validation
                ↓
        solar-engine module
                ↓
          calculation
```

Solar modules should validate domain-specific constraints such as:

```text
PV voltage > inverter minimum voltage
PV voltage < inverter maximum voltage
Battery voltage compatible with inverter
Controller current within rated limit
Cable voltage drop within design limit
```

Validation should report structured errors.

Example conceptual result:

```ts
{
  valid: false,
  errors: [
    {
      code: "PV_VOLTAGE_TOO_HIGH",
      message: "PV string voltage exceeds inverter maximum input voltage."
    }
  ]
}
```

---

# Warnings

Not every engineering issue makes a calculation invalid.

For example:

```text
PV array is close to inverter maximum input voltage.
```

may be a warning rather than a calculation error.

Warnings should be explicit and structured.

Examples:

* High voltage utilization
* High cable voltage drop
* Low battery autonomy
* Low PV production margin
* High inverter utilization
* High controller utilization
* Design operating close to equipment limits

---

# Assumptions

Engineering calculations may depend on assumptions.

Examples:

```text
Peak sun hours = 5.0 h/day
PV system efficiency = 75%
Battery depth of discharge = 50%
Battery round-trip efficiency = 90%
Design margin = 25%
```

Assumptions should be represented explicitly in calculation results and traces where applicable.

---

# Units

The solar engine should use the shared unit infrastructure:

```text
@ogwusearch/engineering-units
```

Typical quantities include:

* Voltage — V
* Current — A
* Power — W
* Energy — Wh
* Battery capacity — Ah
* Resistance — Ω
* Cable length — m
* Irradiance — W/m²
* Peak sun hours — h
* Temperature — °C
* Percentage — %

Avoid silently mixing incompatible units.

---

# Engineering Types

Shared contracts belong to:

```text
@ogwusearch/engineering-types
```

Examples include:

* Engineering inputs
* Engineering outputs
* Errors
* Warnings
* Assumptions
* Metadata
* Calculation traces
* Result structures

The solar engine should reuse these contracts instead of redefining generic engineering infrastructure.

---

# Engineering Core

Execution orchestration belongs to:

```text
@ogwusearch/engineering-core
```

A typical solar module can therefore focus on its engineering logic:

```text
solar module
     ↓
validate domain input
     ↓
perform engineering calculation
     ↓
return calculated value
```

The core runner handles the surrounding execution lifecycle.

---

# Dependency Direction

The architecture should remain acyclic.

```text
                  engineering-types
                  /       |       \
                 /        |        \
                ↓         ↓         ↓
 engineering-units   validation    core
                                      ↑
                                      |
                                      |
                              solar-engine
```

The important rule is:

> Foundation packages must not depend on `solar-engine`.

Solar-specific engineering mathematics belongs in `solar-engine`.

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

A solar module may expose a calculation such as:

```ts
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

The engineering calculation can then be expressed as:

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
```

The actual implementation should use the project's shared types, validation, units, and calculation runner.

---

# Module Structure

A recommended structure is:

```text
packages/solar-engine/
├── src/
│   ├── index.ts
│   │
│   ├── load/
│   ├── energy/
│   ├── peak-demand/
│   │
│   ├── pv-sizing/
│   ├── pv-array/
│   ├── pv-string/
│   │
│   ├── battery/
│   ├── inverter/
│   ├── charge-controller/
│   │
│   ├── cable/
│   ├── voltage-drop/
│   ├── protection/
│   ├── earthing/
│   │
│   ├── generator/
│   ├── bom/
│   ├── costing/
│   ├── system-validation/
│   └── reports/
│
├── README.md
├── package.json
└── tsconfig.json
```

Each module should have a clear public boundary.

For example:

```text
pv-sizing/
├── index.ts
├── types.ts
├── validation.ts
├── calculate.ts
└── __tests__/
    └── calculate.test.ts
```

---

# Testing

Every engineering module should have automated tests.

Tests should cover:

### Normal cases

```text
valid input
    ↓
expected engineering result
```

### Boundary cases

Examples:

* Minimum valid voltage
* Maximum valid voltage
* Zero margin
* Maximum allowable current
* Maximum cable length
* Minimum battery capacity

### Invalid cases

Examples:

* Negative power
* Zero peak sun hours
* Invalid efficiency
* Unsupported battery voltage
* PV voltage outside equipment limits

### Engineering warnings

Verify that valid-but-concerning designs produce warnings.

### Determinism

The same input should always produce the same output.

---

# Quality Requirements

Solar-engine modules should follow these requirements:

* Use explicit inputs and outputs
* Avoid hidden state
* Avoid side effects
* Use shared engineering types
* Use shared units
* Use shared validation infrastructure
* Use the engineering core runner where appropriate
* Validate domain constraints
* Collect all relevant validation errors
* Generate structured warnings
* Record important assumptions
* Produce traceable calculations
* Keep formulas readable
* Keep engineering constants explicit
* Test boundary conditions
* Avoid duplicating foundation functionality

---

# What Does Not Belong Here

The following should generally remain outside `solar-engine`:

### UI

```text
React
Vue
HTML
CSS
Dashboard components
Forms
Charts
```

### Persistence

```text
PostgreSQL
SQLite
IndexedDB
ORM models
Repositories
```

### Networking

```text
REST APIs
GraphQL
HTTP clients
WebSockets
```

### Generic Infrastructure

```text
Authentication
Authorization
Application routing
Logging infrastructure
Generic configuration
```

### Generic Engineering Infrastructure

```text
Generic units
Generic validation
Generic result contracts
Generic calculation orchestration
```

Those responsibilities belong to the appropriate application or foundation package.

---

# Design Goal

The long-term goal is for `solar-engine` to provide a reusable engineering calculation library that can power multiple products.

```text
                     Solar Applications
                            │
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
          Web App       Desktop App      API
             │              │              │
             └──────────────┼──────────────┘
                            ↓
                    @ogwusearch/solar-engine
                            │
             ┌──────────────┼──────────────┐
             ↓              ↓              ↓
       Engineering Core   Units       Validation
             │              │              │
             └──────────────┼──────────────┘
                            ↓
                   Engineering Types
```

This allows the same engineering calculations to be reused across different applications without duplicating the underlying mathematics.

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

> **`solar-engine` owns solar engineering mathematics; the engineering foundation owns reusable infrastructure.**
