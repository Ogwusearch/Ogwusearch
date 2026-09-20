# SolarAudit — Energy Engine

This module contains the energy engineering logic.

## Responsibilities

- Define typed inputs
- Validate engineering inputs
- Perform calculations
- Return structured results
- Report warnings and errors
- Avoid UI-specific logic
- Avoid direct database access

## Boundary

Input
  |
  v
Validation
  |
  v
Calculation
  |
  v
Engineering Result

## Rules

- TypeScript only
- No React
- No UI logic
- No database access
- No HTTP/API calls
- No browser APIs
- Deterministic calculations
- Explicit engineering units
- Structured errors and warnings
