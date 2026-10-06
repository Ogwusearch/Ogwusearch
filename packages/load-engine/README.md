
# @ogwusearch/load-engine

A deterministic engineering calculation engine for electrical load analysis and load-energy calculations.

`@ogwusearch/load-engine` is the dedicated load-domain engine within the Ogwusearch Engineering Platform. It owns reusable load engineering logic including load validation, energy calculations, engineering warnings, assumptions, and calculation traces.

The package is designed to be consumed by engineering applications and other domain engines without coupling the load domain to a specific application, database, UI, or workflow.

---

## Status

**Load Engine V1 — Active**

- Package: `@ogwusearch/load-engine`
- Version: `0.1.0`
- Language: TypeScript
- Runtime: Node.js
- Package manager: pnpm
- Test runner: Vitest
- Architecture: domain engine package
- Deterministic calculations: Yes
- Validation: Yes
- Calculation traces: Yes
- Engineering warnings: Yes

Current V1 test status:

```text
Test Files: 4 passed
Tests:      13 passed
```

Test distribution:

```text
load-trace.test.ts     2 tests
validation.test.ts     5 tests
total-energy.test.ts   3 tests
daily-energy.test.ts   3 tests
```

Total:

```text
13/13 passing
```

---

# Purpose

Load Engine provides reusable engineering logic for analyzing electrical loads.

The engine is responsible for the load domain.

Applications are responsible for application workflows.

This separation allows the same load calculations to be reused by:

- SolarAudit
- Solar Engine
- Energy engineering applications
- Electrical engineering tools
- Engineering APIs
- Engineering MCP tools
- Future AI engineering systems
- The future unified engineering platform

The package should remain domain-focused rather than becoming an application package.

---

# Position in the Engineering Platform

Load Engine belongs to the domain-engine layer.

```text
Applications
│
├── SolarAudit
├── Engineering Dashboard
└── Future Engineering Applications
│
▼
Domain Engines
│
├── Load Engine
├── Battery Engine
├── Solar Engine
├── Energy Engine
├── Power Engine
├── Electrical Engine
└── Circuit Engine
│
▼
Engineering Foundation
│
├── engineering-types
├── engineering-units
├── engineering-validation
└── engineering-core
```

The foundation provides shared engineering infrastructure.

The domain engines provide specialized engineering intelligence.

Applications compose those engines into workflows.

---

# Architectural Responsibility

Load Engine owns:

- load-domain input contracts
- load-domain output contracts
- load validation
- load calculations
- daily energy calculations
- total energy calculations
- engineering warnings
- engineering assumptions
- calculation traces
- deterministic engineering results

Load Engine does not own:

- projects
- audits
- users
- authentication
- database persistence
- application workflows
- UI components
- HTTP routes
- application state
- report presentation
- SolarAudit lifecycle

Those responsibilities belong to application and infrastructure layers.

---

# Architecture

The intended separation is:

```text
                    ┌──────────────────────┐
                    │      SolarAudit      │
                    │     Application      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     Load-Audit       │
                    │       Adapter        │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │      Load Engine     │
                    │                      │
                    │  Validation          │
                    │  Calculation         │
                    │  Energy              │
                    │  Warnings            │
                    │  Assumptions         │
                    │  Trace               │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   Engineering Core   │
                    │ Types / Units /      │
                    │ Validation           │
                    └──────────────────────┘
```

The important boundary is:

```text
Application workflow
        ↓
Load-domain adapter
        ↓
Load Engine
```

The engine should not know that SolarAudit exists.

---

# Package Structure

The V1 package follows a domain-oriented structure.

```text
packages/load-engine
├── README.md
├── package.json
├── tsconfig.json
├── tsconfig.test.json
└── src
    ├── index.ts
    │
    └── load
        ├── calculation
        ├── validation
        ├── assumptions
        ├── trace
        ├── warnings
        ├── types
        └── __tests__
```

The exact internal structure may evolve as the engine expands, but the public package boundary should remain stable.

Internal implementation modules should not be treated as application APIs.

Applications should consume the package's public exports.

---

# Load Domain

A load represents an electrical consumer or appliance participating in a load analysis.

Typical load information includes:

- load name
- quantity
- rated power
- operating hours
- operating days
- power factor
- load type
- phase information
- demand-related parameters where applicable

The load engine uses these values to derive engineering quantities.

---

# Core Load Semantics

The V1 load domain follows explicit engineering semantics.

For a load:

```text
connectedLoadW
    =
quantity × ratedPowerW
```

The running-load value is based on the connected load according to the current V1 contract.

```text
runningLoadW
    =
connectedLoadW
```

This keeps the basic load model deterministic and avoids silently introducing additional efficiency assumptions into the load domain.

---

# Load Quantities

The load domain distinguishes between several engineering quantities.

## Connected Load

Connected load represents the installed/rated electrical load.

```text
connectedLoadW
```

It is derived from:

```text
quantity × ratedPowerW
```

---

## Running Load

Running load represents the load considered operational for the calculation.

```text
runningLoadW
```

In the current V1 contract:

```text
runningLoadW = connectedLoadW
```

Any future operating-profile or utilization model should be introduced explicitly rather than silently changing this behavior.

---

## Apparent Power

Where power factor is available, apparent power can be derived from real power.

The calculation is part of the load-domain engineering model and should preserve the established engineering semantics of the package.

---

# Energy Calculations

Load Engine supports daily and total energy calculations.

Energy calculations are based on the load's operating characteristics.

A basic daily energy calculation follows the relationship:

```text
dailyEnergyWh
    =
runningLoadW
×
hoursPerDay
```

Where operating-day or scheduling information is part of the input contract, the appropriate load-domain rules are applied.

---

# Total Energy

Total energy aggregates the energy contribution of the relevant loads.

The engine supports:

```text
daily energy
```

and:

```text
total/monthly energy
```

calculations.

The total-energy calculation is intentionally kept within the load domain rather than being implemented separately by each application.

This prevents different applications from silently developing different load-energy formulas.

---

# Design Margin

Design margins belong to the relevant engineering calculation contract.

Load Engine does not silently apply arbitrary margins.

Where a margin is part of a calculation, it must be explicit in the input or calculation contract.

This is important because the engineering platform distinguishes between:

- load calculation
- energy calculation
- peak-demand calculation
- downstream design calculations

A downstream engine may apply its own appropriate engineering margin.

---

# Demand Calculations

Load Engine provides the load information required by downstream demand analysis.

Peak-demand engineering is treated as a distinct domain responsibility rather than being silently mixed into every load calculation.

The wider engineering architecture therefore allows:

```text
Load Engine
    ↓
Peak Demand / Power Analysis
```

rather than forcing all demand behavior into the basic load engine.

This separation makes the domain boundaries clearer and allows demand methodology to evolve independently.

---

# Validation

Load Engine validates engineering input before performing calculations.

Validation uses the shared engineering validation infrastructure rather than application-specific validation logic.

The objective is:

```text
Input
  ↓
Validation
  ↓
Calculation
```

rather than:

```text
Input
  ↓
Unchecked calculation
  ↓
Possibly invalid result
```

Invalid engineering input should be represented through structured engineering issues.

The engine should not rely on uncontrolled exceptions for ordinary engineering validation failures.

---

# Validation Principles

Validation covers the engineering requirements necessary for safe load calculations.

Examples include validation of:

- numeric values
- positive quantities
- rated power
- operating duration
- load parameters
- power factor where applicable
- required engineering ranges
- required load fields

Validation should remain deterministic.

The same invalid input should produce the same validation result.

---

# Warnings

Not every engineering condition is an error.

Load Engine distinguishes between:

```text
ERROR
```

and:

```text
WARNING
```

An error means the calculation cannot validly proceed under the defined contract.

A warning means the calculation may proceed, but the engineering condition should be visible to the caller.

Warnings should never silently alter the calculation.

---

# Assumptions

Engineering assumptions are explicit.

An assumption should communicate what the engine relied upon when producing a result.

This supports:

- engineering review
- auditability
- reporting
- debugging
- future AI explanations
- reproducibility

Applications should display or persist assumptions as appropriate, but the engine remains responsible for producing the domain assumptions.

---

# Calculation Trace

Load Engine provides calculation trace support.

The trace allows an engineering result to explain how it was produced.

Conceptually:

```text
Input
  ↓
Validation
  ↓
Load transformation
  ↓
Engineering calculation
  ↓
Aggregation
  ↓
Result
```

Trace information can be used by:

- engineering reports
- audit systems
- debugging tools
- engineering dashboards
- MCP tools
- AI engineering assistants

The trace belongs to the engineering result rather than a particular UI.

---

# Determinism

Load Engine follows the deterministic engineering principle of the Ogwusearch Engineering Platform.

For the same valid input:

```text
same input
    ↓
same validation
    ↓
same calculation
    ↓
same warnings
    ↓
same assumptions
    ↓
same trace
    ↓
same output
```

The engine should not depend on:

- current time
- network requests
- database state
- browser state
- UI state
- random values
- external services

---

# Input Immutability

The engine should not mutate caller-owned input objects.

Conceptually:

```ts
const input = {
  // load input
};

const result = runLoadCalculation(input);

// input remains unchanged
```

This makes calculations easier to:

- test
- cache
- reproduce
- audit
- execute in parallel
- expose through APIs

---

# Public API

The public package entrypoint is the intended integration boundary.

Applications should prefer:

```ts
import {
  // public Load Engine exports
} from "@ogwusearch/load-engine";
```

rather than importing internal source paths.

This allows the internal architecture to evolve without forcing application changes.

---

# Testing

Load Engine V1 currently has four test files.

```text
load-trace.test.ts
2 tests

validation.test.ts
5 tests

total-energy.test.ts
3 tests

daily-energy.test.ts
3 tests
```

Total:

```text
13 tests
```

Current result:

```text
Test Files  4 passed
Tests       13 passed
```

---

# Test Responsibilities

## Daily Energy Tests

Verify the daily energy calculations and expected load-energy behavior.

---

## Total Energy Tests

Verify aggregation and total-energy calculations.

---

## Validation Tests

Verify valid and invalid engineering input behavior.

---

## Trace Tests

Verify that load calculations produce the expected engineering trace information.

---

# Development Commands

Run these commands from the monorepo root.

## Typecheck

```bash
pnpm --filter @ogwusearch/load-engine typecheck
```

## Test Typecheck

```bash
pnpm --filter @ogwusearch/load-engine typecheck:test
```

## Tests

```bash
pnpm --filter @ogwusearch/load-engine test
```

## Build

```bash
pnpm --filter @ogwusearch/load-engine build
```

## Full Package Gate

```bash
set -e

pnpm --filter @ogwusearch/load-engine typecheck
pnpm --filter @ogwusearch/load-engine typecheck:test
pnpm --filter @ogwusearch/load-engine test
pnpm --filter @ogwusearch/load-engine build
```

The `set -e` is intentional.

A package gate must stop immediately when a command fails.

---

# Relationship With Solar Engine

Historically, load-domain logic lived inside Solar Engine.

The wider migration is moving reusable load intelligence into:

```text
@ogwusearch/load-engine
```

The architectural target is:

```text
Solar Engine
      │
      ▼
Load Engine
```

rather than:

```text
Solar Engine
      │
      └── private load implementation
```

However, the migration should be completed in controlled stages.

The current Load Engine V1 package is established and tested.

The remaining Solar Engine migration should:

1. integrate Solar Engine with Load Engine
2. migrate consumers
3. run the Solar Engine test suite
4. verify behavior
5. remove duplicate implementation only after the migration is proven

The old implementation should not be removed prematurely.

---

# SolarAudit Integration

SolarAudit is an application, not the owner of load engineering formulas.

Its responsibility is to manage:

- projects
- audits
- workflows
- persistence
- application services
- user-facing operations
- application composition

Load Engine owns:

- load validation
- load calculations
- energy calculations
- assumptions
- warnings
- traces
- engineering results

The intended relationship is:

```text
SolarAudit
    │
    ▼
Load-Audit Adapter
    │
    ▼
Load Engine
```

The adapter translates application/domain data into the canonical Load Engine contract.

This prevents SolarAudit from duplicating engineering formulas.

---

# Application Boundary

The following should remain outside Load Engine:

```text
Project
Audit
User
Database
Authentication
Authorization
HTTP
React
UI
Persistence
Application workflow
```

For example, Load Engine should not contain:

```ts
createAudit()
saveAudit()
executeAudit()
findProject()
saveResult()
```

Those are application responsibilities.

---

# Domain Boundary

Load Engine should own things such as:

```text
validateLoad()
calculateDailyEnergy()
calculateTotalEnergy()
createLoadTrace()
createLoadAssumptions()
```

The exact public names depend on the package API, but the architectural principle remains:

```text
engineering logic → Load Engine
application workflow → Application
```

---

# Engineering Foundation Dependencies

Load Engine is part of the wider engineering foundation architecture.

The intended dependency direction is:

```text
Load Engine
    │
    ├── engineering-types
    ├── engineering-units
    ├── engineering-validation
    └── engineering-core
```

Foundation packages provide reusable infrastructure.

Load Engine adds load-domain intelligence on top of that foundation.

---

# Dependency Direction

The dependency direction must remain one-way.

Preferred:

```text
Application
    ↓
Domain Engine
    ↓
Engineering Foundation
```

Not:

```text
Engineering Foundation
    ↓
Application
```

And not:

```text
Load Engine
    ↓
SolarAudit
```

This keeps the domain engine reusable.

---

# V1 Scope

Load Engine V1 focuses on the foundational load domain.

Included:

- load input handling
- load validation
- connected-load semantics
- running-load semantics
- daily energy
- total energy
- aggregation
- engineering warnings
- assumptions
- calculation traces
- deterministic results
- structured validation
- reusable package API

---

# Intentionally Out of Scope

Load Engine V1 does not attempt to become a complete electrical engineering platform.

The following are outside the current scope unless explicitly introduced through a future domain contract:

- full solar PV sizing
- battery sizing
- inverter sizing
- generator sizing
- cable sizing
- voltage-drop calculations
- protection coordination
- earthing design
- equipment procurement
- product catalogs
- pricing
- project management
- audit persistence
- authentication
- authorization
- UI
- reporting presentation
- database access

Those responsibilities belong to other domain engines or application layers.

---

# Engineering Philosophy

Load Engine follows the core engineering platform principles.

## 1. Domain ownership

Load calculations belong to Load Engine.

## 2. Deterministic behavior

The same input produces the same engineering result.

## 3. Explicit validation

Invalid inputs produce structured engineering issues.

## 4. Explicit assumptions

Engineering assumptions are visible.

## 5. Traceability

Calculations can expose their calculation path.

## 6. No silent formula changes

Migration and refactoring must not silently change established engineering behavior.

## 7. Application independence

The engine does not depend on SolarAudit or another application.

## 8. Reusability

Multiple applications can consume the same load engine.

## 9. Clear domain boundaries

Load, energy, peak demand, battery, solar, power, and electrical responsibilities should not be unnecessarily mixed.

## 10. Finish before expanding

V1 should be stable before additional capabilities are introduced.

---

# Migration Strategy

Load Engine extraction follows the platform's migration principle:

```text
EXTRACT
   ↓
VERIFY
   ↓
INTEGRATE
   ↓
TEST
   ↓
REMOVE DUPLICATION
```

Not:

```text
DELETE FIRST
   ↓
HOPE EVERYTHING WORKS
```

The migration should therefore preserve behavior while changing ownership.

---

# Migration Checklist

Current V1 package:

- [x] Load Engine package created
- [x] Package identity established
- [x] Load-domain structure established
- [x] Validation implemented
- [x] Daily-energy calculations implemented
- [x] Total-energy calculations implemented
- [x] Warnings implemented
- [x] Calculation traces implemented
- [x] Foundation integration established
- [x] Tests established
- [x] 13/13 tests passing
- [x] Typecheck passing
- [x] Build passing

Solar Engine migration:

- [ ] Integrate Solar Engine with Load Engine
- [ ] Verify all Solar Engine load consumers
- [ ] Run Solar Engine integration tests
- [ ] Confirm no behavioral regression
- [ ] Remove duplicate Solar Engine load implementation
- [ ] Re-run complete Solar Engine gate
- [ ] Perform dependency-boundary audit

SolarAudit integration:

- [ ] Establish Load Engine adapter
- [ ] Preserve SolarAudit application API
- [ ] Verify audit execution
- [ ] Verify persistence behavior
- [ ] Verify application tests
- [ ] Remove duplicated load formulas from application code

---

# V1 Completion Criteria

Load Engine V1 is considered technically stable when:

```text
Typecheck
    PASS

Test Typecheck
    PASS

Tests
    13/13 PASS

Build
    PASS
```

The package should then be treated as the canonical reusable load-domain engine while the remaining Solar Engine and SolarAudit migration work proceeds.

---

# Future Direction

Load Engine is intended to become a foundational domain component of the wider Ogwusearch Engineering Platform.

Potential consumers include:

```text
                    ┌──────────────────────┐
                    │      SolarAudit      │
                    └──────────┬───────────┘
                               │
                    ┌──────────▼───────────┐
                    │      Load Engine     │
                    └──────────┬───────────┘
                               │
              ┌────────────────┼────────────────┐
              │                │                │
              ▼                ▼                ▼
       Energy Engine     Power Engine    Electrical Engine
```

Future infrastructure may expose Load Engine through:

- Engineering API
- Engineering MCP
- Engineering Tools
- Engineering Dashboard
- AI Engineering Assistant
- Unified Engineering Platform

The domain engine should remain independent of those delivery mechanisms.

---

# Architectural Rule

The most important rule for Load Engine is:

```text
Load Engine owns load engineering.

Applications consume Load Engine.

Load Engine must not own application workflows.

Load Engine must not depend on SolarAudit.

Load Engine must not depend on UI or persistence.
```

The long-term goal is a coherent engineering platform in which domain engines provide reusable engineering intelligence and applications compose those engines into professional engineering workflows.

---

# Repository

The package lives at:

```text
packages/load-engine
```

Monorepo:

```text
/home/ogwu/workspace/ogwusearch
```

Package name:

```text
@ogwusearch/load-engine
```

Version:

```text
0.1.0
```

---

# Current V1 Verification

Latest verified Load Engine V1 state:

```text
Typecheck     PASS
Tests         13/13 PASS
Test Files    4/4 PASS
Build         PASS
```

This establishes Load Engine as a tested standalone domain package while the Solar Engine and SolarAudit migration boundaries continue to be completed.
EOF

echo "=============================================="
echo " LOAD ENGINE README INSTALLED"
echo "=============================================="

echo
echo "=== README ==="
wc -l packages/load-engine/README.md

echo
echo "=== GIT STATUS ==="
git status --short packages/load-engine/README.md

echo
echo "=== PACKAGE VERIFICATION ==="
test -f packages/load-engine/README.md
echo "PASS: packages/load-engine/README.md exists"
```

Then verify the package itself without changing anything else:

```bash
cd /home/ogwu/workspace/ogwusearch

set -e

pnpm --filter @ogwusearch/load-engine typecheck
pnpm --filter @ogwusearch/load-engine typecheck:test
pnpm --filter @ogwusearch/load-engine test
pnpm --filter @ogwusearch/load-engine build

echo
echo "=============================================="
echo " LOAD ENGINE V1 GATE PASSED"
echo "=============================================="