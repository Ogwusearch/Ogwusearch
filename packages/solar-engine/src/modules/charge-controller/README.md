# Charge Controller Sizing

Architectural and engineering contract for the `solar-engine` Charge Controller Sizing module.

**Module responsibility:** determine the electrical capacity required of a charge controller from a defined PV-side operating point, battery/system voltage, controller technology, efficiency, design margin, and explicit controller limits.

**Contract status:** authoritative README-first specification. This document defines the intended public behavior before TypeScript implementation.

---

## 1. Purpose

Charge Controller Sizing sits between the PV array/string data and the battery/system interface. It converts an explicit PV electrical input into a deterministic charge-controller requirement.

Conceptually:

```text
PV Array / PV String
        │
        ▼
Charge Controller Input
        │
        ▼
Validation
        │
        ▼
PV Charging Current
        │
        ▼
Design Current
        │
        ▼
Controller Sizing
        │
        ▼
Charge Controller Output
```

The module answers engineering questions such as:

- What PV operating current is represented by the supplied PV power and voltage?
- What battery-side charging current is required?
- What design current is required after the explicit design margin?
- What minimum controller current capacity is required?
- Is the supplied controller electrically compatible with the PV and battery/system inputs?
- What assumptions and calculation steps produced the result?

The module does not select a commercial product or vendor.

---

## 2. Scope

### 2.1 Charge Controller owns

- PV charging-current calculation
- controller current sizing
- controller voltage requirements
- explicit design margin
- controller electrical-capacity calculation
- explicit MPPT/PWM controller technology handling
- PV/controller voltage compatibility checks
- PV/controller current compatibility checks
- battery/controller voltage compatibility checks where those limits are explicitly supplied
- assumptions consumed by the calculation
- validation of charge-controller inputs and relationships
- deterministic calculation traces
- deterministic engineering results

### 2.2 Charge Controller does not own

- PV module sizing
- PV array configuration
- PV string configuration
- battery sizing
- inverter sizing
- cable sizing
- voltage-drop analysis
- protection coordination
- earthing
- BOM generation
- costing
- commercial product selection
- vendor selection
- user interface
- database access
- API implementation
- network access

Those concerns remain responsibilities of their respective modules or application layers.

---

## 3. Architectural Position

The module is part of `@ogwusearch/solar-engine` and consumes reusable foundation contracts.

```text
engineering-types
        ↑
engineering-units / engineering-validation / engineering-core
        ↑
solar-engine / charge-controller
```

The Charge Controller module must not recreate:

- `EngineeringIssue`
- `EngineeringError`
- `EngineeringWarning`
- `EngineeringAssumption`
- `CalculationTraceStep`
- generic calculation lifecycle behavior
- generic validation infrastructure
- generic unit-conversion infrastructure

The runtime entry point should use the `engineering-core` calculation lifecycle.

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

---

## 4. Contract Boundaries

The Charge Controller module receives data contracts from upstream systems. It does not import implementation internals from those modules.

```text
PV Sizing
    │
    ▼
PV Array
    │
    ▼
PV String
    │
    │  PV-side contract
    ▼
Charge Controller
    ▲
    │  Battery/system-voltage contract
Battery Sizing
```

The relationship between Battery and Charge Controller is therefore **data-contract based**, not an implementation dependency cycle.

Charge Controller may consume battery/system voltage produced by Battery Sizing, but must not import Battery calculation internals.

---

## 5. Input Contract

The public input contract is named:

```ts
ChargeControllerInput
```

The input must keep PV-side and battery-side quantities distinct.

### 5.1 PV side

```text
pvArrayPowerW
pvOperatingVoltageV
pvArrayCurrentA
```

Where available for voltage-limit validation:

```text
pvOpenCircuitVoltageV
```

These quantities describe the PV operating point and must not be collapsed into a generic voltage/current field.

### 5.2 Battery side

```text
batteryVoltageV
```

Charging current is derived by the calculation and is not silently accepted as a replacement for the PV-side electrical inputs.

### 5.3 Controller configuration

```text
controllerType
```

Allowed controller technologies:

```text
MPPT
PWM
```

Optional explicit controller limits may be supplied for compatibility checks:

```text
controllerRatedCurrentA
controllerMaxPVVoltageV
controllerMinPVVoltageV
controllerMinBatteryVoltageV
controllerMaxBatteryVoltageV
controllerMaxPVCurrentA
```

These limits are inputs to compatibility analysis only. They do not cause the sizing calculation to mutate or clamp the required capacity.

### 5.4 Design parameters

```text
designMargin
controllerEfficiency
```

`designMargin` is a ratio in the range `0 <= designMargin <= 1`.

`controllerEfficiency` is a ratio in the range `0 < controllerEfficiency <= 1`.

No implicit safety factor, derating factor, or efficiency value may be introduced when one is not present in the contract.

---

## 6. Controller Technology Contract

Controller technology must be explicit.

```text
MPPT | PWM
```

Controller behavior must never be selected through arbitrary branches based on unrelated numeric fields.

### 6.1 MPPT

For an MPPT controller, the PV-side operating point and the battery-side voltage are electrically distinct.

The MPPT calculation may use:

```text
PV power
PV operating voltage
PV current
battery/system voltage
controller efficiency
```

The battery-side charging current is derived from the PV-side power transfer and explicit controller efficiency.

The canonical calculation is:

```text
PV charging current = PV power / battery voltage
controller output current = (PV power × controller efficiency) / battery voltage
```

The implementation must document which value is used as the design basis for the controller current requirement. No alternative equation may be introduced silently.

### 6.2 PWM

PWM is a distinct electrical model and must not silently reuse the MPPT power-conversion equation.

If PWM support is implemented, its calculation must explicitly define the relationship between:

- PV operating voltage
- PV operating current
- battery/system voltage
- charging current

If those additional PWM-specific electrical conditions are not part of the input contract, the module must not pretend that the MPPT calculation is a valid PWM calculation.

A `PWM` value therefore represents an explicit technology contract, not a hidden switch inside an otherwise generic formula.

---

## 7. Calculation Flow

The primary current-sizing flow is:

```text
PV Array Power
      │
      ▼
PV Operating Current
      │
      ▼
Charging Current
      │
      ▼
Design Margin
      │
      ▼
Required Controller Current
      │
      ▼
Controller Capacity Requirement
```

### 7.1 PV operating current

When PV power and PV operating voltage are supplied:

```text
PV operating current = PV array power / PV operating voltage
```

When `pvArrayCurrentA` is also supplied, the supplied current must be treated as an explicit engineering value and may be checked against the power/voltage relationship.

The module must not silently replace one supplied quantity with another.

### 7.2 Charging current

For the MPPT calculation path:

```text
PV-side power = PV array power

charging current basis = PV-side power / battery voltage

controller output charging current =
    (PV-side power × controller efficiency) / battery voltage
```

The exact output naming must distinguish PV-side current from battery-side charging current.

### 7.3 Design current

The explicit design margin is applied once:

```text
design charging current =
    controller output charging current × (1 + design margin)
```

The required controller current is then:

```text
required controller current = design charging current
```

No second hidden margin or derating factor may be applied.

### 7.4 Controller capacity

The module computes the minimum electrical current capacity required by the design.

A commercial nominal controller rating is outside the core responsibility unless a deterministic project-owned rating series is explicitly supplied as part of a separate contract.

If a rating series is later introduced, the deterministic rule must be:

```text
select the smallest allowed rating >= required controller current
```

The module must not query vendor catalogs or infer a product from the internet.

---

## 8. Voltage Requirements

Voltage compatibility is a separate engineering path from current sizing.

```text
PV operating voltage
        │
        ▼
Controller PV operating requirement
```

and, where supplied:

```text
PV open-circuit voltage
        │
        ▼
Controller maximum PV voltage
```

Battery-side compatibility is likewise separate:

```text
Battery/system voltage
        │
        ▼
Controller supported battery-voltage range
```

### 8.1 PV operating voltage

The controller must support the supplied PV operating voltage.

Where explicit controller minimum and maximum PV operating voltages exist:

```text
controllerMinPVVoltageV <= pvOperatingVoltageV <= controllerMaxPVVoltageV
```

### 8.2 PV maximum voltage

Where `pvOpenCircuitVoltageV` and `controllerMaxPVVoltageV` are supplied:

```text
pvOpenCircuitVoltageV <= controllerMaxPVVoltageV
```

This check is independent of operating-voltage compatibility.

### 8.3 Battery voltage

Where controller battery-voltage limits are supplied:

```text
controllerMinBatteryVoltageV <= batteryVoltageV
batteryVoltageV <= controllerMaxBatteryVoltageV
```

Missing optional compatibility limits do not create a fabricated pass or failure. The result should indicate only the checks that were actually evaluated.

---

## 9. Output Contract

The public output contract is named:

```ts
ChargeControllerOutput
```

The output should expose explicit engineering results rather than opaque generic values.

Core results:

```text
pvInputPowerW
pvInputVoltageV
pvInputCurrentA
batteryVoltageV
pvChargingCurrentA
designChargingCurrentA
requiredControllerCurrentA
requiredControllerPVVoltageV
controllerType
```

Where relevant, the output may also expose:

```text
controllerRequiredMaxPVVoltageV
controllerCurrentMarginA
pvCurrentMarginA
currentCompatible
voltageCompatible
batteryVoltageCompatible
pvCurrentCompatible
systemCompatible
```

Optional compatibility results should be present only when their corresponding input limits were supplied.

### 9.1 Required controller PV voltage

`requiredControllerPVVoltageV` represents the PV operating-voltage requirement of the design.

Where a maximum PV voltage requirement is evaluated, it must be exposed separately rather than conflating operating voltage and maximum voltage.

### 9.2 Recommended nominal rating

The module must not silently produce a vendor or commercial product recommendation.

If a deterministic nominal controller rating is ever exposed, its candidate ratings must come from an explicit input or project-owned rating table and the selection rule must be documented and traceable.

---

## 10. Units

| Quantity | Unit |
|---|---|
| PV power | W |
| PV voltage | V |
| PV current | A |
| Battery voltage | V |
| Charging current | A |
| Controller current | A |
| Design margin | ratio |
| Efficiency | ratio |
| Controller rating | A |
| Quantity/count values | integer |

No silent unit conversion is permitted.

Where the surrounding foundation supplies unit-aware quantities, the module should use those contracts instead of embedding its own conversion system.

---

## 11. Validation Contract

Validation must be deterministic, non-mutating, and based only on explicit contract fields.

All validation failures use the foundation type:

```ts
EngineeringIssue
```

### 11.1 Basic validation

Applicable values include:

```text
PV power > 0
PV operating voltage > 0
PV input current > 0
battery voltage > 0
0 < controller efficiency <= 1
0 <= design margin <= 1
valid controller type
```

Derived values such as charging current must also remain positive after calculation.

### 11.2 Controller parameter validation

Where controller limits are supplied:

```text
controller rated current > 0
controller maximum PV voltage > 0
controller minimum PV voltage > 0
controller maximum PV current > 0
controller battery-voltage limits > 0
```

Ranges must themselves be coherent.

For example:

```text
minimum PV voltage <= maximum PV voltage
minimum battery voltage <= maximum battery voltage
```

### 11.3 Relationship validation

Where all three PV operating quantities are explicitly supplied:

```text
PV power
PV operating voltage
PV operating current
```

their electrical relationship must be checked deterministically.

```text
PV power = PV voltage × PV current
```

If a tolerance is required because upstream values are rounded, that tolerance must be an explicit named constant and must not be hidden inside the calculation.

The validator must report the mismatch rather than silently changing one supplied quantity.

### 11.4 Compatibility validation

Applicable compatibility checks include:

- PV operating voltage against controller PV operating limits
- PV open-circuit voltage against controller maximum PV voltage
- PV current against controller maximum PV current
- required controller current against controller rated current
- battery/system voltage against controller battery-voltage limits

The absence of an optional limit means that specific compatibility check is not evaluated; it does not create a fabricated limit.

### 11.5 Validation behavior

Validation must:

- collect all applicable failures
- preserve field paths
- preserve error codes
- preserve actual values where appropriate
- never mutate the input
- never clamp values into an allowed range
- never substitute defaults silently

---

## 12. Assumptions

Use the foundation type:

```ts
EngineeringAssumption
```

Potential assumption codes include:

```text
CHARGE_CONTROLLER_DESIGN_MARGIN
CHARGE_CONTROLLER_EFFICIENCY
CHARGE_CONTROLLER_TYPE
CHARGE_CONTROLLER_VOLTAGE_MARGIN
```

Only assumptions actually consumed by the calculation should be returned.

Examples:

```text
CHARGE_CONTROLLER_DESIGN_MARGIN
    design margin applied to the required charging current

CHARGE_CONTROLLER_EFFICIENCY
    controller efficiency used for battery-side charging-current calculation

CHARGE_CONTROLLER_TYPE
    controller technology used to select the explicit calculation model
```

`CHARGE_CONTROLLER_VOLTAGE_MARGIN` should only be returned when a documented voltage-margin calculation actually consumes it.

There must be:

- no hidden derating
- no hidden safety factor
- no undocumented efficiency
- no assumption that is not used by the calculation

---

## 13. Trace Contract

Use the foundation type:

```ts
CalculationTraceStep
```

The trace must explain the deterministic path from inputs to controller capacity.

Minimum conceptual trace:

```text
PV Array Power
      ↓
PV Operating Current
      ↓
Charging Current
      ↓
Design Margin
      ↓
Required Controller Current
      ↓
Controller Capacity
```

Voltage compatibility should be traceable separately where applicable:

```text
PV Operating Voltage
      ↓
PV Controller Requirement
      ↓
Compatibility Check

PV Open-Circuit Voltage
      ↓
Maximum Controller PV Voltage
      ↓
Compatibility Check

Battery Voltage
      ↓
Controller Battery-Voltage Requirement
      ↓
Compatibility Check
```

A trace step should make the following reconstructable where applicable:

- step ID
- step name
- description
- inputs
- outputs
- sequence
- formula or calculation description

The trace must not contain timestamps, random IDs, or mutable global state that makes identical calculations produce different traces.

---

## 14. Determinism

The module must guarantee:

- immutable inputs
- deterministic calculations
- deterministic output
- explicit assumptions
- reproducible trace
- no global mutable state
- no UI dependency
- no database dependency
- no network dependency
- no silent clamping
- no silent unit conversion
- no hidden derating
- no hidden safety factor

For the same valid input and calculation definition, the module must produce the same engineering value, validation outcome, assumptions, warnings, and trace content.

---

## 15. Errors, Warnings, and Result Lifecycle

Blocking input failures are represented as foundation engineering errors.

Advisory conditions are warnings and must not be disguised as validation failures.

The runtime entry point should use the generic core lifecycle so the final result is represented by the foundation `CalculationResult` contract.

Conceptually:

```text
ChargeControllerInput
        │
        ▼
validateChargeController
        │
        ├── errors ───────────────► error result
        │
        ▼
createChargeControllerAssumptions
        │
        ▼
calculateChargeControllerSizing
        │
        ▼
compatibility / advisory warnings
        │
        ▼
createChargeControllerTrace
        │
        ▼
CalculationResult<ChargeControllerOutput>
```

A warning result may still be mathematically valid. Warnings must not erase the calculated output.

---

## 16. Relationship to Other Solar Modules

The broader engineering sequence is:

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
Charge Controller
  ↓
Cable / Protection / System Integration
```

Battery Sizing supplies a separate contract to Charge Controller:

```text
Battery Sizing
     │
     └── battery/system voltage ──► Charge Controller
```

This means Charge Controller may consume battery-sizing results without depending on Battery implementation internals.

The exact execution order is therefore an application-level orchestration concern; the domain modules communicate through stable data contracts.

---

## 17. Tests

The intended tests are:

```text
__tests__/
├── calculation.test.ts
├── validation.test.ts
└── regression.test.ts
```

Tests should cover at minimum:

### Calculation

- valid MPPT sizing
- valid PWM sizing if an explicit PWM calculation contract is implemented
- PV current calculation
- charging-current calculation
- design-margin calculation
- controller-current requirement
- voltage calculations
- current compatibility
- voltage compatibility
- battery-voltage compatibility where limits are supplied

### Validation

- valid inputs
- invalid PV power
- invalid PV voltage
- invalid PV current
- invalid battery voltage
- invalid efficiency
- invalid design margin
- invalid controller type
- invalid controller limits
- reversed controller ranges
- inconsistent PV power/voltage/current relationship
- PV/controller voltage incompatibility
- PV/controller current incompatibility
- battery/controller voltage incompatibility

### Determinism and safety

- deterministic output
- deterministic trace
- input immutability
- no silent clamping
- no hidden margin
- no hidden derating
- no hidden unit conversion

### Regression

Regression tests must preserve all established charge-controller formulas and public behaviors that are intentionally retained by the migration.

---

## 18. Public API

The eventual public API should expose:

```text
ChargeControllerInput
ChargeControllerOutput
validateChargeController
calculatePVCurrent
calculateControllerCurrent
calculateControllerVoltage
calculateChargeControllerSizing
createChargeControllerAssumptions
createChargeControllerTrace
runChargeControllerSizing
```

Internal calculation helpers should remain internal unless they are deliberately promoted as stable domain API.

The module's public `index.ts` should be export-oriented and must not contain calculation business logic.

---

## 19. Target Structure

```text
charge-controller/
├── README.md
├── constants.ts
├── index.ts
├── run.ts
├── assumptions/
│   ├── charge-controller-assumptions.ts
│   └── index.ts
├── calculation/
│   ├── calculate-pv-current.ts
│   ├── calculate-controller-current.ts
│   ├── calculate-controller-voltage.ts
│   ├── calculate-charge-controller-sizing.ts
│   └── index.ts
├── trace/
│   ├── charge-controller-trace.ts
│   └── index.ts
├── types/
│   ├── charge-controller-input.ts
│   ├── charge-controller-output.ts
│   └── index.ts
├── validation/
│   ├── rules.ts
│   ├── validate-charge-controller.ts
│   └── index.ts
└── __tests__/
    ├── calculation.test.ts
    ├── validation.test.ts
    └── regression.test.ts
```

This README is the contract for the structure above. TypeScript implementation files must be introduced one task at a time.

---

## 20. Implementation Order

```text
01 README.md                              ← CURRENT TASK
02 types/charge-controller-input.ts
03 types/charge-controller-output.ts
04 types/index.ts
05 constants.ts
06 assumptions/charge-controller-assumptions.ts
07 assumptions/index.ts
08 validation/rules.ts
09 validation/validate-charge-controller.ts
10 validation/index.ts
11 calculation/calculate-pv-current.ts
12 calculation/calculate-controller-current.ts
13 calculation/calculate-controller-voltage.ts
14 calculation/calculate-charge-controller-sizing.ts
15 calculation/index.ts
16 trace/charge-controller-trace.ts
17 trace/index.ts
18 run.ts
19 index.ts
20 __tests__/calculation.test.ts
21 __tests__/validation.test.ts
22 __tests__/regression.test.ts
```

No later task should silently redefine the contract established here. If implementation discovers a missing engineering requirement, update this README first, then implement the change in a separate task.

---

## 21. Engineering Invariants

The following invariants are part of the module contract:

1. PV-side and battery-side electrical quantities remain distinct.
2. Controller technology is explicit.
3. MPPT and PWM formulas are never conflated.
4. Design margin is explicit and applied exactly once.
5. No hidden derating or safety factor is introduced.
6. Controller voltage compatibility is evaluated independently from current sizing.
7. Supplied inputs are never silently overwritten.
8. Optional compatibility checks are evaluated only when their required inputs exist.
9. Validation is non-mutating.
10. Results and traces are deterministic.
11. The module calculates engineering capacity; it does not select vendors or products.
12. Battery and Charge Controller communicate through data contracts rather than circular implementation dependencies.
13. Foundation contracts are reused rather than duplicated inside the module.
14. No UI, database, network, or application-service logic belongs in this module.

---

## 22. Definition of Done for the Contract

The Charge Controller README-first contract is complete when:

```text
[ ] ChargeControllerInput is explicitly defined
[ ] ChargeControllerOutput is explicitly defined
[ ] PV-side and battery-side quantities are separated
[ ] controller type is explicit
[ ] MPPT behavior is explicitly documented
[ ] PWM behavior is explicitly documented or explicitly deferred
[ ] current-sizing formulas are explicit
[ ] design margin is explicit
[ ] voltage checks are independent from current sizing
[ ] validation rules are explicit
[ ] assumptions are explicit
[ ] trace requirements are explicit
[ ] deterministic behavior is explicit
[ ] module ownership boundaries are explicit
[ ] public API is explicit
[ ] implementation order is explicit
[ ] no TypeScript implementation is required by this task
```

---

## 23. Final Principle

Charge Controller Sizing is an engineering calculation module, not a product-selection system.

Its responsibility is to transform a validated, explicit PV/battery/controller contract into a reproducible electrical-capacity requirement.

```text
Explicit Inputs
      ↓
Validation
      ↓
Explicit Assumptions
      ↓
Deterministic Electrical Calculation
      ↓
Current + Voltage Requirements
      ↓
Compatibility Results
      ↓
Traceable Engineering Output
```

The implementation must remain faithful to this contract and must not introduce behavior that is not represented by an explicit input, assumption, formula, validation rule, or trace step.
