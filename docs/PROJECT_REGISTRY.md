# PROJECT REGISTRY

# OGWUSEARCH ENGINEERING

**Purpose:** Master registry of all software, engineering, AI, electronics, and experimental projects.

**Rule:** Every project belongs here before it becomes an active development effort.

---

# 01 — PROJECT STATUS SYSTEM

Projects use these statuses:

| Status       | Meaning                                          |
| ------------ | ------------------------------------------------ |
| `ACTIVE`     | Currently being developed                        |
| `FINISH`     | Existing project that should be completed        |
| `PAUSED`     | Temporarily stopped                              |
| `INTEGRATE`  | Capability should become part of another project |
| `EXPERIMENT` | Learning or proof-of-concept                     |
| `ARCHIVE`    | Kept for reference, no active development        |
| `PLANNED`    | Approved idea, not started                       |

---

# 02 — PROJECT PRIORITY

Priority describes current strategic importance and workflow focus.

```text
P0 — Current Focus
P1 — Core
P2 — Supporting
P3 — Future
P4 — Archive
```

Priority can change during project reviews.

---

# 03 — MASTER PROJECT LIST

| ID      | Project                  | Category               | Status     | Priority |
| ------- | ------------------------ | ---------------------- | ---------- | -------- |
| ENG-001 | SolarAudit               | Engineering / Software | ACTIVE     | P0       |
| ENG-002 | Circuit-Simulator        | Engineering / Software | ACTIVE     | P1       |
| ENG-003 | Engineering-Platform     | Platform               | PLANNED    | P1       |
| ENG-004 | AI-Engineering-Assistant | AI                     | PLANNED    | P1       |
| ENG-005 | Engineering-MCP          | AI / Infrastructure    | PLANNED    | P1       |
| ENG-006 | Solar-Calculator         | Engineering            | EXPERIMENT | P2       |
| ENG-007 | Circuit-Calculator       | Engineering            | EXPERIMENT | P2       |
| ENG-008 | Embedded-Motor-Control   | Electronics            | EXPERIMENT | P2       |
| ENG-009 | Engineering-Notes        | Documentation          | ACTIVE     | P1       |
| APP-001 | BoardCapital             | Software               | ACTIVE     | P2       |
| APP-002 | MineCore                 | Software / Mining      | ACTIVE     | P2       |

> **Note:** Status and priority are registry starting points. They should be confirmed during the Project Audit.

---

# 04 — ENG-001 — SOLARAUDIT

## Identity

**Name:** SolarAudit

**Category:** Engineering Software

**Location:**

```text
/home/ogwu/workspace/solaraudit
```

## Purpose

Offline solar-system auditing, sizing, configuration, costing, and reporting system.

## Core Modules

```text
Dashboard

Load Audit
Energy Analysis
Solar Sizing
Battery Sizing
Inverter Sizing
Charge Controller
Cable Sizing
Voltage Drop
Protection
Earthing
Generator Sizing

System Configuration

BOM
Costing
Reports
```

## Long-Term Role

Potential flagship engineering application.

Potential integration:

```text
SolarAudit
    ↓
Engineering Engine
    ↓
Engineering Services
    ↓
MCP
    ↓
AI Engineering Assistant
```

## Current Action

**Finish Foundation → Audit Existing Implementation → Begin Engine Work**

---

# 05 — ENG-002 — CIRCUIT-SIMULATOR

## Purpose

Interactive browser-based electrical circuit simulation.

## Known Technology

```text
React
Vite
TypeScript
Canvas-based interface
```

## Intended Capabilities

```text
Components

├── Resistor
├── Capacitor
├── Inductor
├── Diode
├── LED
├── Voltage Source
├── Current Source
├── Ground
└── Switch
```

```text
Simulation

├── Circuit construction
├── Connections
├── Component properties
├── Electrical calculations
└── Visualization
```

## Long-Term Role

Engineering tool within the broader ecosystem.

## Current Action

**Audit current implementation before further expansion.**

---

# 06 — ENG-003 — ENGINEERING-PLATFORM

## Purpose

Long-term unified environment for engineering applications and tools.

## Intended Architecture

```text
Engineering Platform

│
├── Projects
├── Calculators
├── Simulators
├── Engineering Data
├── Reports
├── Tools
└── AI
```

## Current Status

`PLANNED`

## Current Action

**Do not build yet.**

Define architecture only after the core engineering projects mature.

---

# 07 — ENG-004 — AI-ENGINEERING-ASSISTANT

## Purpose

Natural-language interface for engineering software and tools.

## Intended Architecture

```text
User
  ↓
AI Assistant
  ↓
Engineering Tools
  ↓
Validated Results
```

## Potential Capabilities

* Explain calculations
* Analyze project data
* Run engineering tools
* Generate reports
* Answer engineering questions
* Assist with troubleshooting
* Summarize project results

## Current Status

`PLANNED`

## Dependency

Engineering tools and deterministic calculation engines must mature before the assistant becomes a primary system.

---

# 08 — ENG-005 — ENGINEERING-MCP

## Purpose

Expose engineering capabilities through Model Context Protocol.

## Intended Architecture

```text
AI Client
    ↓
MCP Server
    ↓
Engineering Services
    ↓
Engineering Engines
```

## Potential Tools

```text
calculate_load
calculate_energy
calculate_peak_demand

size_pv
size_battery
size_inverter
size_charge_controller
size_cable

calculate_voltage_drop

validate_system

generate_bom
generate_report
```

## Current Status

`PLANNED`

## Dependency

Engineering capabilities must exist and be validated before they are exposed through MCP.

---

# 09 — ENG-006 — SOLAR-CALCULATOR

## Purpose

Standalone solar calculation utilities.

## Potential Role

Some functionality may eventually move into shared SolarAudit engineering packages.

## Current Status

`EXPERIMENT`

## Decision

Do not duplicate mature SolarAudit functionality.

Evaluate whether it should become:

```text
Standalone Tool

      OR

SolarAudit Module

      OR

Shared Engineering Package
```

---

# 10 — ENG-007 — CIRCUIT-CALCULATOR

## Purpose

Electrical/electronics calculation utilities.

## Potential Capabilities

```text
Ohm's Law
Power
Resistance
Capacitance
Inductance
Voltage Divider
Current
Component Calculations
```

## Current Status

`EXPERIMENT`

## Future

Potential shared package for Circuit Simulator and Engineering Platform.

---

# 11 — ENG-008 — EMBEDDED-MOTOR-CONTROL

## Purpose

Explore practical DC motor control using electronics.

## Areas

```text
MOSFET
PWM
Diode
Inductor
Capacitor
Resistor
DC Motor
Motor Driver
Protection
```

## Current Status

`EXPERIMENT`

## Long-Term Role

Electronics engineering project and documentation source.

---

# 12 — ENG-009 — ENGINEERING-NOTES

## Purpose

Permanent knowledge base for engineering learning and project documentation.

## Categories

```text
Electrical
Electronics
Solar
Batteries
Inverters
Power Electronics
Embedded Systems
Software Engineering
AI
MCP
Calculations
Experiments
```

## Current Status

`ACTIVE`

## Rule

Important lessons discovered during projects should eventually be documented here.

---

# 13 — APP-001 — BOARDCAPITAL

## Purpose

Financial/business application.

## Current Technology

```text
React
Vite
Supabase
```

## Current Status

`ACTIVE`

## Relationship to Engineering Ecosystem

Independent application.

Do not force it into the engineering platform merely because it exists in the same workspace.

---

# 14 — APP-002 — MINECORE

## Purpose

Mining-company management/web application.

## Areas

```text
Organizations
Operations
Projects
Assets
Mining Data
Financial Data
Reports
```

## Current Status

`ACTIVE`

## Relationship

Independent business application.

Potential future platform patterns may be reusable, but MineCore remains its own product.

---

# 15 — PROJECT RELATIONSHIPS

The intended engineering ecosystem:

```text
                         OGWUSEARCH
                         ENGINEERING
                              │
                ┌─────────────┴─────────────┐
                │                           │
        ENGINEERING TOOLS              AI SYSTEMS
                │                           │
        ┌───────┼────────┐             ┌────┴────┐
        │       │        │             │         │
   SolarAudit Circuit  Notes          MCP    AI Assistant
              Simulator
        │
        │
        ▼
 Engineering Engine
```

The architectural principle is:

```text
Deterministic Engineering
          ↓
Engineering Services
          ↓
MCP / External Interfaces
          ↓
AI Assistance
```

AI should orchestrate and explain validated engineering capabilities rather than replace the underlying engineering logic.

---

# 16 — PROJECT INTAKE RULE

Before creating a new project, answer:

```text
1. What problem does it solve?

2. Does an existing project already solve this?

3. Could it be a module instead?

4. Could it be a shared package?

5. What will I learn?

6. What will I demonstrate?

7. What is the smallest complete version?

8. How will I know it is finished?
```

If the answer is unclear, the idea goes into:

```text
BACKLOG.md
```

instead of becoming another project.

---

# 17 — PROJECT AUDIT TEMPLATE

Every project must eventually have:

```text
Project:

ID:

Purpose:

Location:

Technology:

Current Status:

Current Version:

Working Features:

Broken Features:

Missing Features:

Dependencies:

Documentation:

Tests:

Potential Reuse:

Potential Integration:

Recommended Action:

Next Concrete Task:
```

The audit should be based on the actual state of the project, not assumptions from the registry.

---

# 18 — PROJECT REVIEW

Review the registry regularly.

During review:

```text
KEEP
  ↓
IMPROVE
  ↓
INTEGRATE
  ↓
PAUSE
  ↓
ARCHIVE
```

A project is not required to remain active forever.

Archiving a project is a valid engineering decision.

---

# 19 — CURRENT REGISTRY WORKFLOW

At the current foundation stage:

```text
1. OGWUSEARCH ENGINEERING FOUNDATION
        ↓
2. PROJECT AUDIT
        ↓
3. SOLARAUDIT
        ↓
4. ENGINEERING NOTES
        ↓
5. CIRCUIT SIMULATOR
        ↓
6. ENGINEERING MCP
        ↓
7. AI ENGINEERING ASSISTANT
        ↓
8. ENGINEERING PLATFORM
        ↓
9. OTHER PROJECTS
```

This describes the current workflow, not a permanent ranking of projects.

---

# 20 — NEXT REGISTRY ACTION

The registry is not complete until the existing projects have been audited.

## Next Step

For every project:

```text
IDENTIFY
   ↓
INSPECT
   ↓
DOCUMENT
   ↓
CLASSIFY
   ↓
DECIDE
```

Then update this registry with the actual status.

---

# REGISTRY PRINCIPLE

> **If I build it, experiment with it, or intend to build it, I know where it belongs, why it exists, what state it is in, and what happens next.**
