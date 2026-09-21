# OGWUSEARCH Engineering Architecture

## Foundation

The engineering foundation consists of:

- engineering-types
- engineering-units
- engineering-validation
- engineering-core

Dependency direction:

engineering-types
       ↑
       |
engineering-units

engineering-types
       ↑
       |
engineering-validation

engineering-types
       ↑
       |
engineering-core
       ↑
       |
domain engines

## Domain Engines

- solar-engine
- electrical-engine
- circuit-engine

Foundation packages must never depend on domain engines.

## Solar Engine

solar-engine
├── load
├── energy
├── peak-demand
├── pv-sizing
├── pv-array
├── pv-string
├── battery
├── inverter
├── charge-controller
├── cable
├── voltage-drop
├── protection
├── earthing
├── generator
├── bom
├── costing
├── system-validation
└── reports

## Calculation Contract

Input
  ↓
Validation
  ↓
Calculation
  ↓
Warnings
  ↓
Result
  ↓
Trace

## Design Principles

1. Deterministic calculations
2. Explicit units
3. Explicit validation
4. Explicit assumptions
5. Structured warnings
6. Structured errors
7. Reproducible results
8. Calculation traceability
9. Domain logic separated from infrastructure
10. Reusable packages
11. No circular dependencies
12. Existing implementations are never overwritten by scaffolding
