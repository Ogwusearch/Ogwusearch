# OGWUSEARCH ENGINEERING
# Foundation Development Plan

## Document Purpose

This document is the implementation contract for the foundational packages of the Ogwusearch Engineering monorepo.

It defines:

- Development phases
- Dependency direction
- Development workflow
- Folder structure
- File-by-file responsibilities
- TODOs for every planned file
- Acceptance criteria
- Coding-agent prompts
- Phase gates
- Rules that prevent architectural drift

The foundation exists to support domain engines such as `@ogwusearch/solar-engine` without placing solar-specific mathematics into generic infrastructure.

---

# 1. Target Architecture

```text
/home/ogwu/workspace/ogwusearch/
│
├── packages/
│   ├── engineering-types
│   ├── engineering-units
│   ├── engineering-validation
│   ├── engineering-core
│   └── solar-engine
│
├── apps/
│   └── solaraudit/
│
├── services/
│   ├── engineering-api/
│   └── engineering-mcp/
│
└── docs/
```

The current foundation scope is:

```text
FOUNDATION
├── engineering-types
├── engineering-units
├── engineering-validation
└── engineering-core

DOMAIN
└── solar-engine
```

The domain package consumes the foundation. The foundation must never depend on the domain.

---

# 2. Package Responsibilities

## 2.1 `engineering-types`

Owns shared engineering contracts.

Examples:

- Calculation input contracts
- Calculation output contracts
- Calculation results
- Calculation status
- Engineering issues
- Errors
- Warnings
- Assumptions
- Trace steps
- Calculation traces
- Metadata
- IDs

It must not own:

- Unit conversion logic
- Validation algorithms
- Calculation execution
- Solar formulas
- Database access
- Network access

---

## 2.2 `engineering-units`

Owns physical quantities, units, dimensions, conversions, and formatting.

Examples:

- V / mV / kV
- A / mA / kA
- W / kW / MW
- Wh / kWh / MWh
- Ah / mAh
- Ω / kΩ / MΩ
- s / min / h / day
- mm / cm / m / km
- °C / K
- %

It must not decide whether a value is acceptable for a particular engineering system.

---

## 2.3 `engineering-validation`

Owns reusable validation infrastructure.

Examples:

- Required values
- Finite numbers
- Positive values
- Non-negative values
- Integer checks
- Minimum/maximum checks
- Range checks
- Generic rule contracts
- Rule execution
- Error and warning collection

It must not contain solar-domain rules.

---

## 2.4 `engineering-core`

Owns calculation lifecycle and orchestration.

```text
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
```

It must not contain:

- PV formulas
- Battery formulas
- Inverter formulas
- Cable formulas
- Solar-specific validation rules

---

## 2.5 `solar-engine`

Owns solar and renewable-energy mathematics.

```text
Load
Energy
Peak Demand
PV Sizing
PV Array
PV String
Battery
Inverter
Charge Controller
Cable
Voltage Drop
Protection
Earthing
Generator
BOM
Costing
System Validation
Reports
```

---

# 3. Dependency Rules

The preferred dependency graph is:

```text
engineering-types
       ↑
       ├──────── engineering-units
       │
       └──────── engineering-validation
                         ↑
                         │
                  engineering-core
                         ↑
                         │
                    solar-engine
```

Interpretation:

- `engineering-types` is the base contract layer.
- `engineering-units` is a foundational physical-quantity layer.
- `engineering-validation` depends on shared contracts.
- `engineering-core` consumes contracts and validation infrastructure.
- `solar-engine` consumes the foundation.
- No foundation package may import from `solar-engine`.

Application and service layers sit above `solar-engine`:

```text
SolarAudit App
      ↑
solar-engine
      ↑
engineering-core
      ↑
engineering-validation
      ↑
engineering-units
      ↑
engineering-types
```

---

# 4. Development Phases

## Phase 00 — Workspace and Tooling Foundation

### Goal

Establish the monorepo, package boundaries, shared TypeScript conventions, testing, linting, formatting, package scripts, and documentation workflow.

### Build

- Monorepo root
- Workspace package management
- Root TypeScript configuration
- Test runner
- Linting
- Formatting
- Package naming conventions
- Build conventions
- CI-ready scripts

### Exit criteria

- All four foundation package directories exist.
- Every package can be built.
- Every package can be tested.
- Workspace scripts are consistent.
- No package has domain dependencies.

---

## Phase 01 — `engineering-types`

### Goal

Create the common vocabulary used by the rest of the system.

### Build order

```text
status
→ issue
→ error / warning
→ assumptions
→ trace
→ metadata
→ input / output
→ result
→ context
→ public index
```

### Exit criteria

A package consumer can express:

```ts
CalculationResult<MyOutput>
EngineeringError
EngineeringWarning
EngineeringAssumption
CalculationTrace
CalculationContext
```

without importing any other foundation package.

---

## Phase 02 — `engineering-units`

### Goal

Create safe unit-aware quantities and conversions.

### Build order

```text
dimensions
→ unit contract
→ base units
→ unit registry
→ quantity
→ conversion
→ comparison
→ formatting
```

### Initial supported domains

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

### Exit criteria

Examples that must work:

```text
1000 mV = 1 V
5 kW = 5000 W
15 kWh = 15000 Wh
```

Examples that must fail safely:

```text
5 kW → V
100 Ah → kW
```

because dimensions are incompatible.

---

## Phase 03 — `engineering-validation`

### Goal

Build a reusable rule and issue collection system.

### Build order

```text
rule contract
→ rule context
→ basic checks
→ validator
→ validate-all
→ issue helpers
→ composition helpers
```

### Initial checks

```text
required
numeric
positive
non-negative
integer
minimum
maximum
range
equality
```

### Exit criteria

The validator can:

- execute multiple rules
- collect all failures
- separate errors from warnings
- preserve paths
- preserve error codes
- preserve rule metadata

---

## Phase 04 — `engineering-core`

### Goal

Implement a deterministic calculation lifecycle that domain engines can use.

### Build order

```text
calculation contract
→ execution context
→ validation hook
→ calculation hook
→ warnings
→ assumptions
→ trace
→ result creation
→ exception boundary
```

### Exit criteria

A generic calculation can be expressed as:

```ts
executeCalculation({
  name,
  validate,
  assumptions,
  calculate,
}, input)
```

and return a stable result structure.

---

## Phase 05 — Foundation Integration Gate

### Goal

Prove the four packages work together before implementing the large domain engine.

Create a tiny demonstration calculation that is NOT solar-domain functionality.

Suggested example:

```text
Power = Voltage × Current
```

Example:

```text
48 V × 10 A = 480 W
```

The demonstration must use:

- `engineering-types`
- `engineering-units`
- `engineering-validation`
- `engineering-core`

### Exit criteria

- All four packages interoperate.
- Unit compatibility is enforced.
- Validation is collected.
- Calculation result is traceable.
- Tests pass.
- No dependency cycle exists.

---

## Phase 06 — `solar-engine` Start Gate

Only after Phase 05 passes should solar-specific implementation begin.

First vertical slice:

```text
Load
  ↓
Energy
  ↓
Peak Demand
  ↓
PV Sizing
  ↓
Tests
```

Then:

```text
PV Array
  ↓
PV String
  ↓
Battery
  ↓
Inverter
  ↓
Charge Controller
```

Then the remaining modules.

---

# 5. Repository-Level Workflow

Every feature follows this workflow:

```text
PLAN
  ↓
DEFINE CONTRACT
  ↓
IMPLEMENT
  ↓
UNIT TEST
  ↓
INTEGRATION TEST
  ↓
TYPECHECK
  ↓
LINT
  ↓
BUILD
  ↓
REVIEW ARCHITECTURE
  ↓
COMMIT
```

No feature is considered complete because the code merely compiles.

---

# 6. Package Development Workflow

For each package:

## Step 1 — Read the package contract

Read its `README.md` and this document before changing files.

## Step 2 — Confirm dependencies

Do not introduce an undeclared package dependency.

## Step 3 — Build the smallest public contract

Prefer small stable interfaces over large abstractions.

## Step 4 — Implement one behavior at a time

Every behavior gets a test.

## Step 5 — Verify negative cases

Test invalid inputs, incompatible dimensions, boundaries, and warnings.

## Step 6 — Verify determinism

The same input must give the same engineering value.

## Step 7 — Export intentionally

Do not expose internal helpers unless they are part of the package's intended public API.

## Step 8 — Run package verification

```bash
npm run typecheck
npm run test
npm run build
npm run lint
```

## Step 9 — Run workspace verification

```bash
npm run typecheck --workspaces
npm run test --workspaces
npm run build --workspaces
```

Use the actual workspace commands defined by the repository if they differ.

---

# 7. Foundation Folder Structure

```text
packages/
│
├── engineering-types/
│   ├── src/
│   │   ├── calculation/
│   │   │   ├── input.ts
│   │   │   ├── output.ts
│   │   │   ├── result.ts
│   │   │   ├── status.ts
│   │   │   └── context.ts
│   │   ├── validation/
│   │   │   ├── issue.ts
│   │   │   ├── error.ts
│   │   │   └── warning.ts
│   │   ├── trace/
│   │   │   ├── step.ts
│   │   │   └── trace.ts
│   │   ├── assumptions/
│   │   │   └── assumption.ts
│   │   ├── common/
│   │   │   ├── metadata.ts
│   │   │   └── identifier.ts
│   │   └── index.ts
│   │
│   │   ├── tests/
│   │   ├── README.md
│   │   ├── package.json
│   │   └── tsconfig.json
│
├── engineering-units/
│   ├── src/
│   │   ├── dimensions/
│   │   │   ├── dimension.ts
│   │   │   └── dimensions.ts
│   │   ├── units/
│   │   │   ├── unit.ts
│   │   │   ├── registry.ts
│   │   │   ├── voltage.ts
│   │   │   ├── current.ts
│   │   │   ├── power.ts
│   │   │   ├── energy.ts
│   │   │   ├── resistance.ts
│   │   │   ├── charge.ts
│   │   │   ├── time.ts
│   │   │   ├── length.ts
│   │   │   ├── temperature.ts
│   │   │   └── percentage.ts
│   │   ├── quantity/
│   │   │   ├── quantity.ts
│   │   │   ├── create-quantity.ts
│   │   │   └── compare.ts
│   │   ├── conversion/
│   │   │   ├── convert.ts
│   │   │   ├── conversion.ts
│   │   │   └── errors.ts
│   │   ├── formatting/
│   │   │   └── format-quantity.ts
│   │   └── index.ts
│   ├── tests/
│   ├── README.md
│   ├── package.json
│   └── tsconfig.json
│
├── engineering-validation/
│   ├── src/
│   │   ├── rule/
│   │   │   ├── rule.ts
│   │   │   ├── rules.ts
│   │   │   └── rule-context.ts
│   │   ├── validator/
│   │   │   ├── validate.ts
│   │   │   ├── validate-all.ts
│   │   │   └── validation-result.ts
│   │   ├── checks/
│   │   │   ├── required.ts
│   │   │   ├── numeric.ts
│   │   │   ├── positive.ts
│   │   │   ├── non-negative.ts
│   │   │   ├── integer.ts
│   │   │   ├── minimum.ts
│   │   │   ├── maximum.ts
│   │   │   ├── range.ts
│   │   │   └── equality.ts
│   │   ├── issues/
│   │   │   ├── create-error.ts
│   │   │   └── create-warning.ts
│   │   ├── helpers/
│   │   │   ├── combine.ts
│   │   │   └── paths.ts
│   │   └── index.ts
│   ├── tests/
│   ├── README.md
│   ├── package.json
│   └── tsconfig.json
│
└── engineering-core/
    ├── src/
    │   ├── calculation/
    │   │   ├── execute.ts
    │   │   ├── context.ts
    │   │   ├── lifecycle.ts
    │   │   └── types.ts
    │   ├── result/
    │   │   ├── create-result.ts
    │   │   ├── create-error.ts
    │   │   ├── create-warning.ts
    │   │   └── create-trace.ts
    │   ├── errors/
    │   │   └── CalculationError.ts
    │   └── index.ts
    ├── tests/
    ├── README.md
    ├── package.json
    └── tsconfig.json
```

---

# 8. File-by-File TODO Matrix

# 8.1 `engineering-types`

## `src/calculation/status.ts`

TODO:

- Define `CalculationStatus`.
- Initial values: `SUCCESS`, `WARNING`, `ERROR`.
- Keep it a pure type module.

## `src/validation/issue.ts`

TODO:

- Define `IssueSeverity`.
- Define `EngineeringIssue`.
- Include `code`, `message`, `severity`, optional `path`, optional `metadata`.
- Keep metadata serializable.

## `src/validation/error.ts`

TODO:

- Define `EngineeringError`.
- Constrain severity to `ERROR`.

## `src/validation/warning.ts`

TODO:

- Define `EngineeringWarning`.
- Constrain severity to `WARNING`.

## `src/assumptions/assumption.ts`

TODO:

- Define `EngineeringAssumption`.
- Include name, value, optional unit, description, and source.

## `src/trace/step.ts`

TODO:

- Define trace-step contract.
- Include stable step ID/name.
- Include optional formula.
- Include structured input/output snapshots.

## `src/trace/trace.ts`

TODO:

- Define ordered trace collection.
- Do not perform trace mutation here.

## `src/common/metadata.ts`

TODO:

- Define optional calculation metadata.
- Keep runtime timestamps optional.
- Avoid making metadata required for deterministic calculations.

## `src/common/identifier.ts`

TODO:

- Define `EngineeringId` as a portable identifier contract.
- Do not generate UUIDs here.

## `src/calculation/input.ts`

TODO:

- Define minimal generic calculation input shape.
- Allow optional metadata.
- Do not add domain-specific fields.

## `src/calculation/output.ts`

TODO:

- Define minimal generic calculation output shape.
- Allow optional metadata.

## `src/calculation/context.ts`

TODO:

- Define context passed into a calculation.
- Include trace collection, assumptions, and warnings.

## `src/calculation/result.ts`

TODO:

- Define `CalculationResult<T>`.
- Include status, valid, value, errors, warnings, assumptions, trace.
- Keep result serializable.

## `src/index.ts`

TODO:

- Export only intended public contracts.
- No internal-only exports.

---

# 8.2 `engineering-units`

## `src/dimensions/dimension.ts`

TODO:

- Define supported dimension names.
- Define a dimension contract.
- Keep dimensions distinct from units.

## `src/dimensions/dimensions.ts`

TODO:

- Define canonical dimension constants.
- Ensure dimension names are stable.

## `src/units/unit.ts`

TODO:

- Define unit contract.
- Include symbol, name, dimension, `toBase`, `fromBase`.
- Make conversion direction explicit.

## `src/units/voltage.ts`

TODO:

- Define mV, V, kV.
- Base unit: V.
- Add focused tests.

## `src/units/current.ts`

TODO:

- Define mA, A, kA.
- Base unit: A.

## `src/units/power.ts`

TODO:

- Define W, kW, MW.
- Base unit: W.

## `src/units/energy.ts`

TODO:

- Define Wh, kWh, MWh.
- Base unit: Wh.

## `src/units/resistance.ts`

TODO:

- Define Ω, kΩ, MΩ.
- Base unit: Ω.

## `src/units/charge.ts`

TODO:

- Define C, mAh, Ah.
- Decide and document whether Ah uses charge dimension or a battery-capacity domain convention.
- Do not silently equate Ah with coulombs without a documented conversion model.

## `src/units/time.ts`

TODO:

- Define s, min, h, day.
- Base unit: s or h; choose one and document it.
- Preserve exact deterministic conversions.

## `src/units/length.ts`

TODO:

- Define mm, cm, m, km.
- Base unit: m.

## `src/units/temperature.ts`

TODO:

- Define °C and K.
- Handle offset conversion correctly.
- Do not treat temperature as a simple multiplicative scale.

## `src/units/percentage.ts`

TODO:

- Define percent representation.
- Decide whether internal canonical representation is ratio `[0,1]` or percentage `[0,100]`.
- Document it and apply consistently.

## `src/units/registry.ts`

TODO:

- Register all supported units.
- Ensure symbols are unique within their dimension.
- Do not use stringly-typed conversion hacks outside the registry.

## `src/quantity/quantity.ts`

TODO:

- Define immutable `Quantity`.
- Include numeric value, unit, dimension.

## `src/quantity/create-quantity.ts`

TODO:

- Reject non-finite values.
- Return immutable quantity objects where practical.

## `src/quantity/compare.ts`

TODO:

- Support equality/comparison between compatible quantities.
- Normalize to a common base representation before comparison.
- Reject incompatible dimensions.

## `src/conversion/conversion.ts`

TODO:

- Define conversion metadata if required.
- Keep conversion behavior independent of domain logic.

## `src/conversion/convert.ts`

TODO:

- Convert between compatible units.
- Reject dimension mismatches.
- Preserve numerical precision as practical.

## `src/conversion/errors.ts`

TODO:

- Define unit conversion errors.
- Include source unit and target unit when useful.

## `src/formatting/format-quantity.ts`

TODO:

- Provide deterministic human-readable formatting.
- Keep formatting separate from mathematical conversion.

## `src/index.ts`

TODO:

- Export public dimensions, units, quantity APIs, conversion APIs, and formatting.

---

# 8.3 `engineering-validation`

## `src/rule/rule.ts`

TODO:

- Define generic validation rule contract.
- Rules return zero or more engineering issues.

## `src/rule/rules.ts`

TODO:

- Provide rule collection helpers.
- Keep ordering deterministic.

## `src/rule/rule-context.ts`

TODO:

- Define optional validation context.
- Include field path and related data.

## `src/validator/validate.ts`

TODO:

- Execute one rule or one rule set.
- Preserve issue ordering.

## `src/validator/validate-all.ts`

TODO:

- Execute all supplied rules.
- Collect all issues.
- Split errors and warnings.
- Set `valid` based on error absence.

## `src/validator/validation-result.ts`

TODO:

- Define validation result structure.
- Make it easy for callers to inspect all issues.

## `src/checks/required.ts`

TODO:

- Validate null/undefined absence.

## `src/checks/numeric.ts`

TODO:

- Require finite numbers.
- Reject NaN and Infinity.

## `src/checks/positive.ts`

TODO:

- Require value > 0.

## `src/checks/non-negative.ts`

TODO:

- Require value >= 0.

## `src/checks/integer.ts`

TODO:

- Require a finite integer.

## `src/checks/minimum.ts`

TODO:

- Require value >= minimum.

## `src/checks/maximum.ts`

TODO:

- Require value <= maximum.

## `src/checks/range.ts`

TODO:

- Require inclusive min/max range.
- Validate rule configuration.

## `src/checks/equality.ts`

TODO:

- Support deterministic equality checks.
- Keep semantics explicit for numbers vs domain objects.

## `src/issues/create-error.ts`

TODO:

- Build standardized error issues.

## `src/issues/create-warning.ts`

TODO:

- Build standardized warning issues.

## `src/helpers/combine.ts`

TODO:

- Combine issue arrays without mutation.

## `src/helpers/paths.ts`

TODO:

- Build stable field paths such as `loads[0].power`.
- Keep path behavior deterministic.

## `src/index.ts`

TODO:

- Export only public validation APIs.

---

# 8.4 `engineering-core`

## `src/calculation/types.ts`

TODO:

- Define calculation definition contract if it is not kept entirely in `engineering-types`.
- Generic input/output types only.

## `src/calculation/context.ts`

TODO:

- Build runtime calculation context.
- Collect warnings, assumptions, and trace steps.
- Do not store global mutable state.

## `src/calculation/lifecycle.ts`

TODO:

- Define lifecycle stages.
- Recommended stages: validate, calculate, finalize.
- Ensure deterministic ordering.

## `src/calculation/execute.ts`

TODO:

- Run validation first.
- Stop calculation when validation has blocking errors.
- Execute calculation when valid.
- Collect warnings.
- Build result.
- Capture unexpected exceptions in a structured error.

## `src/result/create-result.ts`

TODO:

- Construct a valid `CalculationResult<T>`.
- Avoid hidden fields.

## `src/result/create-error.ts`

TODO:

- Construct standardized calculation failure results.

## `src/result/create-warning.ts`

TODO:

- Construct warning results without invalidating an otherwise valid calculation.

## `src/result/create-trace.ts`

TODO:

- Provide deterministic trace step construction.
- Preserve formula and structured inputs/outputs.

## `src/errors/CalculationError.ts`

TODO:

- Define an internal error class only when necessary.
- Preserve safe public serialization.
- Do not leak stack traces into normal engineering result contracts.

## `src/index.ts`

TODO:

- Export the public execution API and supported lifecycle types.

---

# 9. Testing Strategy

Every foundation package must have four test layers.

## 9.1 Contract tests

Verify interfaces and public shapes compile and behave as documented.

## 9.2 Normal behavior tests

Examples:

```text
48 V
5 kW
15 kWh
```

## 9.3 Boundary tests

Examples:

```text
0
negative values
minimum allowed values
maximum allowed values
unit boundaries
```

## 9.4 Failure tests

Examples:

```text
NaN
Infinity
invalid ranges
incompatible units
missing required inputs
unexpected calculation exceptions
```

---

# 10. Determinism Rules

Engineering values must not change because of:

- Current time
- Randomness
- Network state
- Database state
- Browser state
- Hidden global variables
- Mutable singleton state

Runtime metadata may contain timestamps, but those timestamps must not influence the engineering result.

---

# 11. Coding Rules for the Agent

The coding agent must follow these rules:

1. Do not invent new packages without a documented architectural reason.
2. Do not move solar logic into foundation packages.
3. Do not duplicate shared contracts between packages.
4. Prefer pure functions for engineering behavior.
5. Prefer explicit inputs and outputs.
6. Do not introduce hidden mutable state.
7. Do not introduce network calls into the foundation.
8. Do not introduce database dependencies into the foundation.
9. Do not add UI dependencies to the foundation.
10. Every new behavior must have tests.
11. Every public export must be intentional.
12. Preserve deterministic ordering of validation issues and trace steps.
13. Do not silently coerce incompatible units.
14. Do not silently clamp engineering inputs unless explicitly specified.
15. Do not make engineering assumptions implicit.
16. When architecture is ambiguous, choose the smallest change that preserves the dependency direction.
17. Update package README documentation when public APIs change.
18. Before finishing a phase, run typecheck, tests, lint, and build.

---

# 12. Phase Acceptance Gates

## Phase 00 Gate

```text
[ ] Monorepo workspace works
[ ] Package scripts work
[ ] TypeScript configuration works
[ ] Tests run
[ ] Lint runs
[ ] Build runs
```

## Phase 01 Gate

```text
[ ] Shared contracts compile
[ ] Result/error/warning/trace types are stable
[ ] No external runtime dependencies required
[ ] Tests pass
```

## Phase 02 Gate

```text
[ ] Dimensions exist
[ ] Units exist
[ ] Quantity model works
[ ] Compatible conversion works
[ ] Incompatible conversion fails
[ ] Temperature offset conversion works
[ ] Tests pass
```

## Phase 03 Gate

```text
[ ] Generic rules work
[ ] Multiple rules execute
[ ] All issues are collected
[ ] Error/warning separation works
[ ] Field paths work
[ ] Tests pass
```

## Phase 04 Gate

```text
[ ] Calculation lifecycle works
[ ] Validation runs before calculation
[ ] Warnings are preserved
[ ] Assumptions are preserved
[ ] Trace is preserved
[ ] Unexpected failures become structured results
[ ] Tests pass
```

## Phase 05 Gate

```text
[ ] Cross-package integration works
[ ] A sample calculation uses all four foundations
[ ] No circular dependencies
[ ] Public APIs are stable
[ ] Full workspace checks pass
```

---

# 13. Coding Agent Master Prompt

Use this prompt when assigning work to a coding agent.

```text
You are implementing the Ogwusearch Engineering monorepo.

Repository root:
/home/ogwu/workspace/ogwusearch

Read first:
1. docs/foundation/FOUNDATION-DEV-PLAN.md
2. The target package README.md
3. Existing package.json and tsconfig.json files
4. Existing source and tests before creating or replacing anything

MISSION
-------
Implement only the current foundation phase described by the development plan.
Do not jump ahead into solar-engine, applications, API, MCP, or AI unless the current phase explicitly requires an integration test.

ARCHITECTURE
------------
The current foundation is:

engineering-types
engineering-units
engineering-validation
engineering-core

The domain layer is:

solar-engine

Dependency direction must remain upward toward the domain:

engineering-types
  -> engineering-units / engineering-validation
  -> engineering-core
  -> solar-engine

Never make a foundation package depend on solar-engine.

PACKAGE RESPONSIBILITIES
------------------------
engineering-types:
- shared engineering contracts
- results
- errors
- warnings
- assumptions
- traces
- metadata

engineering-units:
- dimensions
- units
- quantities
- conversion
- formatting

engineering-validation:
- generic validation rules
- validators
- issue collection
- errors/warnings

engineering-core:
- calculation lifecycle
- execution/orchestration
- result creation
- trace creation

ENGINEERING PRINCIPLES
----------------------
- Deterministic calculations
- Pure functions where practical
- Explicit inputs and outputs
- No hidden state
- No network access
- No database access
- No UI dependencies
- No domain-specific logic in foundation packages
- No silent unit coercion
- No silent clamping
- Explicit assumptions
- Structured validation issues
- Traceable calculations

IMPLEMENTATION WORKFLOW
-----------------------
1. Inspect the existing repository.
2. Identify what already exists.
3. Do not overwrite working code blindly.
4. Implement one file responsibility at a time.
5. Add or update tests with every behavior.
6. Export only intentional public APIs.
7. Run typecheck.
8. Run tests.
9. Run lint.
10. Run build.
11. Inspect package dependency graph for cycles.
12. Summarize changed files, tests, and any architecture concerns.

TODO EXECUTION RULE
-------------------
Treat each file TODO in FOUNDATION-DEV-PLAN.md as an implementation contract.
Do not create unrelated abstractions.
If an existing file already satisfies the TODO, verify it with tests rather than rewriting it.
If a TODO conflicts with existing code, preserve the architecture and explain the smallest safe reconciliation.

TEST REQUIREMENTS
-----------------
For every implementation add tests for:
- normal behavior
- boundary behavior
- invalid input
- failure behavior
- deterministic output

For engineering-units additionally test:
- correct conversions
- incompatible dimensions
- floating point edge cases where relevant
- temperature offset conversions

For engineering-validation additionally test:
- all-rule collection
- error/warning separation
- path preservation

For engineering-core additionally test:
- validation before calculation
- calculation execution
- warnings
- assumptions
- trace
- thrown exceptions

DONE CRITERIA
-------------
The phase is complete only when:
- all TODOs required for the phase are implemented
- tests pass
- typecheck passes
- lint passes
- build passes
- package exports are intentional
- dependency direction remains correct
- no solar-specific logic has leaked into the foundation

OUTPUT FORMAT
-------------
At the end report:

PHASE:
PACKAGE:

FILES CREATED:
- ...

FILES MODIFIED:
- ...

IMPLEMENTED:
- ...

TESTS:
- ...

CHECKS:
- typecheck: PASS/FAIL
- test: PASS/FAIL
- lint: PASS/FAIL
- build: PASS/FAIL

ARCHITECTURE:
- dependency changes
- public API changes
- concerns or follow-up work
```

---

# 14. Phase-Specific Agent Prompts

## Prompt — Phase 01 `engineering-types`

```text
Implement Phase 01 of the Ogwusearch Engineering Foundation Plan.

Target package:
/home/ogwu/workspace/ogwusearch/packages/engineering-types

Read:
docs/foundation/FOUNDATION-DEV-PLAN.md

Implement the engineering-types TODO matrix only.

Create stable contracts for:
- calculation status
- issue
- error
- warning
- assumption
- trace step
- trace
- metadata
- identifier
- calculation input
- calculation output
- calculation context
- calculation result

Rules:
- No runtime engineering formulas.
- No unit conversion.
- No validation algorithms.
- No domain dependencies.
- Keep contracts serializable.
- Export only intentional public types.

Add tests and finish with typecheck, test, lint, and build.
```

## Prompt — Phase 02 `engineering-units`

```text
Implement Phase 02 of the Ogwusearch Engineering Foundation Plan.

Target package:
/home/ogwu/workspace/ogwusearch/packages/engineering-units

Read:
docs/foundation/FOUNDATION-DEV-PLAN.md

Implement:
- dimensions
- unit contract
- voltage units
- current units
- power units
- energy units
- resistance units
- charge units
- time units
- length units
- temperature units
- percentage representation
- unit registry
- quantity
- conversion
- comparison
- formatting

Requirements:
- conversions are deterministic
- incompatible dimensions fail explicitly
- temperature conversion handles offsets correctly
- no solar-specific rules
- no application/database/network dependencies

Add tests for normal, boundary, invalid, and incompatible conversions.
Finish with typecheck, test, lint, and build.
```

## Prompt — Phase 03 `engineering-validation`

```text
Implement Phase 03 of the Ogwusearch Engineering Foundation Plan.

Target package:
/home/ogwu/workspace/ogwusearch/packages/engineering-validation

Read:
docs/foundation/FOUNDATION-DEV-PLAN.md

Implement:
- validation rule contract
- rule context
- validator
- validate-all
- required check
- numeric check
- positive check
- non-negative check
- integer check
- minimum check
- maximum check
- range check
- equality check
- error helper
- warning helper
- issue composition helpers
- field path helpers

Requirements:
- collect all relevant issues
- distinguish errors from warnings
- preserve deterministic order
- preserve field paths
- use shared engineering-types contracts
- never add solar-specific validation

Add complete tests and finish with typecheck, test, lint, and build.
```

## Prompt — Phase 04 `engineering-core`

```text
Implement Phase 04 of the Ogwusearch Engineering Foundation Plan.

Target package:
/home/ogwu/workspace/ogwusearch/packages/engineering-core

Read:
docs/foundation/FOUNDATION-DEV-PLAN.md

Implement the calculation lifecycle:

Input
  -> Validation
  -> Calculation
  -> Warnings
  -> Assumptions
  -> Trace
  -> Result

The execution layer must:
- validate before calculation
- block calculation on validation errors
- allow valid calculations with warnings
- preserve assumptions
- preserve trace
- return deterministic engineering output
- convert unexpected failures to structured result errors
- avoid hidden global state

Do not implement solar mathematics.

Create tests for successful calculations, validation failures, warnings, assumptions, traces, and thrown calculation errors.
Finish with typecheck, test, lint, and build.
```

## Prompt — Phase 05 Foundation Integration

```text
Implement the Foundation Integration Gate.

Read:
docs/foundation/FOUNDATION-DEV-PLAN.md

Create a minimal non-solar demonstration calculation using all four foundation packages:
- engineering-types
- engineering-units
- engineering-validation
- engineering-core

Use a simple electrical relationship such as:
Power = Voltage × Current

Example:
48 V × 10 A = 480 W

The demonstration must show:
- unit-aware inputs
- generic validation
- calculation execution
- structured result
- warnings/assumptions where relevant
- calculation trace

Do not move this example into solar-engine.

Use the integration only to prove the foundation works together.
Run full workspace checks and verify that no dependency cycle exists.
```

---

# 15. Definition of Done for the Foundation

The foundation is complete when all of the following are true:

```text
[ ] engineering-types is stable
[ ] engineering-units is stable
[ ] engineering-validation is stable
[ ] engineering-core is stable
[ ] shared contracts are not duplicated
[ ] units are not implemented inside domain packages
[ ] validation infrastructure is not implemented inside domain packages
[ ] calculation orchestration is not duplicated inside domain packages
[ ] dependency direction is acyclic
[ ] tests pass
[ ] typecheck passes
[ ] lint passes
[ ] builds pass
[ ] a cross-package integration example works
[ ] package READMEs explain responsibilities and public APIs
[ ] coding-agent instructions are available in-repository
```

---

# 16. What Comes Immediately After the Foundation

Do not add MCP or AI yet.

The next build target is:

```text
@ogwusearch/solar-engine
```

Its first vertical slice should be:

```text
Load
  ↓
Energy
  ↓
Peak Demand
  ↓
PV Sizing
```

Then:

```text
PV Array
  ↓
PV String
  ↓
Battery
  ↓
Inverter
  ↓
Charge Controller
  ↓
Cable
  ↓
Voltage Drop
  ↓
Protection
  ↓
Earthing
  ↓
Generator
  ↓
BOM
  ↓
Costing
  ↓
System Validation
```

Only after a reliable domain engine exists should the project move into:

```text
SolarAudit App
      ↓
Engineering API
      ↓
Engineering MCP
      ↓
AI Engineering Assistant
```

---

# 17. Final Architectural Principle

The foundation should make the domain easier to build, not become the domain itself.

```text
FOUNDATION

What is an engineering result?
        ↓
How are units represented?
        ↓
How are values validated?
        ↓
How is a calculation executed?

DOMAIN

What does solar engineering require?
        ↓
Load
Energy
PV
Battery
Inverter
Cable
Protection
Validation

APPLICATION

How does a user operate the engineering system?
```

The intended long-term flow is:

```text
AI / MCP / API / Desktop / Web
              ↓
         SolarAudit
              ↓
        solar-engine
              ↓
      engineering-core
              ↓
 engineering-validation
       ↙              ↘
engineering-units   engineering-types
```

This separation is the architectural contract for Ogwusearch Engineering.
