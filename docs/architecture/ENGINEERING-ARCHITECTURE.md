# OGWUSEARCH ENGINEERING — Architecture Specification

## Purpose

This document defines the canonical architecture of the **Ogwusearch Engineering** monorepo.

It establishes:

* The separation between reusable engineering foundation and domain-specific engineering engines.
* Dependency direction.
* Standard engineering calculation flow.
* Package responsibilities.
* Engineering implementation contracts.
* Architectural constraints for future development.

This architecture is the governing contract for implementation, refactoring, testing, dependency management, and future expansion of the engineering platform.

---

# 1. Foundation Layer

The foundation provides reusable engineering infrastructure shared by all engineering domains.

Foundation packages must remain **domain-agnostic** and contain no solar, electrical, or circuit-specific mathematics.

## Foundation Packages

| Package                                  | Responsibility                                                                                                                            |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **`@ogwusearch/engineering-types`**      | Shared engineering contracts, calculation interfaces, result types, issue types, assumptions, trace contracts, metadata, and identifiers. |
| **`@ogwusearch/engineering-units`**      | Physical dimensions, units, quantities, conversions, comparisons, and formatting utilities.                                               |
| **`@ogwusearch/engineering-validation`** | Generic validation framework, reusable validation rules, issue collection, and deterministic validation infrastructure.                   |
| **`@ogwusearch/engineering-core`**       | Calculation lifecycle, execution orchestration, structured results, warnings, assumptions, and calculation traces.                        |

## Foundation Responsibilities

The foundation owns reusable engineering infrastructure only.

It does **not** own:

* Solar PV mathematics.
* Battery sizing formulas.
* Inverter sizing formulas.
* Electrical circuit formulas.
* Application logic.
* Database access.
* Network access.
* User interface code.
* AI integrations.
* MCP integrations.

---

# 2. Dependency Architecture

The dependency graph is intentionally one-directional.

```text
                 engineering-types
                    /          \
                   /            \
                  v              v
      engineering-units    engineering-validation
                   \            /
                    \          /
                     v        v
                  engineering-core
                         |
          +--------------+--------------+
          |              |              |
          v              v              v
    solar-engine   electrical-engine  circuit-engine
```

## Dependency Rules

* `engineering-types` is the foundational contract layer.
* `engineering-units` depends only on shared contracts.
* `engineering-validation` depends only on shared contracts.
* `engineering-core` consumes contracts, units, and validation infrastructure.
* Domain engines consume foundation packages.
* Foundation packages must **never** import from domain engines.
* The dependency graph must remain acyclic.

## Architectural Constraints

* No circular dependencies.
* No dependency inversion from foundation into domain code.
* Shared functionality belongs in the lowest appropriate foundation package.
* Domain engines extend the foundation rather than duplicating it.

---

# 3. Domain Layer

The engineering domain consists of specialized engines built on top of the shared foundation.

## Domain Engines

| Engine                              | Responsibility                                                                      |
| ----------------------------------- | ----------------------------------------------------------------------------------- |
| **`@ogwusearch/solar-engine`**      | Solar photovoltaic engineering calculations and renewable-energy system design.     |
| **`@ogwusearch/electrical-engine`** | General electrical engineering calculations shared outside the solar domain.        |
| **`@ogwusearch/circuit-engine`**    | Circuit analysis, electrical networks, impedance, and component-level calculations. |

Each domain engine owns only:

* Its engineering mathematics.
* Its domain-specific validation rules.
* Its calculation workflows.
* Its domain-specific engineering contracts.

---

# 4. Solar Engine Architecture

The Solar Engine is composed of deterministic engineering modules.

Each module consumes explicit contracts from the previous engineering stage rather than reaching into another module's internal implementation.

## Module Pipeline

```text
Load
  |
  v
Energy
  |
  v
Peak Demand
  |
  v
PV Sizing
  |
  v
PV Array
  |
  v
PV String
  |
  v
Battery
  |
  v
Inverter
  |
  v
Charge Controller
  |
  v
Cable
  |
  v
Voltage Drop
  |
  v
Protection
  |
  v
Earthing
  |
  v
Generator
  |
  v
Bill of Materials (BOM)
  |
  v
Costing
  |
  v
System Validation
  |
  v
Reports
```

## Module Boundaries

Each module:

* Owns its own engineering contracts.
* Validates its own inputs.
* Exposes deterministic outputs.
* Preserves calculation trace information.
* Passes explicit contracts to the next stage.

Modules must never duplicate another module's internal model.

---

# 5. Standard Engineering Calculation Lifecycle

Every engineering module follows the same execution contract.

```text
Input
  |
  v
Validation
  |
  v
Calculation
  |
  v
Warnings
  |
  v
Result
  |
  v
Trace
```

## Lifecycle Responsibilities

| Stage                   | Owned By                                                       |
| ----------------------- | -------------------------------------------------------------- |
| **Input Contract**      | `engineering-types` and the domain module                      |
| **Validation**          | `engineering-validation` plus domain-specific validation rules |
| **Calculation**         | Domain engine mathematics                                      |
| **Warnings**            | `engineering-core`                                             |
| **Result Construction** | `engineering-core`                                             |
| **Trace Generation**    | `engineering-core` with domain trace steps                     |

## Lifecycle Rules

* Validation always executes before calculation.
* Blocking validation errors prevent calculation.
* Warnings never invalidate successful calculations.
* Results preserve assumptions and warnings.
* Trace ordering is deterministic.
* Identical inputs always produce identical lifecycle outputs.

---

# 6. Engineering Design Principles

These principles apply across every package and engineering module.

| #      | Principle                                      | Architectural Meaning                                                                                  |
| ------ | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| **1**  | **Deterministic calculations**                 | Identical inputs always produce identical outputs.                                                     |
| **2**  | **Explicit units**                             | All physical values are represented through `engineering-units`. No implicit conversions are allowed.  |
| **3**  | **Explicit validation**                        | Invalid engineering inputs produce structured engineering issues. Values are never silently corrected. |
| **4**  | **Explicit assumptions**                       | Every engineering assumption is represented as an `EngineeringAssumption`.                             |
| **5**  | **Structured warnings**                        | Warnings are preserved independently from errors.                                                      |
| **6**  | **Structured errors**                          | Errors include deterministic codes, messages, severity, optional paths, and metadata.                  |
| **7**  | **Reproducible results**                       | Calculations never depend on time, randomness, network state, database state, or mutable globals.      |
| **8**  | **Calculation traceability**                   | Every calculation exposes an ordered engineering trace describing how the result was produced.         |
| **9**  | **Domain logic separated from infrastructure** | Foundation packages provide infrastructure; domain engines provide engineering mathematics.            |
| **10** | **Reusable packages**                          | Shared functionality is implemented once in the foundation and reused by domain engines.               |
| **11** | **No circular dependencies**                   | Package dependencies must remain acyclic across the monorepo.                                          |
| **12** | **Preserve existing implementations**          | Working implementations are verified before modification and are never overwritten by scaffolding.     |

---

# 7. Architectural Contracts

Every implementation within the repository must satisfy these contracts.

## Foundation Contracts

* Shared contracts live only in `engineering-types`.
* Unit definitions and conversions live only in `engineering-units`.
* Generic validation lives only in `engineering-validation`.
* Calculation orchestration lives only in `engineering-core`.

## Domain Contracts

Domain engines:

* Consume foundation APIs.
* Implement domain mathematics.
* Define domain validation rules.
* Expose deterministic calculation APIs.
* Never duplicate foundation infrastructure.

## Cross-Package Rules

* No database dependencies in foundation packages.
* No network dependencies in foundation packages.
* No UI dependencies in foundation packages.
* No MCP dependencies in foundation packages.
* No AI dependencies in foundation packages.
* Public exports are intentional and documented.
* Internal implementation details remain private.

---

# 8. Engineering Implementation Workflow

Every engineering feature follows the same development workflow.

```text
Plan
  |
  v
Define Contracts
  |
  v
Implement
  |
  v
Unit Tests
  |
  v
Integration Tests
  |
  v
Typecheck
  |
  v
Lint
  |
  v
Build
  |
  v
Architecture Review
```

## Required Quality Gates

Every implementation must verify:

* Deterministic behavior.
* Boundary conditions.
* Invalid input handling.
* Incompatible unit handling.
* Warning behavior.
* Structured error behavior.
* Calculation trace behavior.
* Public API exports.
* Dependency direction.

---

# 9. Architecture Contract for Coding Agents

All coding agents working within the Ogwusearch Engineering repository must follow these rules.

## Foundation-First Development

Implement or modify foundation capabilities in this order:

1. `engineering-types`
2. `engineering-units`
3. `engineering-validation`
4. `engineering-core`

Dependent domain functionality should be implemented only after the required foundation contracts are available.

## Dependency Enforcement

Foundation packages must never import:

* `solar-engine`
* `electrical-engine`
* `circuit-engine`
* Any application package.
* Any service package.

## Phase-Driven Development

Implementation follows the current phase defined in `FOUNDATION-DEV-PLAN.md`.

Agents implement only the responsibilities and TODOs assigned to that phase.

## Non-Destructive Development

Agents must:

* Inspect existing implementations.
* Preserve working code.
* Avoid unnecessary refactoring.
* Avoid accidental public API expansion.
* Verify existing behavior before modifying it.

---

# 10. Long-Term Engineering Architecture

The complete engineering platform is layered from infrastructure to user-facing applications.

```text
AI / MCP / API / Desktop / Web
              |
              v
          SolarAudit
              |
              v
        Domain Engines
              |
      +-------+-------+
      |       |       |
      v       v       v
   solar   electrical circuit
   engine     engine    engine
              |
              v
       engineering-core
              |
       +------+------+
       |             |
       v             v
engineering-validation
       |
       v
engineering-units
       |
       v
engineering-types
```

## Layered Dependency Model

```text
User / AI / MCP / API / Applications
                    |
                    v
              Domain Engines
                    |
                    v
           engineering-core
                    |
          +---------+---------+
          |                   |
          v                   v
engineering-validation  engineering-units
          \                   /
           \                 /
            +-------+-------+
                    |
                    v
           engineering-types
```

The exact package dependency graph remains:

```text
engineering-types
        |
        +-------------------+
        |                   |
        v                   v
engineering-units   engineering-validation
        |                   |
        +---------+---------+
                  |
                  v
          engineering-core
                  |
        +---------+---------+
        |         |         |
        v         v         v
      solar   electrical  circuit
      engine    engine     engine
```

Applications, services, MCP, and AI operate **above** the engineering engines and must not introduce dependencies back into the foundation.

---

# Architectural Objective

The engineering foundation exists to make domain engines easier to:

* Build.
* Test.
* Validate.
* Reproduce.
* Trace.
* Maintain.
* Reuse.

Domain engines contain engineering knowledge.

The foundation contains reusable engineering infrastructure.

Every new engineering module should strengthen this separation rather than blur it.

> **Architecture is a contract, not a suggestion.**
>
> Foundation provides reusable infrastructure.
> Domain engines provide engineering mathematics.
> Validation protects engineering calculations.
> Applications provide workflows and interfaces.
> Services provide stable capability boundaries.
> AI and MCP provide interaction and orchestration without replacing deterministic engineering logic.
