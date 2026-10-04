# SolarAudit

SolarAudit is the application project for performing, organizing, executing, and storing solar engineering audits using the Ogwusearch Solar Engine.

SolarAudit is intentionally separated from the engineering calculation domain.

* **SolarAudit** owns projects, audits, application workflows, persistence contracts, and application-level composition.
* **Solar Engine** owns solar engineering calculations, validation, assumptions, warnings, results, and calculation traces.
* **Engineering Foundation** packages provide shared types, units, validation infrastructure, and calculation execution infrastructure.

The application consumes the engineering engine. It does not duplicate engineering formulas.

---

## 1. Project Position

SolarAudit lives under:

```text
/home/ogwu/workspace/ogwusearch/projects/SolarAudit
```

The broader architecture is:

```text
Ogwusearch Engineering
│
├── packages/
│   ├── engineering-types
│   ├── engineering-units
│   ├── engineering-validation
│   ├── engineering-core
│   └── solar-engine
│
├── projects/
│   ├── SolarAudit
│   ├── Solar-Calculator
│   ├── Circuit-Calculator
│   └── ...
│
├── services/
│   └── ...
│
└── docs/
```

The dependency direction is:

```text
engineering-types
       │
       ├── engineering-units
       └── engineering-validation
                    │
                    ▼
           engineering-core
                    │
                    ▼
              solar-engine
                    │
                    ▼
              SolarAudit
```

SolarAudit is therefore an **application project**, not a module of `solar-engine`.

---

# 2. Responsibility Boundary

## SolarAudit owns

SolarAudit is responsible for application-level concerns such as:

* Projects
* Audits
* Project-owned loads
* Application workflows
* Loading application data
* Calling the Solar Engine
* Persisting calculation results
* Connecting audit execution to application entities
* Future reports and application presentation
* Future persistence implementations
* Future API/UI integration

## SolarAudit does not own

SolarAudit does not implement:

* Solar engineering formulas
* Load calculation formulas
* Energy formulas
* Peak-demand formulas
* PV sizing formulas
* Battery sizing formulas
* Inverter sizing formulas
* Cable calculations
* Voltage-drop formulas
* Protection calculations
* Earthing calculations
* Engineering unit-conversion rules
* Engineering calculation lifecycle infrastructure

Those responsibilities belong to the appropriate foundation or domain package.

---

# 3. Core Architecture

The application follows a simple application/domain/persistence separation.

```text
projects/SolarAudit/src
│
├── application/
│   ├── audits/
│   ├── bom/
│   ├── loads/
│   ├── projects/
│   ├── results/
│   └── system/
│
├── domain/
│
├── persistence/
│
└── index.ts
```

Conceptually:

```text
                SolarAudit
                    │
          ┌─────────┴─────────┐
          │                   │
     Application           Domain
          │                   │
          │                   │
          ▼                   ▼
     Solar Engine       Application
          │              Contracts
          │
          ▼
     CalculationResult
          │
          ▼
       Results
          │
          ▼
      Persistence
```

The application layer orchestrates work.

The domain layer defines application-owned contracts.

The persistence layer defines storage interfaces.

The Solar Engine performs the engineering calculations.

---

# 4. Directory Structure

Current structure:

```text
SolarAudit/
├── README.md
├── package.json
├── tsconfig.json
├── src/
│   ├── application/
│   │   ├── audits/
│   │   │   ├── create-audit.ts
│   │   │   ├── execute-audit.ts
│   │   │   ├── index.ts
│   │   │   ├── run-audit.ts
│   │   │   └── solar-engine.ts
│   │   │
│   │   ├── bom/
│   │   │   └── index.ts
│   │   │
│   │   ├── index.ts
│   │   │
│   │   ├── loads/
│   │   │   ├── add-load.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── projects/
│   │   │   ├── create-project.ts
│   │   │   └── index.ts
│   │   │
│   │   ├── results/
│   │   │   ├── index.ts
│   │   │   └── save-result.ts
│   │   │
│   │   └── system/
│   │       └── index.ts
│   │
│   ├── domain/
│   │   ├── audit-result.ts
│   │   ├── audit.ts
│   │   ├── index.ts
│   │   ├── load.ts
│   │   ├── project.ts
│   │   └── result.ts
│   │
│   ├── persistence/
│   │   ├── audit-repository.ts
│   │   ├── index.ts
│   │   ├── load-repository.ts
│   │   ├── project-repository.ts
│   │   └── result-repository.ts
│   │
│   └── index.ts
│
└── tests/
    └── application/
        ├── add-load.test.ts
        ├── create-audit.test.ts
        ├── create-project.test.ts
        ├── execute-audit.test.ts
        ├── run-audit.test.ts
        └── save-result.test.ts
```

---

# 5. Domain Model

## Project

A project is the top-level application entity.

```ts
export interface SolarAuditProject {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}
```

A project owns the loads and audits associated with an engineering engagement.

---

## Audit

An audit represents an engineering audit execution lifecycle within a project.

```ts
export type AuditStatus =
  | "DRAFT"
  | "RUNNING"
  | "COMPLETED"
  | "FAILED";

export interface SolarAudit {
  readonly id: string;
  readonly projectId: string;
  readonly name: string;
  readonly status: AuditStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}
```

The audit belongs to a project through `projectId`.

---

## Load

SolarAudit adds application ownership to the engineering `Load` contract.

```ts
export interface SolarAuditLoad extends Load {
  readonly projectId: string;
}
```

The underlying engineering load contract remains owned by:

```text
@ogwusearch/solar-engine
```

SolarAudit adds only the application-level project relationship.

---

## Calculation Result

Individual calculation results are represented using the shared engineering result contract.

```ts
export interface AuditCalculationResult {
  readonly auditId: string;
  readonly calculationName: string;
  readonly result: CalculationResult;
  readonly savedAt: string;
}
```

This keeps engineering calculation results intact while attaching them to an application audit.

---

# 6. Audit Result Composition

SolarAudit currently treats the Solar Engine's composed Load Audit as the authoritative load-audit calculation.

```text
SolarAudit
    │
    ▼
runAudit()
    │
    ▼
SolarAuditEngine
    │
    ▼
runLoadAudit()
    │
    ▼
Solar Engine Load Audit
    │
    ├── Load characterization
    ├── Energy analysis
    └── Peak demand analysis
    │
    ▼
CalculationResult<LoadAuditOutput>
    │
    ▼
saveResult()
```

The application should **not independently call**:

```text
runEnergyAnalysis()
runPeakDemand()
```

for the same composed Load Audit.

The Solar Engine already provides the composed engineering boundary:

```ts
runLoadAudit()
```

This prevents duplicate orchestration and keeps the engineering calculation flow inside the engineering domain.

---

# 7. Application Flow

The primary audit execution flow is:

```text
Project
   │
   ├── Loads
   │
   └── Audit
        │
        ▼
   executeAudit()
        │
        ├── Find Audit
        │
        ├── Resolve Project
        │
        ├── Load Project Loads
        │
        ├── runAudit()
        │
        ├── SolarAuditEngine
        │
        ├── Solar Engine
        │
        └── saveResult()
                │
                ▼
        AuditCalculationResult
```

The current execution boundary is:

```ts
executeAudit(input, dependencies)
```

It coordinates:

1. Finding the audit.
2. Finding the project's loads.
3. Passing the loads to the application audit flow.
4. Calling the Solar Engine.
5. Saving the resulting calculation.
6. Returning the saved result.

---

# 8. Solar Engine Boundary

SolarAudit communicates with the Solar Engine through an application-level interface:

```ts
export interface SolarAuditEngine {
  runLoadAudit(
    input: LoadAuditInput,
  ): CalculationResult<LoadAuditOutput>;

  runEnergyAnalysis(
    input: EnergyInput,
  ): CalculationResult<EnergyOutput>;

  runPeakDemand(
    input: PeakDemandInput,
  ): CalculationResult<PeakDemandOutput>;
}
```

The interface allows the application to depend on a stable execution boundary instead of directly embedding engineering calculations into application services.

It also makes application tests deterministic because the engine can be replaced with a controlled test implementation.

---

# 9. Persistence Boundary

SolarAudit currently defines repository contracts rather than committing the application to a particular database.

## Project Repository

```ts
export interface ProjectRepository {
  create(project: SolarAuditProject): Promise<SolarAuditProject>;
  findById(projectId: string): Promise<SolarAuditProject | undefined>;
  save(project: SolarAuditProject): Promise<SolarAuditProject>;
}
```

## Audit Repository

```ts
export interface AuditRepository {
  create(audit: SolarAudit): Promise<SolarAudit>;
  findById(auditId: string): Promise<SolarAudit | undefined>;
  save(audit: SolarAudit): Promise<SolarAudit>;
}
```

## Load Repository

```ts
export interface LoadRepository {
  create(load: SolarAuditLoad): Promise<SolarAuditLoad>;
  findById(loadId: string): Promise<SolarAuditLoad | undefined>;
  findByProjectId(
    projectId: string,
  ): Promise<readonly SolarAuditLoad[]>;
  save(load: SolarAuditLoad): Promise<SolarAuditLoad>;
}
```

## Result Repository

```ts
export interface ResultRepository {
  save(
    result: AuditCalculationResult,
  ): Promise<AuditCalculationResult>;

  findByAuditId(
    auditId: string,
  ): Promise<readonly AuditCalculationResult[]>;
}
```

These interfaces allow future storage implementations without changing application use cases.

---

# 10. Current Application Use Cases

SolarAudit currently contains application services for:

### Projects

```text
createProject()
```

Creates a project and assigns creation/update timestamps.

### Audits

```text
CreateAuditService
```

Creates an audit under an existing project.

```text
runAudit()
```

Composes the application input for the Solar Engine.

```text
executeAudit()
```

Coordinates:

```text
Audit → Loads → Solar Engine → Result Storage
```

### Loads

```text
addLoad()
```

Creates an application-owned project load while preserving the engineering `Load` contract.

### Results

```text
saveResult()
```

Stores a calculation result against an audit.

---

# 11. Testing

SolarAudit uses Vitest.

Tests are organized around application behavior rather than implementation details.

Current test areas include:

```text
create-project
create-audit
add-load
run-audit
save-result
execute-audit
```

The important behaviors tested include:

* Project creation
* Audit creation
* Project ownership
* Load creation
* Solar Engine invocation
* Composed Load Audit execution
* Result persistence
* Unknown audit handling
* Application-to-engine mapping
* Optional audit parameters
* Result metadata such as `savedAt`

Tests should remain deterministic and should not require a real database or external service.

---

# 12. Development Commands

Run commands from the monorepo root:

```bash
cd /home/ogwu/workspace/ogwusearch
```

### Typecheck

```bash
pnpm --dir projects/SolarAudit typecheck
```

### Tests

```bash
pnpm --dir projects/SolarAudit test
```

### Build

```bash
pnpm --dir projects/SolarAudit build
```

### Full project gate

```bash
pnpm --dir projects/SolarAudit typecheck && \
pnpm --dir projects/SolarAudit test && \
pnpm --dir projects/SolarAudit build
```

The development gate is:

```text
TYPECHECK
   ↓
TEST
   ↓
BUILD
   ↓
REVIEW
```

---

# 13. Engineering Rules

## Rule 1 — SolarAudit is an application

Do not move SolarAudit application concepts into:

```text
packages/solar-engine
```

The correct relationship is:

```text
SolarAudit
    ↓
solar-engine
```

not:

```text
solar-engine
    └── SolarAudit
```

---

## Rule 2 — Do not duplicate engineering formulas

Application services should orchestrate engineering calculations.

They should not reproduce formulas from Solar Engine.

For example, SolarAudit should call:

```ts
runLoadAudit(...)
```

rather than independently reconstructing:

```text
Load calculation
Energy calculation
Peak demand calculation
```

when the Solar Engine already exposes the composed calculation.

---

## Rule 3 — Preserve engineering results

SolarAudit should preserve the complete:

```ts
CalculationResult
```

returned by Solar Engine.

That includes:

```text
valid
status
value
errors
warnings
assumptions
trace
metadata
```

Application-level persistence should add application context rather than discard engineering information.

---

## Rule 4 — Keep persistence behind interfaces

Application use cases should depend on:

```text
ProjectRepository
AuditRepository
LoadRepository
ResultRepository
```

rather than directly depending on:

```text
SQLite
Supabase
PostgreSQL
filesystem
HTTP
```

Concrete persistence implementations can be introduced later.

---

## Rule 5 — Keep tests deterministic

Use injected dependencies and deterministic clocks where appropriate.

Avoid making application tests depend on:

* Real databases
* Network calls
* Browser APIs
* External services
* Current system state

---

# 14. Dependency Policy

SolarAudit may depend on:

```text
@ogwusearch/engineering-types
@ogwusearch/solar-engine
```

The Solar Engine must not depend on SolarAudit.

The dependency direction must remain:

```text
Foundation
    ↓
Solar Engine
    ↓
SolarAudit
```

Never reverse this relationship.

---

# 15. Engineering Calculation Ownership

The following ownership model must remain explicit.

| Concern                       | Owner                               |
| ----------------------------- | ----------------------------------- |
| Shared engineering contracts  | `engineering-types`                 |
| Physical units and conversion | `engineering-units`                 |
| Generic validation            | `engineering-validation`            |
| Calculation lifecycle         | `engineering-core`                  |
| Solar engineering formulas    | `solar-engine`                      |
| Projects                      | `SolarAudit`                        |
| Audits                        | `SolarAudit`                        |
| Project ownership             | `SolarAudit`                        |
| Application workflows         | `SolarAudit`                        |
| Persistence contracts         | `SolarAudit`                        |
| Presentation/UI               | Future SolarAudit application layer |

This separation allows the Solar Engine to remain reusable outside SolarAudit.

---

# 16. Current Development Status

SolarAudit has established the initial application contracts and execution flow.

Completed foundations include:

```text
Phase 01 — Project Contract
Phase 02 — Audit Contract
Phase 03 — Load Ownership
Phase 04 — Result Contract
Phase 05 — Engineering Execution Flow
```

The current application flow is:

```text
Project
   ↓
Audit
   ↓
Project Loads
   ↓
Execute Audit
   ↓
Solar Engine
   ↓
Calculation Result
   ↓
Persist Result
```

The application is intentionally being built incrementally.

Future work should extend the project without collapsing application responsibilities into the engineering domain.

---

# 17. Future Direction

Potential future SolarAudit capabilities include:

```text
Project Management
        │
        ▼
Audit Management
        │
        ▼
Load Management
        │
        ▼
Engineering Execution
        │
        ▼
Calculation Results
        │
        ├── Reports
        ├── BOM
        ├── System Validation
        ├── Engineering Documents
        └── Audit History
```

Later application layers may include:

```text
API
UI
Authentication
Database
Reports
Export
Dashboard
```

These should remain application concerns.

The Solar Engine should continue to provide deterministic engineering calculations independently of those presentation and infrastructure layers.

---

# 18. Guiding Principle

SolarAudit exists to turn the Solar Engine into a usable engineering application without weakening the engineering domain.

The architectural rule is simple:

```text
APPLICATION ORCHESTRATES.

SOLAR ENGINE CALCULATES.

FOUNDATION PROVIDES INFRASTRUCTURE.

PERSISTENCE STORES.

REPORTS PRESENT.

NO LAYER SHOULD PRETEND TO OWN ANOTHER LAYER'S RESPONSIBILITY.
```

Build less.

Finish more.

Connect everything that deserves to be connected.
