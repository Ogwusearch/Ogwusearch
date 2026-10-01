# Cable Sizing

## Module Purpose

The Cable Sizing module determines the required conductor size from electrical load requirements and explicit installation and design assumptions.

```text
Electrical Requirement
        ↓
Cable Input
        ↓
Validation
        ↓
Design Current
        ↓
Required Cable Capacity
        ↓
Cable Size
        ↓
Cable Output
```

Cable Sizing is a domain module within `@ogwusearch/solar-engine`. It consumes shared engineering contracts, units, validation infrastructure, and calculation lifecycle infrastructure from the foundation packages.

It must remain independent of UI, database access, API transport, network access, commercial catalogs, and vendor selection.

---

## Responsibilities

Cable Sizing owns:

* cable sizing inputs
* operating-current calculation where required by the cable contract
* design-current calculation
* required conductor ampacity
* conductor cross-sectional area
* cable configuration
* conductor material and resistivity assumptions
* explicit installation/design assumptions consumed by sizing
* structured validation
* engineering assumptions
* calculation trace
* deterministic output

The module determines the engineering conductor requirement. It does not select a commercial product or vendor.

---

## Does Not Own

Cable Sizing must not own:

* Load Audit
* Energy Analysis
* Peak Demand
* PV sizing
* PV array sizing
* PV string sizing
* Battery sizing
* Inverter sizing
* Charge-controller sizing
* Protection coordination
* Earthing design
* Voltage-drop analysis
* BOM generation
* Costing
* commercial product selection
* supplier/vendor selection
* UI
* database
* API transport
* network access

Related modules communicate through explicit data contracts rather than internal implementation imports.

---

## Position in the Solar Engine

The intended domain relationship is:

```text
Load
  ↓
Energy
  ↓
Peak Demand
  ↓
PV Sizing
  ↓
PV Array / PV String
  ↓
Battery / Inverter / Charge Controller
  ↓
Cable Sizing
  ↓
Voltage Drop
  ↓
Protection / Earthing
```

The exact execution sequence may vary by project configuration. Dependencies must remain acyclic and must be represented through data contracts.

---

## DC and AC Cable Sizing

The module supports both DC and AC conductor sizing through one cable-sizing engine.

The electrical mode must be explicit.

```text
DC Cable Sizing
    ↓
DC Operating Current
    ↓
DC Design Current
    ↓
DC Conductor Requirement

AC Cable Sizing
    ↓
AC Operating Current
    ↓
AC Design Current
    ↓
AC Conductor Requirement
```

The shared calculation pipeline is:

```text
Electrical Mode
      ↓
Operating Current
      ↓
Design Conditions
      ↓
Design Current
      ↓
Required Ampacity
      ↓
Conductor Size
```

Only the mode-specific electrical relationship used to determine operating current should differ.

### DC operating-current relationship

For a DC load represented by power and voltage:

```text
I = P / V
```

### AC operating-current relationship

For AC, the current relationship must be explicit for the selected AC system model.

The module must not silently assume phase configuration.

If a future AC implementation requires phase count, topology, or another electrical configuration, that must be an explicit input.

The module must never infer AC topology from arbitrary fields.

---

## Relationship with Voltage Drop

Cable Sizing and Voltage Drop are separate responsibilities.

```text
Cable Sizing
     │
     └── conductor capacity / required size
                         │
                         ▼
                   Voltage Drop
                         │
                         └── voltage-loss verification
```

Cable Sizing may provide selected conductor characteristics to the dedicated `voltage-drop` module through a data contract.

Typical downstream data may include:

```text
selected conductor area
conductor material
resistivity
conductor count
cable length
```

Voltage Drop remains responsible for:

```text
AC voltage-drop calculation
DC voltage-drop calculation
percentage voltage-drop calculation
voltage-drop compliance assessment
```

### Architectural rule

The Cable module must not implement:

```text
calculation/calculate-voltage-drop.ts
```

when `voltage-drop` exists as a separate Solar Engine module.

Cable Sizing may provide conductor data to Voltage Drop, but Voltage Drop remains an independent module.

---

## Input Contract

The module must define an explicit `CableInput`.

The contract must make the calculation path explicit rather than accepting an unstructured collection of unrelated optional values.

Conceptually:

```text
CableInput
├── electrical
│   ├── mode
│   ├── load power
│   ├── system voltage
│   ├── operating current
│   └── power factor where applicable
│
├── design
│   └── design margin
│
├── conductor
│   ├── material
│   ├── resistivity
│   ├── conductor area where applicable
│   └── conductor count where applicable
│
└── installation
    ├── installation method
    └── other explicit design conditions
```

### Electrical mode

The mode must be explicit:

```text
DC
AC
```

No hidden mode inference is permitted.

### Operating current

The contract may accept operating current directly.

When current is supplied directly, the module must not silently recalculate it from power.

A consistency check may be introduced only if explicitly defined by the contract.

When current is not supplied, the module may derive it from the applicable electrical relationship.

The selected calculation path must be traceable.

### Power

Power is required only when the selected current-calculation path derives current from power.

Unit:

```text
W
```

### Voltage

System voltage is required whenever the selected calculation requires it.

Unit:

```text
V
```

### Power factor

Power factor applies where required by the AC current calculation.

Range:

```text
0 < power factor <= 1
```

Power factor must not be silently consumed by DC calculations.

### Cable length

Cable length may be carried as cable data when required by the contract.

Unit:

```text
m
```

Cable length must not silently activate Voltage Drop calculations.

### Design margin

Design margin is explicit.

Range:

```text
0 <= design margin <= 1
```

No hidden safety factor or derating factor is permitted.

### Conductor material

Conductor material is explicit whenever material-dependent conductor characteristics are consumed.

Examples:

```text
copper
aluminium
```

The implementation must not silently select a material.

### Resistivity

Resistivity must either be supplied explicitly by the input contract or supplied through an explicit engineering assumption.

It must never be fetched implicitly from:

* a database
* a network
* a vendor catalog

Unit:

```text
Ω·mm²/m
```

### Installation assumptions

Installation conditions that affect sizing must be explicit.

Examples:

```text
installation method
ambient/design condition
allowable ampacity basis
```

If an installation condition is not part of the implemented calculation, it must not appear as a consumed hidden assumption.

---

## Output Contract

The module should expose a `CableOutput` containing explicit engineering results.

Conceptually:

```text
CableOutput
├── operating current
├── design current
├── required ampacity
├── selected conductor area
├── conductor material
├── conductor resistivity where consumed
├── conductor count
├── cable length
├── electrical mode
└── sizing metadata required by downstream engineering modules
```

The output must distinguish:

```text
required conductor area
```

from:

```text
selected conductor area
```

Required area is the calculated engineering requirement.

Selected area is the deterministic size selected according to an explicit sizing rule.

If a nominal/catalog size is introduced later, it must come from an explicit input table, deterministic dependency, or documented engineering standard.

It must not come from an implicit vendor lookup.

---

## Units

| Quantity        | Unit    |
| --------------- | ------- |
| Power           | W       |
| Voltage         | V       |
| Current         | A       |
| Length          | m       |
| Conductor area  | mm²     |
| Resistivity     | Ω·mm²/m |
| Resistance      | Ω       |
| Power factor    | ratio   |
| Design margin   | ratio   |
| Conductor count | integer |

No silent unit conversion is permitted.

The module must not implement its own private unit-conversion system.

Where conversion is required, it must use the foundation unit system explicitly.

---

## Validation

Validation must use the foundation:

```ts
EngineeringIssue
```

Applicable checks include:

```text
power > 0
voltage > 0
current > 0
length > 0
power factor > 0 and <= 1
design margin >= 0 and <= 1
resistivity > 0
conductor area > 0
conductor count >= 1
```

### Relationship validation

Where relationships exist in the input contract, they must be checked explicitly.

Examples:

```text
selected conductor area >= required conductor area
conductor count >= 1
AC-only fields are not silently consumed by DC calculations
DC-only relationships are not silently applied to AC calculations
```

Relationship failures must produce `EngineeringIssue` objects.

Validation must:

* execute deterministically
* preserve field paths
* collect applicable issues
* distinguish errors from warnings
* execute before calculation
* never mutate input

Invalid input must prevent a normal successful calculation result.

---

## Assumptions

Use the foundation:

```ts
EngineeringAssumption
```

Potential codes include:

```text
CABLE_DESIGN_MARGIN
CABLE_CONDUCTOR_MATERIAL
CABLE_RESISTIVITY
CABLE_INSTALLATION_METHOD
CABLE_ALLOWABLE_AMPACITY
```

Only assumptions actually consumed by the calculation may be returned.

If resistivity is supplied directly, do not also emit a hidden resistivity assumption.

If allowable ampacity is supplied directly, do not silently apply another ampacity adjustment.

No hidden:

* derating
* safety factor
* material selection
* temperature factor
* installation correction factor
* rounding rule

may be introduced.

Every engineering factor consumed by the calculation must be explicit and traceable.

---

## Calculation Flow

```text
Input
  ↓
Validate
  ↓
Determine Operating Current
  ↓
Apply Explicit Design Conditions
  ↓
Determine Design Current
  ↓
Determine Required Ampacity
  ↓
Determine Required Conductor Size
  ↓
Output
```

Conceptually:

```text
Design Current
=
Operating Current × Explicit Design Factors
```

For the initial contract, the universally defined design factor is the explicit design margin:

```text
Design Current
=
Operating Current × (1 + Design Margin)
```

Any additional design factor must be added to the contract before it is consumed.

The implementation must not invent additional factors.

---

## Required Ampacity

Required ampacity represents the minimum conductor current-carrying capacity required by the calculation.

```text
Required Ampacity
    ↓
Conductor Selection
    ↓
Selected Conductor Area
```

The relationship between ampacity and physical conductor area must be explicit.

A numeric area must not automatically be treated as valid for an installation condition unless the corresponding engineering basis is represented in the input, constants, assumptions, or calculation rule.

---

## Conductor Sizing

The conductor-size calculation must be deterministic.

At minimum, it must expose:

```text
required conductor area
selected conductor area
```

The selected area must not be silently rounded.

When discrete conductor sizes are introduced, the selection rule must be explicit, for example:

```text
choose the smallest available standard size
that satisfies the required conductor area
```

The standard-size table must be deterministic and versionable.

Future catalog or standards integration must be an explicit dependency or input.

It must never become an implicit network or database lookup.

---

## Trace

Use the foundation:

```ts
CalculationTraceStep
```

The trace must make the calculation reproducible.

```text
Operating Current
       ↓
Design Margin
       ↓
Design Current
       ↓
Required Ampacity
       ↓
Required Conductor Area
       ↓
Selected Cable Size
```

A trace step should expose, where applicable:

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

The trace must:

* preserve deterministic ordering
* contain only consumed values
* reflect actual calculation steps
* remain reproducible for identical inputs
* avoid hidden state

---

## Determinism

The module must guarantee:

* immutable inputs
* deterministic calculations
* deterministic output
* stable ordering
* explicit assumptions
* reproducible trace
* no global mutable state
* no network access
* no database access
* no UI dependencies
* no silent clamping
* no silent rounding
* no silent unit conversion
* no hidden derating
* no hidden safety factors

The same valid input and the same explicit assumptions must produce the same output and trace.

---

## Relationship to Foundation Packages

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
                  cable module
```

Cable Sizing may consume:

```text
@ogwusearch/engineering-types
@ogwusearch/engineering-units
@ogwusearch/engineering-validation
@ogwusearch/engineering-core
```

as required.

It must not create local replacements for:

* engineering issues
* engineering assumptions
* calculation results
* calculation traces
* generic validation
* generic unit conversion
* calculation lifecycle infrastructure

---

## Relationship with Other Solar Modules

Cable Sizing communicates through data contracts.

```text
Peak Demand
    ↓
electrical load requirement
    ↓
Cable Sizing
```

```text
PV String / Battery / Inverter / Charge Controller
    ↓
operating voltage and current requirements
    ↓
Cable Sizing
```

```text
Cable Sizing
    ↓
selected conductor characteristics
    ↓
Voltage Drop
```

```text
Cable Sizing
    ↓
design current
    ↓
Protection
```

The Cable module must not directly import another module's internal implementation merely to obtain engineering values.

---

## Target Structure

```text
cable/

├── README.md                         ← CURRENT TASK
├── constants.ts
├── index.ts
├── run.ts
│
├── assumptions/
│   ├── cable-assumptions.ts
│   └── index.ts
│
├── calculation/
│   ├── calculate-current.ts
│   ├── calculate-cable-size.ts
│   └── index.ts
│
├── trace/
│   ├── cable-trace.ts
│   └── index.ts
│
├── types/
│   ├── cable-input.ts
│   ├── cable-output.ts
│   └── index.ts
│
├── validation/
│   ├── rules.ts
│   ├── validate-cable.ts
│   └── index.ts
│
└── __tests__/
    ├── calculation.test.ts
    ├── validation.test.ts
    └── regression.test.ts
```

### Voltage Drop Separation

The Cable module must not contain:

```text
calculation/calculate-voltage-drop.ts
```

because `voltage-drop` is a separate Solar Engine module.

---

## Public API

The eventual public API should expose only the cable module contract:

```text
CableInput
CableOutput
CableResult
validateCable
calculateCurrent
calculateCableSize
createCableAssumptions
createCableTrace
runCableSizing
```

Internal implementation helpers must remain internal.

The public API should not expose:

* private validation rules
* private trace adapters
* vendor catalogs
* database clients
* network clients
* UI types
* unnecessary calculation intermediates

---

## Tests

The intended test structure is:

```text
__tests__/

├── calculation.test.ts
├── validation.test.ts
└── regression.test.ts
```

Tests must cover:

* valid DC sizing
* valid AC sizing
* boundary values
* invalid electrical inputs
* invalid relationships
* design-margin behavior
* deterministic results
* trace generation
* assumptions
* input immutability
* regression calculations

The tests must verify that inputs are not mutated.

---

## Implementation Order

```text
01 README.md                         ← CURRENT TASK

02 types/cable-input.ts
03 types/cable-output.ts
04 types/index.ts

05 constants.ts

06 assumptions/cable-assumptions.ts
07 assumptions/index.ts

08 validation/rules.ts
09 validation/validate-cable.ts
10 validation/index.ts

11 calculation/calculate-current.ts
12 calculation/calculate-cable-size.ts
13 calculation/index.ts

14 trace/cable-trace.ts
15 trace/index.ts

16 run.ts
17 index.ts

18 __tests__/calculation.test.ts
19 __tests__/validation.test.ts
20 __tests__/regression.test.ts
```

---

## Definition of Done

```text
[ ] README contract is stable
[ ] CableInput is explicit
[ ] CableOutput is explicit
[ ] DC and AC modes are explicit
[ ] current calculation path is deterministic
[ ] design-current calculation is deterministic
[ ] required ampacity is explicit
[ ] conductor sizing is deterministic
[ ] assumptions are explicit
[ ] validation returns EngineeringIssue
[ ] trace uses CalculationTraceStep
[ ] input is immutable
[ ] no silent unit conversion exists
[ ] no hidden derating exists
[ ] no hidden safety factor exists
[ ] Voltage Drop remains a separate module
[ ] public API is intentionally limited
[ ] calculation tests pass
[ ] validation tests pass
[ ] regression tests pass
[ ] typecheck passes
```

---

## Architectural Principle

Cable Sizing answers:

```text
What conductor capacity and size
does this electrical requirement require?
```

Voltage Drop answers:

```text
How much voltage is lost through
the selected conductor over the specified run?
```

Protection answers:

```text
What protective device and coordination
are required for the electrical system?
```

These are related engineering questions, but they remain separate module responsibilities.

The Cable Sizing module should therefore remain:

```text
Deterministic
Unit-aware
Validated
Traceable
Assumption-explicit
Immutable
Independent of applications and infrastructure
```

No TypeScript implementation should be created or modified as part of this README task.
