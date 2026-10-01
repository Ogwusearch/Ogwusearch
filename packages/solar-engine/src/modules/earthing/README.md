# Earthing

## Module Purpose

The Earthing module determines the engineering requirements for grounding, protective bonding, and earth-resistance calculations from explicit electrical inputs and installation/design assumptions.

The module provides deterministic calculations for:

```text
Electrical / Installation Requirement
              ↓
        Earthing Input
              ↓
          Validation
              ↓
       Earthing Calculations
        ↙      ↓       ↘
 Earth Conductor  Bonding  Earth Resistance
        ↘      ↓       ↙
          Earthing Output
```

The module provides engineering calculations and validation contracts.

It does not select commercial products, perform procurement, or replace project-specific standards review.

---

## Responsibilities

The Earthing module owns:

* earthing inputs
* protective earth-conductor sizing
* bonding-conductor sizing
* earth-resistance calculation
* grounding electrode calculation where explicitly supported
* conductor material/resistivity assumptions
* electrode and installation assumptions used by the calculation
* explicit design factors
* structured validation
* engineering assumptions
* calculation trace
* deterministic output
* grounding and bonding compatibility checks where explicitly represented

The module must make each calculation path explicit.

---

## Does Not Own

Earthing must not own:

* Load Audit
* Energy Analysis
* Peak Demand
* PV sizing
* PV array sizing
* PV string sizing
* Battery sizing
* Inverter sizing
* Charge-controller sizing
* Cable sizing
* voltage-drop analysis
* overcurrent protection
* breaker sizing
* fuse sizing
* BOM generation
* costing
* commercial product selection
* supplier/vendor selection
* UI
* database
* API transport
* network access

Earthing may consume electrical and conductor information from other modules through explicit data contracts.

It must not import their internal implementation merely to obtain values.

---

## Position in the Solar Engine

The intended relationship is:

```text
Electrical Requirements
        ↓
Cable Sizing
        ↓
Protection
        ↓
Earthing
```

Other engineering modules may provide information required by Earthing:

```text
Cable
  ↓
conductor characteristics
  ↓
Earthing

Protection
  ↓
fault/protection requirements
  ↓
Earthing

System / Equipment
  ↓
equipment bonding requirements
  ↓
Earthing
```

The exact execution order may vary by project.

Dependencies must remain acyclic and must be expressed through data contracts.

---

## Earthing Scope

The module contains three distinct engineering calculations:

```text
Earth Conductor
        ↓
Protective conductor requirement

Bonding Conductor
        ↓
Bonding conductor requirement

Earth Resistance
        ↓
Grounding electrode / earth-system resistance
```

The calculation type must be explicit.

Conceptually:

```text
Earthing Calculation Type

├── EARTH_CONDUCTOR
├── BONDING_CONDUCTOR
└── EARTH_RESISTANCE
```

No calculation behavior should be hidden behind unrelated optional fields.

---

# Earth Conductor Sizing

## Purpose

Earth-conductor sizing determines the required protective earth-conductor capacity or cross-sectional area according to an explicit engineering rule.

The calculation should consume only the electrical conditions actually required by the selected sizing method.

Conceptually:

```text
Fault / Protective Requirement
          ↓
Earth-Conductor Input
          ↓
Validation
          ↓
Required Earth-Conductor Capacity
          ↓
Required Conductor Area
          ↓
Selected Conductor
```

The calculation must not silently reuse Cable Sizing's conductor-selection logic unless the data contract explicitly requires it.

---

## Bonding Conductor Sizing

Bonding conductor sizing determines the required conductor characteristics for bonding exposed conductive parts or specified system components.

Conceptually:

```text
Bonding Requirement
        ↓
Bonding Input
        ↓
Validation
        ↓
Required Bonding Capacity
        ↓
Required Bonding Area
        ↓
Selected Bonding Conductor
```

The module must distinguish bonding conductors from ordinary circuit conductors.

---

# Earth Resistance

## Purpose

Earth-resistance calculation determines the resistance represented by the explicit grounding configuration supplied to the module.

Potential inputs may include:

```text
electrode type
electrode length
electrode diameter
number of electrodes
electrode spacing
soil resistivity
installation geometry
```

Only quantities consumed by the implemented calculation should exist in `EarthingInput`.

The module must not infer soil properties or grounding geometry.

---

## Earth-Resistance Calculation Boundary

Earth Resistance is a calculation owned by Earthing.

It must not be implemented in:

```text
Cable
Protection
Voltage Drop
```

The Earthing module may later support multiple electrode models, but every model must have an explicit calculation contract.

The selected model must be deterministic and traceable.

---

## Input Contract

The module must define an explicit:

```ts
EarthingInput
```

The input must identify the selected calculation path rather than accepting an arbitrary collection of unrelated optional fields.

Conceptually:

```text
EarthingInput

├── calculation type
│
├── electrical
│   ├── system voltage where applicable
│   ├── fault current where applicable
│   └── clearing time where applicable
│
├── conductor
│   ├── material
│   ├── resistivity where applicable
│   ├── conductor area where applicable
│   └── conductor count where applicable
│
├── bonding
│   ├── bonding requirement where applicable
│   └── connected equipment information where applicable
│
├── electrode
│   ├── electrode type
│   ├── length
│   ├── diameter where applicable
│   ├── quantity
│   └── spacing where applicable
│
└── soil
    └── soil resistivity where required
```

Not every field is required for every calculation type.

The contract must make applicability explicit.

---

## Calculation Type

The calculation type must be explicit:

```text
EARTH_CONDUCTOR
BONDING_CONDUCTOR
EARTH_RESISTANCE
```

No hidden calculation-mode inference is permitted.

---

## Electrical Inputs

Electrical quantities should be supplied only where required by the selected engineering method.

Potential quantities include:

```text
system voltage
fault current
fault-clearing time
```

Units:

```text
Voltage       V
Current       A
Time          s
```

No electrical quantity should be silently derived from an unrelated module.

---

## Conductor Inputs

Where conductor sizing is required:

```text
conductor material
conductor resistivity
conductor area
conductor count
```

must be explicit as applicable.

Resistivity unit:

```text
Ω·mm²/m
```

No conductor material may be silently selected.

---

## Electrode Inputs

Where Earth Resistance is calculated, the grounding-electrode model must explicitly identify applicable inputs.

Potential quantities include:

```text
electrode type
electrode length
electrode diameter
electrode quantity
electrode spacing
```

Length unit:

```text
m
```

Diameter unit:

```text
mm
```

The module must not infer electrode dimensions.

---

## Soil Inputs

Where required by the selected earth-resistance calculation:

```text
soil resistivity
```

must be explicit.

Unit:

```text
Ω·m
```

No soil-resistivity value may be obtained implicitly from:

* a database
* network access
* geographic inference
* vendor data

---

# Output Contract

The module should expose an explicit:

```ts
EarthingOutput
```

Conceptually:

```text
EarthingOutput

├── calculation type
├── required earth-conductor area where applicable
├── selected earth-conductor area where applicable
├── required bonding-conductor area where applicable
├── selected bonding-conductor area where applicable
├── conductor material where applicable
├── conductor count where applicable
├── calculated earth resistance where applicable
├── target earth resistance where supplied
├── resistance compatibility where applicable
└── engineering compatibility results
```

The output must distinguish:

```text
required value
```

from:

```text
selected value
```

where discrete conductor or electrode selection exists.

---

# Units

| Quantity              | Unit    |
| --------------------- | ------- |
| Voltage               | V       |
| Current               | A       |
| Time                  | s       |
| Length                | m       |
| Electrode diameter    | mm      |
| Conductor area        | mm²     |
| Conductor resistivity | Ω·mm²/m |
| Soil resistivity      | Ω·m     |
| Resistance            | Ω       |
| Conductor count       | integer |
| Electrode count       | integer |
| Design factor         | ratio   |

No silent unit conversion is permitted.

The module must use the foundation unit system when conversion is required.

It must not implement its own private unit-conversion system.

---

# Validation

Validation must use the foundation:

```ts
EngineeringIssue
```

Applicable checks include:

```text
valid calculation type

voltage > 0 where required

current > 0 where required

fault-clearing time > 0 where required

conductor area > 0 where required

conductor count >= 1

conductor resistivity > 0 where required

electrode length > 0 where required

electrode diameter > 0 where required

electrode count >= 1

electrode spacing > 0 where required

soil resistivity > 0 where required
```

The exact required fields depend on the calculation type.

---

## Relationship Validation

Where relationships are represented in the contract, they must be checked explicitly.

Examples:

```text
selected conductor area >= required conductor area

conductor count >= 1

electrode count >= 1

electrode spacing > 0

selected earth resistance <= explicit target resistance
```

The actual applicability of each relationship must follow the selected calculation contract.

Validation must:

* execute before calculation
* collect applicable issues
* preserve field paths
* preserve error codes
* distinguish errors from warnings
* never mutate input
* remain deterministic

---

# Assumptions

Use:

```ts
EngineeringAssumption
```

Potential assumption codes include:

```text
EARTHING_CONDUCTOR_MATERIAL
EARTHING_CONDUCTOR_RESISTIVITY
EARTHING_INSTALLATION_METHOD
EARTHING_ELECTRODE_TYPE
EARTHING_SOIL_RESISTIVITY
EARTHING_DESIGN_FACTOR
EARTHING_TARGET_RESISTANCE
```

Only assumptions actually consumed by the selected calculation may appear in the result.

For example, if soil resistivity is supplied directly by the input, the calculation must not also return an undocumented soil-resistivity assumption.

No hidden:

* material selection
* soil value
* electrode geometry
* safety factor
* correction factor
* derating
* standards factor

may be consumed.

---

# Calculation Flow

The common lifecycle is:

```text
Input
  ↓
Validate
  ↓
Identify Calculation Type
  ↓
Determine Required Electrical / Physical Values
  ↓
Calculate Engineering Requirement
  ↓
Determine Selected Value where applicable
  ↓
Evaluate Compatibility
  ↓
Output
```

### Earth Conductor

```text
Electrical Requirement
       ↓
Required Protective Conductor
       ↓
Required Area
       ↓
Selected Conductor
```

### Bonding Conductor

```text
Bonding Requirement
       ↓
Required Bonding Conductor
       ↓
Required Area
       ↓
Selected Conductor
```

### Earth Resistance

```text
Soil / Electrode Inputs
       ↓
Earth-Resistance Formula
       ↓
Calculated Resistance
       ↓
Target Comparison where applicable
```

The selected calculation formula must be documented in the implementation and represented in the trace.

---

# Earth-Conductor Sizing

The implementation must choose one explicit engineering basis.

Potential methods may include:

```text
thermal / fault-current method
explicit standard-based sizing relationship
explicit minimum-area rule
```

The selected basis must not be hidden.

If a fault-current/time relationship is implemented, all required electrical inputs must be explicit.

The module must not invent fault conditions.

---

# Bonding-Conductor Sizing

Bonding-conductor sizing must similarly use an explicit engineering basis.

The calculation must identify:

```text
bonding requirement
applicable source conductor or fault condition
design basis
required bonding area
```

No implicit conductor-size relationship should be used.

---

# Earth-Resistance Calculation

The earth-resistance calculation must identify the applicable electrode model.

The implementation may support one or more explicit models.

For example:

```text
single electrode
multiple electrodes
other explicitly defined electrode geometry
```

Each model must have:

```text
explicit inputs
explicit formula
explicit assumptions
explicit trace
deterministic result
```

No geographic or network-based lookup is permitted.

---

# Target Resistance

When a target earth resistance is supplied:

```text
calculated resistance
        ↓
compare against target
        ↓
resistanceCompatible
```

Conceptually:

```text
Calculated Resistance <= Target Resistance
```

The comparison must be explicit.

The module must not silently choose its own target.

---

# Conductor Selection

Where discrete conductor sizes are supplied, selection must be deterministic.

Conceptually:

```text
Required Conductor Area
        ↓
Available Conductor Options
        ↓
Smallest Option
that satisfies requirement
        ↓
Selected Conductor Area
```

The available options must be explicit.

The module must not use an implicit commercial catalog or vendor lookup.

---

# Electrode Selection

If discrete electrode configurations are introduced, selection must also be deterministic.

The module must distinguish:

```text
calculated required configuration
```

from:

```text
selected configuration
```

No automatic commercial-product selection is permitted.

---

# Trace

Use the foundation:

```ts
CalculationTraceStep
```

The trace must expose the actual engineering sequence.

Conceptually:

```text
Input Conditions
       ↓
Calculation Type
       ↓
Engineering Formula
       ↓
Required Value
       ↓
Selected Value
       ↓
Compatibility Check
```

For Earth Resistance:

```text
Soil Resistivity
       ↓
Electrode Geometry
       ↓
Earth Resistance
       ↓
Target Comparison
```

Trace steps should contain, where applicable:

```text
step ID
name
description
formula
inputs
outputs
unit
sequence
```

The trace must be:

* deterministic
* reproducible
* ordered
* explicit
* limited to consumed values

---

# Determinism

The module must guarantee:

* immutable inputs
* deterministic calculations
* deterministic output
* stable ordering
* explicit assumptions
* reproducible trace
* no global mutable state
* no database access
* no network access
* no UI dependency
* no silent clamping
* no silent rounding
* no silent unit conversion
* no hidden derating
* no hidden safety factor
* no hidden environmental assumptions

The same valid input and explicit assumptions must produce the same result.

---

# Relationship with Cable

Cable determines conductor requirements for circuit conductors.

Earthing determines protective earth and bonding requirements.

```text
Cable
  ↓
Circuit Conductor
  ↓
Earthing
  ↓
Protective / Bonding Conductor
```

Earthing must not reuse Cable's internal implementation.

The modules communicate through explicit data contracts.

---

# Relationship with Protection

Protection evaluates fault and overcurrent protection.

Earthing evaluates grounding and bonding.

```text
Protection
    ↓
Overcurrent / Fault Protection

Earthing
    ↓
Grounding / Bonding / Earth Resistance
```

Where a future earthing calculation needs protection-related information, it must consume that information through an explicit contract.

Earthing must not implement breaker or fuse calculations.

---

# Relationship with Voltage Drop

Voltage Drop is separate from Earthing.

```text
Cable
  ↓
Voltage Drop
  ↓
Voltage-Loss Verification
```

Earthing must not calculate circuit voltage drop.

---

# Relationship with Foundation Packages

The preferred dependency direction remains:

```text
engineering-types
       ↑
       ├──────── engineering-units
       │
       └──────── engineering-validation
                         ↑
                         │
                  engineering-core
                         ↑
                         │
                    solar-engine
                         ↑
                         │
                     earthing
```

Earthing may consume:

```text
@ogwusearch/engineering-types
@ogwusearch/engineering-units
@ogwusearch/engineering-validation
@ogwusearch/engineering-core
```

as required.

It must not implement private replacements for:

* EngineeringIssue
* EngineeringError
* EngineeringWarning
* EngineeringAssumption
* CalculationTraceStep
* CalculationResult
* generic validation
* generic unit conversion
* calculation lifecycle

---

# Target Structure

```text
earthing/

├── README.md                         ← CURRENT TASK
├── constants.ts
├── index.ts
├── run.ts
│
├── assumptions/
│   ├── earthing-assumptions.ts
│   └── index.ts
│
├── calculation/
│   ├── calculate-earth-conductor.ts
│   ├── calculate-bonding-conductor.ts
│   ├── calculate-earth-resistance.ts
│   └── index.ts
│
├── trace/
│   ├── earthing-trace.ts
│   └── index.ts
│
├── types/
│   ├── earthing-input.ts
│   ├── earthing-output.ts
│   └── index.ts
│
├── validation/
│   ├── rules.ts
│   ├── validate-earthing.ts
│   └── index.ts
│
└── __tests__/
    ├── calculation.test.ts
    ├── validation.test.ts
    └── regression.test.ts
```

No `calculate-voltage-drop.ts` belongs in Earthing.

No Cable or Protection implementation file belongs in Earthing.

---

# Public API

The eventual public API should expose only the Earthing contract:

```text
EarthingInput
EarthingOutput
EarthingResult
validateEarthing
calculateEarthConductor
calculateBondingConductor
calculateEarthResistance
createEarthingAssumptions
createEarthingTrace
runEarthingSizing
```

Internal helpers should remain internal.

The public API should not expose:

* private validation rules
* private calculation intermediates
* private trace adapters
* vendor catalogs
* database clients
* network clients
* UI types

---

# Tests

The intended test structure is:

```text
__tests__/

├── calculation.test.ts
├── validation.test.ts
└── regression.test.ts
```

## Calculation Tests

Tests should cover:

* valid earth-conductor sizing
* valid bonding-conductor sizing
* valid earth-resistance calculation
* boundary values
* conductor selection
* electrode configuration
* target-resistance comparison
* deterministic results

## Validation Tests

Tests should cover:

* invalid calculation type
* invalid current
* invalid voltage
* invalid fault current
* invalid time
* invalid conductor area
* invalid conductor count
* invalid resistivity
* invalid soil resistivity
* invalid electrode dimensions
* invalid electrode count
* invalid electrode spacing
* invalid relationships
* input immutability

## Regression Tests

Tests should cover:

* core calculation lifecycle
* assumptions
* calculation trace
* validation blocking
* deterministic result
* established historical calculations
* compatibility results

---

# Implementation Order

```text
01 README.md                         ← CURRENT TASK

02 types/earthing-input.ts
03 types/earthing-output.ts
04 types/index.ts

05 constants.ts

06 assumptions/earthing-assumptions.ts
07 assumptions/index.ts

08 validation/rules.ts
09 validation/validate-earthing.ts
10 validation/index.ts

11 calculation/calculate-earth-conductor.ts
12 calculation/calculate-bonding-conductor.ts
13 calculation/calculate-earth-resistance.ts
14 calculation/index.ts

15 trace/earthing-trace.ts
16 trace/index.ts

17 run.ts
18 index.ts

19 __tests__/calculation.test.ts
20 __tests__/validation.test.ts
21 __tests__/regression.test.ts
```

---

# Definition of Done

```text
[ ] README contract is stable
[ ] EarthingInput is explicit
[ ] EarthingOutput is explicit
[ ] calculation type is explicit
[ ] earth-conductor sizing is deterministic
[ ] bonding-conductor sizing is deterministic
[ ] earth-resistance calculation is deterministic
[ ] conductor selection is deterministic
[ ] electrode configuration is explicit
[ ] target resistance is explicit where used
[ ] assumptions are explicit
[ ] validation uses EngineeringIssue
[ ] trace uses CalculationTraceStep
[ ] input is immutable
[ ] no silent unit conversion
[ ] no hidden derating
[ ] no hidden safety factor
[ ] no hidden soil assumptions
[ ] Cable remains a separate module
[ ] Protection remains a separate module
[ ] Voltage Drop remains a separate module
[ ] public API is intentionally limited
[ ] calculation tests pass
[ ] validation tests pass
[ ] regression tests pass
[ ] typecheck passes
```

---

# Architectural Principle

Earthing answers:

```text
What grounding, bonding, protective
conductor, and earth-resistance
requirements does this system have?
```

Cable answers:

```text
What circuit conductor capacity
and size does the electrical load require?
```

Protection answers:

```text
What protective-device requirement
does the electrical circuit require?
```

Voltage Drop answers:

```text
What voltage loss occurs through
the selected circuit conductor?
```

These are related engineering responsibilities, but they remain separate modules.

The Earthing module should therefore remain:

```text
Deterministic
Unit-aware
Validated
Traceable
Assumption-explicit
Immutable
Independent of applications and infrastructure
```

No implementation should infer engineering values from databases, networks, vendor catalogs, or geographic data.
