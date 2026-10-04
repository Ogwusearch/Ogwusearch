# Ogwusearch Generators

Generator tooling for creating consistent project, package, module, and engineering-system structures within the Ogwusearch Engineering monorepo.

The generators are **development infrastructure**. They help create repeatable structures and boilerplate without becoming part of the engineering calculation runtime.

---

## Purpose

The generator system exists to reduce repetitive setup work while enforcing the repository's architectural conventions.

Generators may create:

* Engineering packages
* Domain-engine modules
* Calculation modules
* Validation structures
* Test structures
* Documentation templates
* Project scaffolding
* Standard configuration files

The goal is **consistent structure without hidden behavior**.

---

## Position in the Repository

```text
Ogwusearch Engineering
│
├── packages/
│   ├── engineering-types/
│   ├── engineering-units/
│   ├── engineering-validation/
│   ├── engineering-core/
│   └── solar-engine/
│
├── tools/
│   └── generators/
│       ├── README.md
│       ├── ...
│       └── ...
│
└── docs/
    ├── architecture/
    ├── standards/
    └── ...
```

Generators sit outside the runtime engineering dependency graph.

```text
                    ┌──────────────────────┐
                    │   Generator Tools    │
                    │      tools/          │
                    └──────────┬───────────┘
                               │
                               │ creates structure
                               ▼
                    ┌──────────────────────┐
                    │   Engineering Repo   │
                    └──────────┬───────────┘
                               │
                               ▼
             ┌─────────────────────────────────┐
             │          Foundation              │
             │                                 │
             │ engineering-types               │
             │ engineering-units               │
             │ engineering-validation          │
             │ engineering-core                │
             └────────────────┬────────────────┘
                              │
                              ▼
                    ┌──────────────────────┐
                    │    Domain Engines    │
                    │     solar-engine     │
                    │   electrical-engine  │
                    │    circuit-engine    │
                    └──────────────────────┘
```

Generators **must not become a dependency of the engineering runtime**.

---

## Responsibilities

Generators are responsible for:

1. Creating predictable directory structures.
2. Creating standard source-file templates.
3. Creating test-file templates.
4. Creating README/documentation templates.
5. Applying repository naming conventions.
6. Reducing repetitive manual setup.
7. Preserving architectural boundaries.
8. Making new modules easier to initialize consistently.

Generators are **not responsible for**:

* Engineering calculations
* Runtime validation
* Unit conversion
* Calculation orchestration
* Database operations
* UI rendering
* MCP execution
* AI reasoning
* Production business logic

---

## Generator Principles

### 1. Explicit

Generated files should be understandable without requiring the generator to understand them.

### 2. Deterministic

The same generator command with the same inputs should produce the same structure.

### 3. Minimal

Generators should create only what is required.

Avoid generating large amounts of unused boilerplate.

### 4. Architecture-Aware

Generated code must respect the repository dependency direction.

```text
engineering-types
        ↓
engineering-units
engineering-validation
        ↓
engineering-core
        ↓
domain engines
        ↓
applications / services / integrations
```

### 5. Safe

Generators should avoid silently overwriting existing implementation.

Prefer:

```text
create
check
warn
stop
```

over:

```text
overwrite everything
```

### 6. Reproducible

Generated structures should be reproducible from documented commands and templates.

---

## Planned Generator Categories

### Package Generator

Creates a new package following the monorepo package conventions.

Example:

```bash
generate package engineering-example
```

Potential output:

```text
packages/engineering-example/
├── README.md
├── package.json
├── tsconfig.json
└── src/
    └── index.ts
```

---

### Engineering Module Generator

Creates a standard engineering calculation module.

Example:

```bash
generate module pv-sizing
```

Potential structure:

```text
pv-sizing/
├── README.md
├── constants/
├── assumptions/
├── calculation/
├── validation/
├── trace/
├── types/
├── index.ts
├── run.ts
└── __tests__/
```

The exact structure should follow the current domain-engine architecture rather than forcing one universal structure onto every module.

---

### Validation Generator

Creates validation structures for a calculation or module.

Potential output:

```text
validation/
├── index.ts
├── rules.ts
├── validate-input.ts
└── validate-output.ts
```

Generated validation must follow the repository's explicit error-handling standards.

---

### Test Generator

Creates a test structure appropriate for the target module.

Potential output:

```text
__tests__/
├── calculation.test.ts
├── validation.test.ts
├── boundary.test.ts
└── regression.test.ts
```

Tests should remain engineering-specific rather than becoming generic placeholder tests.

---

### Documentation Generator

Creates documentation templates for new engineering capabilities.

Potential sections include:

```text
Purpose
Inputs
Outputs
Units
Formula
Variables
Assumptions
Constants
Validation
Errors
Precision
Rounding
Traceability
Examples
Limitations
Testing
```

---

## Generated Engineering Module Lifecycle

A generator should support the engineering development lifecycle:

```text
Plan
  ↓
Define Contracts
  ↓
Generate Structure
  ↓
Implement
  ↓
Validate
  ↓
Test
  ↓
Typecheck
  ↓
Build
  ↓
Document
  ↓
Complete
```

Generation creates the **starting structure**.

It does not mean the generated module is complete.

---

## Relationship to Engineering Standards

Generated code must align with the repository engineering standards:

* Deterministic calculations
* Explicit engineering error handling
* Explicit units
* Reproducibility
* Numerical precision
* Separation of concerns
* Validation
* Traceability
* Testing
* Documentation
* Controlled AI integration

See:

```text
docs/standards/README.md
```

---

## Relationship to Architecture

Generators must follow the canonical architecture.

They must not introduce:

* Circular dependencies
* Domain logic into foundation packages
* UI dependencies into engineering packages
* Database dependencies into calculation engines
* Network dependencies into deterministic calculations
* AI dependencies into deterministic calculation modules
* Duplicate implementations of shared infrastructure

Architecture reference:

```text
ARCHITECTURE.md
```

---

## Safety Rules

Before generating files:

1. Confirm the target path.
2. Check whether files already exist.
3. Do not overwrite implementation without explicit intent.
4. Preserve existing working code.
5. Report generated files.
6. Report skipped files.
7. Report conflicts.
8. Keep generation deterministic.

Example behavior:

```text
Generating module: pv-sizing

✓ Created:
  types/
  validation/
  calculation/
  assumptions/
  trace/
  __tests__/

⚠ Skipped:
  README.md
  File already exists.

✓ Generation complete.
```

---

## Implementation Status

| Capability                   | Status  |
| ---------------------------- | ------- |
| Generator architecture       | PLANNED |
| Package generator            | PLANNED |
| Engineering module generator | PLANNED |
| Validation generator         | PLANNED |
| Test generator               | PLANNED |
| Documentation generator      | PLANNED |
| Generator CLI                | PLANNED |
| Generator tests              | PLANNED |

Generators should be developed only when they solve a demonstrated repetition problem.

---

## Development Rules

When adding a generator:

1. Define the generated structure first.
2. Identify the architectural contract.
3. Define required inputs.
4. Define generated files.
5. Define overwrite behavior.
6. Define validation/error behavior.
7. Add generator tests.
8. Add usage documentation.
9. Test generated output.
10. Confirm the generated project passes normal repository quality gates.

---

## Example Future Workflow

A future developer may be able to create a calculation module with:

```bash
pnpm generate module \
  --domain solar \
  --name pv-sizing
```

The generator would create the agreed structure, after which the developer implements the actual engineering logic.

```text
Generator
    ↓
Module Structure
    ↓
Engineering Contracts
    ↓
Implementation
    ↓
Validation
    ↓
Tests
    ↓
Documentation
    ↓
Finished Engineering Capability
```

---

## What Generators Do Not Replace

Generators do not replace engineering design.

They do not decide:

* Engineering formulas
* System assumptions
* Design limits
* Component specifications
* Safety requirements
* Validation rules
* Engineering interpretation
* Acceptable tolerances
* Final engineering decisions

They provide structure so those decisions can be implemented consistently.

---

## Completion Criteria

A generator is complete when:

* Its purpose is documented.
* Inputs are defined.
* Generated output is defined.
* Generated code follows repository architecture.
* Existing files are protected.
* Errors are explicit.
* Generation is deterministic.
* Generated output passes typechecking.
* Generated output passes relevant tests.
* Documentation exists.
* Usage examples work.
* Generator behavior itself is tested.

---

## Core Principle

> **Generate structure. Preserve engineering judgment.**

Generators should make the Ogwusearch Engineering codebase easier to build and maintain without hiding engineering logic behind automation.
