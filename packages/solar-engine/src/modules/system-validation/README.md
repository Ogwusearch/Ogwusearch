# System Validation Module

The `system-validation` module provides system-level validation for the `solar-engine` engineering platform.

It evaluates the consistency, completeness, compatibility, and engineering validity of results produced by the individual solar-system calculation modules.

The module does **not** replace domain calculations. Instead, it consumes authoritative engineering outputs and determines whether the resulting system satisfies defined validation rules and engineering constraints.

---

## Purpose

A solar system is composed of multiple interconnected engineering domains.

A calculation can be individually valid while the overall system remains incompatible.

For example:

```text
PV Array
   │
   ├── voltage
   ├── current
   └── power
          │
          ▼
      Inverter
          │
          ├── DC input compatibility
          ├── AC output compatibility
          └── capacity
          │
          ▼
      Protection
          │
          ▼
       Cable
          │
          ▼
   Voltage Drop
```

The `system-validation` module evaluates these relationships at the system level.

---

# Architecture Position

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
        ┌───────────┼────────────┐
        │           │            │
      load       energy      peak-demand
        │           │            │
        └───────────┼────────────┘
                    │
             System Modules
                    │
                    ▼
          ┌───────────────────┐
          │ system-validation │
          └───────────────────┘
                    │
                    ▼
            System Validation
                    │
                    ▼
                 reports
```

`system-validation` is a domain-level module inside `solar-engine`.

Foundation packages must not depend on it.

---

# Responsibilities

The module is responsible for validating relationships between engineering results.

Examples include:

* system completeness
* cross-module compatibility
* voltage compatibility
* current compatibility
* power compatibility
* equipment rating compatibility
* PV array and inverter compatibility
* battery and inverter compatibility
* charge-controller compatibility
* cable and protective-device compatibility
* voltage-drop compliance
* protection coordination checks
* required engineering result availability
* system-level warnings and errors

---

# Non-Responsibilities

`system-validation` must not:

* redesign the system
* silently change engineering inputs
* modify calculation results
* replace domain calculations
* duplicate established engineering formulas unnecessarily
* perform UI rendering
* access browser APIs
* access databases
* call external APIs
* perform authentication
* generate PDFs
* contain React components
* contain API/server logic

When a domain calculation is required, the corresponding engineering module remains authoritative.

---

# Validation vs Calculation

The distinction between calculation and validation is fundamental.

For example:

```text
inverter
    │
    └── calculates required inverter capacity

system-validation
    │
    └── verifies that selected inverter capacity
        satisfies the calculated requirement
```

Likewise:

```text
voltage-drop
    │
    └── calculates voltage drop

system-validation
    │
    └── verifies that voltage drop satisfies
        the applicable system requirement
```

System validation should consume authoritative results rather than recreate them.

---

# Validation Model

System validation can be represented as:

```text
Engineering Results
        │
        ▼
System Validation Input
        │
        ▼
Validation Rules
        │
        ├── completeness
        ├── compatibility
        ├── capacity
        ├── voltage
        ├── current
        ├── protection
        └── system constraints
        │
        ▼
Validation Issues
        │
        ├── ERROR
        └── WARNING
        │
        ▼
System Validation Result
```

---

# Validation Severity

System validation distinguishes between errors and warnings.

## ERROR

An error indicates that a system requirement is not satisfied or that validation cannot establish system validity.

Examples:

```text
PV voltage exceeds inverter maximum DC input voltage.

Battery voltage is incompatible with inverter DC input voltage.

Required inverter capacity exceeds selected inverter rating.

Required engineering result is missing.
```

Errors normally produce:

```text
valid: false
```

---

## WARNING

A warning identifies a condition that may require engineering review but does not necessarily invalidate the system.

Examples:

```text
High inverter utilization.

Voltage drop approaching the configured limit.

Low design margin.

Non-standard equipment configuration.

Optional engineering information unavailable.
```

Warnings normally preserve:

```text
valid: true
```

while producing:

```text
status: WARNING
```

The exact behavior follows the shared `engineering-core` result contract.

---

# Engineering-Core Integration

Where system validation follows the shared calculation lifecycle, it should use the `engineering-core` execution infrastructure.

Conceptually:

```ts
const definition = defineCalculation<
  SystemValidationInput,
  SystemValidationOutput
>({
  name: "System Validation",

  validate: validateSystem,

  assumptions: createSystemValidationAssumptions,

  calculate: validateSystemConfiguration,
});

return executeCalculation(definition, input);
```

The actual implementation must follow the current repository contracts.

The foundation layer owns execution and result lifecycle behavior.

The domain module owns system-specific validation rules.

---

# Validation Lifecycle

The intended lifecycle is:

```text
1. Receive system validation input
        │
        ▼
2. Validate validation input
        │
        ▼
3. Collect available engineering results
        │
        ▼
4. Evaluate system rules
        │
        ▼
5. Generate errors and warnings
        │
        ▼
6. Build validation output
        │
        ▼
7. Produce traceable CalculationResult
```

The validator must not silently repair invalid input.

---

# Cross-Module Validation

System validation connects otherwise independent engineering modules.

For example:

### PV Array → Inverter

```text
PV maximum voltage
        ≤
Inverter maximum DC input voltage
```

and:

```text
PV operating voltage
        within
Inverter MPPT operating range
```

The exact limits must come from the relevant equipment specifications and domain contracts.

---

### Battery → Inverter

The validator may verify:

```text
Battery nominal voltage
        ↔
Inverter DC input voltage
```

and applicable:

```text
battery current
battery power
inverter DC requirements
```

---

### Inverter → Load

The validator may verify that the selected inverter satisfies the authoritative load requirements.

Conceptually:

```text
Required continuous capacity
        ≤
Selected inverter rated capacity
```

and:

```text
Required starting/surge capacity
        ≤
Selected inverter surge capability
```

The system validator must not recreate the peak-demand calculation.

---

### Cable → Protection

The validator may evaluate coordination between:

```text
Cable ampacity
        │
        ▼
Protective device rating
        │
        ▼
System operating current
```

The authoritative cable and protection calculations remain in their respective modules.

---

### Voltage Drop → System Requirement

The validator may evaluate:

```text
Calculated voltage-drop percentage
        ≤
Applicable voltage-drop limit
```

The voltage-drop calculation itself belongs to the `voltage-drop` module.

---

# Completeness Validation

System validation may determine whether the required engineering results exist before evaluating dependent relationships.

For example:

```text
PV sizing
   │
   ├── required
   ▼
PV array
   │
   ├── required
   ▼
Inverter
   │
   ├── required
   ▼
Protection
```

If an authoritative prerequisite is missing, validation should report the missing dependency rather than inventing a substitute value.

---

# Assumptions

System validation may use explicit assumptions where required.

Examples include:

* applicable voltage-drop limit
* permitted utilization threshold
* system compatibility rules
* design review thresholds
* standard operating limits
* engineering reference values

Assumptions must be explicit and traceable.

They must not be hidden inside validation logic.

---

# Units

System validation should operate on engineering values with explicit units.

Typical quantities include:

* W
* kW
* Wh
* kWh
* V
* A
* Ω
* m
* °C
* %

Unit-aware validation should rely on the engineering foundation rather than implementing ad-hoc unit conversion.

The validator must not silently interpret incompatible units as equivalent.

---

# Traceability

Every important validation decision should be traceable.

A validation trace may identify:

```text
Rule
  │
  ├── input value
  ├── comparison value
  ├── applicable limit
  ├── result
  └── validation decision
```

For example:

```text
Rule:
  INVERTER_DC_VOLTAGE_COMPATIBILITY

Actual:
  96 V

Expected:
  48 V

Result:
  ERROR
```

The trace should explain why the validation rule produced its result without duplicating unnecessary calculation logic.

---

# Validation Rules

Validation rules should remain explicit and independently testable.

Examples:

```text
SYSTEM_INPUT_COMPLETE
PV_INVERTER_VOLTAGE_COMPATIBLE
PV_INVERTER_POWER_COMPATIBLE
BATTERY_INVERTER_VOLTAGE_COMPATIBLE
INVERTER_LOAD_CAPACITY_COMPATIBLE
CABLE_CURRENT_COMPATIBLE
PROTECTION_CABLE_COMPATIBLE
VOLTAGE_DROP_WITHIN_LIMIT
SYSTEM_CONFIGURATION_COMPLETE
```

The final rule names must follow the actual repository warning/error-code conventions.

---

# Warnings

System-level warnings should have stable identifiers.

Examples:

```text
SYSTEM_VALIDATION_WARNING
HIGH_SYSTEM_UTILIZATION
VOLTAGE_DROP_NEAR_LIMIT
LOW_DESIGN_MARGIN
NON_STANDARD_CONFIGURATION
```

Warnings should remain distinguishable from errors.

They should not be encoded only as free-form strings.

---

# Errors

System validation errors should identify the failed engineering relationship.

Examples:

```text
MISSING_REQUIRED_RESULT
INCOMPATIBLE_SYSTEM_VOLTAGE
INVERTER_CAPACITY_INSUFFICIENT
PV_VOLTAGE_EXCEEDS_INVERTER_LIMIT
BATTERY_VOLTAGE_INCOMPATIBLE
CABLE_PROTECTION_MISMATCH
VOLTAGE_DROP_LIMIT_EXCEEDED
```

The final codes should use the repository's established engineering issue contract.

---

# Determinism

System validation must be deterministic.

Given identical engineering results, assumptions, equipment specifications, and validation configuration, the validator should produce the same result.

Avoid:

* random decisions
* hidden state
* environment-dependent behavior
* live external data
* implicit time-dependent rules
* silent defaults

If a rule depends on an external standard or equipment specification, that dependency should be explicit.

---

# No Silent Mutation

Validation must never modify the supplied engineering results.

For example:

```text
Input:
  inverterRatedPowerW = 5000

Validation:
  requiredPowerW = 6000

Correct:
  ERROR — insufficient capacity
```

Not:

```text
Input:
  inverterRatedPowerW = 5000

Validator:
  adjusts value to 6000
```

Validation reports the condition.

It does not repair the engineering design.

---

# Relationship With Engineering Modules

`system-validation` sits downstream of the domain calculations.

```text
load
  │
  ▼
energy
  │
  ▼
peak-demand
  │
  ├───────────────┐
  ▼               ▼
pv-sizing       battery
  │               │
  ▼               ▼
pv-array        inverter
  │               │
  └───────┬───────┘
          ▼
  system-validation
          │
          ▼
       reports
```

The exact dependency graph may differ according to the current system configuration.

The important principle is that system validation consumes authoritative results.

---

# Relationship With Reports

The distinction between validation and reporting is:

```text
system-validation
    │
    └── Is the system configuration valid?

reports
    │
    └── How should the engineering results be presented?
```

A report may include the system-validation result.

For example:

```text
System Validation
-----------------
Status: WARNING

Errors: 0
Warnings: 2

Warnings:
- High inverter utilization
- Voltage drop approaching configured limit
```

Reports should consume the validation result rather than independently re-evaluating the system.

---

# Testing

The module should include tests for:

## Validation tests

* required input validation
* missing calculation results
* incompatible voltages
* incompatible capacities
* cable/protection relationships
* voltage-drop limits
* battery/inverter compatibility
* PV/inverter compatibility

## Result tests

* valid system
* invalid system
* warning-only system
* error system
* mixed warning/error system
* multiple validation issues

## Regression tests

Regression tests should protect:

* validation rules
* error codes
* warning codes
* status propagation
* `valid` behavior
* trace output
* assumptions
* deterministic issue ordering

Existing engineering formulas should not be changed to satisfy system-validation tests.

---

# Example

A conceptual validation input may contain results from several modules:

```ts
{
  peakDemand: peakDemandResult,

  pvSizing: pvSizingResult,

  pvArray: pvArrayResult,

  battery: batteryResult,

  inverter: inverterResult,

  cable: cableResult,

  voltageDrop: voltageDropResult,

  protection: protectionResult,
}
```

The validator evaluates relationships among those results.

Conceptually:

```text
PV Array
   │
   ├── voltage ───────────► Inverter
   ├── current ───────────► Inverter
   └── power ─────────────► Inverter

Battery
   │
   └── voltage ───────────► Inverter

Load
   │
   └── demand ────────────► Inverter

Cable
   │
   └── ampacity ──────────► Protection

Voltage Drop
   │
   └── percentage ────────► System Limit
```

The result is a structured validation result containing the applicable errors, warnings, assumptions, and trace information.

---

# Public API

The module should expose intentional public contracts through `index.ts`.

A typical public surface includes:

```text
SystemValidationInput
SystemValidationOutput
runSystemValidation
validation rules
validation warning/error codes
```

Internal rule helpers should not be exported unless they are intentionally part of the domain API.

---

# Target Directory Structure

```text
system-validation/
├── README.md
├── index.ts
├── run.ts
├── warnings.ts
│
├── types/
│   ├── index.ts
│   ├── input.ts
│   └── output.ts
│
├── validation/
│   ├── index.ts
│   ├── rules.ts
│   └── validate-system.ts
│
├── assumptions/
│   ├── index.ts
│   └── system-validation-assumptions.ts
│
├── calculation/
│   ├── index.ts
│   ├── validate-system-configuration.ts
│   ├── validate-completeness.ts
│   └── validate-compatibility.ts
│
├── trace/
│   ├── index.ts
│   └── system-validation-trace.ts
│
└── __tests__/
    ├── calculation.test.ts
    ├── validation.test.ts
    └── regression.test.ts
```

The actual repository structure should take precedence over this target structure. Existing files should be preserved and migrated rather than duplicated.

---

# Design Principles

The `system-validation` module follows these principles:

1. **Validate; do not redesign.**
2. **Consume authoritative domain results.**
3. **Do not duplicate established engineering calculations.**
4. **Keep validation rules explicit.**
5. **Keep errors and warnings distinct.**
6. **Preserve engineering units.**
7. **Make assumptions explicit.**
8. **Make validation decisions traceable.**
9. **Never silently mutate engineering results.**
10. **Keep validation deterministic.**
11. **Use `engineering-core` for shared calculation/result lifecycle behavior.**
12. **Keep UI, API, database, and rendering concerns outside the module.**

---

# Summary

`system-validation` is the system-level engineering consistency layer of `solar-engine`.

Its role is:

```text
Authoritative Engineering Results
              │
              ▼
       System Relationships
              │
              ▼
       Validation Rules
              │
              ▼
      Errors + Warnings
              │
              ▼
    System Validation Result
```

Individual modules answer:

> What is the calculated engineering value?

`system-validation` answers:

> Are the calculated engineering values and selected system components mutually compatible and compliant with the defined validation rules?

`reports` can then answer:

> How should those engineering results and validation findings be organized for presentation?

This separation keeps the solar-engine architecture deterministic, traceable, modular, and maintainable.
