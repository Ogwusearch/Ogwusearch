# PV String

PV string electrical calculation module for `@ogwusearch/solar-engine`.

This module provides deterministic calculations for photovoltaic modules connected in series to form a PV string.

## Responsibilities

PV String owns:

* PV string voltage calculations
* PV string current calculations
* PV string power calculations
* Open-circuit voltage calculations
* Maximum-power voltage calculations
* String configuration validation
* Engineering warnings
* PV String assumptions
* PV String trace support

Generic engineering contracts and execution infrastructure belong to the shared engineering foundation packages.

## Dependencies

```text
@ogwusearch/engineering-types
@ogwusearch/engineering-validation
@ogwusearch/engineering-core
```

Dependency direction:

```text
engineering-types
      ↑
engineering-validation
      ↑
engineering-core
      ↑
solar-engine
      ↑
pv-string
```

Foundation packages must not depend on `solar-engine`.

## Module Structure

```text
pv-string/
├── README.md
├── constants.ts
├── errors.ts
├── warnings.ts
├── index.ts
├── run.ts
│
├── types/
│   ├── index.ts
│   ├── pv-string-input.ts
│   ├── pv-string-output.ts
│   └── pv-string.ts
│
├── validation/
│   ├── index.ts
│   └── validate-pv-string.ts
│
├── assumptions/
│   ├── index.ts
│   └── pv-string-assumptions.ts
│
├── calculation/
│   ├── index.ts
│   └── calculate-pv-string.ts
│
├── trace/
│   ├── index.ts
│   └── pv-string-trace.ts
│
└── __tests__/
    ├── calculate.test.ts
    └── validation.test.ts
```

## Input

```ts
import type { CalculationInput } from "@ogwusearch/engineering-types";

export interface PvStringInput extends CalculationInput {
  readonly modulePowerW: number;
  readonly moduleVmpV: number;
  readonly moduleImpA: number;
  readonly moduleVocV: number;
  readonly moduleIscA: number;
  readonly modulesPerString: number;
  readonly maxStringVoltageV?: number;
}
```

| Parameter           | Description                               | Unit  |
| ------------------- | ----------------------------------------- | ----- |
| `modulePowerW`      | Rated module power                        | W     |
| `moduleVmpV`        | Module voltage at maximum power           | V     |
| `moduleImpA`        | Module current at maximum power           | A     |
| `moduleVocV`        | Module open-circuit voltage               | V     |
| `moduleIscA`        | Module short-circuit current              | A     |
| `modulesPerString`  | Number of modules connected in series     | count |
| `maxStringVoltageV` | Optional maximum permitted string voltage | V     |

## Output

```ts
import type { CalculationOutput } from "@ogwusearch/engineering-types";

export interface PvStringOutput extends CalculationOutput {
  readonly modulesPerString: number;
  readonly stringVmpV: number;
  readonly stringImpA: number;
  readonly stringVocV: number;
  readonly stringIscA: number;
  readonly stringPowerW: number;
}
```

## Calculation Model

PV String calculations preserve the repository's existing engineering mathematics.

For modules connected in series:

```text
String Vmp = module Vmp × modules per string
String Voc = module Voc × modules per string
String Imp = module Imp
String Isc = module Isc
```

The existing implementation remains the source of truth for string power and any other calculation details. Architectural migration must not alter those formulas.

Calculation functions are pure and must not modify inputs, access application state, perform network requests, access databases, or depend on mutable global state.

## Validation

PV String validation uses the shared engineering validation infrastructure.

Current domain validation covers:

```text
module power > 0
module Vmp > 0
module Imp > 0
module Voc > 0
module Isc > 0

modules per string >= 1
modules per string is an integer

optional maximum string voltage > 0

module Vmp <= module Voc
module Imp <= module Isc

calculated string Voc <= configured maximum string voltage
```

Validation collects relevant errors rather than stopping at the first error.

Standardized validation API:

```ts
validatePvStringIssues(input)
```

Backward-compatible validation API:

```ts
validatePvStringInput(input)
```

## Error Codes

```text
PV_STRING_INVALID_MODULE_POWER
PV_STRING_INVALID_MODULE_VMP
PV_STRING_INVALID_MODULE_IMP
PV_STRING_INVALID_MODULE_VOC
PV_STRING_INVALID_MODULE_ISC
PV_STRING_INVALID_MODULES_PER_STRING
PV_STRING_INVALID_MAX_STRING_VOLTAGE
PV_STRING_VMP_EXCEEDS_VOC
PV_STRING_IMP_EXCEEDS_ISC
PV_STRING_VOC_EXCEEDS_LIMIT
```

## Warnings

Warnings do not invalidate an otherwise valid calculation.

Current warning:

```text
PV_STRING_SINGLE_MODULE_STRING
```

This identifies a string containing only one module.

Shared issue severity values are:

```ts
"ERROR"
"WARNING"
```

## Assumptions

PV String assumptions use the shared `EngineeringAssumption` contract.

The assumptions module describes domain assumptions without performing engineering calculations.

```text
assumptions/pv-string-assumptions.ts
```

## Calculation Execution

The standard execution flow is:

```text
PvStringInput
    ↓
Validation
    ↓
engineering-core
    ├── assumptions
    ├── calculation
    ├── warnings
    └── trace
    ↓
CalculationResult<PvStringOutput>
```

Public runner:

```ts
runPvString(input)
```

The runner delegates lifecycle orchestration to `@ogwusearch/engineering-core`.

## Trace

PV String exposes:

```ts
createPvStringTrace(steps)
```

using the shared `CalculationTrace` and `CalculationTraceStep` contracts from `@ogwusearch/engineering-types`.

PV String does not create a separate execution lifecycle.

## Compatibility

Architectural migration must preserve existing public behavior.

* Existing engineering formulas must not change.
* Existing validation conditions must not change.
* Existing validation messages must not change.
* Existing error codes must not change.
* Existing warning codes must not change.
* Existing regression behavior must not change.
* Compatibility wrappers may remain where necessary.
* There must be a single engineering implementation for each calculation.

## Testing

Tests should cover normal, boundary, invalid, warning, immutability, and deterministic cases.

Run PV String tests:

```bash
pnpm exec vitest run packages/solar-engine/src/pv-string
```

Run TypeScript validation:

```bash
pnpm exec tsc --noEmit
```

## Non-Responsibilities

PV String does not own:

* UI components
* Database persistence
* REST or GraphQL APIs
* Authentication
* Generic units infrastructure
* Generic validation infrastructure
* Generic calculation orchestration
* Purchasing workflows

Those responsibilities remain in the appropriate application or foundation package.

## Public API

The public boundary is defined by `index.ts` and exposes the module's types, constants, validation, assumptions, calculation, trace, warning, and execution APIs.

Consumers should import from the PV String public boundary rather than internal implementation files.

## Migration Rule

> Change structure and contracts where necessary, but do not change the underlying engineering mathematics.

Any deliberate engineering-model change must be treated separately from architectural migration and protected by explicit regression tests.
