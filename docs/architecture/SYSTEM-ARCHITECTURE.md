# System Architecture

## High-Level Architecture

```text
                              USER
                                |
                                v
                          APPLICATIONS
                                |
                 +--------------+--------------+
                 |                             |
                 v                             v
       ENGINEERING SERVICES                    AI
                 |                             |
                 |                             v
                 |                            MCP
                 |                             |
                 +--------------+--------------+
                                |
                                v
                    ENGINEERING ENGINES
                                |
                                v
                          VALIDATION
                                |
                 +--------------+--------------+
                 |                             |
                 v                             v
               DATA                         REPORTS
```

---

## Architecture Layers

The Ogwusearch Engineering system separates user interaction, application logic, engineering services, deterministic calculation engines, validation, data, and reporting.

### 1. User

The user interacts with the engineering ecosystem through applications or AI-assisted interfaces.

```text
USER
```

---

### 2. Applications

Applications provide the user-facing interface and application workflows.

Examples:

* SolarAudit
* Circuit Simulator
* Future Engineering Applications

Applications should **not contain duplicated engineering formulas**.

```text
USER
  |
  v
APPLICATIONS
```

---

### 3. Engineering Services

Engineering Services provide stable interfaces between applications or external clients and the engineering engines.

Responsibilities include:

* Receiving calculation requests
* Preparing validated inputs
* Calling engineering engines
* Returning structured results
* Handling engineering errors
* Exposing reusable engineering capabilities

```text
APPLICATION
     |
     v
ENGINEERING SERVICES
```

---

### 4. AI

AI provides an interaction and orchestration layer around engineering capabilities.

AI may:

* Understand user requests
* Ask for missing inputs
* Prepare tool requests
* Call engineering tools
* Explain validated results
* Explain engineering errors
* Summarize calculations
* Assist with engineering documentation

AI does **not** replace the deterministic engineering engine.

```text
USER
 |
 v
AI
 |
 v
MCP
 |
 v
ENGINEERING SERVICES
```

---

### 5. MCP

The Model Context Protocol layer exposes engineering capabilities to AI clients and other compatible clients.

```text
AI CLIENT
    |
    v
MCP SERVER
    |
    v
ENGINEERING SERVICES
    |
    v
ENGINEERING ENGINE
```

MCP is an interface layer, not a second calculation engine.

Engineering formulas and core calculation logic remain inside the Engineering Engine.

---

### 6. Engineering Engines

Engineering Engines contain the deterministic engineering calculations.

Examples:

* Load Analysis
* Energy Analysis
* Peak Demand
* PV Sizing
* Battery Sizing
* Inverter Sizing
* Charge Controller
* Cable Sizing
* Voltage Drop
* Protection
* Earthing
* Generator Sizing
* System Configuration
* BOM
* Costing

The engine should be:

* Deterministic
* Unit-aware
* Reproducible
* Numerically precise
* Validated
* Traceable
* Testable
* Independent of UI frameworks

```text
ENGINEERING SERVICES
        |
        v
ENGINEERING ENGINE
```

---

### 7. Validation

Validation protects the engineering calculation pipeline.

```text
INPUT
  |
  v
VALIDATION
  |
  v
CALCULATION
  |
  v
RESULT
  |
  v
RESULT VALIDATION
```

Validation should detect conditions such as:

* Missing inputs
* Invalid inputs
* Invalid units
* Unit mismatches
* Out-of-range values
* Invalid configurations
* Unsupported conditions
* Calculation failures
* Invalid results

Engineering errors must be explicit and structured.

---

## SolarAudit Architecture

SolarAudit is an application built on top of the Engineering Engine.

```text
                         SOLARAUDIT
                             |
                             v
                             UI
                             |
                             v
                    APPLICATION LAYER
                             |
                             v
                  ENGINEERING ENGINE
                             |
                             v
                       VALIDATION
                             |
                             v
                      PROJECT DATA
```

### Separation of Responsibilities

#### UI

Responsible for:

* User interaction
* Forms
* Navigation
* Display
* Input collection
* Result presentation

The UI should not own engineering formulas.

#### Application Layer

Responsible for:

* Project workflows
* State management
* User actions
* Connecting UI to engineering capabilities
* Coordinating project data

#### Engineering Engine

Responsible for:

* Engineering calculations
* Units
* Formulas
* Assumptions
* Calculation results
* Traceability

#### Validation

Responsible for:

* Input validation
* Configuration validation
* Result validation
* Engineering error handling

#### Project Data

Responsible for persistent project information such as:

* Customer
* Site
* Loads
* Energy data
* System configuration
* Equipment
* BOM
* Costing
* Reports
* Audit history

---

## MCP Architecture

The MCP architecture exposes deterministic engineering capabilities to AI clients.

```text
                         AI CLIENT
                             |
                             v
                        MCP SERVER
                             |
                             v
                   ENGINEERING SERVICES
                             |
                             v
                    ENGINEERING ENGINE
                             |
                             v
                        VALIDATION
                             |
                             v
                    VALIDATED RESULT
```

### Request Flow

```text
User Request
     |
     v
AI Client
     |
     v
MCP Server
     |
     v
Engineering Service
     |
     v
Engineering Engine
     |
     v
Validation
     |
     +-------> Engineering Error
     |
     v
Validated Result
     |
     v
Engineering Service
     |
     v
MCP Server
     |
     v
AI Client
     |
     v
User Explanation
```

---

## Dependency Direction

The architecture follows a one-directional dependency model.

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
                  v
            solar-engine
                  |
                  v
             Applications
```

The dependency direction should remain toward lower-level, reusable engineering capabilities.

Foundation packages must not depend on domain applications or UI frameworks.

---

## Core Engineering Flow

All engineering calculations should follow a consistent pipeline:

```text
INPUT
  |
  v
VALIDATION
  |
  v
ASSUMPTIONS
  |
  v
CALCULATION
  |
  v
RESULT
  |
  v
RESULT VALIDATION
  |
  v
TRACEABILITY
  |
  v
REPORT / DATA / APPLICATION
```

---

## Architectural Principles

### Deterministic Engineering

The same validated inputs, assumptions, configuration, constants, and calculation version must produce the same result.

### Explicit Units

Engineering quantities must have explicit units.

Unit conversion must be controlled and deterministic.

### Explicit Errors

Engineering failures must never silently become plausible results.

Errors should identify:

```text
Error Code
Error Type
Affected Input
Problem
Expected Condition
Recommended Action
```

### Reproducibility

A result should contain enough engineering context to reproduce the calculation:

```text
Inputs
Units
Assumptions
Constants
Formula
Calculation Method
Calculation Version
Result
Validation
```

### Precision

Calculations should preserve sufficient numerical precision internally.

Rounding should occur only at defined boundaries.

```text
Internal Calculation
        |
        v
Full Required Precision
        |
        v
Validation
        |
        v
Defined Rounding Rule
        |
        v
Displayed Result
```

### Traceability

Engineering results should be traceable from:

```text
Input
  |
  v
Assumption
  |
  v
Formula
  |
  v
Calculation
  |
  v
Result
  |
  v
Validation
```

### Separation of Concerns

UI, application workflows, engineering services, and engineering calculations must remain separate.

```text
UI
 |
 v
APPLICATION LAYER
 |
 v
ENGINEERING SERVICES
 |
 v
ENGINEERING ENGINE
 |
 v
VALIDATION
```

### AI Does Not Replace Engineering

AI may interact with and explain engineering capabilities, but validated deterministic engineering calculations remain the source of truth.

```text
USER
 |
 v
AI
 |
 v
MCP
 |
 v
ENGINEERING SERVICES
 |
 v
ENGINEERING ENGINE
 |
 v
VALIDATION
 |
 +----> ERROR
 |
 v
VALIDATED RESULT
 |
 v
AI EXPLANATION
```

---

## Architectural Rule

> **Applications provide the interface. Services provide the capability boundary. Engineering Engines perform the calculations. Validation protects the calculation pipeline. Data preserves engineering state. Reports communicate validated results. AI orchestrates and explains without replacing deterministic engineering logic.**

The architecture should evolve by extending these boundaries rather than bypassing them.
