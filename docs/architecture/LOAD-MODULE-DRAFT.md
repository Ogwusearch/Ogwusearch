# Load Module

The `load` module defines and analyzes electrical loads used by the solar and renewable-energy engineering engine.

It is responsible for determining:

* Connected load
* Operating load
* Daily energy demand
* Load schedules
* Load profiles
* Diversity effects
* Load factor
* Demand characteristics
* Surge characteristics where applicable

The module describes **what the electrical system consumes**. It does not size the PV array, battery, inverter, generator, or other downstream equipment.

---

## Responsibility

The load module owns solar-domain load calculations and load models.

Typical inputs include:

```text
Load name
Quantity
Rated power
Power factor
Operating hours
Duty cycle
Schedule
Surge factor
Continuous-load designation
```

Typical outputs include:

```text
Connected power
Operating power
Daily energy
Diversified demand
Peak demand inputs
Load factor
Hourly/daily load profiles
```

---

# Module Structure

```text
load/
├── README.md
│
├── types/
│   ├── load-input.ts
│   ├── load-item.ts
│   ├── load-profile.ts
│   ├── load-schedule.ts
│   └── index.ts
│
├── calculations/
│   ├── connected-load.ts
│   ├── operating-load.ts
│   ├── diversified-load.ts
│   ├── daily-energy.ts
│   ├── load-factor.ts
│   ├── diversity-factor.ts
│   └── index.ts
│
├── profile/
│   ├── hourly-load.ts
│   ├── daily-load.ts
│   ├── peak-period.ts
│   └── index.ts
│
├── validation/
│   ├── load-item-validation.ts
│   ├── load-schedule-validation.ts
│   └── index.ts
│
├── __tests__/
│   ├── connected-load.test.ts
│   ├── operating-load.test.ts
│   ├── diversified-load.test.ts
│   ├── daily-energy.test.ts
│   ├── load-factor.test.ts
│   ├── diversity-factor.test.ts
│   └── load-validation.test.ts
│
└── index.ts
```

The exact file set may evolve as the domain implementation grows, but the public responsibility of the module should remain stable.

---

# Load Item

A `LoadItem` represents one class of electrical consumer.

Examples:

```text
Refrigerator
Water pump
Lighting circuit
Air conditioner
Television
Computer
Fan
Washing machine
Microwave
```

A typical load item contains:

```ts
interface LoadItem {
  id: string;
  name: string;
  quantity: number;
  ratedPowerW: number;
  powerFactor?: number;
  operatingHoursPerDay: number;
  surgeFactor?: number;
  continuous?: boolean;
}
```

The model describes the equipment. It does not decide whether its values are valid.

---

# Load Input

A load calculation may operate on a collection of load items:

```ts
interface LoadInput {
  loads: readonly LoadItem[];
  diversityFactor?: number;
}
```

The input may later be extended with:

* Load schedules
* Site operating periods
* Design assumptions
* Ambient conditions
* Phase information
* Single-phase/three-phase information
* Demand categories

Domain-specific extensions should remain explicit rather than hidden in generic objects.

---

# Load Schedule

Operating time should be represented independently from the equipment definition where practical.

Example:

```ts
interface LoadSchedule {
  loadId: string;
  startHour: number;
  durationHours: number;
  dutyCycle?: number;
}
```

This separation allows the same appliance to have different operating patterns.

For example:

```text
Water pump
    │
    ├── Morning: 06:00–08:00
    ├── Afternoon: 13:00–14:00
    └── Evening: 18:00–20:00
```

The schedule determines when the load operates; the load item describes what the equipment is.

---

# Core Calculations

## Connected Load

Connected load represents the installed rated electrical capacity before operating schedules or diversity effects.

```text
Connected Load
=
Σ(quantity × rated power)
```

Example:

```text
5 × 100 W lights
+
2 × 500 W pumps

= 1,500 W
```

Connected load is not necessarily the actual simultaneous demand.

---

## Operating Load

Operating load represents the expected demand while the relevant loads are operating.

A simple model may use duty cycle:

```text
Operating Load
=
rated power × quantity × duty cycle
```

For multiple loads:

```text
Operating Load
=
Σ(quantity × rated power × duty cycle)
```

More advanced demand models may use time schedules instead.

---

## Daily Energy

Daily energy represents the energy consumed over the operating period.

The basic relationship is:

```text
Energy
=
Power × Time
```

For load schedules:

```text
Daily Energy
=
Σ(power × operating hours × duty cycle)
```

Typical unit:

```text
Wh/day
```

or:

```text
kWh/day
```

The load module should normally calculate using a consistent internal engineering representation and allow the units layer to handle conversion.

---

## Diversity Factor

Diversity accounts for the fact that not all connected loads necessarily operate simultaneously.

A simple model is:

```text
Diversified Load
=
Connected/Operating Load × Diversity Factor
```

The engineering meaning of the factor must be explicit.

Do not silently apply a default diversity factor unless the calculation contract explicitly defines one.

---

## Load Factor

Load factor describes the relationship between average and peak demand:

```text
Load Factor
=
Average Load / Peak Load
```

A typical load factor is represented as a decimal ratio:

```text
0.50 = 50%
0.75 = 75%
1.00 = 100%
```

The calculation should not confuse load factor with diversity factor.

---

# Load Profiles

A load profile represents demand over time.

For example:

```text
Hour       Load
00:00      400 W
01:00      350 W
02:00      320 W
...
12:00      1,800 W
...
18:00      3,200 W
...
23:00      700 W
```

The profile can support:

* Peak demand analysis
* Daily energy calculations
* Battery autonomy modeling
* Inverter sizing
* Generator sizing
* PV self-consumption analysis
* Hybrid-system analysis

The profile module should remain deterministic and should not depend on real-time system telemetry.

---

# Peak Periods

The load module may identify periods where demand is highest.

For example:

```text
Peak period
├── start hour
├── end hour
├── peak power
└── associated loads
```

Peak-period detection should remain descriptive.

The `peak-demand` module is responsible for higher-level design-demand calculations.

---

# Surge Characteristics

Some loads have starting or transient demand significantly above their steady-state rating.

Examples:

```text
Motors
Compressors
Refrigerators
Pumps
Air conditioners
```

A load may therefore define:

```ts
surgeFactor?: number;
```

A conceptual relationship is:

```text
Surge Power
=
Rated Power × Surge Factor
```

Surge information is an input to downstream inverter and generator sizing.

The load module should calculate the load-side surge requirement but should not decide which inverter or generator to purchase.

---

# Validation

Generic validation infrastructure belongs to:

```text
@ogwusearch/engineering-validation
```

The load module applies domain-specific constraints.

Examples:

```text
quantity > 0

ratedPowerW > 0

operatingHoursPerDay >= 0

operatingHoursPerDay <= 24

dutyCycle >= 0

dutyCycle <= 1

powerFactor > 0

powerFactor <= 1

surgeFactor >= 1
```

Validation should collect all relevant errors rather than stop at the first error.

---

# Warnings

Some load conditions may be valid but deserve engineering attention.

Examples:

```text
Load operates for an unusually long period.

Load has a significant starting surge.

Peak demand is close to the design limit.

A large proportion of daily energy occurs during a short period.

Load profile is highly concentrated around the evening peak.
```

Warnings should be structured rather than returned as arbitrary strings.

---

# Assumptions

Load calculations may depend on explicit assumptions.

Examples:

```text
Operating hours = 8 h/day

Duty cycle = 75%

Power factor = 0.90

Diversity factor = 0.80

Motor surge factor = 3.0
```

Assumptions should be visible to callers and may be included in the calculation trace.

They should not be hidden inside formulas.

---

# Units

The load module uses:

```text
@ogwusearch/engineering-units
```

Typical quantities include:

| Quantity         | Unit  |
| ---------------- | ----- |
| Rated power      | W     |
| Operating power  | W     |
| Energy           | Wh    |
| Operating time   | h     |
| Current          | A     |
| Voltage          | V     |
| Power factor     | ratio |
| Diversity factor | ratio |
| Load factor      | ratio |
| Surge factor     | ratio |

The load module should not implement a second unit-conversion system.

---

# Relationship With Other Modules

The load module is upstream of several other solar-engineering modules.

```text
                    LOAD
                      │
          ┌───────────┼───────────┐
          ▼           ▼           ▼
        Energy   Peak Demand   Profiles
          │           │           │
          └──────┬────┴──────┬────┘
                 ▼           ▼
              PV Sizing   Inverter
                 │           │
                 ▼           ▼
              Battery     Generator
```

More specifically:

```text
Load
  │
  ├── daily energy ───────► Energy
  │
  ├── peak demand ────────► Peak Demand
  │
  ├── surge demand ───────► Inverter
  │
  └── load profile ───────► Battery / PV / Generator
```

The load module therefore provides **demand-side inputs** to the rest of the system.

---

# Relationship With Shared Solar Utilities

The module may use:

```text
src/shared/
├── assumptions
├── constants
├── formulas
├── warnings
└── traces
```

For example:

```ts
import {
  calculateEnergyWh,
  createWarning,
  createTrace,
} from "../shared";
```

Generic infrastructure remains in the foundation packages.

---

# Calculation Flow

The load module follows:

```text
Load Definition
      ↓
Domain Validation
      ↓
Load Aggregation
      ↓
Schedule Application
      ↓
Energy / Demand Calculation
      ↓
Warnings
      ↓
Trace
      ↓
Load Result
```

A complete load workflow may therefore produce:

```text
Connected Load
Operating Load
Daily Energy
Peak Demand
Surge Demand
Load Factor
Load Profile
Warnings
Assumptions
Trace
```

---

# Determinism

Load calculations must be deterministic.

For the same input:

```text
same load items
+
same schedules
+
same assumptions
```

the module should produce:

```text
same load result
```

Calculations must not depend on:

* Current time
* Random numbers
* Network state
* Database state
* Browser state
* Hidden mutable state

---

# Pure Functions

Core load mathematics should be expressed as pure functions.

Example:

```ts
const connectedLoadW = calculateConnectedLoadW(loads);
```

Avoid functions that:

* modify external state
* perform database writes
* make HTTP requests
* access UI state
* depend on mutable global configuration

This permits the load engine to run in:

* Web applications
* APIs
* Desktop applications
* Mobile applications
* CLI tools
* Automated reports
* Tests

---

# Testing

The load module should have automated unit tests covering:

## Normal cases

```text
2 × 100 W
+
1 × 500 W

= 700 W connected load
```

## Boundary cases

Examples:

* Zero operating hours
* 24-hour operation
* 100% duty cycle
* 0% duty cycle
* Diversity factor of 1
* Minimum valid quantities

## Invalid cases

Examples:

* Negative quantity
* Negative power
* Operating hours above 24
* Negative duty cycle
* Duty cycle above 1
* Invalid power factor
* Invalid surge factor

## Profile cases

Verify:

* Correct hourly placement
* Multiple schedules
* Overlapping loads
* Peak-period identification
* Daily energy consistency

## Determinism

Repeated execution with identical inputs must produce identical results.

---

# Public API

The module entry point is:

```text
src/load/index.ts
```

The public API should expose only intentional domain contracts and calculations.

A typical public surface may include:

```ts
export type {
  LoadItem,
  LoadInput,
  LoadProfile,
  LoadSchedule,
} from "./types";

export {
  calculateConnectedLoadW,
  calculateOperatingLoadW,
  calculateDiversifiedLoadW,
  calculateDailyEnergyWh,
  calculateLoadFactor,
  calculateDiversityFactor,
} from "./calculations";

export {
  calculateHourlyLoadProfile,
  calculateDailyLoadProfile,
  findPeakLoadPeriod,
} from "./profile";
```

Internal implementation details should remain private to the module.

---

# Design Boundary

The load module **does own**:

```text
Load definition
Load aggregation
Operating schedules
Load profiles
Daily load energy
Diversity calculations
Load factor
Load-side surge calculations
Load-domain validation
```

The load module **does not own**:

```text
PV sizing
Battery sizing
Inverter sizing
Generator sizing
Cable sizing
Unit conversion infrastructure
Generic validation infrastructure
Generic calculation orchestration
UI
Database
Network access
Purchasing workflows
```

Those responsibilities belong to their respective domain or foundation packages.

---

# Example

Given:

```text
Lighting
Quantity           = 10
Rated Power       = 20 W
Operating Hours   = 6 h/day

Refrigerator
Quantity           = 1
Rated Power       = 150 W
Operating Hours   = 24 h/day
Duty Cycle        = 0.40

Water Pump
Quantity           = 1
Rated Power       = 750 W
Operating Hours   = 2 h/day
Surge Factor      = 3
```

Connected load:

```text
(10 × 20)
+
(1 × 150)
+
(1 × 750)

= 1,100 W
```

Approximate daily energy:

```text
Lighting:
10 × 20 × 6
= 1,200 Wh/day

Refrigerator:
150 × 24 × 0.40
= 1,440 Wh/day

Water pump:
750 × 2
= 1,500 Wh/day

Total:
4,140 Wh/day
```

Pump starting demand:

```text
750 × 3
= 2,250 W
```

These values become inputs to downstream calculations rather than being interpreted as equipment-selection decisions by the load module.

---

# Engineering Principle

The load module answers:

> **What electrical demand does the system have, when does that demand occur, and how much energy does it consume?**

It does not answer:

> Which PV array, battery, inverter, generator, or cable should be installed?

Those decisions belong to downstream engineering modules.

---

# Summary

The `load` module is the demand-side foundation of `@ogwusearch/solar-engine`.

It converts:

```text
Load definitions
      +
Operating schedules
      +
Engineering assumptions
```

into:

```text
Connected load
Operating load
Daily energy
Peak-demand inputs
Surge-demand inputs
Load profiles
Load-factor information
Warnings
Traceable results
```

The guiding principle is:

> **`load` describes and calculates electrical demand; downstream modules use that demand to design the renewable-energy system.**
