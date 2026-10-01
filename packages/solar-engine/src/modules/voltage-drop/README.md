# Voltage Drop Module

Electrical voltage-drop calculation and validation module for the Ogwusearch Solar Engine.

The `voltage-drop` module determines voltage drop across an electrical conductor or circuit section, evaluates the resulting voltage at the load, and optionally evaluates the result against an allowable voltage-drop limit.

The module is deterministic, unit-aware, traceable, and independent of UI, database, network, and application concerns.

---

## Purpose

The Voltage Drop module answers:

> **Given a circuit current, conductor resistance/impedance characteristics, conductor length, and system voltage, what voltage is lost across the circuit and what voltage remains at the load?**

It supports engineering workflows such as:

* DC battery-to-inverter circuits
* PV array circuits
* AC feeder circuits
* inverter-to-load circuits
* controller-to-battery circuits
* other electrical circuit sections where voltage-drop evaluation is required

The module does **not** determine the complete cable size by itself unless the cable-sizing contract explicitly delegates that responsibility to it.

---

## Position in the Engineering Architecture

```text
engineering-types
        │
        ├── engineering-units
        │
        ├── engineering-validation
        │
        └── engineering-core
                │
                ▼
          solar-engine
                │
                ▼
        voltage-drop module
```

Within the Solar Engine:

```text
Load
  │
  ├──► Peak Demand ───────► Inverter
  │
  └──► Energy ────────────► Battery / PV

PV / Battery / Inverter / Load
  │
  ▼
Cable
  │
  ▼
Voltage Drop
  │
  └──► System Validation
```

The module consumes electrical requirements supplied by upstream calculations. It should not silently recreate load, inverter, battery, or PV sizing calculations.

---

## Responsibilities

The module owns:

* voltage-drop calculations
* voltage-drop percentage calculations
* load-side voltage calculations
* circuit-side electrical relationships required by voltage-drop analysis
* validation of voltage-drop-specific inputs
* allowable voltage-drop evaluation
* voltage-drop warnings
* calculation assumptions
* calculation trace information
* deterministic engineering output

The module may evaluate supplied conductor characteristics such as:

* resistance
* impedance
* conductor length
* conductor cross-sectional area
* conductor material
* number of conductors
* temperature-adjusted resistance

when these are part of the established calculation contract.

---

## Non-Responsibilities

The module does not own:

* load sizing
* peak-demand calculations
* energy calculations
* PV sizing
* battery sizing
* inverter sizing
* complete cable selection
* protection-device selection
* earthing design
* generator sizing
* UI logic
* database operations
* HTTP/API handling
* browser logic
* AI/LLM logic
* MCP/tool exposure

Application and integration layers may consume the module's results.

---

# Calculation Model

The fundamental voltage-drop relationship is:

```text
Vdrop = I × R
```

where:

```text
Vdrop = voltage drop in volts
I     = circuit current in amperes
R     = circuit resistance in ohms
```

For a supplied resistance:

```text
voltageDropV =
  operatingCurrentA × resistanceOhm
```

The resulting load voltage is:

```text
loadVoltageV =
  sourceVoltageV - voltageDropV
```

Voltage-drop percentage is:

```text
voltageDropPercent =
  (voltageDropV / sourceVoltageV) × 100
```

When the calculation contract uses a conductor resistivity model, resistance may be determined from:

```text
R = ρL / A
```

where:

```text
R = conductor resistance
ρ = conductor resistivity
L = conductor length
A = conductor cross-sectional area
```

For a two-conductor DC circuit, the electrical path length must account for the complete current path when required by the selected calculation model.

For AC circuits, impedance and power factor may be required depending on the calculation method.

The module must use the explicitly defined calculation contract rather than silently selecting a different electrical model.

---

# Input Contract

The exact TypeScript interface is authoritative.

Conceptually, a voltage-drop calculation may require:

```ts
interface VoltageDropInput {
  readonly sourceVoltageV: number;
  readonly operatingCurrentA: number;
  readonly resistanceOhm?: number;
  readonly conductorLengthM?: number;
  readonly conductorAreaMm2?: number;
  readonly allowableVoltageDropPercent?: number;
}
```

The actual interface may contain additional fields required by the implementation.

Optional inputs must remain optional in the TypeScript contract.

The module must not silently substitute arbitrary engineering values for omitted required inputs.

---

# Output Contract

A successful calculation should expose the quantities required by downstream engineering modules.

Conceptually:

```ts
interface VoltageDropOutput {
  readonly voltageDropV: number;
  readonly voltageDropPercent: number;
  readonly loadVoltageV: number;
  readonly allowableVoltageDropPercent?: number;
  readonly withinAllowableLimit?: boolean;
}
```

The actual exported TypeScript output interface is authoritative.

Where a selected cable or conductor is supplied, compatibility information may additionally identify whether the resulting voltage drop satisfies the specified limit.

---

# Calculation Lifecycle

The module follows the standard engineering calculation lifecycle:

```text
Input
  │
  ▼
Validate
  │
  ├── invalid ───────► CalculationResult(ERROR)
  │
  ▼
Assumptions
  │
  ▼
Calculate
  │
  ▼
Validate Result
  │
  ▼
Warnings
  │
  ▼
CalculationResult
```

The execution lifecycle is provided by `engineering-core`.

The module should therefore avoid implementing a second independent result/execution framework.

---

# engineering-core Integration

The module should use the shared calculation lifecycle from:

```text
@ogwusearch/engineering-core
```

The intended structure is:

```ts
import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";
```

A module runner should conceptually follow:

```ts
export function runVoltageDrop(
  input: VoltageDropInput,
): CalculationResult<VoltageDropOutput> {
  const definition = defineCalculation<
    VoltageDropInput,
    VoltageDropOutput
  >({
    name: "Voltage Drop",

    validate(input) {
      return validateVoltageDropInput(input);
    },

    assumptions(input) {
      return createVoltageDropAssumptions(input);
    },

    warnings(input, output) {
      return createVoltageDropWarnings(input, output);
    },

    calculate(input, context) {
      return calculateVoltageDrop(input, context);
    },
  });

  return executeCalculation(
    definition,
    input,
  );
}
```

The exact implementation should follow the current `engineering-core` API.

---

# Validation

Validation must occur before engineering calculations are executed.

Typical validation requirements include:

* source voltage must be finite and greater than zero
* operating current must be finite and non-negative or positive according to the calculation contract
* resistance must not be negative
* conductor length must not be negative
* conductor area must be greater than zero
* allowable voltage-drop percentage must be within a valid engineering range
* required combinations of conductor inputs must be present
* calculated quantities must remain finite

Validation errors should use the shared:

```ts
EngineeringIssue
```

contract.

Do not use a module-specific replacement for the foundation issue contract.

---

# Warnings

Warnings represent conditions that do not necessarily invalidate the mathematical calculation but require engineering attention.

Examples include:

* voltage drop approaching the allowable limit
* voltage-drop percentage exceeding the supplied design threshold
* unusually high circuit current
* unusually long conductor length
* low remaining load voltage
* assumptions requiring engineering review

Warnings should use the shared engineering warning/result infrastructure.

A warning must not silently convert an invalid engineering condition into a valid result.

---

# Assumptions

Assumptions must be explicit and traceable.

Possible assumptions include:

```text
source voltage
operating current
conductor length
conductor resistance
conductor cross-sectional area
conductor resistivity
allowable voltage-drop percentage
temperature condition
AC/DC electrical model
```

An assumption must not be presented as an equipment specification unless it actually originates from an equipment specification.

Generic defaults should be clearly identified as modeling assumptions.

---

# Traceability

Voltage-drop calculations should produce a deterministic calculation trace.

A typical trace may contain:

```text
1. Operating Current
2. Conductor Resistance
3. Voltage Drop
4. Load Voltage
5. Voltage Drop Percentage
6. Allowable Voltage Drop Evaluation
```

Example:

```json
{
  "id": "voltage-drop-calculation",
  "name": "Voltage Drop",
  "description": "Calculate voltage lost across the electrical circuit.",
  "formula": "voltageDrop = current × resistance",
  "inputs": {
    "operatingCurrentA": 18,
    "resistanceOhm": 0.12
  },
  "outputs": {
    "voltageDropV": 2.16
  },
  "unit": "V"
}
```

Trace steps should use the shared `CalculationTraceStep` contract.

The trace should explain **what was calculated, from which inputs, and using which formula**.

---

# Units

The module uses explicit SI-style engineering units.

Common units include:

| Quantity                | Unit |
| ----------------------- | ---- |
| Voltage                 | V    |
| Current                 | A    |
| Resistance              | Ω    |
| Impedance               | Ω    |
| Length                  | m    |
| Conductor area          | mm²  |
| Voltage drop            | V    |
| Voltage drop percentage | %    |

Unit conversion should be explicit.

The module must not silently interpret incompatible units.

Where appropriate, reusable unit functionality belongs in:

```text
@ogwusearch/engineering-units
```

rather than being duplicated inside the Solar Engine.

---

# Determinism

For the same validated input and calculation configuration:

```text
same input
   ↓
same assumptions
   ↓
same calculation
   ↓
same output
   ↓
same trace
```

The module must not depend on:

* current time
* random values
* network state
* database state
* browser state
* mutable global configuration

unless explicitly introduced through the calculation context.

---

# Precision

Voltage-drop calculations should preserve mathematical precision internally.

Do not round intermediate calculations merely to make output visually convenient.

For example:

```text
18 × 1.2
```

may produce a JavaScript floating-point representation such as:

```text
21.599999999999998
```

Tests should therefore use appropriate floating-point assertions such as:

```ts
expect(value).toBeCloseTo(21.6, 10);
```

rather than changing engineering formulas solely to accommodate binary floating-point representation.

Presentation-layer rounding is separate from engineering calculation precision.

---

# Compatibility Evaluation

When equipment or design limits are supplied, the module may evaluate compatibility.

Conceptually:

```text
calculated voltage drop
        │
        ▼
allowable voltage drop
        │
        ▼
compatibility
```

For example:

```text
withinAllowableLimit =
  voltageDropPercent <= allowableVoltageDropPercent
```

Compatibility is an evaluation of the supplied design/equipment parameters.

It should not be interpreted as certification or standards compliance unless the applicable standard, edition, jurisdiction, and calculation requirements have explicitly been supplied.

---

# Relationship With Cable Sizing

Cable sizing and voltage-drop analysis are related but distinct responsibilities.

```text
Cable Sizing
    │
    ├── conductor selection
    ├── ampacity
    ├── installation constraints
    └── candidate conductor
             │
             ▼
       Voltage Drop
             │
             ├── voltage loss
             ├── load voltage
             └── allowable-limit evaluation
```

A cable may be thermally adequate while failing a voltage-drop requirement.

Conversely, a conductor may satisfy a voltage-drop requirement while requiring additional ampacity, protection, installation, or thermal evaluation.

Therefore voltage-drop results should be considered alongside other electrical design constraints.

---

# Relationship With Protection

Protection sizing should not be derived solely from voltage-drop results.

The broader relationship is:

```text
Load
  │
  ▼
Operating Current
  │
  ├────────► Cable Sizing
  │
  ├────────► Protection
  │
  └────────► Voltage Drop
```

Each module owns its specific engineering calculation.

---

# Relationship With Inverter and Battery

For DC systems:

```text
Battery
   │
   ▼
DC Current
   │
   ▼
Cable
   │
   ▼
Voltage Drop
   │
   ▼
Inverter DC Input
```

The voltage-drop module evaluates the electrical circuit between the supplied source and load conditions.

It does not determine inverter sizing or battery sizing.

Those calculations remain owned by their respective modules.

---

# Error Handling

Calculation failures must use the shared engineering result model.

Expected result states are:

```text
SUCCESS
WARNING
ERROR
```

Conceptually:

```ts
CalculationResult<VoltageDropOutput>
```

Errors should be represented using the shared engineering error/issue contracts.

The module should not return ad-hoc result objects that omit required fields such as:

```text
valid
status
errors
warnings
assumptions
trace
metadata
```

The execution framework is responsible for assembling the final calculation result.

---

# Testing

The module should maintain tests for:

### Calculation

* basic voltage-drop calculation
* zero or minimal voltage drop where valid
* load voltage calculation
* voltage-drop percentage
* conductor resistance calculation where supported
* allowable-limit evaluation
* deterministic results

### Validation

* missing required values
* zero values where invalid
* negative values
* non-finite values
* invalid voltage-drop limits
* incompatible input combinations

### Regression

Regression tests should protect established engineering formulas and expected behavior.

Tests should verify formulas rather than implementation details.

---

# Example

Given:

```text
Source voltage = 230 V
Operating current = 18 A
Circuit resistance = 0.12 Ω
```

Voltage drop:

```text
Vdrop = I × R
      = 18 × 0.12
      = 2.16 V
```

Load voltage:

```text
Vload = Vsource - Vdrop
      = 230 - 2.16
      = 227.84 V
```

Voltage-drop percentage:

```text
Vdrop% = (2.16 / 230) × 100
       ≈ 0.939%
```

The calculation result should retain the underlying numerical precision. Any display rounding should occur outside the engineering calculation layer.

---

# Design Principles

The module follows the Solar Engine engineering principles:

1. **Deterministic**
   Identical validated inputs produce identical results.

2. **Traceable**
   Calculations expose formulas, inputs, outputs, and sequence.

3. **Unit-aware**
   Electrical quantities use explicit engineering units.

4. **Validated**
   Invalid inputs are rejected before calculation.

5. **Assumptions are explicit**
   Defaults and engineering assumptions are visible.

6. **No silent mutation**
   Inputs are not modified.

7. **No silent clamping**
   Invalid values are not silently adjusted.

8. **No hidden conversion**
   Unit conversion must be explicit.

9. **Domain ownership**
   Voltage-drop mathematics belongs to this module.

10. **Foundation reuse**
    Execution, results, issues, assumptions, and traces come from the engineering foundation.

11. **No application coupling**
    The module remains independent of UI, database, API, browser, and AI infrastructure.

---

# Public API

The module should expose its public contract through:

```text
index.ts
```

Typical exports include:

```ts
runVoltageDrop
```

calculation functions:

```ts
calculateVoltageDrop
```

validation functions:

```ts
validateVoltageDropInput
```

assumption functions:

```ts
createVoltageDropAssumptions
```

trace functions where intentionally public:

```ts
createVoltageDropTrace
```

and the module's TypeScript input/output contracts.

Internal implementation helpers should not be exported unless they are part of the intentional public API.

---

# Directory Structure

The target structure is:

```text
voltage-drop/
├── README.md
├── index.ts
├── run.ts
├── types/
│   ├── index.ts
│   ├── input.ts
│   └── output.ts
├── validation/
│   ├── index.ts
│   ├── rules.ts
│   └── validate-voltage-drop.ts
├── assumptions/
│   ├── index.ts
│   └── voltage-drop-assumptions.ts
├── calculation/
│   ├── index.ts
│   ├── calculate-voltage-drop.ts
│   ├── calculate-load-voltage.ts
│   └── calculate-voltage-drop-percentage.ts
├── trace/
│   ├── index.ts
│   └── voltage-drop-trace.ts
├── warnings.ts
└── __tests__/
    ├── calculation.test.ts
    ├── validation.test.ts
    └── regression.test.ts
```

The actual repository structure may contain fewer or additional files. The architectural responsibilities are more important than forcing files that are not required.

---

# Engineering Boundary

The voltage-drop module should answer:

> **How much voltage is lost in this electrical circuit, what voltage reaches the load, and does the supplied design satisfy the specified voltage-drop limit?**

It should not answer:

> **Which complete electrical system should be purchased or installed?**

System-level decisions remain outside the module and require the combined results of load, energy, PV, battery, inverter, cable, protection, earthing, and other engineering modules.
