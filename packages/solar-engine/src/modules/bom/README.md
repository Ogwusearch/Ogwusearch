# BOM Module

The `bom` module generates a structured **Bill of Materials (BOM)** from validated solar-engineering results.

Its purpose is to identify the equipment, components, materials, and quantities required to implement a designed solar system.

The BOM module is an aggregation and specification boundary. It does **not** replace the engineering calculation modules that determine system requirements, and it does **not** perform monetary costing.

---

## Purpose

The Bill of Materials answers:

> **What equipment and materials are required, and in what quantity?**

It converts authoritative engineering outputs into a structured list of required system components.

Typical BOM items may include:

* PV modules
* batteries
* inverters
* charge controllers
* DC cables
* AC cables
* breakers
* fuses
* disconnects
* surge protection devices
* earthing conductors
* earth electrodes
* connectors
* mounting structures
* combiner boxes
* distribution boards
* generator components
* installation accessories

The exact BOM depends on the system configuration and available engineering results.

---

# Architecture Position

```text
engineering-types
        │
        ├── engineering-units
        ├── engineering-validation
        └── engineering-core
                    │
                    ▼
              solar-engine
                    │
       ┌────────────┴────────────┐
       │                         │
 Engineering Modules       system-validation
       │                         │
       └────────────┬────────────┘
                    ▼
                   BOM
                    │
                    ▼
                 costing
                    │
                    ▼
                 reports
```

The BOM module belongs to the `solar-engine` domain layer.

Foundation packages must not depend on `bom`.

---

# Core Principle

The BOM module reports **what the engineering design requires**.

It does not independently redesign the system.

For example:

```text
PV Sizing
    │
    └── required PV capacity
             │
             ▼
PV Array
    │
    └── module count
             │
             ▼
BOM
    │
    └── PV modules — quantity required
```

The BOM should use the authoritative output from `pv-array` rather than independently recalculating the number of PV modules.

---

# Responsibilities

The BOM module is responsible for:

* collecting required system components
* converting engineering outputs into BOM items
* aggregating equivalent components
* determining item quantities from authoritative results
* preserving component specifications
* preserving units
* identifying required equipment
* identifying required materials
* validating BOM structure
* preserving assumptions
* providing traceability to source calculations
* producing deterministic BOM output

---

# Non-Responsibilities

The BOM module must not:

* redesign the solar system
* replace engineering calculations
* silently change component quantities
* invent equipment specifications
* perform market-price discovery
* perform costing
* access databases
* access external APIs
* render HTML
* generate PDFs
* contain React/UI logic
* contain authentication
* contain API/server logic

Cost calculation belongs to the `costing` module.

Presentation belongs to `reports` or an external presentation layer.

---

# BOM vs Engineering Calculations

The distinction between engineering calculations and BOM generation is important.

For example:

```text
battery
    │
    └── calculates required battery capacity
              │
              ▼
BOM
    │
    └── identifies battery equipment and quantity
```

Likewise:

```text
cable
    │
    └── determines required conductor characteristics
              │
              ▼
BOM
    │
    └── identifies cable material and required quantity
```

The BOM module consumes authoritative results.

It should not reproduce those calculations.

---

# BOM vs Costing

BOM and costing are deliberately separate.

```text
BOM
    │
    ├── item
    ├── specification
    ├── quantity
    └── unit
          │
          ▼
Costing
    │
    ├── unit cost
    ├── item cost
    ├── subtotal
    ├── contingency
    └── total cost
```

In simple terms:

> **BOM = What is required?**

> **Costing = What does it cost?**

The BOM should not contain market prices unless pricing is explicitly part of a separate contract.

---

# BOM Item

A BOM item should represent one identifiable material, component, or equipment requirement.

Conceptually:

```ts
interface BOMItem {
  readonly id: string;
  readonly category: string;
  readonly name: string;
  readonly description?: string;
  readonly specification?: string;
  readonly quantity: number;
  readonly unit: string;
}
```

The actual contract must follow the repository's established TypeScript types.

---

# Item Categories

Possible BOM categories include:

```text
PV
BATTERY
INVERTER
CHARGE_CONTROLLER
CABLE
PROTECTION
EARTHING
MOUNTING
DISTRIBUTION
GENERATOR
ACCESSORY
OTHER
```

The final category system should follow the actual domain contracts.

---

# Quantity

BOM quantities should come from authoritative engineering results.

Examples:

```text
PV modules
    quantity = calculated module count

Batteries
    quantity = calculated battery count

Inverters
    quantity = selected/required inverter quantity

Cable
    quantity = calculated cable length

Protective devices
    quantity = required equipment count
```

The BOM must not silently round engineering quantities without an explicit engineering rule.

Where a physical quantity must be an integer, the responsible domain calculation should establish that requirement.

---

# Units

BOM quantities must have explicit units.

Examples:

| Item               | Unit    |
| ------------------ | ------- |
| PV module          | pcs     |
| Battery            | pcs     |
| Inverter           | pcs     |
| Charge controller  | pcs     |
| Cable              | m       |
| Breaker            | pcs     |
| Fuse               | pcs     |
| SPD                | pcs     |
| Earthing conductor | m       |
| Earth electrode    | pcs     |
| Mounting rail      | m / pcs |

Units should remain explicit and deterministic.

---

# Equipment Specifications

A BOM item may preserve relevant engineering specifications.

For example:

```text
PV Module
-----------
Quantity: 24 pcs
Power: 550 W
Technology: specified module technology
```

or:

```text
Battery
-----------
Quantity: 4 pcs
Nominal Voltage: 48 V
Capacity: 200 Ah
```

The BOM should report specifications supplied by authoritative engineering or equipment-selection results.

It should not invent missing equipment specifications.

---

# Aggregation

Equivalent BOM items may be aggregated.

For example:

```text
PV Module
550 W
24 pcs

PV Module
550 W
6 pcs
```

may be represented as:

```text
PV Module
550 W
30 pcs
```

provided the items are genuinely equivalent according to the BOM identity rules.

Items with different specifications must not be incorrectly merged.

For example:

```text
PV Module 450 W
PV Module 550 W
```

must remain separate items unless an explicit aggregation policy says otherwise.

---

# Deterministic Item Identity

Equivalent items should have a deterministic identity.

Conceptually:

```text
category
+
manufacturer
+
model
+
specification
+
unit
```

may participate in determining whether two BOM items represent the same component.

The exact identity contract should be defined by the module rather than relying on object-reference equality.

---

# Validation

BOM validation concerns the integrity of the generated material list.

Validation may check:

* item identifiers
* item names
* categories
* quantities
* units
* specifications
* duplicate identities
* invalid quantities
* missing required fields
* incompatible item definitions

Examples of invalid BOM data include:

```text
quantity < 0
```

or:

```text
quantity = NaN
```

or:

```text
unit is missing
```

or:

```text
item name is empty
```

The BOM validator should not perform unrelated system engineering validation.

System-level compatibility remains the responsibility of `system-validation`.

---

# System Validation Relationship

The distinction is:

```text
system-validation
    │
    └── Is the engineering configuration valid?

bom
    │
    └── What components/materials does the configuration require?
```

The BOM can consume validated system results but should not become a second system-validation engine.

---

# Assumptions

BOM generation may require explicit assumptions.

Examples include:

* standard accessory quantities
* installation allowances
* component grouping rules
* standard package quantities
* spare quantities
* material aggregation rules

Any such assumption must be explicit.

For example:

```text
Assumption:
    One spare fuse is included per required fuse group.
```

The module must not hide material allowances inside arbitrary calculations.

---

# Spares

Where spare components are included, they must be distinguishable from the primary engineering quantity.

Conceptually:

```text
Required quantity: 10
Spare quantity:     1
Total BOM quantity: 11
```

The source and purpose of the spare should be traceable.

A spare must not silently alter the engineering requirement.

---

# Traceability

Each BOM item should be traceable to its source engineering result where practical.

For example:

```text
PV Module
    │
    ├── source: pv-array
    ├── calculated quantity: 24
    └── specification: 550 W
```

or:

```text
DC Cable
    │
    ├── source: cable
    ├── calculated length: 85 m
    └── specification: defined conductor
```

Traceability allows downstream users to determine why an item appears in the BOM.

---

# Calculation Trace

Where BOM generation uses engineering-core calculation lifecycle support, trace steps may describe:

```text
1. Collect source results
2. Extract required components
3. Normalize item definitions
4. Aggregate equivalent items
5. Apply explicit BOM assumptions
6. Validate final BOM
7. Produce BOM output
```

The trace should describe the transformation without duplicating the underlying engineering formulas.

---

# Engineering-Core Integration

Where appropriate, the BOM module should use the shared `engineering-core` lifecycle.

Conceptually:

```ts
const definition = defineCalculation<
  BOMInput,
  BOMOutput
>({
  name: "Bill of Materials",

  validate: validateBOM,

  assumptions: createBOMAssumptions,

  calculate: buildBOM,
});

return executeCalculation(definition, input);
```

The actual implementation must follow the current `engineering-core` contracts in the repository.

The domain module owns BOM-specific logic.

`engineering-core` owns the shared calculation lifecycle and result construction.

---

# Result Status

The BOM result should preserve the standard calculation status model.

A successful BOM:

```text
status: SUCCESS
valid: true
```

A BOM generated with non-blocking warnings:

```text
status: WARNING
valid: true
```

A failed BOM:

```text
status: ERROR
valid: false
```

Errors and warnings must remain separate.

---

# Errors

Potential BOM errors include:

```text
MISSING_REQUIRED_RESULT
INVALID_BOM_ITEM
INVALID_BOM_QUANTITY
INVALID_BOM_UNIT
DUPLICATE_BOM_ITEM
MISSING_ITEM_SPECIFICATION
```

The final error codes should follow the repository's established `EngineeringIssue` conventions.

The module must never fabricate missing engineering data to make a BOM appear complete.

---

# Warnings

Potential BOM warnings include:

```text
DUPLICATE_ITEM_MERGED
OPTIONAL_SPECIFICATION_MISSING
SPARE_QUANTITY_INCLUDED
NON_STANDARD_ITEM
INCOMPLETE_SOURCE_INFORMATION
```

Warnings should have stable identifiers and remain distinguishable from errors.

---

# Determinism

Given the same engineering results and BOM configuration, BOM generation should produce the same output.

Avoid:

* random item IDs
* random ordering
* live market data
* environment-dependent quantities
* hidden state
* implicit pricing
* hidden rounding

Ordering should be explicit and deterministic.

For example:

```text
PV
Battery
Inverter
Charge Controller
Cable
Protection
Earthing
Mounting
Accessories
```

or another documented stable ordering.

---

# Precision and Rounding

The BOM should preserve engineering quantities.

For example:

```text
Calculated cable length:
85.37 m
```

must not silently become:

```text
85 m
```

unless the engineering contract explicitly requires procurement rounding.

If procurement packaging requires rounding, the distinction should be visible:

```text
Engineering requirement: 85.37 m
Procurement quantity:    100 m
```

The BOM must not hide this distinction.

---

# Procurement vs Engineering Requirement

A future procurement layer may introduce concepts such as:

```text
engineering quantity
procurement quantity
package size
minimum order quantity
spare quantity
```

These concepts should not be confused with the underlying engineering requirement.

The BOM may support procurement-oriented information when explicitly defined, but it should preserve the engineering source quantity.

---

# Testing

The module should include tests for:

## Calculation Tests

* BOM generation
* item collection
* quantity aggregation
* equivalent item merging
* distinct item preservation
* deterministic ordering
* explicit spare handling

## Validation Tests

* missing item name
* missing category
* invalid quantity
* invalid unit
* duplicate item identity
* malformed specification
* missing source result

## Regression Tests

Regression tests should protect:

* BOM item structure
* quantity calculations
* aggregation behavior
* item ordering
* status propagation
* warnings
* errors
* assumptions
* traceability

Existing engineering calculations must not be modified merely to satisfy BOM tests.

---

# Example

A conceptual system may produce:

```text
PV Array
    └── 24 × 550 W modules

Battery
    └── 4 × 48 V / 200 Ah batteries

Inverter
    └── 1 × 10 kW inverter

Cable
    └── 85 m DC cable

Protection
    ├── 2 × DC breakers
    ├── 1 × DC SPD
    └── 1 × AC breaker

Earthing
    ├── 20 m earth conductor
    └── 2 × earth electrodes
```

The BOM transforms these authoritative engineering requirements into structured items:

```text
24 × PV Module
4 × Battery
1 × Inverter
85 × m DC Cable
2 × DC Breaker
1 × DC SPD
1 × AC Breaker
20 × m Earth Conductor
2 × Earth Electrode
```

The exact quantities must come from actual engineering results rather than this conceptual example.

---

# Relationship to Costing

The BOM feeds the costing module.

```text
BOM
 │
 ├── item
 ├── specification
 ├── quantity
 └── unit
 │
 ▼
Costing
 │
 ├── unit cost
 ├── item cost
 ├── subtotal
 ├── contingency
 └── total
```

The BOM itself does not determine:

* market price
* supplier price
* currency conversion
* discounts
* taxes
* contingency cost

Those concerns belong to the costing boundary.

---

# Relationship to Reports

The Reports module may consume the BOM result.

```text
BOM
 │
 └── structured material requirements
             │
             ▼
          Reports
             │
             └── BOM report section
```

Reports may present the BOM but should not independently reconstruct it.

---

# Public API

The public API should expose intentional BOM contracts through `index.ts`.

A typical public surface includes:

```text
BOMItem
BOMInput
BOMOutput
runBOM
BOM validation
BOM warning/error codes
```

Internal helpers should remain private unless they are deliberately part of the domain API.

---

# Target Directory Structure

```text
bom/
├── README.md
├── index.ts
├── run.ts
├── warnings.ts
│
├── types/
│   ├── index.ts
│   ├── input.ts
│   ├── output.ts
│   └── item.ts
│
├── validation/
│   ├── index.ts
│   ├── rules.ts
│   └── validate-bom.ts
│
├── assumptions/
│   ├── index.ts
│   └── bom-assumptions.ts
│
├── calculation/
│   ├── index.ts
│   ├── collect-items.ts
│   ├── aggregate-quantities.ts
│   └── build-bom.ts
│
├── trace/
│   ├── index.ts
│   └── bom-trace.ts
│
└── __tests__/
    ├── calculation.test.ts
    ├── validation.test.ts
    └── regression.test.ts
```

The actual repository structure always takes precedence over this target structure. Existing files should be inspected and migrated rather than blindly replaced.

---

# Design Principles

The BOM module follows these principles:

1. **BOM is downstream of engineering calculations.**
2. **Do not duplicate authoritative engineering formulas.**
3. **Do not redesign the system.**
4. **Keep quantities traceable.**
5. **Keep units explicit.**
6. **Keep specifications explicit.**
7. **Aggregate only genuinely equivalent items.**
8. **Keep engineering quantities distinct from procurement quantities.**
9. **Keep BOM separate from costing.**
10. **Keep BOM separate from presentation.**
11. **Preserve warnings, errors, assumptions, and traceability.**
12. **Produce deterministic output.**
13. **Do not silently mutate source engineering results.**
14. **Use `engineering-core` for shared calculation/result lifecycle behavior where applicable.**

---

# Summary

The `bom` module is the material-definition boundary of `solar-engine`.

Its role is:

```text
Authoritative Engineering Results
              │
              ▼
       Required Components
              │
              ▼
       BOM Item Definitions
              │
              ▼
       Quantity Aggregation
              │
              ▼
       Structured BOM
              │
        ┌─────┴─────┐
        ▼           ▼
     costing      reports
```

The engineering modules determine **what the system requires**.

The BOM module determines **what physical components and materials represent those requirements**.

The costing module determines **what those items cost**.

The reports module determines **how the combined engineering information is presented**.

This separation keeps `solar-engine` modular, deterministic, traceable, and suitable for future procurement, costing, reporting, and system-validation workflows.
