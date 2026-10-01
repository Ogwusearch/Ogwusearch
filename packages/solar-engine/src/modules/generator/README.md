# Generator

The `generator` module provides deterministic engineering calculations for **standby, backup, and auxiliary electrical generation** within `solar-engine`.

Its purpose is to answer:

> **What generator capacity and configuration are required to support the defined electrical demand?**

The module consumes authoritative engineering demand and system requirements. It does not replace `peak-demand`, inverter sizing, battery sizing, or system validation.

---

# 1. Architecture Position

The Generator module is a downstream domain module within `solar-engine`.

```text
engineering-types
        │
        ├── engineering-units
        ├── engineering-validation
        └── engineering-core
                    │
                    ▼
              solar-engine
                    │
          Engineering Modules
                    │
                    ▼
             Generator
```

The generator module may consume results from:

```text
Peak Demand
Load Analysis
Energy
Inverter
Battery
System Validation
```

depending on the defined generator calculation contract.

The dependency direction remains:

```text
engineering-types
        ↓
engineering-units
engineering-validation
engineering-core
        ↓
solar-engine
```

The foundation packages must not depend on `generator`.

---

# 2. Generator Responsibility

The generator module transforms validated electrical requirements into generator engineering requirements.

Conceptually:

```text
Engineering Demand
        │
        ├── Running / Continuous Demand
        ├── Starting / Surge Demand
        ├── Design Demand
        └── Generator Constraints
                │
                ▼
          Generator Input
                │
                ▼
             Validate
                │
                ▼
        Generator Requirement
                │
                ▼
          Generator Output
```

The module is responsible for determining whether a generator capacity is adequate for the supplied engineering requirement.

---

# 3. Core Questions

The module should answer engineering questions such as:

```text
What generator capacity is required?

What apparent-power rating is required?

What real-power requirement must the generator support?

Is a supplied generator adequately rated?

What reserve or design margin is being applied?

What starting-demand requirement must be considered?

Is the generator compatible with the specified system voltage/frequency?

What assumptions were used?
```

The exact questions supported by the implementation must be defined by the TypeScript contracts.

---

# 4. What Generator Does Not Do

The generator module must not become a general generator procurement or commercial-selection system.

It does not determine:

```text
preferred manufacturer
preferred brand
supplier
purchase source
market price
fuel price
profit margin
commercial quotation
vendor availability
```

Those concerns belong to downstream commercial or application layers.

The module also does not perform unrelated system calculations that already belong to other engineering modules.

---

# 5. Relationship With Peak Demand

`peak-demand` remains the authoritative source for electrical demand calculations.

The generator module must not independently recreate the peak-demand formulas.

The established demand relationships remain:

```text
Individual Demand
    =
Running Power × Demand Factor
```

```text
Normal Coincident Demand
    =
Σ Individual Demand / Diversity Factor
```

```text
Starting Demand
    =
Explicit Starting Power
OR
Running Power × Surge Factor
```

```text
Design Demand
    =
Peak Demand × (1 + Demand Margin)
```

Generator sizing consumes the applicable authoritative result.

It must not silently apply another demand calculation to replace the upstream result.

---

# 6. Generator Sizing Boundary

The architecture is:

```text
Load Analysis
      │
      ▼
Peak Demand
      │
      ▼
Generator Requirement
      │
      ▼
Generator Sizing
      │
      ▼
Generator Verification
```

The generator module may convert between relevant electrical quantities when explicitly required by its contract.

For example:

```text
Real Power Requirement
        │
        ▼
Apparent Power Requirement
        │
        ▼
Generator Rating
```

Such conversions must use explicit assumptions and units.

---

# 7. Real Power and Apparent Power

Generator ratings are commonly expressed in apparent power.

The module may therefore distinguish:

```text
kW
```

from:

```text
kVA
```

where the required input contract supports power factor.

The basic relationship is:

```text
S = P / PF
```

where:

```text
S = apparent power
P = real power
PF = power factor
```

The implementation must not assume an arbitrary power factor unless that assumption is explicitly defined.

If power factor is supplied by the engineering input, that value is authoritative for the calculation.

If a default is used, it must be represented as an explicit assumption.

---

# 8. Starting Demand

Generator sizing must account for starting demand when the supplied engineering contract requires it.

Conceptually:

```text
Continuous Requirement
        │
        ├── normal operating requirement
        │
        ▼
Starting Requirement
        │
        └── transient / starting requirement
```

The generator module must not invent motor starting requirements.

Starting demand should come from:

```text
explicit starting demand
```

or an upstream authoritative demand calculation.

If a generator-specific starting allowance is applied, it must be explicit and traceable.

---

# 9. Generator Capacity

A generator capacity requirement may be represented as:

```text
Required Generator Capacity
```

with an explicit unit such as:

```text
kW
kVA
```

The implementation must clearly distinguish:

```text
required capacity
```

from:

```text
supplied generator rating
```

For example:

```text
Required:
    80 kVA

Available Generator:
    100 kVA
```

The module may determine whether the supplied rating satisfies the requirement.

---

# 10. Generator Rating Verification

When a generator rating is supplied, the module may verify:

```text
rated capacity >= required capacity
```

and, where applicable:

```text
rated real power >= required real power
```

The exact compatibility rules depend on the defined generator contract.

A failed rating check should produce an appropriate `EngineeringIssue` rather than silently increasing or modifying the supplied generator rating.

---

# 11. Design Margin

Generator sizing may support an explicit design margin.

Conceptually:

```text
Required Generator Capacity
    =
Base Generator Requirement
    ×
(1 + Design Margin)
```

However, the generator module must not blindly apply a second design margin when the upstream `designDemand` already includes the project's defined demand margin.

The contract must clearly distinguish:

```text
upstream design demand
```

from:

```text
generator-specific capacity margin
```

Any generator-specific margin must be explicit.

---

# 12. Reserve Capacity

Reserve capacity may be represented separately from design margin where required.

For example:

```text
Base Requirement
        │
        ▼
Generator Design Requirement
        │
        ▼
Available Generator Rating
        │
        ▼
Reserve / Capacity Margin
```

Reserve capacity must not be silently introduced.

If the implementation supports a reserve fraction, it must be represented through an explicit assumption or input.

---

# 13. Voltage Compatibility

Where system voltage is part of the generator contract, the module may verify compatibility between:

```text
required system voltage
```

and:

```text
generator output voltage
```

The generator module should not silently convert an incompatible voltage.

An incompatibility should become an explicit engineering issue.

---

# 14. Frequency Compatibility

Where frequency is specified, the generator may be validated against:

```text
50 Hz
60 Hz
```

or another explicitly supported frequency.

The module must not silently substitute one frequency for another.

Frequency compatibility is a validation concern, not an automatic conversion.

---

# 15. Phase Configuration

If phase configuration is part of the generator contract, the module may distinguish:

```text
single-phase
three-phase
```

or other explicitly supported configurations.

The module must not infer phase configuration from unrelated fields unless the contract explicitly defines that behavior.

---

# 16. Generator Input

The generator input should consume already calculated engineering requirements.

Conceptually:

```text
GeneratorInput
├── demand requirement
├── starting requirement
├── power factor
├── design margin
├── generator rating
├── generator voltage
├── system voltage
├── frequency
└── phase configuration
```

Only fields actually required by the implementation should exist in the final TypeScript contract.

The module should avoid unnecessary optional fields merely for future speculation.

---

# 17. Upstream Engineering Results

Where the repository already has typed results for demand, inverter, battery, or other modules, the Generator module should consume those contracts rather than duplicating them.

For example:

```text
Peak Demand Result
        │
        ▼
Generator Input
```

The Generator module should not reconstruct:

```text
appliance list
demand factors
diversity factors
surge factors
```

when those values have already been resolved by `peak-demand`.

---

# 18. Partial Input

The generator contract may support a standalone generator calculation or a calculation based on upstream engineering results.

However, missing required information must be explicit.

For example:

```text
generator rating provided
system voltage missing
```

must not cause the module to invent a system voltage.

Likewise:

```text
starting demand required
starting demand unavailable
```

must produce an explicit issue if starting demand is required by the selected calculation.

---

# 19. Calculation Boundary

The Generator module owns generator-specific calculations.

It may perform:

```text
generator capacity calculation
apparent-power conversion
capacity margin calculation
generator rating verification
voltage compatibility verification
frequency compatibility verification
phase compatibility verification
```

It must not duplicate:

```text
load analysis
peak demand calculation
PV sizing
battery sizing
inverter sizing
cable sizing
protection sizing
earthing design
```

Those remain responsibilities of their respective modules.

---

# 20. Units

Generator calculations must use explicit engineering units.

Typical quantities include:

```text
W
kW
VA
kVA
V
A
Hz
%
```

The implementation should use the repository's engineering units foundation where unit-aware behavior is required.

No silent unit conversion is permitted.

For example:

```text
100 kVA
```

must not be interpreted as:

```text
100 VA
```

without an explicit unit conversion.

---

# 21. Validation

Generator validation must use the shared:

```ts
EngineeringIssue
```

contract.

The module must not create a separate generator-specific error framework.

Validation should cover applicable conditions such as:

```text
input exists

required demand is finite

required demand is non-negative

starting demand is finite

starting demand is non-negative

power factor is valid

design margin is valid

generator rating is finite

generator rating is positive where required

voltage is valid

frequency is valid

phase configuration is valid

required upstream references are present

equipment rating satisfies required capacity
```

Only validations applicable to the final contract should be implemented.

---

# 22. Power Factor Validation

If power factor is supplied, it should normally satisfy:

```text
0 < PF <= 1
```

A value outside the supported range should produce an engineering validation issue.

The module must not silently clamp:

```text
1.2 → 1.0
```

or:

```text
-0.5 → 0
```

because that would hide invalid engineering input.

---

# 23. Margin Validation

Design or reserve margins must be explicitly defined.

The module must reject invalid values rather than silently correcting them.

For example:

```text
negative margin
non-finite margin
```

must not be silently converted to zero.

The exact allowable range belongs to the generator constants and validation contract.

---

# 24. Warnings

Warnings represent conditions that do not necessarily invalidate the calculation but require engineering attention.

Possible generator warnings include:

```text
GENERATOR_CAPACITY_MARGIN_LOW
GENERATOR_UTILIZATION_HIGH
GENERATOR_POWER_FACTOR_LOW
GENERATOR_STARTING_CAPACITY_LOW
GENERATOR_VOLTAGE_MISMATCH
GENERATOR_FREQUENCY_MISMATCH
GENERATOR_PHASE_MISMATCH
```

Only warning codes actually implemented by the module should be exported.

Warnings must not be used as a substitute for genuine validation errors.

---

# 25. Errors vs Warnings

The distinction should remain explicit.

### Error

The calculation cannot be considered valid.

Examples:

```text
required demand is negative

power factor is invalid

generator rating is missing when required

required generator capacity cannot be determined

voltage compatibility is explicitly required but invalid
```

### Warning

The calculation is valid but requires attention.

Examples:

```text
low reserve margin

high generator utilization

generator operating near its rated capacity
```

The final `CalculationResult` status should be determined by `engineering-core`.

---

# 26. Assumptions

Generator-specific assumptions should use:

```ts
EngineeringAssumption
```

Possible assumptions may include:

```text
GENERATOR_DEFAULT_POWER_FACTOR
GENERATOR_DEFAULT_DESIGN_MARGIN
GENERATOR_DEFAULT_RESERVE_FRACTION
GENERATOR_REFERENCE_FREQUENCY
GENERATOR_CAPACITY_METHOD
```

These names are conceptual until the actual constants and contracts are implemented.

An assumption should only exist if the calculation actually uses it.

---

# 27. No Hidden Generator Assumptions

The module must not silently assume:

```text
power factor
reserve percentage
generator efficiency
fuel consumption
starting capability
voltage
frequency
phase configuration
```

when those values materially affect the engineering result.

If a default is required, it must be:

```text
explicit
documented
traceable
deterministic
```

---

# 28. Generator Efficiency

Generator efficiency should not be introduced into capacity calculations unless the calculation explicitly requires it.

Electrical generator rating and fuel/thermal efficiency are different engineering concerns.

The generator module should therefore avoid mixing:

```text
electrical capacity
```

with:

```text
fuel consumption
thermal efficiency
engine heat rate
```

unless a future contract explicitly adds those calculations.

---

# 29. Fuel Consumption Boundary

Fuel consumption is outside the initial generator electrical-sizing boundary.

The current module should not silently calculate:

```text
litres/hour
litres/day
fuel cost
runtime fuel requirement
fuel reserve
```

unless those capabilities are explicitly added to the generator contract.

This keeps the initial module focused on deterministic electrical engineering.

---

# 30. Generator Runtime

Runtime may be relevant to system design but should not be inferred without explicit inputs.

For example:

```text
generator capacity
```

does not by itself determine:

```text
runtime
```

Runtime requires additional information such as:

```text
fuel capacity
fuel consumption
operating load
```

Those belong to a future explicit contract.

---

# 31. Hybrid Solar System Relationship

In a hybrid system, the generator may operate alongside:

```text
PV
Battery
Inverter
Grid
```

The Generator module should consume explicitly defined system requirements.

It should not independently implement the complete hybrid dispatch strategy.

Conceptually:

```text
PV ───────────────┐
                  │
Battery ──────────┤
                  ├── System
Generator ────────┤
                  │
Grid ─────────────┘
```

Generator dispatch optimization belongs outside the initial generator-sizing calculation unless explicitly defined.

---

# 32. Inverter Relationship

The Generator module may consume inverter requirements when generator compatibility with an inverter-based system must be checked.

For example:

```text
Generator
    │
    ▼
AC Source Requirement
    │
    ▼
Inverter / System Compatibility
```

However, generator sizing must not duplicate inverter sizing.

The inverter module remains responsible for inverter-specific requirements.

---

# 33. Battery Relationship

A battery may reduce the generator's instantaneous load requirement depending on system architecture.

The Generator module must not assume this behavior automatically.

If battery contribution affects generator sizing, that contribution must be represented by an explicit upstream engineering result or explicit generator input.

No hidden battery-dispatch assumption is permitted.

---

# 34. System Validation Relationship

`system-validation` remains responsible for cross-module system compatibility.

The Generator module is responsible for generator-specific calculations and validation.

For example:

```text
generator
    │
    └── Is generator rating sufficient?

system-validation
    │
    └── Is the generator compatible with
        the complete system configuration?
```

This separation prevents cross-module validation rules from being duplicated.

---

# 35. Traceability

Every meaningful generator calculation should be traceable.

A conceptual trace may contain:

```text
1. Read design demand
2. Read starting demand
3. Apply generator-specific requirement
4. Convert kW to kVA where applicable
5. Apply explicit generator margin
6. Determine required generator capacity
7. Compare supplied generator rating
8. Determine capacity margin
9. Produce generator result
```

The trace must describe what the implementation actually performed.

---

# 36. Calculation Trace

The Generator module should use the foundation:

```ts
CalculationTraceStep
```

Trace information may contain:

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

The module must not invent trace steps for calculations that did not occur.

---

# 37. Determinism

Generator calculations must be deterministic.

Given identical:

```text
inputs
engineering results
assumptions
constants
```

the module must produce identical results.

The calculation must not depend on:

```text
current time
random values
network state
database state
UI state
environment state
```

unless those are explicitly part of a future contract.

---

# 38. Immutability

Generator inputs and upstream engineering results must be treated as immutable.

The module must not mutate:

```text
peak-demand results
inverter results
battery results
system-validation inputs
```

Instead, it should create its own generator output.

---

# 39. Precision

The module must preserve numerical precision throughout calculations.

For example, calculations should not unnecessarily round:

```text
required kVA
capacity margin
power factor conversion
```

intermediate values.

Formatting and presentation rounding belongs to reporting or presentation layers unless an explicit engineering rule requires rounding.

---

# 40. Result Contract

The generator calculation should return the repository-standard:

```ts
CalculationResult<GeneratorOutput>
```

rather than creating a generator-specific result wrapper.

Conceptually:

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

The domain output should contain generator-specific engineering information only.

For example:

```text
GeneratorOutput
├── requiredCapacity
├── requiredRealPower
├── requiredApparentPower
├── suppliedRating
├── capacityMargin
└── compatibility
```

The exact fields belong to the final TypeScript contract.

---

# 41. Public Runner

The module should expose a runner conceptually equivalent to:

```ts
runGenerator(input)
```

returning:

```ts
CalculationResult<GeneratorOutput>
```

The runner should use the repository's `engineering-core` lifecycle where appropriate:

```text
defineCalculation
        │
        ▼
executeCalculation
```

The generator domain should provide:

```text
validation
assumptions
calculation
warnings
trace
```

while `engineering-core` owns result lifecycle construction.

---

# 42. No Manual Result Construction

The generator module should not create an independent result lifecycle such as:

```ts
{
  valid: true,
  output: ...,
  errors: ...
}
```

when that conflicts with the established:

```ts
CalculationResult<TOutput>
```

contract.

The domain calculation should return its domain output.

`engineering-core` should construct the final calculation result.

---

# 43. Testing

The Generator module should follow the established test structure.

```text
__tests__/
├── calculation.test.ts
├── validation.test.ts
└── regression.test.ts
```

### Calculation Tests

Tests should cover:

```text
valid generator sizing

real-power requirement

apparent-power requirement

power-factor conversion

starting-demand requirement

design-margin behavior

capacity-margin calculation

generator rating verification

deterministic output

trace generation
```

### Validation Tests

Tests should cover:

```text
missing input

invalid demand

negative demand

invalid power factor

invalid margin

invalid generator rating

invalid voltage

invalid frequency

invalid phase configuration

missing required engineering result
```

### Regression Tests

Regression tests should protect:

```text
established generator formulas

capacity behavior

power-factor behavior

margin behavior

compatibility behavior

warning behavior

error behavior

trace behavior

precision
```

---

# 44. Example

Consider an engineering requirement of:

```text
Required real power = 80 kW
Power factor = 0.80
```

The apparent-power requirement is:

```text
S = P / PF

S = 80 / 0.80

S = 100 kVA
```

If an explicit generator design margin of 10% is applied:

```text
Required generator capacity
=
100 × 1.10

=
110 kVA
```

A supplied:

```text
125 kVA
```

generator can then be evaluated against:

```text
Required capacity = 110 kVA
Available capacity = 125 kVA
```

The Generator module should report the engineering relationship and trace rather than making a commercial recommendation about which generator to purchase.

---

# 45. Engineering Boundary

The complete architecture should remain:

```text
Load
 │
 ▼
Peak Demand
 │
 ├──────────────► Inverter
 │
 ├──────────────► Battery
 │
 └──────────────► Generator
                         │
                         ▼
                 Generator Requirement
                         │
                         ▼
                  System Validation
                         │
                         ▼
                       BOM
                         │
                         ▼
                     Costing
                         │
                         ▼
                      Reports
```

Each module remains responsible for its own engineering domain.

---

# 46. Target Structure

The Generator module should follow the established solar-engine module organization.

```text
generator/
├── README.md
├── constants.ts
├── index.ts
├── run.ts
├── warnings.ts
│
├── assumptions/
│   ├── generator-assumptions.ts
│   └── index.ts
│
├── calculation/
│   ├── calculate-generator.ts
│   ├── calculate-generator-capacity.ts
│   ├── calculate-apparent-power.ts
│   ├── calculate-capacity-margin.ts
│   └── index.ts
│
├── trace/
│   ├── generator-trace.ts
│   └── index.ts
│
├── types/
│   ├── generator-input.ts
│   ├── generator-output.ts
│   └── index.ts
│
├── validation/
│   ├── rules.ts
│   ├── validate-generator.ts
│   └── index.ts
│
└── __tests__/
    ├── calculation.test.ts
    ├── validation.test.ts
    └── regression.test.ts
```

The exact calculation files may be adjusted after the final TypeScript contract is established.

No implementation should be created merely because a file appears in this conceptual structure.

---

# 47. Implementation Order

The Generator module should be implemented one file at a time:

```text
01 README.md
02 types/generator-input.ts
03 types/generator-output.ts
04 types/index.ts
05 constants.ts
06 assumptions/generator-assumptions.ts
07 assumptions/index.ts
08 validation/rules.ts
09 validation/validate-generator.ts
10 validation/index.ts
11 calculation/calculate-apparent-power.ts
12 calculation/calculate-generator-capacity.ts
13 calculation/calculate-capacity-margin.ts
14 calculation/calculate-generator.ts
15 calculation/index.ts
16 trace/generator-trace.ts
17 trace/index.ts
18 warnings.ts
19 run.ts
20 index.ts
21 __tests__/calculation.test.ts
22 __tests__/validation.test.ts
23 __tests__/regression.test.ts
```

Each subsequent file must be implemented against the contracts established by the preceding files.

---

# 48. Design Principles

The Generator module follows these principles:

1. **Peak-demand results remain authoritative.**
2. **Generator does not duplicate upstream demand calculations.**
3. **Generator-specific calculations remain inside the generator domain.**
4. **Real power and apparent power remain explicitly distinguished.**
5. **Power factor must be explicit when required.**
6. **Starting demand must be explicit or sourced from an authoritative result.**
7. **Margins must never be silently introduced.**
8. **Reserve capacity must never be silently introduced.**
9. **Units must remain explicit.**
10. **No silent unit conversion.**
11. **No silent rounding.**
12. **No silent clamping.**
13. **Invalid engineering values become explicit issues.**
14. **Warnings remain distinct from errors.**
15. **Assumptions use `EngineeringAssumption`.**
16. **Validation uses `EngineeringIssue`.**
17. **Traceability uses `CalculationTraceStep`.**
18. **Results use `CalculationResult<T>`.**
19. **Inputs and upstream results remain immutable.**
20. **Calculations are deterministic.**
21. **Fuel and commercial calculations remain outside the initial electrical-sizing boundary.**
22. **System-wide compatibility remains the responsibility of `system-validation`.**
23. **BOM, costing, and reports remain separate downstream concerns.**
24. **No UI, database, or network dependencies.**
25. **The implementation must preserve the established `solar-engine` architecture.**

---

# 49. Summary

The Generator module is the electrical-generation engineering boundary of `solar-engine`.

```text
Authoritative Demand
        │
        ▼
Generator Input
        │
        ▼
      Validate
        │
        ▼
Generator Requirement
        │
        ├── Real Power
        ├── Apparent Power
        ├── Starting Requirement
        ├── Capacity
        ├── Margin
        └── Compatibility
        │
        ▼
Generator Output
        │
        ▼
System Validation
        │
        ▼
BOM / Costing / Reports
```

The fundamental separation is:

```text
Peak Demand
    ↓
What electrical demand must be supported?

Generator
    ↓
What generation capacity is required to support
that defined demand?

System Validation
    ↓
Is the generator compatible with the complete system?

BOM
    ↓
What physical generator equipment is represented?

Costing
    ↓
What does the equipment cost?

Reports
    ↓
How should the engineering result be presented?
```

The Generator module therefore remains a **deterministic, traceable, unit-aware electrical generation sizing and verification engine**, while preserving the responsibility boundaries of the rest of `solar-engine`.
