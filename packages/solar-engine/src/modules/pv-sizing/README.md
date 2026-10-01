
# PV Sizing

The PV Sizing module calculates the required photovoltaic array size from daily energy demand, peak sun hours, and overall system efficiency.

It optionally calculates physical panel count, installed capacity, and the resulting oversizing after panel-count rounding.

## Purpose

PV Sizing answers two related questions:

1. How much PV array power is required to supply the daily energy demand?
2. When a panel rating is supplied, how many panels are required and what installed capacity results?

The module preserves the existing PV sizing engineering formulas and calculation behavior.

---

## Input

```ts
interface PVSizingInput {
  dailyEnergyKWh: number;
  peakSunHours: number;
  systemEfficiency: number;
  panelPowerW?: number;
  designMargin?: number;
}
````

### `dailyEnergyKWh`

Total daily energy requirement.

**Unit:** `kWh/day`

Must be greater than zero.

### `peakSunHours`

Peak sun hours available at the installation location.

**Unit:** `h/day`

Must be greater than zero.

### `systemEfficiency`

Overall PV system performance factor used to account for system losses.

Examples:

```text
0.80 = 80% effective system performance
1.00 = 100% effective system performance
```

Valid range:

```text
0 < systemEfficiency <= 1
```

### `panelPowerW`

Rated power of one PV module.

**Unit:** `W`

Optional.

When omitted, the calculation performs PV array sizing but does not calculate physical panel count or installed capacity.

When supplied, it must be greater than zero.

### `designMargin`

Optional design-margin field retained for compatibility with the existing input contract.

The current PV sizing calculation does not apply this value to the sizing formulas.

---

## Calculation

### 1. Required PV energy

The required PV energy accounts for system losses:

```text
requiredPVEnergyKWh =
  dailyEnergyKWh / systemEfficiency
```

### 2. Required PV array power

The required PV array power is calculated from required PV energy and peak sun hours:

```text
requiredPVPowerW =
  (requiredPVEnergyKWh / peakSunHours) * 1000
```

### 3. Required PV power in kilowatts

```text
requiredPVPowerKW =
  requiredPVPowerW / 1000
```

### 4. Required panel count

When `panelPowerW` is supplied:

```text
requiredPanelCount =
  Math.ceil(requiredPVPowerW / panelPowerW)
```

The result is rounded upward because a fractional panel cannot be installed.

### 5. Installed PV capacity

```text
installedPVCapacityW =
  requiredPanelCount * panelPowerW

installedPVCapacityKW =
  installedPVCapacityW / 1000
```

### 6. Oversizing

The difference between installed capacity and calculated required PV power is:

```text
oversizingW =
  installedPVCapacityW - requiredPVPowerW

oversizingKW =
  oversizingW / 1000

oversizingRatio =
  oversizingW / requiredPVPowerW

oversizingPercent =
  oversizingRatio * 100
```

---

## Output

The calculation returns:

```ts
interface PVSizingOutput {
  readonly requiredPVPowerW: number;
  readonly requiredPVPowerKW: number;
  readonly requiredPVEnergyKWh: number;

  readonly panelPowerW?: number;
  readonly requiredPanelCount?: number;

  readonly installedPVCapacityW?: number;
  readonly installedPVCapacityKW?: number;

  readonly oversizingW?: number;
  readonly oversizingKW?: number;
  readonly oversizingRatio?: number;
  readonly oversizingPercent?: number;
}
```

When `panelPowerW` is omitted, only the following values are returned:

```text
requiredPVEnergyKWh
requiredPVPowerW
requiredPVPowerKW
```

When `panelPowerW` is supplied, the panel-sizing and installed-capacity fields are also returned.

---

## Validation

PV Sizing validates:

| Field              | Requirement                  |
| ------------------ | ---------------------------- |
| `dailyEnergyKWh`   | Finite and > 0               |
| `peakSunHours`     | Finite and > 0               |
| `systemEfficiency` | Finite and > 0 and <= 1      |
| `panelPowerW`      | Finite and > 0 when supplied |

Multiple validation errors are collected rather than stopping after the first invalid field.

Validation is implemented using the shared `@ogwusearch/engineering-validation` infrastructure.

---

## Assumptions

The module records the following calculation assumptions:

* Daily Energy Requirement
* Peak Sun Hours
* System Efficiency
* Panel Power, when supplied

Assumptions are represented using the shared `EngineeringAssumption` contract from `@ogwusearch/engineering-types`.

---

## Architecture

The module follows the shared engineering calculation architecture:

```text
pv-sizing/
├── types/
│   ├── pv-sizing-input.ts
│   └── pv-sizing-output.ts
│
├── validation/
│   ├── rules.ts
│   └── validate-pv-sizing.ts
│
├── assumptions/
│   └── pv-sizing-assumptions.ts
│
├── calculation/
│   ├── calculate-pv-energy.ts
│   ├── calculate-array-size.ts
│   ├── calculate-panel-count.ts
│   ├── calculate-installed-capacity.ts
│   └── calculate-pv-sizing.ts
│
├── trace/
│   └── pv-sizing-trace.ts
│
├── run.ts
└── index.ts
```

### Foundation packages

The module relies on the shared engineering packages:

```text
@ogwusearch/engineering-types
        │
        ├── CalculationInput
        ├── CalculationOutput
        ├── CalculationResult
        ├── EngineeringIssue
        └── EngineeringAssumption
        │
        ▼
@ogwusearch/engineering-validation
        │
        └── PV input validation
        │
        ▼
@ogwusearch/engineering-core
        │
        └── calculation execution lifecycle
        │
        ▼
solar-engine / pv-sizing
```

PV Sizing does not define duplicate calculation-result, validation-result, error, warning, assumption, or trace contracts.

---

## Calculation Components

### `calculate-pv-energy.ts`

Calculates the energy that must be supplied by the PV system after accounting for system losses.

### `calculate-array-size.ts`

Converts required PV energy and peak sun hours into required PV array power.

### `calculate-panel-count.ts`

Calculates the required number of panels using upward rounding.

### `calculate-installed-capacity.ts`

Calculates actual installed capacity after panel-count rounding.

### `calculate-pv-sizing.ts`

Composes the individual calculation functions into the complete PV sizing calculation.

This file contains calculation composition and preserves the existing engineering formulas.

---

## Execution

The standardized execution entry point is:

```ts
runPVSizing(input)
```

The execution lifecycle is responsible for:

1. Validating the input.
2. Collecting validation errors and warnings.
3. Collecting PV sizing assumptions.
4. Executing the PV sizing calculation.
5. Returning the standardized `CalculationResult<PVSizingOutput>`.

The calculation result follows the shared engineering contract rather than defining a PV-specific result type.

---

## Backward Compatibility

The existing:

```ts
calculatePVSizing(input)
```

API is retained as a compatibility wrapper around the standardized calculation implementation.

The compatibility layer does not introduce or modify engineering formulas.

The existing `PVSizingValue` type name is retained as an alias for:

```ts
PVSizingOutput
```

---

## Engineering Behavior

This module is a structural migration of the existing PV sizing implementation.

The migration does **not** intentionally change:

* Engineering formulas
* Units used by the existing formulas
* Panel-count rounding behavior
* Optional panel sizing behavior
* Existing validation requirements
* Existing error codes
* Existing warning behavior
* Existing regression behavior

Changes to module organization, shared contracts, execution lifecycle, and imports are architectural changes and are kept separate from engineering calculation logic.

---

## Example

### Array sizing only

```ts
const result = runPVSizing({
  dailyEnergyKWh: 10,
  peakSunHours: 5,
  systemEfficiency: 0.8,
});
```

The calculation produces:

```text
requiredPVEnergyKWh = 12.5
requiredPVPowerW   = 2500
requiredPVPowerKW  = 2.5
```

### Array sizing with physical panel sizing

```ts
const result = runPVSizing({
  dailyEnergyKWh: 10,
  peakSunHours: 5,
  systemEfficiency: 0.8,
  panelPowerW: 550,
});
```

The required panel count is calculated from:

```text
Math.ceil(2500 / 550)
```

and the installed capacity and oversizing values are then derived from that rounded panel count.

---

## Testing

PV Sizing tests are organized into:

```text
__tests__/
├── calculation.test.ts
├── regression.test.ts
└── validation.test.ts
```

### Calculation tests

Verify the individual PV sizing calculations and their composition.

### Regression tests

Protect existing PV sizing behavior and numerical results during architectural migration.

### Validation tests

Verify required input constraints, optional panel sizing, multiple validation errors, warnings, and input immutability.

---

## Design Principle

> **Structure may change; engineering behavior must remain stable.**

The PV Sizing module should use the shared engineering architecture without modifying the established engineering calculations unless a deliberate, separately reviewed engineering change is required.

```

One correction worth making in the README is that **`designMargin` should be documented as compatibility-only**, because the actual `calculate.ts` you showed does not apply it. That keeps the documentation faithful to the current implementation rather than implying a formula that does not exist.
```
