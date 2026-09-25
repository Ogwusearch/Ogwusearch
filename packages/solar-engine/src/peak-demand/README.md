# Peak Demand Engine

The Peak Demand Engine calculates electrical demand scenarios for
engineering system sizing.

## Responsibilities

- Individual demand calculation
- Demand factor application
- System diversity adjustment
- Starting demand
- Surge demand
- Peak demand scenario selection
- Design demand margin

## Boundary

Load Audit determines load characteristics and energy consumption.

Peak Demand determines system-level operating demand and peak demand.

## Core formulas

Individual demand:

    Individual Demand = Running Power × Demand Factor

Normal coincident demand:

    Coincident Demand =
      Σ Individual Demand / Diversity Factor

Starting demand:

    Starting Demand =
      Explicit Starting Power
      OR
      Running Power × Surge Factor

Design demand:

    Design Demand =
      Peak Demand × (1 + Demand Margin)

## Engineering rules

- Demand factor must be greater than 0 and less than or equal to 1.
- Diversity factor must be greater than or equal to 1.
- Surge factor must be greater than or equal to 1.
- Starting power must not be less than running power.
- Demand margin must be between 0 and 1.
- Load IDs must be unique.
- Calculations are deterministic.
- Input data is treated as immutable.

## Architecture

Peak Demand follows the engineering foundation pattern:

    defineCalculation()
            ↓
    validate input
            ↓
    calculate
            ↓
    executeCalculation()
            ↓
    CalculationResult<PeakDemandOutput>

## Module structure

- types/
- validation/
- assumptions/
- calculation/
- trace/
- __tests__/
- run.ts
- index.ts

## Design principle

Demand factor, diversity factor, and surge factor represent
different engineering concepts and must not be collapsed into one
multiplication or division formula.
