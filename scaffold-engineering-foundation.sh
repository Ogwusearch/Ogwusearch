#!/usr/bin/env bash

set -e

ROOT="$(pwd)"

echo "=============================================="
echo " OGWUSEARCH ENGINEERING FOUNDATION"
echo "=============================================="
echo
echo "Project: $ROOT"
echo

# --------------------------------------------------
# Create directories
# --------------------------------------------------

mkdir -p \
  packages/engineering-types \
  packages/engineering-units \
  packages/engineering-validation \
  packages/engineering-core \
  packages/solar-engine \
  packages/electrical-engine/src \
  packages/circuit-engine/src

echo "[OK] Package directories created"

# --------------------------------------------------
# Helper: create file only if it does not exist
# --------------------------------------------------

create_file() {
  FILE="$1"

  if [ -f "$FILE" ]; then
    echo "[SKIP] $FILE already exists"
  else
    cat > "$FILE"
    echo "[CREATE] $FILE"
  fi
}

# --------------------------------------------------
# Engineering Types
# --------------------------------------------------

create_file packages/engineering-types/README.md <<'EOF'
# @ogwusearch/engineering-types

Shared contracts for deterministic engineering calculations.

Responsibilities:

- Engineering inputs
- Engineering outputs
- Engineering results
- Validation results
- Errors
- Warnings
- Assumptions
- Metadata
- Calculation traces

This package contains shared contracts.

It does not contain domain-specific engineering calculations.
EOF

# --------------------------------------------------
# Engineering Units
# --------------------------------------------------

create_file packages/engineering-units/README.md <<'EOF'
# @ogwusearch/engineering-units

Engineering quantities, dimensions, units, and conversions.

Responsibilities:

- Quantity representation
- Unit definitions
- Dimensions
- Unit registry
- Unit conversion

Example:

1500 W
  ↓
1.5 kW

No domain-specific engineering calculations belong here.
EOF

# --------------------------------------------------
# Engineering Validation
# --------------------------------------------------

create_file packages/engineering-validation/README.md <<'EOF'
# @ogwusearch/engineering-validation

Reusable validation infrastructure for engineering calculations.

Responsibilities:

- Required-field validation
- Numeric validation
- Range validation
- Constraint validation
- Rule validation
- Validation errors

Design principles:

- Deterministic
- Side-effect free
- Reusable
- Composable

Validation should collect applicable errors rather than stopping
at the first error.
EOF

# --------------------------------------------------
# Engineering Core
# --------------------------------------------------

create_file packages/engineering-core/README.md <<'EOF'
# @ogwusearch/engineering-core

Execution foundation for deterministic engineering calculations.

Calculation flow:

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

Core responsibilities:

- Engineering module
- Calculation runner
- Engineering result
- Warnings
- Errors
- Assumptions
- Metadata
- Calculation trace

The core package does not contain solar-specific formulas.
EOF

# --------------------------------------------------
# Solar Engine
# --------------------------------------------------

create_file packages/solar-engine/README.md <<'EOF'
# @ogwusearch/solar-engine

Solar and renewable-energy engineering calculation engine.

Modules:

- load
- energy
- peak-demand
- pv-sizing
- pv-array
- pv-string
- battery
- inverter
- charge-controller
- cable
- voltage-drop
- protection
- earthing
- generator
- bom
- costing
- system-validation
- reports

Calculation flow:

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

Solar-specific calculations belong here.

Reusable infrastructure belongs in:

- @ogwusearch/engineering-types
- @ogwusearch/engineering-units
- @ogwusearch/engineering-validation
- @ogwusearch/engineering-core
EOF

# --------------------------------------------------
# Electrical Engine
# --------------------------------------------------

create_file packages/electrical-engine/package.json <<'EOF'
{
  "name": "@ogwusearch/electrical-engine",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
EOF

create_file packages/electrical-engine/README.md <<'EOF'
# @ogwusearch/electrical-engine

General electrical engineering calculation engine.

Potential modules:

- AC calculations
- DC calculations
- Power
- Current
- Voltage
- Resistance
- Impedance
- Power factor
- Short circuit
- Cable sizing
- Voltage drop
- Protection
- Earthing

This package consumes the shared engineering foundation.
EOF

create_file packages/electrical-engine/src/index.ts <<'EOF'
/**
 * @ogwusearch/electrical-engine
 *
 * General electrical engineering calculations.
 */

export {};
EOF

# --------------------------------------------------
# Circuit Engine
# --------------------------------------------------

create_file packages/circuit-engine/package.json <<'EOF'
{
  "name": "@ogwusearch/circuit-engine",
  "version": "0.1.0",
  "private": true,
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts"
}
EOF

create_file packages/circuit-engine/README.md <<'EOF'
# @ogwusearch/circuit-engine

Circuit analysis and simulation engine.

Potential modules:

- DC analysis
- AC analysis
- Transient analysis
- Resistors
- Capacitors
- Inductors
- Diodes
- BJTs
- MOSFETs
- Op-amps
- Transformers
- Sources
- Switches
- Wires

This package consumes the shared engineering foundation.
EOF

create_file packages/circuit-engine/src/index.ts <<'EOF'
/**
 * @ogwusearch/circuit-engine
 *
 * Circuit analysis and simulation engine.
 */

export {};
EOF

# --------------------------------------------------
# Architecture
# --------------------------------------------------

create_file packages/ARCHITECTURE.md <<'EOF'
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
EOF

# --------------------------------------------------
# Verify
# --------------------------------------------------

echo
echo "=============================================="
echo " VERIFYING"
echo "=============================================="

echo
echo "Package directories:"
find packages \
  -maxdepth 2 \
  -type d \
  \( -name "engineering-types" \
  -o -name "engineering-units" \
  -o -name "engineering-validation" \
  -o -name "engineering-core" \
  -o -name "solar-engine" \
  -o -name "electrical-engine" \
  -o -name "circuit-engine" \) \
  | sort

echo
echo "Created documentation:"
find packages \
  -maxdepth 2 \
  -type f \
  \( -name "README.md" -o -name "ARCHITECTURE.md" \) \
  | sort

echo
echo "=============================================="
echo " DONE"
echo "=============================================="
