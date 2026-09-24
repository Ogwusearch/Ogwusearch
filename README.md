⚙️ OGWUSEARCH ENGINEERING

# ⚙️ OGWUSEARCH ENGINEERING

### Software Engineering × Electrical Engineering × AI

<p align="center"> <strong>Build reliable engineering infrastructure first.</strong><br/> Build deterministic engineering engines.<br/> Build applications on top of them.<br/> Connect AI to engineering infrastructure rather than replacing it. </p>

---

## 🌍 Overview

**Ogwusearch Engineering** is an open engineering technology ecosystem for building **deterministic engineering software**, reusable calculation engines, engineering simulations, technical tools, APIs, Model Context Protocol (MCP) services, and AI-assisted engineering workflows.

The platform is designed around one architectural principle:

> **Engineering infrastructure comes first. Domain mathematics comes second. Applications, APIs, MCP, and AI consume that infrastructure.**

Instead of embedding engineering logic inside user interfaces or AI prompts, Ogwusearch Engineering builds reusable engineering engines that can power multiple applications while remaining independently testable, deterministic, and traceable.

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

* [🤖 AI Engineering & MCP](#-ai-engineering--mcp)

* [🗺️ Roadmap](#️-roadmap)

* [📚 Documentation](#-documentation)

* [🤝 Contributing](#-contributing)

* [🌍 Long-Term Vision](#-long-term-vision)

* [🧠 Core Principles](#-core-principles)

---

# 🚀 Quick Start

## Prerequisites

Install the required development tools.

| Tool       | Purpose                   |
| ---------- | ------------------------- |
| Node.js    | Runtime and tooling       |
| pnpm       | Workspace package manager |
| Git        | Version control           |
| TypeScript | Engineering packages      |

Verify installation:

```
node --version
pnpm --version
git --version
```

---

## Clone the Repository

```
git clone https://github.com/Ogwusearch/Ogwusearch.git
cd ogwusearch
```

---

## Install Dependencies

```
pnpm install
```

---

## Run the Test Suite

```
pnpm vitest run
```

Expected baseline after the engineering foundation is complete:

```
Test Files   16 passed
Tests       200+ passed
```

---

## Type Check the Workspace

```
pnpm tsc --noEmit
```

---

## Build the Workspace

```
pnpm build
```

---

## Development Loop

```
git pull
pnpm install
pnpm vitest run
pnpm tsc --noEmit
pnpm lint
pnpm build
```

Before committing:

```
git status
git add .
git commit -m "feat: describe your change"
git push origin main
```

> **First principle:** Engineering tests pass before application features are built.

---

# 🎯 Mission

Ogwusearch Engineering converts engineering knowledge into reusable software infrastructure.

The ecosystem is designed to:

> **Calculate → Validate → Simulate → Explain → Document → Automate**

The platform combines multiple disciplines into one reusable engineering stack.

### Engineering Disciplines

* 💻 Software Engineering

* ⚡ Electrical Engineering

* ☀️ Solar Engineering

* 📐 Deterministic Engineering Calculations

* 🔬 Engineering Simulation

* ✅ Validation Infrastructure

* 📊 Engineering Reporting

* 📄 Technical Documentation

* 🤖 Artificial Intelligence

* 🔌 Model Context Protocol (MCP)

### Goals

* Reusable engineering engines.

* Reliable engineering calculations.

* Explainable engineering workflows.

* Testable engineering behavior.

* AI-assisted engineering productivity.

---

# 🧭 Engineering Philosophy

Engineering calculations must behave like engineering—not spreadsheets, UI logic, or AI guesses.

## Engineering Characteristics

| Characteristic    | Description                                                        |
| ----------------- | ------------------------------------------------------------------ |
| **Deterministic** | Same valid input always produces the same engineering output.      |
| **Traceable**     | Every calculation explains how it reached the result.              |
| **Unit-aware**    | Engineering quantities always carry explicit units and dimensions. |
| **Validated**     | Invalid engineering inputs fail before calculation.                |
| **Reusable**      | Engines power applications, APIs, MCP, and AI simultaneously.      |
| **Serializable**  | Results can be stored and transmitted consistently.                |
| **Reviewable**    | Warnings, assumptions, and traces remain visible.                  |
| **Testable**      | Every engineering behavior is covered by automated tests.          |

---

## Engineering Philosophy Diagram

```
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
    ├── TRACE
    ├── REPORTS
    └── APPLICATIONS / API / MCP / AI
```

AI interacts with engineering infrastructure.

Engineering infrastructure remains deterministic.

---

# 🏗️ Architecture

Ogwusearch Engineering follows a layered architecture.

## Layer Model

```
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
ENGINEERING TYPES • UNITS • VALIDATION
```

Each layer depends only on layers below it.

---

## Architectural Layers

| Layer               | Responsibility                         |
| ------------------- | -------------------------------------- |
| User / AI           | Human interaction and AI orchestration |
| Applications        | Engineering user interfaces            |
| Services            | APIs and MCP services                  |
| Domain Engines      | Engineering mathematics                |
| Engineering Core    | Calculation lifecycle                  |
| Foundation Packages | Shared engineering infrastructure      |

---

## Why Layered Architecture?

* Reusable engines.

* Independent testing.

* Stable dependency graph.

* Domain logic separated from infrastructure.

* AI can orchestrate tools without owning calculations.

---

# ⚡ Engineering Pipeline

Every engineering calculation follows the same lifecycle.

```
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

This lifecycle is implemented by `**@ogwusearch/engineering-core**`.

Domain packages only provide engineering mathematics.

---

## Calculation Lifecycle Responsibilities

| Stage       | Responsibility                             |
| ----------- | ------------------------------------------ |
| Input       | Accept engineering inputs.                 |
| Validation  | Validate reusable engineering constraints. |
| Calculation | Execute deterministic mathematics.         |
| Warnings    | Collect non-blocking engineering warnings. |
| Assumptions | Preserve engineering assumptions.          |
| Result      | Build structured engineering result.       |
| Trace       | Preserve calculation history.              |

---

# 🏛️ Engineering Foundation

The engineering foundation is reusable infrastructure beneath every engineering engine.

## Foundation Packages

| Package                              | Responsibility                                          |
| ------------------------------------ | ------------------------------------------------------- |
| `@ogwusearch/engineering-types`      | Shared engineering contracts and result types.          |
| `@ogwusearch/engineering-units`      | Dimensions, units, quantities, conversions, formatting. |
| `@ogwusearch/engineering-validation` | Generic validation infrastructure.                      |
| `@ogwusearch/engineering-core`       | Calculation execution lifecycle and orchestration.      |

---

## Foundation Responsibilities

### `engineering-types`

Owns shared contracts.

Examples:

* Calculation results

* Calculation status

* Errors

* Warnings

* Issues

* Metadata

* Trace

* Assumptions

Never owns calculations.

---

### `engineering-units`

Owns physical quantities.

Examples:

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

Never owns validation rules.

---

### `engineering-validation`

Owns reusable validation.

Examples:

* Required values

* Positive values

* Numeric validation

* Range validation

* Issue aggregation

* Warning/error separation

Never owns solar rules.

---

### `engineering-core`

Owns reusable execution infrastructure.

Examples:

* Validation orchestration

* Execution context

* Result creation

* Trace creation

* Warning collection

* Assumption collection

Never owns engineering mathematics.

---

## Architectural Principle

```
Foundation
    │
    ▼
Engineering Engines
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

The foundation never imports engineering engines.

---

# 🔬 Engineering Engines

Engineering engines contain deterministic engineering mathematics.

## Current Engineering Engines

| Engine              | Responsibility                          |
| ------------------- | --------------------------------------- |
| `solar-engine`      | Solar and renewable-energy engineering. |
| `electrical-engine` | General electrical engineering.         |
| `circuit-engine`    | Circuit analysis and simulation.        |

Future engines follow the same architecture.

---

# ☀️ Solar Engineering

The first production engineering domain.

## Solar Engineering Modules

| Module            | Responsibility                   |
| ----------------- | -------------------------------- |
| Load              | Load calculations and validation |
| Energy            | Energy consumption analysis      |
| Peak Demand       | Peak load calculation            |
| PV Sizing         | Solar PV sizing                  |
| PV Array          | PV array configuration           |
| PV String         | String configuration             |
| Battery           | Battery sizing                   |
| Inverter          | Inverter sizing                  |
| Charge Controller | MPPT/controller sizing           |
| Cable             | Cable sizing                     |
| Voltage Drop      | Voltage-drop analysis            |
| Protection        | Electrical protection            |
| Earthing          | Grounding calculations           |
| Generator         | Generator sizing                 |
| System Validation | Cross-system validation          |
| BOM               | Bill of materials                |
| Costing           | Project costing                  |
| Reports           | Engineering reports              |

---

## Solar Design Workflow

```
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

---

# 📦 Repository Structure

```
ogwusearch/
│
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
│   ├── solar-engine/
│   ├── electrical-engine/
│   └── circuit-engine/
│
├── apps/
│   └── solaraudit/
│
├── services/
│   ├── engineering-api/
│   └── engineering-mcp/
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

---

# 📦 Package Responsibilities

## Foundation Packages

| Package                | Purpose                      |
| ---------------------- | ---------------------------- |
| engineering-types      | Shared engineering contracts |
| engineering-units      | Units and dimensions         |
| engineering-validation | Validation infrastructure    |
| engineering-core       | Calculation lifecycle        |

---

## Domain Packages

| Package           | Purpose                             |
| ----------------- | ----------------------------------- |
| solar-engine      | Solar engineering calculations      |
| electrical-engine | Electrical engineering calculations |
| circuit-engine    | Circuit analysis and simulation     |

---

## Applications

| Project              | Purpose                            |
| -------------------- | ---------------------------------- |
| SolarAudit           | Solar engineering workspace        |
| Engineering Platform | Unified engineering interface      |
| Circuit Simulator    | Engineering simulation application |
| Engineering Notes    | Engineering documentation          |
| Solar Calculator     | Standalone engineering calculator  |
| Circuit Calculator   | Circuit utilities                  |

---

## Services

| Service         | Purpose                               |
| --------------- | ------------------------------------- |
| engineering-api | Engineering HTTP API                  |
| engineering-mcp | MCP server exposing engineering tools |

---

# 🔗 Dependency Architecture

Dependencies always point toward the engineering foundation.

```
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
     ▼
Engineering Types / Units / Validation
```

---

## Allowed Dependency Graph

```
engineering-types
      │
      ├── engineering-units
      ├── engineering-validation
      └── engineering-core
              │
              ├── solar-engine
              ├── electrical-engine
              └── circuit-engine
```

---

## Forbidden Dependencies

Never introduce:

```
❌ Foundation → Solar Engine
❌ Engine → React
❌ Engine → Database
❌ Engine → API
❌ Engine → MCP
❌ Engine → AI SDK
❌ Engine → UI State
```

The dependency graph must remain acyclic.

---

# 🛠️ Technology Stack

## Core

| Technology | Purpose              |
| ---------- | -------------------- |
| TypeScript | Engineering packages |
| Node.js    | Runtime              |
| pnpm       | Monorepo             |
| Vitest     | Testing              |
| ESLint     | Linting              |
| Prettier   | Formatting           |
| Git        | Version control      |

---

## Applications

| Technology              | Purpose             |
| ----------------------- | ------------------- |
| React                   | Engineering UI      |
| Vite                    | Application tooling |
| PDF Tooling             | Engineering reports |
| Visualization Libraries | Charts and diagrams |

---

## Backend Services

| Technology         | Purpose                     |
| ------------------ | --------------------------- |
| FastAPI / Node     | Engineering APIs            |
| PostgreSQL         | Persistent application data |
| SQLite / IndexedDB | Offline workflows           |

---

## AI Layer

| Technology | Purpose                      |
| ---------- | ---------------------------- |
| MCP        | Engineering tool interface   |
| LLMs       | Reasoning and orchestration  |
| Retrieval  | Engineering knowledge access |

---

# 🧪 Development Workflow

Every feature follows the same engineering workflow.

```
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
LINT
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

## Working on a Package

```
pnpm --filter @ogwusearch/engineering-types test

pnpm --filter @ogwusearch/engineering-units test

pnpm --filter @ogwusearch/engineering-validation test

pnpm --filter @ogwusearch/engineering-core test

pnpm --filter @ogwusearch/solar-engine test
```

---

# ✅ Testing Strategy

Testing is part of the engineering architecture.

## Test Layers

1. Contract Tests

2. Normal Behavior Tests

3. Boundary Tests

4. Failure Tests

5. Regression Tests

6. Integration Tests

---

## Engineering Tests Cover

* Valid calculations.

* Invalid inputs.

* Boundary conditions.

* Engineering warnings.

* Engineering assumptions.

* Calculation traces.

* Regression cases.

* Cross-module integration.

---

## Workspace Verification

```
pnpm vitest run

pnpm tsc --noEmit

pnpm lint

pnpm build
```

A development phase is complete only when all checks succeed.

---

# 📊 Engineering Standards

## Deterministic Calculations

Engineering calculations must **never** depend on:

* Current time.

* Randomness.

* Network state.

* Database state.

* Browser state.

* Hidden mutable globals.

Same input must always produce the same engineering result.

---

## Unit-Aware Engineering

Supported dimensions include:

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

Compatible conversions succeed.

Incompatible conversions fail explicitly.

---

## Validation Philosophy

Validation:

* Executes before calculations.

* Collects all issues.

* Preserves ordering.

* Preserves field paths.

* Separates warnings from errors.

* Keeps metadata intact.

---

## Trace Philosophy

Every engineering result may contain:

* Step identifiers.

* Inputs.

* Outputs.

* Formula references.

* Assumptions.

* Metadata.

Trace order is deterministic.

---

# 🤖 AI Engineering & MCP

AI is an orchestration layer.

It does **not** replace deterministic engineering engines.

---

## AI Workflow

```
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

---

## MCP Responsibilities

Examples:

* calculate_load

* calculate_energy_consumption

* calculate_pv_size

* calculate_pv_array

* calculate_pv_string

* calculate_battery_size

* calculate_inverter_size

* calculate_charge_controller_size

* calculate_cable_size

* calculate_voltage_drop

* validate_solar_system

* generate_bom

* calculate_project_cost

* generate_engineering_report

The MCP layer exposes engineering contracts rather than engineering mathematics.

---

# 🗺️ Roadmap

## Phase 00 — Engineering Foundation

* Workspace

* Types

* Units

* Validation

* Core

* Testing

* Documentation

---

## Phase 01 — Foundation Integration

* Cross-package integration.

* Demonstration calculations.

* Dependency verification.

---

## Phase 02 — Solar Engine

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

---

## Phase 03 — SolarAudit

* Dashboard

* Customer management

* Projects

* Engineering workflows

* Reporting

---

## Phase 04 — Validation & Testing

* Regression testing.

* Cross-engine testing.

* Boundary testing.

* Integration testing.

---

## Phase 05 — Engineering Reports

* Engineering reports.

* Audit reports.

* Technical documentation.

* Calculation traces.

---

## Phase 06 — Engineering MCP

* MCP server.

* Engineering tools.

* Tool schemas.

* Validation interfaces.

---

## Phase 07 — AI Engineering Assistant

* Natural-language engineering interface.

* Tool orchestration.

* Engineering explanations.

* Documentation generation.

---

## Phase 08 — Engineering Tools

* Solar Calculator.

* Circuit Calculator.

* Circuit Simulator.

* Engineering utilities.

---

## Phase 09 — Unified Engineering Platform

Projects, tools, engines, reports, APIs, MCP, and AI unified into one engineering ecosystem.

---

## Phase 10 — Public Engineering Presence

* Documentation.

* Engineering articles.

* Demonstrations.

* Open-source tools.

* Engineering portfolio.

---

# 📚 Documentation

Documentation is treated as part of the engineering system.

```
docs/
├── foundation/
├── architecture/
├── engineering/
├── standards/
├── calculations/
├── roadmap/
└── media/
```

Documentation includes:

* Engineering assumptions.

* Formulas.

* Units.

* Validation rules.

* Calculation traces.

* Architecture decisions.

* API contracts.

* MCP tool contracts.

---

# 🤝 Contributing

Development follows the Foundation Development Plan.

## Before Writing Code

1. Read the Foundation Development Plan.

2. Read the target package README.

3. Inspect existing source code.

4. Inspect existing tests.

5. Implement only the current development phase.

---

## Before Opening a Pull Request

Run:

```
pnpm vitest run
pnpm tsc --noEmit
pnpm lint
pnpm build
```

Verify:

* Deterministic behavior.

* Dependency direction.

* No circular dependencies.

* Tests added for new behavior.

* Documentation updated when public APIs change.

---

# 🌍 Long-Term Vision

Ogwusearch Engineering is designed to become reusable engineering infrastructure that powers:

* Engineering Applications

* Engineering Calculators

* Engineering Simulators

* Engineering Reports

* Engineering APIs

* MCP Servers

* AI Engineering Assistants

* Engineering Automation Workflows

The objective is **not** simply to build applications.

The objective is to build engineering infrastructure that applications, services, and AI can trust.

---

# 🧠 Core Principles

1. **Build the engineering foundation first.**

2. **Keep engineering calculations deterministic.**

3. **Separate infrastructure from engineering mathematics.**

4. **Keep units explicit and validation reusable.**

5. **Make assumptions visible.**

6. **Make calculation traces inspectable.**

7. **Keep dependency direction acyclic.**

8. **Test every engineering behavior.**

9. **Treat documentation as part of the engineering system.**

10. **Connect AI only after the engineering logic is reliable.**

---

<p align="center"> <strong>OGWUSEARCH ENGINEERING</strong><br/> Software Engineering × Electrical Engineering × AI </p>

<p align="center"> <em>Engineering Infrastructure First.</em> </p>
