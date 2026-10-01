# PV Array

PV array configuration and electrical calculation module for `@ogwusearch/solar-engine`.

This module provides deterministic calculations for photovoltaic modules configured into series strings and parallel strings to form a complete PV array.

The module preserves the repository's existing engineering mathematics while providing a structured domain boundary for PV array configuration, validation, assumptions, warnings, calculation, and trace support.

## Responsibilities

PV Array owns:

* PV array configuration calculations
* modules-per-string calculations
* parallel-string calculations
* total PV module count
* PV array voltage calculations
* PV array current calculations
* PV array power calculations
* PV array capacity calculations
* array configuration validation
* engineering warnings
* PV Array assumptions
* PV Array trace support

Generic engineering contracts and execution infrastructure belong to the shared engineering foundation packages.

## Dependencies

```text
@ogwusearch/engineering-types

@ogwusearch/engineering-units

@ogwusearch/engineering-validation

@ogwusearch/engineering-core
```

Dependency direction:

```text
engineering-types
       ↑
   ┌───┴────────────────────┐
   │                        │
engineering-units    engineering-validation
   │                        │
   └──────────┬─────────────┘
              │
      engineering-core
              │
              ↑
        solar-engine
              ↑
           pv-array
```

Foundation packages must not depend on `solar-engine`.

## Module Structure

```text
pv-array/

├── README.md
├── constants.ts
├── errors.ts
├── warnings.ts
├── index.ts
├── run.ts
│
├── types/
│   ├── index.ts
│   ├── pv-array-input.ts
│   ├── pv-array-output.ts
│   └── pv-array.ts
│
├── validation/
│   ├── index.ts
│   └── validate-pv-array.ts
│
├── assumptions/
│   ├── index.ts
│   └── pv-array-assumptions.ts
│
├── calculation/
│   ├── index.ts
│   └── calculate-pv-array.ts
│
├── trace/
│   ├── index.ts
│   └── pv-array-trace.ts
│
└── __tests__/
    ├── calculate.test.ts
    └── validation.test.ts
```

The exact structure may expand as additional PV array engineering contracts are introduced.

## Input

The PV Array input represents the electrical characteristics of the PV module and the desired series/parallel configuration.

```ts
import type { CalculationInput } from "@ogwusearch/engineering-types";

export interface PvArrayInput extends CalculationInput {
  readonly modulePowerW: number;

  readonly moduleVmpV: number;

  readonly moduleImpA: number;

  readonly moduleVocV: number;

  readonly moduleIscA: number;

  readonly modulesPerString: number;

  readonly parallelStrings: number;

  readonly maxArrayVoltageV?: number;

  readonly maxArrayCurrentA?: number;
}
```

| Parameter          | Description                              | Unit  |
| ------------------ | ---------------------------------------- | ----- |
| `modulePowerW`     | Rated PV module power                    | W     |
| `moduleVmpV`       | Module voltage at maximum power          | V     |
| `moduleImpA`       | Module current at maximum power          | A     |
| `moduleVocV`       | Module open-circuit voltage              | V     |
| `moduleIscA`       | Module short-circuit current             | A     |
| `modulesPerString` | Number of modules connected in series    | count |
| `parallelStrings`  | Number of strings connected in parallel  | count |
| `maxArrayVoltageV` | Optional maximum permitted array voltage | V     |
| `maxArrayCurrentA` | Optional maximum permitted array current | A     |

## Output

```ts
import type { CalculationOutput } from "@ogwusearch/engineering-types";

export interface PvArrayOutput extends CalculationOutput {
  readonly modulesPerString: number;

  readonly parallelStrings: number;

  readonly totalModules: number;

  readonly stringVmpV: number;

  readonly stringVocV: number;

  readonly stringImpA: number;

  readonly stringIscA: number;

  readonly arrayVmpV: number;

  readonly arrayVocV: number;

  readonly arrayImpA: number;

  readonly arrayIscA: number;

  readonly arrayPowerW: number;
}
```

The output represents the resulting electrical configuration of the complete PV array.

## Calculation Model

A PV array consists of PV modules connected in series to form strings, with those strings connected in parallel.

```text
PV Module
    │
    ├── Series
    │
    ▼
PV String
    │
    ├── Parallel
    │
    ▼
PV Array
```

### Total Module Count

```text
total modules =
modules per string × parallel strings
```

### String Voltage

For modules connected in series:

```text
String Vmp =
module Vmp × modules per string

String Voc =
module Voc × modules per string
```

### String Current

For modules connected in series, current remains approximately equal to the current of an individual module:

```text
String Imp =
module Imp

String Isc =
module Isc
```

### Array Current

For strings connected in parallel:

```text
Array Imp =
String Imp × parallel strings

Array Isc =
String Isc × parallel strings
```

### Array Voltage

For identical strings connected in parallel:

```text
Array Vmp =
String Vmp

Array Voc =
String Voc
```

### Array Power

The resulting array power is calculated from the configured module rating and total module count:

```text
Array Power =
module power × total modules
```

The existing implementation remains the source of truth for any additional calculation details.

Architectural migration must not alter established engineering formulas.

## Validation

PV Array validation uses the shared engineering validation infrastructure.

Current domain validation should cover:

```text
module power > 0

module Vmp > 0

module Imp > 0

module Voc > 0

module Isc > 0

modules per string >= 1

modules per string is an integer

parallel strings >= 1

parallel strings is an integer

optional maximum array voltage > 0

optional maximum array current > 0

module Vmp <= module Voc

module Imp <= module Isc

calculated array Voc <= configured maximum array voltage

calculated array Isc <= configured maximum array current
```

Validation collects relevant errors rather than stopping at the first error.

Standardized validation API:

```ts
validatePvArrayIssues(input)
```

Backward-compatible validation API, where retained:

```ts
validatePvArrayInput(input)
```

## Error Codes

The module's domain error codes should remain stable once established.

```text
PV_ARRAY_INVALID_MODULE_POWER

PV_ARRAY_INVALID_MODULE_VMP

PV_ARRAY_INVALID_MODULE_IMP

PV_ARRAY_INVALID_MODULE_VOC

PV_ARRAY_INVALID_MODULE_ISC

PV_ARRAY_INVALID_MODULES_PER_STRING

PV_ARRAY_INVALID_PARALLEL_STRINGS

PV_ARRAY_INVALID_MAX_ARRAY_VOLTAGE

PV_ARRAY_INVALID_MAX_ARRAY_CURRENT

PV_ARRAY_VMP_EXCEEDS_VOC

PV_ARRAY_IMP_EXCEEDS_ISC

PV_ARRAY_VOC_EXCEEDS_LIMIT

PV_ARRAY_ISC_EXCEEDS_LIMIT
```

Additional error codes may be introduced when new domain validation rules are added.

## Warnings

Warnings do not invalidate an otherwise valid calculation.

Warnings represent engineering conditions that may require review but do not prevent calculation execution.

Possible domain warnings include:

```text
PV_ARRAY_SINGLE_STRING

PV_ARRAY_SINGLE_MODULE_STRING

PV_ARRAY_HIGH_MODULE_COUNT
```

Only warning codes implemented by the module should be exposed as active public warnings.

Shared issue severity values are:

```ts
"ERROR"

"WARNING"
```

Warnings should be generated through the `CalculationDefinition.warnings` lifecycle supported by `@ogwusearch/engineering-core`.

## Assumptions

PV Array assumptions use the shared `EngineeringAssumption` contract.

The assumptions module describes domain assumptions without performing the engineering calculation itself.

```text
assumptions/pv-array-assumptions.ts
```

Typical assumptions may describe:

* identical modules within an array
* identical strings
* equal module count per string
* equal number of parallel strings
* electrical configuration assumptions
* applicable design limits

Assumptions must remain explicit and traceable.

## Calculation Execution

The standard execution flow is:

```text
PvArrayInput

    ↓

Validation

    ↓

engineering-core

    ├── assumptions
    ├── calculation
    ├── warnings
    └── trace

    ↓

CalculationResult<PvArrayOutput>
```

Public runner:

```ts
runPvArray(input)
```

The runner delegates lifecycle orchestration to:

```text
@ogwusearch/engineering-core
```

The PV Array module should not implement its own competing calculation lifecycle.

## Trace

PV Array exposes trace support through:

```ts
createPvArrayTrace(steps)
```

using the shared:

```ts
CalculationTrace
CalculationTraceStep
```

contracts from:

```text
@ogwusearch/engineering-types
```

The trace should make the configuration and resulting electrical values understandable.

A typical calculation trace is:

```text
Input
  ↓
Series module configuration
  ↓
String electrical values
  ↓
Parallel string configuration
  ↓
Array electrical values
  ↓
Total module count
  ↓
Array power
```

PV Array does not create a separate execution lifecycle.

## Compatibility

Architectural migration must preserve existing public behavior.

* Existing engineering formulas must not change.
* Existing validation conditions must not change.
* Existing validation messages must not change.
* Existing error codes must not change.
* Existing warning codes must not change.
* Existing regression behavior must not change.
* Existing public calculation behavior must not change.
* Compatibility wrappers may remain where necessary.
* There must be a single engineering implementation for each calculation.

The migration changes structure and contracts where necessary, not the underlying engineering mathematics.

## Relationship to PV String

PV String and PV Array are related but distinct engineering boundaries.

```text
PV Module
    │
    ▼
PV String
    │
    ├── modules connected in series
    │
    ▼
PV Array
    │
    ├── strings connected in parallel
    │
    ▼
Complete PV Array
```

`pv-string` calculates the electrical behavior of a single series string.

`pv-array` calculates the electrical behavior of multiple configured strings forming an array.

The modules should not duplicate each other's core calculations.

Where appropriate, PV Array may consume PV String-level concepts while maintaining a single implementation for each calculation.

## Relationship to PV Sizing

PV sizing determines the required photovoltaic capacity.

PV array configuration determines how physical PV modules can be arranged to provide that capacity.

```text
pv-sizing
    │
    │ required PV capacity
    ▼
pv-array
    │
    ├── modules per string
    ├── parallel strings
    ├── total modules
    └── array electrical characteristics
```

Conceptually:

```text
PV Sizing
    ↓
Required Capacity
    ↓
PV Array Configuration
    ↓
Actual Module Count
    ↓
Series / Parallel Arrangement
```

The two modules have different responsibilities and should remain independently testable.

## Calculation Purity

Calculation functions are pure.

They must not:

* modify input objects
* access application state
* perform network requests
* access databases
* access browser state
* depend on mutable global state
* introduce random values
* depend on current time

For identical input:

```ts
calculatePvArray(input)
```

must produce deterministic output.

## Testing

Tests should cover:

* normal configurations
* single-string configurations
* multiple-string configurations
* single-module strings
* boundary values
* invalid module values
* invalid configuration counts
* maximum voltage limits
* maximum current limits
* warning conditions
* deterministic results
* input immutability
* regression behavior

Run PV Array tests:

```bash
pnpm exec vitest run \
  packages/solar-engine/src/modules/pv-array
```

Run Solar Engine type validation:

```bash
pnpm --filter @ogwusearch/solar-engine typecheck
```

Build Solar Engine:

```bash
pnpm --filter @ogwusearch/solar-engine build
```

## Non-Responsibilities

PV Array does not own:

* UI components
* database persistence
* REST or GraphQL APIs
* authentication
* generic units infrastructure
* generic validation infrastructure
* generic calculation orchestration
* inverter sizing
* battery sizing
* charge-controller sizing
* cable sizing
* purchasing workflows

Those responsibilities remain in the appropriate application, foundation, or solar-engine module.

## Public API

The public boundary is defined by:

```text
index.ts
```

It should expose the module's intended:

* types
* constants
* error codes
* warning codes
* validation APIs
* assumptions
* calculation APIs
* trace APIs
* execution APIs

Consumers should import from the PV Array public boundary rather than internal implementation files.

Example:

```ts
import {
  runPvArray,
} from "@ogwusearch/solar-engine";
```

Internal implementation files should not become accidental public APIs.

## Migration Rule

> Change structure and contracts where necessary, but do not change the underlying engineering mathematics.

Any deliberate engineering-model change must be treated separately from architectural migration and protected by explicit regression tests.

The PV Array module should remain:

```text
deterministic
traceable
validated
unit-aware
assumption-aware
immutable
testable
domain-focused
```

while relying on `@ogwusearch/engineering-core` for the shared calculation lifecycle.

## Authoritative Module Paths

The authoritative PV Array module is:

```text
packages/solar-engine/src/modules/pv-array/
```

All PV Array implementation, tests, and public exports belong under this directory.

The authoritative module structure is:

```text
packages/solar-engine/src/modules/pv-array/
├── README.md
├── constants.ts
├── errors.ts
├── warnings.ts
├── index.ts
├── run.ts
│
├── types/
│   ├── index.ts
│   ├── pv-array-input.ts
│   ├── pv-array-output.ts
│   └── pv-array.ts
│
├── validation/
│   ├── index.ts
│   └── validate-pv-array.ts
│
├── assumptions/
│   ├── index.ts
│   └── pv-array-assumptions.ts
│
├── calculation/
│   ├── index.ts
│   └── calculate-pv-array.ts
│
├── trace/
│   ├── index.ts
│   └── pv-array-trace.ts
│
└── __tests__/
    ├── calculate.test.ts
    └── validation.test.ts
```

### Authoritative Files

| Responsibility               | Authoritative path                                                               |
| ---------------------------- | -------------------------------------------------------------------------------- |
| Module documentation         | `packages/solar-engine/src/modules/pv-array/README.md`                           |
| Constants                    | `packages/solar-engine/src/modules/pv-array/constants.ts`                        |
| Error definitions            | `packages/solar-engine/src/modules/pv-array/errors.ts`                           |
| Warning definitions          | `packages/solar-engine/src/modules/pv-array/warnings.ts`                         |
| Public module barrel         | `packages/solar-engine/src/modules/pv-array/index.ts`                            |
| Public execution entry point | `packages/solar-engine/src/modules/pv-array/run.ts`                              |
| Input types                  | `packages/solar-engine/src/modules/pv-array/types/pv-array-input.ts`             |
| Output types                 | `packages/solar-engine/src/modules/pv-array/types/pv-array-output.ts`            |
| Domain types                 | `packages/solar-engine/src/modules/pv-array/types/pv-array.ts`                   |
| Type barrel                  | `packages/solar-engine/src/modules/pv-array/types/index.ts`                      |
| Validation                   | `packages/solar-engine/src/modules/pv-array/validation/validate-pv-array.ts`     |
| Validation barrel            | `packages/solar-engine/src/modules/pv-array/validation/index.ts`                 |
| Assumptions                  | `packages/solar-engine/src/modules/pv-array/assumptions/pv-array-assumptions.ts` |
| Assumptions barrel           | `packages/solar-engine/src/modules/pv-array/assumptions/index.ts`                |
| Calculation                  | `packages/solar-engine/src/modules/pv-array/calculation/calculate-pv-array.ts`   |
| Calculation barrel           | `packages/solar-engine/src/modules/pv-array/calculation/index.ts`                |
| Trace                        | `packages/solar-engine/src/modules/pv-array/trace/pv-array-trace.ts`             |
| Trace barrel                 | `packages/solar-engine/src/modules/pv-array/trace/index.ts`                      |
| Calculation tests            | `packages/solar-engine/src/modules/pv-array/__tests__/calculate.test.ts`         |
| Validation tests             | `packages/solar-engine/src/modules/pv-array/__tests__/validation.test.ts`        |

### Public Boundary

The authoritative public boundary for the module is:

```text
packages/solar-engine/src/modules/pv-array/index.ts
```

The Solar Engine module barrel should re-export that boundary:

```text
packages/solar-engine/src/modules/index.ts
```

and the package-level public API should expose the module through the existing Solar Engine export structure.

Consumers should therefore use:

```ts
import {
  runPvArray,
} from "@ogwusearch/solar-engine";
```

rather than importing implementation files directly.

### Calculation Boundary

The authoritative PV Array engineering calculation is:

```text
packages/solar-engine/src/modules/pv-array/calculation/calculate-pv-array.ts
```

If the calculation is decomposed into additional calculation files later, those files remain implementation details of the same `calculation/` boundary.

There must be one authoritative implementation for each PV Array engineering calculation. Compatibility wrappers must not introduce a second implementation.

### Validation Boundary

The authoritative PV Array validation entry point is:

```text
packages/solar-engine/src/modules/pv-array/validation/validate-pv-array.ts
```

Validation rules belong to the PV Array domain and should use the shared validation contracts from:

```text
packages/engineering-validation/
```

### Execution Boundary

The authoritative execution entry point is:

```text
packages/solar-engine/src/modules/pv-array/run.ts
```

It should delegate lifecycle orchestration to:

```text
packages/engineering-core/
```

The PV Array module must not maintain a separate calculation lifecycle.

### Important Path Rule

The following path is authoritative:

```text
packages/solar-engine/src/modules/pv-array/
```

A legacy or compatibility implementation elsewhere in `solar-engine` must not become a competing source of truth.

If an older PV Array implementation exists outside this directory, it should either:

1. delegate to the authoritative implementation, or
2. be removed after public API and regression compatibility have been verified.

Do not maintain two independent PV Array calculation implementations.
