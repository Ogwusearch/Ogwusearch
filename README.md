# ⚙️ OGWUSEARCH ENGINEERING

### Software Engineering × Electrical Engineering × AI

<p align="center">
  <strong>Build reliable engineering infrastructure first.</strong><br>
  Build deterministic engineering engines.<br>
  Build applications on top of them.<br>
  Connect AI to engineering infrastructure rather than replacing it.
</p>

---

## 🌍 Overview

**Ogwusearch Engineering** is an engineering software ecosystem for building deterministic calculation engines, reusable engineering infrastructure, simulations, technical tools, APIs, Model Context Protocol (MCP) services, and AI-assisted engineering workflows.

The platform is built around one architectural principle:

> **Engineering infrastructure comes first. Domain mathematics comes second. Applications, APIs, MCP, and AI consume that infrastructure.**

Engineering logic should not be buried inside user interfaces, database layers, API handlers, or AI prompts.

Instead, Ogwusearch Engineering separates reusable engineering infrastructure from domain mathematics so that calculations can remain:

* Deterministic
* Traceable
* Unit-aware
* Validated
* Testable
* Serializable
* Reviewable
* Reusable

The current repository establishes the **engineering foundation** and a modular **Solar Engineering Engine** on top of it.

---

## 📑 Table of Contents

* [🚀 Quick Start](#-quick-start)
* [🎯 Mission](#-mission)
* [🧭 Engineering Philosophy](#-engineering-philosophy)
* [🏗️ Architecture](#️-architecture)
* [⚡ Engineering Pipeline](#-engineering-pipeline)
* [🏛️ Engineering Foundation](#️-engineering-foundation)
* [🔬 Engineering Engines](#-engineering-engines)
* [☀️ Solar Engineering](#️-solar-engineering)
* [📦 Repository Structure](#-repository-structure)
* [🔗 Dependency Architecture](#-dependency-architecture)
* [🛠️ Technology Stack](#️-technology-stack)
* [🧪 Development Workflow](#-development-workflow)
* [✅ Testing Strategy](#-testing-strategy)
* [📊 Engineering Standards](#-engineering-standards)
* [🤖 AI Engineering & MCP](#-ai-engineering--mcp)
* [🗺️ Roadmap](#️-roadmap)
* [📚 Documentation](#-documentation)
* [🤝 Contributing](#-contributing)
* [🌍 Long-Term Vision](#-long-term-vision)
* [🧠 Core Principles](#-core-principles)

---

# 🚀 Quick Start

## Prerequisites

Install:

| Tool       | Purpose                         |
| ---------- | ------------------------------- |
| Node.js    | Runtime and tooling             |
| pnpm       | Workspace package manager       |
| Git        | Version control                 |
| TypeScript | Engineering package development |

Verify:

```bash
node --version
pnpm --version
git --version
```

---

## Clone the Repository

```bash
git clone https://github.com/Ogwusearch/Ogwusearch.git
cd Ogwusearch
```

---

## Install Dependencies

```bash
pnpm install
```

---

## Run Tests

Run the workspace test suite:

```bash
pnpm vitest run
```

For the current Solar Engine package:

```bash
pnpm --filter @ogwusearch/solar-engine test
```

The current Solar Engine baseline contains:

```text
55 test files
577 tests passed
```

The test suite covers calculation behavior, validation, warnings, regression cases, traces, and integration workflows.

---

## Type Check

Workspace:

```bash
pnpm tsc --noEmit
```

Individual packages can also be checked directly:

```bash
pnpm --filter @ogwusearch/engineering-core exec tsc --noEmit
pnpm --filter @ogwusearch/solar-engine exec tsc --noEmit
```

---

## Build

```bash
pnpm build
```

Or build Solar Engine directly:

```bash
pnpm --filter @ogwusearch/solar-engine build
```

The generated Solar Engine package is an ES module and can be loaded directly by Node.js from its `dist` output.

---

## Development Loop

A normal development cycle is:

```bash
git pull

pnpm install

pnpm vitest run

pnpm tsc --noEmit

pnpm build

git status
```

Before committing:

```bash
git diff
git diff --cached
git status
```

Then:

```bash
git add <intended-files>
git commit -m "describe your change"
git push origin main
```

> **First principle:** Engineering tests and contracts come before application features.

---

# 🎯 Mission

Ogwusearch Engineering converts engineering knowledge into reusable software infrastructure.

The system is designed around:

> **Calculate → Validate → Simulate → Explain → Document → Automate**

The ecosystem combines:

* 💻 Software Engineering
* ⚡ Electrical Engineering
* ☀️ Solar Engineering
* 📐 Deterministic Engineering Calculations
* 🔬 Engineering Simulation
* ✅ Validation Infrastructure
* 📊 Engineering Reporting
* 📄 Technical Documentation
* 🤖 Artificial Intelligence
* 🔌 Model Context Protocol

## Goals

* Build reusable engineering engines.
* Make engineering calculations deterministic.
* Make assumptions explicit.
* Make calculations traceable.
* Make engineering results testable.
* Separate engineering mathematics from applications.
* Provide structured interfaces for APIs and MCP.
* Enable AI to orchestrate engineering tools without owning engineering mathematics.

---

# 🧭 Engineering Philosophy

Engineering calculations should behave like engineering infrastructure—not spreadsheets, UI logic, or AI guesses.

## Engineering Characteristics

| Characteristic    | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| **Deterministic** | The same valid input produces the same engineering result.         |
| **Traceable**     | Calculations can preserve how results were produced.               |
| **Unit-aware**    | Engineering quantities use explicit units and dimensions.          |
| **Validated**     | Invalid inputs are rejected before dependent calculations execute. |
| **Reusable**      | Engines can support applications, APIs, MCP, and AI workflows.     |
| **Serializable**  | Results can be represented consistently for storage and transport. |
| **Reviewable**    | Warnings, assumptions, issues, and traces remain inspectable.      |
| **Testable**      | Engineering behavior is covered by automated tests.                |

---

## Engineering Philosophy Diagram

```text
ENGINEERING PROBLEM
        │
        ▼
      INPUT
        │
        ▼
   VALIDATION
        │
        ▼
 ENGINEERING ENGINE
        │
        ▼
   CALCULATION
        │
        ▼
    WARNINGS
        │
        ▼
 ENGINEERING RESULT
    ├── ASSUMPTIONS
    ├── TRACE
    ├── ISSUES
    └── REPORTS
        │
        ▼
 APPLICATIONS / API / MCP / AI
```

AI interacts with engineering infrastructure.

The engineering infrastructure remains deterministic.

---

# 🏗️ Architecture

Ogwusearch Engineering follows a layered architecture.

```text
USER / AI
    │
    ▼
APPLICATIONS
    │
    ▼
ENGINEERING SERVICES
    │
    ▼
DOMAIN ENGINES
    │
    ▼
ENGINEERING CORE
    │
    ▼
ENGINEERING TYPES
    │
    ├── ENGINEERING UNITS
    │
    └── ENGINEERING VALIDATION
```

Each layer should depend only on infrastructure below it.

---

## Architectural Layers

| Layer               | Responsibility                                      |
| ------------------- | --------------------------------------------------- |
| User / AI           | Human interaction and AI orchestration              |
| Applications        | Engineering user interfaces                         |
| Services            | APIs and MCP interfaces                             |
| Domain Engines      | Engineering mathematics                             |
| Engineering Core    | Calculation lifecycle and orchestration             |
| Foundation Packages | Shared engineering contracts, units, and validation |

---

## Why Layered Architecture?

The separation provides:

* Reusable engineering engines.
* Independent testing.
* Stable dependency boundaries.
* Separation between infrastructure and mathematics.
* Replaceable application layers.
* API-independent calculations.
* MCP-independent calculations.
* AI-independent engineering logic.

---

# ⚡ Engineering Pipeline

Engineering calculations follow a common lifecycle.

```text
Input
  │
  ▼
Validation
  │
  ▼
Calculation
  │
  ▼
Warnings
  │
  ▼
Assumptions
  │
  ▼
Result
  │
  ▼
Trace
```

This lifecycle is implemented by:

```text
@ogwusearch/engineering-core
```

Domain engines provide the engineering-specific mathematics and domain contracts.

---

## Calculation Lifecycle Responsibilities

| Stage       | Responsibility                                        |
| ----------- | ----------------------------------------------------- |
| Input       | Accept engineering inputs.                            |
| Validation  | Validate reusable and domain-specific constraints.    |
| Calculation | Execute deterministic mathematics.                    |
| Warnings    | Preserve non-blocking engineering conditions.         |
| Assumptions | Preserve assumptions used by the calculation.         |
| Result      | Produce structured engineering results.               |
| Trace       | Preserve calculation history and supporting metadata. |

---

# 🏛️ Engineering Foundation

The engineering foundation provides reusable infrastructure beneath domain engines.

## Foundation Packages

| Package                              | Responsibility                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------------- |
| `@ogwusearch/engineering-types`      | Shared engineering contracts and result types.                                              |
| `@ogwusearch/engineering-units`      | Dimensions, units, quantities, conversions, and formatting.                                 |
| `@ogwusearch/engineering-validation` | Generic validation infrastructure.                                                          |
| `@ogwusearch/engineering-core`       | Calculation lifecycle, execution, results, traces, and reusable calculation infrastructure. |

---

## `engineering-types`

Owns shared engineering contracts.

Examples include:

* Calculation results
* Calculation status
* Errors
* Warnings
* Issues
* Metadata
* Trace structures
* Assumption structures

`engineering-types` does not own domain calculations.

---

## `engineering-units`

Owns physical quantities and unit infrastructure.

Current engineering dimensions include:

* Voltage
* Current
* Power
* Energy
* Resistance
* Charge
* Time
* Length
* Temperature
* Percentage

Responsibilities include:

* Dimensions
* Units
* Quantities
* Conversions
* Formatting

`engineering-units` does not own domain validation rules.

---

## `engineering-validation`

Provides reusable validation infrastructure.

Examples include:

* Required values
* Positive values
* Numeric validation
* Range validation
* Integer validation
* Issue aggregation
* Error/warning separation
* Field-path preservation

Domain packages build their engineering-specific validation on top of the reusable infrastructure.

---

## `engineering-core`

Provides reusable calculation infrastructure.

Current responsibilities include:

* Calculation definitions
* Calculation execution
* Calculation context
* Calculation lifecycle
* Validation orchestration
* Result creation
* Error creation
* Warning creation
* Trace creation
* Trace context
* Trace builders
* Assumption builders
* Reusable engineering formulas

`engineering-core` does **not** own solar engineering mathematics.

---

# 🔬 Engineering Engines

Engineering engines contain domain-specific deterministic mathematics.

## Current Domain Engine

| Engine                     | Responsibility                                       |
| -------------------------- | ---------------------------------------------------- |
| `@ogwusearch/solar-engine` | Solar and renewable-energy engineering calculations. |

Additional domain engines are planned for future phases.

Potential future engines include:

| Engine              | Intended Responsibility                      |
| ------------------- | -------------------------------------------- |
| `electrical-engine` | General electrical engineering calculations. |
| `circuit-engine`    | Circuit analysis and simulation.             |

These are architectural targets, not current production packages in the repository.

---

# ☀️ Solar Engineering

Solar Engine is currently the primary domain engine in the repository.

Package:

```text
@ogwusearch/solar-engine
```

The current architecture organizes domain functionality under:

```text
packages/solar-engine/src/modules/
```

with reusable solar infrastructure under:

```text
packages/solar-engine/src/shared/
```

---

## Solar Engineering Modules

The current Solar Engine contains 18 modules:

| Module              | Responsibility                     |
| ------------------- | ---------------------------------- |
| `load`              | Load calculations and validation   |
| `energy`            | Energy consumption analysis        |
| `peak-demand`       | Peak demand calculation            |
| `pv-sizing`         | PV system sizing                   |
| `pv-array`          | PV array configuration             |
| `pv-string`         | PV string configuration            |
| `battery`           | Battery sizing                     |
| `inverter`          | Inverter sizing                    |
| `charge-controller` | Charge-controller / MPPT sizing    |
| `cable`             | Cable sizing                       |
| `voltage-drop`      | Voltage-drop analysis              |
| `protection`        | Electrical protection calculations |
| `earthing`          | Earthing calculations              |
| `generator`         | Generator sizing                   |
| `bom`               | Bill of materials                  |
| `costing`           | Project costing                    |
| `system-validation` | Cross-system validation            |
| `reports`           | Engineering report generation      |

---

## Solar Engine Structure

```text
packages/solar-engine/

├── src/
│   ├── index.ts
│   │
│   ├── modules/
│   │   ├── load/
│   │   ├── energy/
│   │   ├── peak-demand/
│   │   ├── pv-sizing/
│   │   ├── pv-array/
│   │   ├── pv-string/
│   │   ├── battery/
│   │   ├── inverter/
│   │   ├── charge-controller/
│   │   ├── cable/
│   │   ├── voltage-drop/
│   │   ├── protection/
│   │   ├── earthing/
│   │   ├── generator/
│   │   ├── bom/
│   │   ├── costing/
│   │   ├── system-validation/
│   │   └── reports/
│   │
│   └── shared/
│       ├── assumptions/
│       ├── constants/
│       ├── derating/
│       ├── irradiance/
│       ├── standards/
│       ├── temperature/
│       └── warnings/
│
├── tests/
├── biome.json
├── package.json
└── tsconfig.json
```

---

## Solar Design Workflow

The intended system-level engineering workflow is:

```text
Load Audit
    │
    ▼
Energy Analysis
    │
    ▼
Peak Demand
    │
    ▼
PV Sizing
    │
    ▼
PV Array
    │
    ▼
PV String
    │
    ▼
Battery
    │
    ▼
Inverter
    │
    ▼
Charge Controller
    │
    ▼
Cable Sizing
    │
    ▼
Voltage Drop
    │
    ▼
Protection
    │
    ▼
Earthing
    │
    ▼
System Validation
    │
    ▼
BOM
    │
    ▼
Costing
    │
    ▼
Engineering Reports
```

Individual modules remain independently testable even when used as part of a larger engineering workflow.

---

## Peak Demand

Peak-demand calculations preserve the established engineering relationships:

```text
Individual Demand
    = Running Power × Demand Factor

Normal Coincident Demand
    = Σ Individual Demand / Diversity Factor

Starting Demand
    = Explicit Starting Power
      OR
      Running Power × Surge Factor

Design Demand
    = Peak Demand × (1 + Demand Margin)
```

Existing regression behavior is preserved during architectural migration.

---

# 📦 Repository Structure

The current repository is organized around the engineering foundation and Solar Engine.

```text
ogwusearch/

├── README.md
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .gitignore
│
├── packages/
│   ├── engineering-types/
│   ├── engineering-units/
│   ├── engineering-validation/
│   ├── engineering-core/
│   └── solar-engine/
│
├── docs/
│   ├── foundation/
│   ├── architecture/
│   ├── engineering/
│   ├── standards/
│   ├── calculations/
│   ├── roadmap/
│   └── media/
│
├── tools/
│   ├── generators/
│   ├── scripts/
│   └── development/
│
└── experiments/
```

Future applications, services, and additional domain engines can be added without changing the foundation architecture.

---

# 📦 Package Responsibilities

## Foundation Packages

| Package                  | Purpose                                            |
| ------------------------ | -------------------------------------------------- |
| `engineering-types`      | Shared engineering contracts                       |
| `engineering-units`      | Units, quantities, dimensions, and conversions     |
| `engineering-validation` | Reusable validation                                |
| `engineering-core`       | Calculation lifecycle and execution infrastructure |

---

## Domain Packages

| Package             | Purpose                         | Status  |
| ------------------- | ------------------------------- | ------- |
| `solar-engine`      | Solar engineering calculations  | Current |
| `electrical-engine` | General electrical engineering  | Planned |
| `circuit-engine`    | Circuit analysis and simulation | Planned |

---

## Future Applications

The architecture is intended to support applications such as:

| Project              | Purpose                            |
| -------------------- | ---------------------------------- |
| SolarAudit           | Solar engineering workspace        |
| Engineering Platform | Unified engineering interface      |
| Circuit Simulator    | Engineering simulation application |
| Engineering Notes    | Engineering documentation          |
| Solar Calculator     | Standalone engineering calculator  |
| Circuit Calculator   | Circuit utilities                  |

These applications are part of the platform vision and are not all current repository packages.

---

## Future Services

Planned service layers include:

| Service           | Purpose                               |
| ----------------- | ------------------------------------- |
| `engineering-api` | Engineering HTTP API                  |
| `engineering-mcp` | MCP server exposing engineering tools |

The service layer should consume engineering engines rather than duplicate their mathematics.

---

# 🔗 Dependency Architecture

Dependencies should point toward the engineering foundation.

```text
Applications
     │
     ▼
Services
     │
     ▼
Domain Engines
     │
     ▼
Engineering Core
     │
     ├───────────────┐
     ▼               ▼
Engineering Types   Engineering Validation
     │
     ▼
Engineering Units
```

At the package level, the intended direction is:

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
```

Domain engines may consume the reusable foundation packages directly where their contracts require them.

---

## Architectural Rule

The foundation must never depend on domain engines.

```text
Foundation
    │
    ▼
Domain Engines
    │
    ▼
Services
    │
    ▼
Applications
    │
    ▼
AI / MCP
```

Dependencies must remain acyclic.

---

## Forbidden Dependencies

Do not introduce:

```text
❌ Foundation → Solar Engine

❌ Foundation → Electrical Engine

❌ Engine → React

❌ Engine → Database

❌ Engine → API

❌ Engine → MCP

❌ Engine → AI SDK

❌ Engine → UI State
```

Engineering engines should remain independently executable and testable.

---

# 🛠️ Technology Stack

## Core

| Technology | Purpose                     |
| ---------- | --------------------------- |
| TypeScript | Engineering packages        |
| Node.js    | Runtime and tooling         |
| pnpm       | Monorepo package management |
| Vitest     | Automated testing           |
| Git        | Version control             |

Package tooling may evolve independently as the repository grows.

---

## Application Layer

Planned application technologies include:

| Technology              | Purpose                         |
| ----------------------- | ------------------------------- |
| React                   | Engineering interfaces          |
| Vite                    | Application tooling             |
| Visualization libraries | Engineering charts and diagrams |
| PDF tooling             | Engineering reports             |

Applications should consume domain engines rather than reproduce their calculations.

---

## Backend Services

Planned service technologies include:

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| FastAPI / Node.js  | Engineering APIs              |
| PostgreSQL         | Persistent application data   |
| SQLite / IndexedDB | Offline engineering workflows |

These technologies belong to service/application layers and should not become dependencies of deterministic engineering engines.

---

## AI Layer

Planned AI infrastructure includes:

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| MCP        | Engineering tool interface   |
| LLMs       | Reasoning and orchestration  |
| Retrieval  | Engineering knowledge access |

AI is an orchestration and explanation layer—not the source of engineering truth.

---

# 🧪 Development Workflow

Every engineering feature should follow a disciplined workflow.

```text
PLAN
  │
  ▼
DEFINE CONTRACT
  │
  ▼
IMPLEMENT
  │
  ▼
UNIT TEST
  │
  ▼
INTEGRATION TEST
  │
  ▼
TYPECHECK
  │
  ▼
LINT / FORMAT
  │
  ▼
BUILD
  │
  ▼
ARCHITECTURE REVIEW
  │
  ▼
COMMIT
```

---

## Before Writing Code

1. Read the relevant development plan.
2. Read the target package README.
3. Inspect the existing architecture.
4. Inspect existing source code.
5. Inspect existing tests.
6. Identify the current development phase.
7. Implement only the required scope.

---

## Working on Foundation Packages

```bash
pnpm --filter @ogwusearch/engineering-types exec tsc --noEmit

pnpm --filter @ogwusearch/engineering-units exec tsc --noEmit

pnpm --filter @ogwusearch/engineering-validation exec tsc --noEmit

pnpm --filter @ogwusearch/engineering-core exec tsc --noEmit
```

---

## Working on Solar Engine

```bash
pnpm --filter @ogwusearch/solar-engine test

pnpm --filter @ogwusearch/solar-engine exec tsc --noEmit

pnpm --filter @ogwusearch/solar-engine build
```

---

# ✅ Testing Strategy

Testing is part of the engineering architecture.

## Test Layers

1. Contract tests
2. Normal behavior tests
3. Boundary tests
4. Failure tests
5. Regression tests
6. Integration tests

---

## Engineering Tests Cover

* Valid calculations
* Invalid inputs
* Boundary conditions
* Validation failures
* Engineering warnings
* Engineering assumptions
* Calculation traces
* Regression cases
* Cross-module behavior
* System-level integration

---

## Current Solar Engine Verification

The current migrated Solar Engine baseline has been verified with:

```text
55 test files
577 tests passed
TypeScript compilation passed
Production build passed
Native Node.js ESM import passed
```

The generated public package can be loaded directly from:

```text
packages/solar-engine/dist/index.js
```

The public package currently exposes the module and shared engineering APIs through its package entry point.

---

## Workspace Verification

Before considering a development phase complete:

```bash
pnpm vitest run
pnpm tsc --noEmit
pnpm build
```

Where configured, linting and formatting checks should also pass.

---

# 📊 Engineering Standards

## Deterministic Calculations

Engineering calculations must not depend on:

* Current time
* Randomness
* Network state
* Database state
* Browser state
* Hidden mutable globals

For a given valid input and defined assumptions, the calculation should produce the same result.

---

## Unit-Aware Engineering

Engineering quantities should use explicit dimensions and units.

Current foundation dimensions include:

```text
Voltage
Current
Power
Energy
Resistance
Charge
Time
Length
Temperature
Percentage
```

Compatible conversions should succeed.

Incompatible conversions should fail explicitly.

---

## Validation Philosophy

Validation should:

* Execute before dependent calculations.
* Collect relevant issues.
* Preserve issue ordering.
* Preserve field paths.
* Separate errors from warnings.
* Preserve useful metadata.
* Prevent invalid engineering states from silently entering calculations.

---

## Trace Philosophy

Engineering results may preserve:

* Step identifiers
* Inputs
* Outputs
* Formula references
* Assumptions
* Metadata
* Warnings
* Calculation context

Trace ordering should remain deterministic.

---

## Assumption Philosophy

Engineering assumptions should be explicit rather than hidden inside formulas.

Examples include:

* Design margins
* Efficiency assumptions
* Temperature assumptions
* Derating factors
* System voltage
* Performance factors
* Environmental assumptions
* Standards-related assumptions

The goal is to make engineering decisions inspectable.

---

# 🤖 AI Engineering & MCP

AI is an orchestration layer.

It should **not replace deterministic engineering engines**.

The intended architecture is:

```text
Natural Language
       │
       ▼
Understand Request
       │
       ▼
Select Engineering Tool
       │
       ▼
Engineering MCP
       │
       ▼
Engineering Service
       │
       ▼
Engineering Engine
       │
       ▼
Structured Result
       │
       ▼
Explanation / Documentation
```

The AI layer interprets requests and orchestrates tools.

The engineering engine performs the calculation.

---

## MCP Responsibilities

Potential engineering MCP tools include:

```text
calculate_load

calculate_energy_consumption

calculate_pv_size

calculate_pv_array

calculate_pv_string

calculate_battery_size

calculate_inverter_size

calculate_charge_controller_size

calculate_cable_size

calculate_voltage_drop

validate_solar_system

generate_bom

calculate_project_cost

generate_engineering_report
```

The MCP layer should expose engineering contracts.

It should not duplicate engineering mathematics.

---

# 🗺️ Roadmap

The roadmap distinguishes the **current engineering foundation** from future platform development.

## Phase 00 — Engineering Foundation

### Status: Established

* Workspace
* Engineering types
* Engineering units
* Validation infrastructure
* Engineering core
* Core tests
* Foundation documentation

---

## Phase 01 — Foundation Integration

### Status: Established / Continuing

* Cross-package integration
* Calculation lifecycle
* Result infrastructure
* Trace infrastructure
* Formula infrastructure
* Dependency verification
* Foundation regression tests

---

## Phase 02 — Solar Engine

### Status: Current / Modularized

The Solar Engine architecture currently contains:

* Load
* Energy
* Peak Demand
* PV Sizing
* PV Array
* PV String
* Battery
* Inverter
* Charge Controller
* Cable
* Voltage Drop
* Protection
* Earthing
* Generator
* System Validation
* BOM
* Costing
* Reports

The current architecture separates:

```text
solar-engine/src/modules/
solar-engine/src/shared/
```

from the engineering foundation.

---

## Phase 03 — SolarAudit

### Status: Planned

Potential capabilities:

* Dashboard
* Customer management
* Project management
* Engineering workflows
* Calculation review
* Reporting
* Engineering documentation

---

## Phase 04 — Validation & Testing

### Status: Ongoing

* Regression testing
* Cross-module testing
* Boundary testing
* Integration testing
* Contract testing
* Engineering invariants
* System validation

---

## Phase 05 — Engineering Reports

### Status: Planned / Expanding

* Engineering reports
* Audit reports
* Technical documentation
* Calculation traces
* Assumption summaries
* Engineering result exports

---

## Phase 06 — Engineering MCP

### Status: Planned

* MCP server
* Engineering tools
* Tool schemas
* Validation interfaces
* Structured engineering results

---

## Phase 07 — AI Engineering Assistant

### Status: Planned

* Natural-language engineering interface
* Tool orchestration
* Engineering explanations
* Documentation generation
* Engineering workflow assistance

---

## Phase 08 — Engineering Tools

### Status: Planned

* Solar Calculator
* Circuit Calculator
* Circuit Simulator
* Engineering utilities
* Engineering analysis tools

---

## Phase 09 — Unified Engineering Platform

### Status: Future

Unify:

```text
Projects
Tools
Engines
Reports
APIs
MCP
AI
Documentation
```

into a coherent engineering platform.

---

## Phase 10 — Public Engineering Presence

### Status: Future

* Public documentation
* Engineering articles
* Demonstrations
* Open-source engineering tools
* Engineering portfolio
* Educational material

---

# 📚 Documentation

Documentation is part of the engineering system.

Current documentation is organized around:

```text
docs/

├── foundation/
├── architecture/
├── engineering/
├── standards/
├── calculations/
├── roadmap/
└── media/
```

Documentation may cover:

* Engineering assumptions
* Formulas
* Units
* Validation rules
* Calculation traces
* Architecture decisions
* Standards
* API contracts
* MCP tool contracts
* Engineering workflows

A public engineering system should document not only **what** it calculates, but also **how** and **under which assumptions** it calculates it.

---

# 🤝 Contributing

Contributions should preserve the engineering architecture.

## Before Writing Code

1. Read the relevant development plan.
2. Read the target package documentation.
3. Inspect the package architecture.
4. Inspect existing tests.
5. Identify existing contracts.
6. Determine the appropriate layer.
7. Implement the smallest coherent change.

---

## Before Opening a Pull Request

Run the relevant checks:

```bash
pnpm vitest run
pnpm tsc --noEmit
pnpm build
```

Also verify:

* Deterministic behavior.
* Dependency direction.
* No circular dependencies.
* Unit consistency.
* Validation behavior.
* Regression coverage.
* Integration behavior.
* Documentation for public API changes.

---

## Architectural Review

Before merging a substantial engineering change, ask:

```text
Does this belong in the foundation?

Does this belong in a domain engine?

Does this introduce a new dependency direction?

Does this duplicate existing engineering mathematics?

Are assumptions explicit?

Are units explicit?

Can the behavior be tested independently?

Can the result be traced?

Can the calculation run without a UI?

Can the calculation run without AI?

Can the calculation run without a database?
```

---

# 🌍 Long-Term Vision

Ogwusearch Engineering is designed to become reusable engineering infrastructure capable of powering:

* Engineering Applications
* Engineering Calculators
* Engineering Simulators
* Engineering Reports
* Engineering APIs
* MCP Servers
* AI Engineering Assistants
* Engineering Automation Workflows

The objective is **not simply to build applications**.

The objective is to build engineering infrastructure that applications, services, and AI can trust.

```text
Engineering Knowledge
        │
        ▼
Engineering Contracts
        │
        ▼
Deterministic Engines
        │
        ▼
Services / APIs / MCP
        │
        ▼
Applications
        │
        ▼
AI-Assisted Engineering
```

---

# 🧠 Core Principles

1. **Build the engineering foundation first.**

2. **Keep engineering calculations deterministic.**

3. **Separate infrastructure from engineering mathematics.**

4. **Keep units explicit and validation reusable.**

5. **Make assumptions visible.**

6. **Make calculation traces inspectable.**

7. **Keep dependency direction acyclic.**

8. **Test engineering behavior before depending on it.**

9. **Treat documentation as part of the engineering system.**

10. **Connect AI only after engineering logic is reliable.**

---

<p align="center">
  <strong>OGWUSEARCH ENGINEERING</strong><br>
  Software Engineering × Electrical Engineering × AI
</p>

<p align="center">
  <em>Engineering Infrastructure First.</em>
</p>
