# Inverter Sizing Module

The Inverter Sizing module calculates inverter requirements and evaluates compatibility between the connected loads, DC system, and inverter specifications.

The module is part of the `solar-engine` package and is intentionally independent of UI, API, database, React, FastAPI, MCP, and browser-specific code.

## Responsibilities

The module covers:

* Continuous AC power requirement
* Surge AC power requirement
* Apparent power when power factor is supplied
* DC input power requirement
* DC input current requirement
* Inverter continuous capacity
* Inverter surge capacity
* DC input voltage compatibility
* AC output voltage compatibility
* Overall inverter system compatibility
* Engineering warnings
* Calculation trace
* Input validation

## Structure

```text
inverter/
├── README.md
├── constants.ts
├── errors.ts
├── warnings.ts
├── index.ts
├── run.ts
│
├── types/
│   ├── index.ts
│   ├── engineering-message.ts
│   ├── inverter-sizing-input.ts
│   ├── inverter-sizing-output.ts
│   └── inverter-sizing-result.ts
│
├── validation/
│   ├── index.ts
│   ├── rules.ts
│   └── validate-inverter.ts
│
├── assumptions/
│   ├── index.ts
│   └── inverter-assumptions.ts
│
├── calculation/
│   ├── index.ts
│   ├── calculate-continuous-power.ts
│   ├── calculate-surge-requirement.ts
│   ├── calculate-ac-output.ts
│   ├── calculate-dc-input.ts
│   ├── calculate-inverter-capacity.ts
│   └── calculate-inverter-sizing.ts
│
├── trace/
│   ├── index.ts
│   └── inverter-sizing-trace.ts
│
└── __tests__/
    ├── calculation.test.ts
    ├── regression.test.ts
    ├── validation.test.ts
    ├── warnings.test.ts
    └── trace.test.ts
```

## Architecture

The module follows a strict separation of responsibilities:

```text
Input
  │
  ▼
Validation
  │
  ├── invalid → Engineering Errors
  │
  ▼
Calculation
  │
  ▼
Warnings
  │
  ▼
Trace
  │
  ▼
Engineering Result
```

The public execution entry point is:

```ts
runInverterSizing(input)
```

## Calculation responsibilities

### Continuous power

`calculate-continuous-power.ts`

Calculates the continuous AC output power requirement from the continuous load.

```text
requiredContinuousOutputPowerW
    = continuousLoadW
```

### Surge requirement

`calculate-surge-requirement.ts`

Calculates the required surge AC output power.

```text
requiredSurgeOutputPowerW
    = surgeLoadW
```

### AC output

`calculate-ac-output.ts`

Coordinates the AC-side calculations and calculates apparent power when a power factor is supplied.

```text
requiredContinuousVA
    = continuousLoadW / powerFactor
```

### DC input

`calculate-dc-input.ts`

Calculates DC input power after accounting for inverter efficiency and calculates the corresponding DC input currents.

```text
requiredContinuousInputPowerW
    = continuousLoadW / inverterEfficiency

requiredSurgeInputPowerW
    = surgeLoadW / inverterEfficiency

requiredContinuousDCInputCurrentA
    = requiredContinuousInputPowerW / systemVoltageV

requiredSurgeDCInputCurrentA
    = requiredSurgeInputPowerW / systemVoltageV
```

### Inverter capacity

`calculate-inverter-capacity.ts`

Evaluates the supplied inverter continuous and surge ratings.

```text
continuousMarginW
    = inverterRatedPowerW
      - requiredContinuousOutputPowerW

continuousCompatible
    = continuousMarginW >= 0

surgeMarginW
    = inverterSurgePowerW
      - requiredSurgeOutputPowerW

surgeCompatible
    = surgeMarginW >= 0
```

### Inverter sizing

`calculate-inverter-sizing.ts`

Coordinates the specialized calculation functions and assembles the final `InverterSizingValue`.

It also evaluates:

```text
DC input voltage compatibility
AC output voltage compatibility
overall system compatibility
```

## Compatibility behavior

The overall `systemCompatible` value is based only on compatibility checks that are actually available.

The available checks are:

```text
continuousCompatible
surgeCompatible
inputVoltageCompatible
outputVoltageCompatible
```

When one or more checks are supplied:

```text
systemCompatible
    = every supplied compatibility check is true
```

When no compatibility checks are available, `systemCompatible` remains undefined.

## Validation

Validation is handled separately from calculation.

```text
validation/
├── rules.ts
└── validate-inverter.ts
```

Validation covers:

* Continuous load
* Surge load
* Surge-to-continuous load relationship
* System voltage
* Inverter efficiency
* Power factor
* Continuous inverter rating
* Inverter surge rating
* Surge-to-continuous inverter rating relationship
* Minimum inverter input voltage
* Maximum inverter input voltage
* Input voltage range
* Required output voltage
* Inverter output voltage

The established engineering error codes and messages in `errors.ts` are preserved as the module contract.

## Warnings

`warnings.ts` produces engineering warnings for conditions that are valid inputs but deserve attention.

Current warning conditions include:

```text
Low inverter efficiency
Low power factor
Low continuous power margin
Low surge power margin
Insufficient continuous capacity
Insufficient surge capacity
Input voltage mismatch
Output voltage mismatch
High DC input current
Overall system incompatibility
```

Warnings do not replace validation errors.

```text
Invalid input
    → error

Valid but potentially concerning condition
    → warning
```

## Assumptions

`assumptions/inverter-assumptions.ts` documents the engineering assumptions applicable to a calculation.

Assumptions are informational and do not perform calculations or validation.

## Trace

The trace layer is responsible for making the calculation auditable.

```text
trace/
├── index.ts
└── inverter-sizing-trace.ts
```

The trace records:

* Formula expressions
* Engineering assumptions
* Input values
* Calculated values
* Compatibility results

The trace does not perform the calculation itself.

## Result contract

A successful calculation returns:

```ts
{
  success: true,
  value,
  errors: [],
  warnings,
  trace,
  metadata
}
```

An invalid calculation returns:

```ts
{
  success: false,
  errors,
  warnings: [],
  metadata
}
```

Metadata identifies:

```text
engine
version
unitSystem
```

The unit system is:

```text
SI
```

## Engineering formulas

The formulas implemented by this module are established module behavior.

Refactoring the file structure must not alter:

* Formula definitions
* Calculation order where behavior depends on it
* Validation rules
* Warning thresholds
* Error codes
* Warning codes
* Compatibility semantics
* Output field names

Structural refactoring and engineering-model changes are treated as separate concerns.

## Public entry point

Consumers should use:

```ts
import {
  runInverterSizing,
} from "./inverter";
```

Example:

```ts
const result = runInverterSizing({
  continuousLoadW: 5000,
  surgeLoadW: 8000,
  systemVoltageV: 48,
  inverterEfficiency: 0.92,
  powerFactor: 0.8,
  inverterRatedPowerW: 6000,
  inverterSurgePowerW: 10000,
  inverterInputVoltageMinV: 40,
  inverterInputVoltageMaxV: 60,
  requiredOutputVoltageV: 230,
  inverterOutputVoltageV: 230,
});
```

The result contains the calculated engineering values together with validation status, warnings, trace information, and metadata.

## Architectural boundary

The inverter module is an engineering domain module.

```text
                    solar-engine
                         │
                         ▼
                     inverter
                         │
        ┌────────────────┼────────────────┐
        │                │                │
     types          calculation       validation
        │                │                │
        └────────────────┼────────────────┘
                         │
              ┌──────────┴──────────┐
              │                     │
           warnings              trace
```

Application layers should call the module rather than reproducing inverter calculations elsewhere.
