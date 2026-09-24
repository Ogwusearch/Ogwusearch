# Ogwusearch Engineering — Foundation Coding Agent Prompt

Use this as the master instruction for coding-agent sessions working on the engineering foundation.

```text
You are implementing the Ogwusearch Engineering monorepo.

Repository:
/home/ogwu/workspace/ogwusearch

Primary specification:
docs/foundation/FOUNDATION-DEV-PLAN.md

Before changing anything:
1. Read the foundation development plan.
2. Read the target package README.
3. Inspect the existing source, tests, package.json, tsconfig, and workspace configuration.
4. Preserve working code unless the specification requires a change.

Current foundation packages:
- @ogwusearch/engineering-types
- @ogwusearch/engineering-units
- @ogwusearch/engineering-validation
- @ogwusearch/engineering-core

Domain package:
- @ogwusearch/solar-engine

Architecture:
engineering-types
engineering-units
engineering-validation
engineering-core
        ↓
solar-engine

The arrow means the domain layer may depend on the foundation. Foundation packages must never depend on solar-engine.

Responsibilities:

engineering-types:
- shared contracts
- result types
- issue types
- errors
- warnings
- assumptions
- trace
- metadata

engineering-units:
- dimensions
- units
- quantities
- conversions
- formatting

engineering-validation:
- generic validation rules
- rule execution
- issue collection
- error/warning classification

engineering-core:
- calculation lifecycle
- execution/orchestration
- result creation
- trace handling

solar-engine:
- solar and renewable-energy mathematics
- solar-domain validation rules

Rules:
- Do not duplicate contracts.
- Do not duplicate units.
- Do not duplicate generic validation.
- Do not duplicate calculation orchestration.
- Do not place solar mathematics in foundation packages.
- Do not introduce database, network, UI, MCP, or AI dependencies into foundation packages.
- Prefer pure functions.
- Avoid hidden mutable state.
- Do not silently coerce incompatible units.
- Do not silently clamp engineering values.
- Make assumptions explicit.
- Keep validation results structured.
- Keep issue ordering deterministic.
- Keep calculation traces deterministic.
- Keep runtime timestamps out of engineering mathematics.

Implementation method:
1. Identify the current phase and target files from the foundation plan.
2. Implement only the current phase.
3. Add tests for every new behavior.
4. Run tests after each coherent change.
5. Run typecheck, lint, and build before completion.
6. Review imports for dependency-direction violations.
7. Review public exports for accidental API expansion.
8. Update README when a public API changes.

TODO rule:
Treat each file TODO in FOUNDATION-DEV-PLAN.md as a contract. Do not create unrelated abstractions. If a TODO is already implemented, verify it rather than rewriting it.

Testing requirements:
- normal cases
- boundary cases
- invalid cases
- incompatible cases where applicable
- deterministic output
- error/warning behavior

Completion report:
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
- tests: PASS/FAIL
- lint: PASS/FAIL
- build: PASS/FAIL

DEPENDENCY REVIEW:
- new dependencies
- dependency graph changes
- cycle check

PUBLIC API:
- exports added/changed

CONCERNS:
- ...
```
