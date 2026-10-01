# Protection

## Module Purpose

The Protection module determines the electrical protection requirements for a solar or renewable-energy system from explicit electrical requirements and engineering assumptions.

It evaluates applicable protective-device requirements such as:

```text
Electrical Requirement
        ↓
Protection Input
        ↓
Validation
        ↓
Operating / Design Current
        ↓
Protection Requirement
        ↓
Protective Device Sizing
        ↓
Protection Output
```

The module provides deterministic engineering calculations for protective-device requirements.

It does not select commercial vendor products, perform procurement, or replace project-specific standards review.

---

## Responsibilities

The Protection module owns:

* protection-sizing inputs
* operating-current handling where required by the protection contract
* design-current handling
* protective-device sizing
* AC breaker calculation
* DC fuse calculation
* overcurrent-device calculation
* PV string-fuse calculation
* protective-device current-rating requirements
* protective-device voltage-rating requirements
* interrupting / breaking-capacity checks where explicitly represented
* coordination inputs where explicitly represented
* structured validation
* engineering assumptions
* deterministic calculation trace
* deterministic results

The module must make the protection calculation path explicit.

---

## Does Not Own

Protection must not own:

* Load Audit
* Energy Analysis
* Peak Demand
* PV sizing
* PV array sizing
* PV string configuration
* Battery sizing
* Inverter sizing
* Charge-controller sizing
* Cable sizing
* conductor cross-sectional-area calculation
* voltage-drop analysis
* earthing design
* BOM generation
* costing
* commercial product selection
* supplier/vendor selection
* UI
* database
* API transport
* network access

Protection may consume engineering outputs from these modules through explicit data contracts.

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

Other system modules may provide the electrical conditions consumed by Protection:

```text
PV Array / PV String
        ↓
PV current / voltage
        ↓
Protection

Battery
        ↓
battery current / voltage
        ↓
Protection

Inverter
        ↓
AC current / voltage
        ↓
Protection

Charge Controller
        ↓
controller-side current / voltage
        ↓
Protection

Cable
        ↓
design current
        ↓
Protection
```

These relationships must be represented by data contracts.

Protection must not introduce circular module dependencies.

---

## Protection Scope

Protection supports distinct protection calculations through one protection engine.

The protection type must be explicit.

```text
Protection Type

├── AC_BREAKER
├── DC_FUSE
├── OVERCURRENT_DEVICE
└── STRING_FUSE
```

The selected protection type determines which electrical relationships apply.

No protection behavior may be hidden inside arbitrary conditional branches without an explicit protection type or calculation contract.

---

## AC and DC Protection

The module must explicitly distinguish AC and DC protection.

```text
AC Protection
    ↓
AC Operating Current
    ↓
Design Current
    ↓
AC Protective Device Requirement
```

```text
DC Protection
    ↓
DC Operating Current
    ↓
Design Current
    ↓
DC Protective Device Requirement
```

The common protection-sizing pipeline is:

```text
Electrical Input
      ↓
Protection Type
      ↓
Validation
      ↓
Operating Current
      ↓
Design Current
      ↓
Required Protective Rating
      ↓
Voltage / Interrupting Checks
      ↓
Protection Output
```

The module must not duplicate the entire protection engine merely because AC and DC electrical relationships differ.

The mode-specific calculation belongs in the appropriate calculation helper.

---

## Protection Types

### AC Breaker

The AC breaker calculation determines the minimum required breaker current rating from the applicable design current.

The calculation may also evaluate:

* system voltage
* device voltage rating
* interrupting rating
* phase configuration where explicitly provided
* required pole count where explicitly provided

The module must not infer phase configuration.

---

### DC Fuse

The DC fuse calculation determines the required fuse current rating for the applicable DC circuit.

The calculation may evaluate:

* operating current
* design current
* system voltage
* fuse voltage rating
* interrupting capacity
* applicable PV or battery-side conditions

The calculation must not silently apply a solar-specific multiplier unless that multiplier is explicitly defined in the input contract or documented engineering assumptions.

---

### Overcurrent Device

The overcurrent-device calculation provides a generic protection requirement when the circuit should be evaluated by a common overcurrent-sizing rule.

The output must distinguish:

```text
required protective rating
```

from:

```text
selected nominal device rating
```

If standard device sizes are introduced, the selection rule must be deterministic.

---

### String Fuse

The string-fuse calculation applies specifically to PV string protection.

The input contract must make PV-string electrical information explicit.

Potential inputs include:

```text
PV operating current
PV short-circuit current
PV operating voltage
PV open-circuit voltage
number of parallel strings
required protective rating
```

Only fields consumed by the actual implemented calculation should be included.

The module must not perform PV string configuration itself.

PV string configuration remains the responsibility of `pv-string`.

---

## Relationship with Cable Sizing

Cable Sizing determines the conductor requirement.

Protection determines the protective-device requirement.

```text
Cable Sizing
     ↓
Design Current
     ↓
Protection
     ↓
Protective Device Rating
```

Protection must not calculate:

* conductor area
* conductor resistance
* cable impedance
* cable voltage drop

Those responsibilities belong to Cable and Voltage Drop.

---

## Relationship with Voltage Drop

Voltage Drop remains an independent module.

```text
Cable
   ↓
selected conductor
   ↓
Voltage Drop
   ↓
voltage-loss verification

Protection
   ↓
protective-device requirement
```

Protection may consume voltage information required for device-rating checks, but it must not implement voltage-drop calculations.

---

## Relationship with Earthing

Protection and Earthing are separate engineering concerns.

```text
Protection
    ↓
overcurrent / fault protection

Earthing
    ↓
grounding / bonding / earth resistance
```

Protection may consume explicit fault-related information if required by a future contract.

It must not own:

* earth conductor sizing
* earth electrode design
* bonding conductor design
* earth resistance calculation

Those belong to the `earthing` module.

---

## Input Contract

The module must define an explicit `ProtectionInput`.

The contract must identify the protection mode and applicable electrical conditions rather than accepting an arbitrary collection of optional fields.

Conceptually:

```text
ProtectionInput

├── protection
│   ├── protection type
│   └── electrical mode
│
├── electrical
│   ├── operating current
│   ├── system voltage
│   ├── design current where supplied
│   ├── power where applicable
│   └── short-circuit current where applicable
│
├── design
│   ├── design margin
│   └── explicit protection factors
│
└── device
    ├── voltage rating where applicable
    ├── current rating where applicable
    ├── interrupting rating where applicable
    └── available device ratings where applicable
```

### Protection type

The protection type must be explicit:

```text
AC_BREAKER
DC_FUSE
OVERCURRENT_DEVICE
STRING_FUSE
```

No hidden protection-type inference is permitted.

### Electrical mode

The electrical mode must be explicit:

```text
AC
DC
```

A protection calculation must not silently switch between AC and DC behavior.

### Operating current

Operating current may be supplied directly.

If current is derived from another electrical quantity, the calculation path must be explicit and traceable.

### Design current

The contract may accept design current directly when it is produced by another engineering module.

Protection must not silently recalculate a supplied design current.

If design current is not supplied, the module may calculate it according to its explicit contract.

### System voltage

System voltage is required for voltage-rating checks and any electrical relationship that requires it.

Unit:

```text
V
```

### Short-circuit current

Short-circuit current may be supplied where the selected protection calculation requires it.

Unit:

```text
A
```

The module must not invent fault-current values.

### Device ratings

Protective-device rating information must be explicit.

Potential values include:

```text
current rating
voltage rating
interrupting rating
```

These must not be obtained implicitly from commercial catalogs or network services.

---

## Output Contract

The module should expose a `ProtectionOutput` containing explicit engineering results.

Conceptually:

```text
ProtectionOutput

├── protection type
├── electrical mode
├── operating current
├── design current
├── required protective current rating
├── selected protective rating
├── required voltage rating
├── interrupting rating requirement where applicable
├── selected device voltage rating where supplied
├── selected device interrupting rating where supplied
└── compatibility results
```

The output must distinguish:

```text
required protective rating
```

from:

```text
selected protective rating
```

The required rating is an engineering requirement.

The selected rating is a deterministic choice from an explicit device-rating set.

No commercial product selection occurs inside the module.

---

## Units

| Quantity                      | Unit    |
| ----------------------------- | ------- |
| Power                         | W       |
| Voltage                       | V       |
| Current                       | A       |
| Short-circuit current         | A       |
| Interrupting current          | A       |
| Design margin                 | ratio   |
| Power factor where applicable | ratio   |
| Device count                  | integer |

No silent unit conversion is permitted.

The module must use the foundation unit system where conversion is required.

It must not implement a private unit-conversion engine.

---

## Validation

Validation must use the foundation:

```ts
EngineeringIssue
```

Applicable checks include:

```text
valid protection type

valid electrical mode

operating current > 0

design current > 0

system voltage > 0

short-circuit current > 0 where required

design margin >= 0 and <= 1

device current rating > 0 where supplied

device voltage rating > 0 where supplied

interrupting rating > 0 where supplied
```

### Relationship validation

Where relationships are represented in the contract, they must be checked explicitly.

Examples:

```text
selected device current rating >= required protective rating

selected device voltage rating >= required system voltage

selected interrupting rating >= required fault current

design current >= operating current

DC protection is not evaluated with AC-only assumptions

AC protection is not evaluated with DC-only assumptions
```

The actual relationship rules must be determined by the specific protection contract.

Validation must:

* execute before calculation
* collect applicable issues
* preserve field paths
* preserve error codes
* distinguish errors from warnings
* never mutate input

---

## Assumptions

Use:

```ts
EngineeringAssumption
```

Potential assumption codes include:

```text
PROTECTION_DESIGN_MARGIN
PROTECTION_DEVICE_RATING_BASIS
PROTECTION_VOLTAGE_RATING_BASIS
PROTECTION_INTERRUPTING_RATING
PROTECTION_TYPE
PROTECTION_STANDARD_BASIS
```

Only assumptions actually consumed by a calculation may be returned.

No hidden:

* protection multiplier
* safety factor
* derating
* device selection
* interrupting-capacity assumption
* standards requirement

may be applied without explicit representation.

Any standard-specific requirement must be introduced through an explicit engineering input, constant, assumption, or documented rule.

---

## Calculation Flow

```text
Input
  ↓
Validate
  ↓
Determine Operating Current
  ↓
Determine Design Current
  ↓
Determine Required Protective Rating
  ↓
Determine Required Voltage Rating
  ↓
Evaluate Interrupting Requirement
  ↓
Evaluate Device Compatibility
  ↓
Output
```

A generic current relationship may be:

```text
Design Current
=
Operating Current × Explicit Design Factor
```

For a design margin represented by the module:

```text
Design Current
=
Operating Current × (1 + Design Margin)
```

This relationship must not be applied if a design current is explicitly supplied by another engineering module unless the contract specifically requires Protection to recalculate it.

---

## Protective Device Selection

When discrete nominal ratings are supported, selection must be deterministic.

Conceptually:

```text
Required Protective Rating
        ↓
Available Device Ratings
        ↓
Smallest Rating
that satisfies the requirement
        ↓
Selected Protective Rating
```

The available rating set must be explicit.

Examples:

```text
16 A
20 A
25 A
32 A
40 A
50 A
63 A
80 A
100 A
```

A standard rating table must not be populated from an implicit vendor lookup.

If a standards-based device series is introduced, its source and version must be explicit.

---

## Voltage Compatibility

Where device voltage ratings are part of the contract:

```text
Selected Device Voltage Rating
        ≥
Required System Voltage
```

The result must be explicit:

```text
voltageCompatible: true | false
```

No silent voltage assumptions are permitted.

---

## Interrupting Capacity

Where fault-current protection is part of the input contract:

```text
Selected Interrupting Rating
        ≥
Required Fault Current
```

The result must be traceable.

The Protection module must not invent fault-current values.

If fault current is not available, the calculation must either:

* omit the interrupting-capacity evaluation when the contract permits, or
* produce a validation error when the evaluation is mandatory.

That distinction must be explicit.

---

## Trace

Use the foundation:

```ts
CalculationTraceStep
```

A protection trace should expose the calculation path.

Conceptually:

```text
Operating Current
       ↓
Design Current
       ↓
Required Protective Rating
       ↓
Required Voltage Rating
       ↓
Interrupting Requirement
       ↓
Device Compatibility
       ↓
Selected Protective Rating
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

The trace must:

* preserve deterministic ordering
* contain only consumed values
* represent actual calculations
* remain reproducible
* avoid hidden state

---

## Determinism

The module must guarantee:

* immutable inputs
* deterministic calculations
* deterministic output
* stable result ordering
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
* no hidden protection factor

The same valid input and the same assumptions must produce the same result.

---

## Relationship to Foundation Packages

The preferred dependency direction is:

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
                   protection
```

Protection may consume:

```text
@ogwusearch/engineering-types
@ogwusearch/engineering-units
@ogwusearch/engineering-validation
@ogwusearch/engineering-core
```

as required.

Protection must not implement private replacements for:

* EngineeringIssue
* EngineeringError
* EngineeringWarning
* EngineeringAssumption
* CalculationTraceStep
* CalculationResult
* generic validation
* generic units
* calculation lifecycle

---

## Target Structure

```text
protection/

├── README.md                         ← CURRENT TASK
├── constants.ts
├── index.ts
├── run.ts
│
├── assumptions/
│   ├── protection-assumptions.ts
│   └── index.ts
│
├── calculation/
│   ├── calculate-ac-breaker.ts
│   ├── calculate-dc-fuse.ts
│   ├── calculate-overcurrent-device.ts
│   ├── calculate-string-fuse.ts
│   └── index.ts
│
├── trace/
│   ├── protection-trace.ts
│   └── index.ts
│
├── types/
│   ├── protection-input.ts
│   ├── protection-output.ts
│   └── index.ts
│
├── validation/
│   ├── rules.ts
│   ├── validate-protection.ts
│   └── index.ts
│
└── __tests__/
    ├── calculation.test.ts
    ├── validation.test.ts
    └── regression.test.ts
```

### Structural Rules

The following are deliberately excluded from Protection:

```text
calculate-cable-size.ts
calculate-voltage-drop.ts
calculate-earth-conductor.ts
calculate-earth-resistance.ts
calculate-pv-string.ts
```

Those responsibilities belong to their respective modules.

---

## Public API

The eventual public API should expose only the Protection contract:

```text
ProtectionInput
ProtectionOutput
ProtectionResult
validateProtection
calculateACBreaker
calculateDCF​use
calculateOvercurrentDevice
calculateStringFuse
createProtectionAssumptions
createProtectionTrace
runProtectionSizing
```

The actual exported spelling must remain consistent with the implementation naming convention.

Internal helpers must remain internal.

The public API should not expose:

* private validation rules
* private calculation intermediates
* private trace adapters
* vendor catalogs
* database clients
* network clients
* UI types

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

### Calculation

* valid AC breaker sizing
* valid DC fuse sizing
* valid generic overcurrent-device sizing
* valid PV string-fuse sizing
* operating-current handling
* design-current behavior
* protective-device rating
* voltage compatibility
* interrupting-capacity compatibility where supported
* boundary values
* deterministic device selection

### Validation

* invalid protection type
* invalid electrical mode
* invalid operating current
* invalid design current
* invalid system voltage
* invalid short-circuit current
* invalid design margin
* invalid device ratings
* invalid relationships
* input immutability

### Integration / Regression

* core result lifecycle
* assumptions
* calculation trace
* validation blocking
* deterministic results
* historical regression calculations
* compatibility results

---

## Implementation Order

```text
01 README.md                         ← CURRENT TASK

02 types/protection-input.ts
03 types/protection-output.ts
04 types/index.ts

05 constants.ts

06 assumptions/protection-assumptions.ts
07 assumptions/index.ts

08 validation/rules.ts
09 validation/validate-protection.ts
10 validation/index.ts

11 calculation/calculate-ac-breaker.ts
12 calculation/calculate-dc-fuse.ts
13 calculation/calculate-overcurrent-device.ts
14 calculation/calculate-string-fuse.ts
15 calculation/index.ts

16 trace/protection-trace.ts
17 trace/index.ts

18 run.ts
19 index.ts

20 __tests__/calculation.test.ts
21 __tests__/validation.test.ts
22 __tests__/regression.test.ts
```

---

## Definition of Done

```text
[ ] README contract is stable
[ ] ProtectionInput is explicit
[ ] ProtectionOutput is explicit
[ ] protection type is explicit
[ ] AC/DC mode is explicit
[ ] operating-current path is deterministic
[ ] design-current path is deterministic
[ ] protective rating requirement is explicit
[ ] voltage-rating checks are explicit
[ ] interrupting-capacity checks are explicit where applicable
[ ] assumptions are explicit
[ ] validation uses EngineeringIssue
[ ] trace uses CalculationTraceStep
[ ] input is immutable
[ ] no silent unit conversion
[ ] no hidden derating
[ ] no hidden protection factor
[ ] Cable remains a separate module
[ ] Voltage Drop remains a separate module
[ ] Earthing remains a separate module
[ ] public API is intentionally limited
[ ] calculation tests pass
[ ] validation tests pass
[ ] regression tests pass
[ ] typecheck passes
```

---

## Architectural Principle

Protection answers:

```text
What protective-device requirement
does this electrical circuit require?
```

Cable answers:

```text
What conductor capacity and size
does this circuit require?
```

Voltage Drop answers:

```text
What voltage loss occurs through
the selected conductor?
```

Earthing answers:

```text
What grounding, bonding, and earth
resistance provisions are required?
```

These engineering questions are related, but they remain separate module responsibilities.

The Protection module should therefore remain:

```text
Deterministic
Unit-aware
Validated
Traceable
Assumption-explicit
Immutable
Independent of applications and infrastructure
```

No implementation should be inferred from a commercial product catalog, database, or network source.
