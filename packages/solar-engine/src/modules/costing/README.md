# Costing Module

Engineering costing module for the Ogwusearch Solar Engine.

The `costing` module converts engineering system quantities and supplied unit costs into a structured cost estimate.

It is responsible for deterministic cost calculations and cost aggregation. It does not own system sizing, equipment selection, procurement, inventory management, payment processing, or commercial application logic.

---

## Purpose

The Costing module answers:

> **Given a set of engineering items, quantities, and applicable unit costs, what is the calculated cost of each item and the resulting system cost?**

It supports engineering workflows such as:

* equipment costing
* material costing
* installation costing
* component-level cost breakdowns
* subtotal calculation
* additional cost categories
* contingency where explicitly supplied
* total project cost estimation
* cost reporting inputs

The module is designed to consume outputs from other Solar Engine modules without recreating their engineering calculations.

---

## Position in the Engineering Architecture

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
                │
                ▼
           costing module
```

Within the Solar Engine:

```text
Load
  │
  ▼
Engineering Calculations
  │
  ├── PV sizing
  ├── Battery sizing
  ├── Inverter sizing
  ├── Cable sizing
  ├── Protection
  └── Other engineering modules
              │
              ▼
             BOM
              │
              ▼
           Costing
              │
              ▼
       System Cost Estimate
```

The Costing module should consume engineering quantities rather than independently determining what equipment the system requires.

---

# Responsibilities

The module owns:

* cost-item representation
* quantity × unit-cost calculations
* item-level extended cost
* category subtotals
* cost aggregation
* explicitly supplied contingency calculations
* explicitly supplied additional costs
* cost validation
* costing assumptions
* costing warnings
* costing trace information
* deterministic cost output

---

# Non-Responsibilities

The module does not own:

* load calculations
* energy calculations
* peak-demand calculations
* PV sizing
* PV string sizing
* battery sizing
* inverter sizing
* charge-controller sizing
* cable sizing
* voltage-drop calculations
* protection sizing
* earthing calculations
* generator sizing
* equipment selection
* procurement
* inventory
* supplier management
* payment processing
* currency exchange
* database operations
* UI logic
* API logic
* browser logic
* AI/LLM logic
* MCP/tool exposure

Those concerns belong to their respective domain or application layers.

---

# Costing Model

The fundamental item-cost relationship is:

```text
itemCost = quantity × unitCost
```

For multiple items:

```text
subtotal = Σ itemCost
```

Where an explicitly supplied contingency rate is applicable:

```text
contingency =
  subtotal × contingencyRate
```

The total estimated cost is then:

```text
totalCost =
  subtotal
  + additionalCosts
  + contingency
```

The exact aggregation model is determined by the module's TypeScript contract.

The module must not silently introduce taxes, discounts, transportation, installation charges, contingency, or other commercial adjustments unless those values are explicitly part of the input contract.

---

# Cost Items

A costing item represents a measurable engineering or project component.

Conceptually:

```ts
interface CostItem {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly quantity: number;
  readonly unitCost: number;
  readonly unit?: string;
}
```

The actual TypeScript contract in the repository is authoritative.

Typical cost items may represent:

* PV modules
* batteries
* inverters
* charge controllers
* cables
* breakers
* fuses
* distribution equipment
* mounting components
* earthing materials
* connectors
* installation materials
* labor
* engineering services
* other explicitly supplied project items

The Costing module should not assume that every system contains every category.

---

# Quantity

Quantities should normally originate from upstream engineering calculations.

For example:

```text
PV sizing
    │
    └──► PV quantity
             │
             ▼
          Costing
```

or:

```text
Battery sizing
    │
    └──► battery quantity
             │
             ▼
          Costing
```

The Costing module should use the supplied quantity rather than recomputing engineering quantities.

---

# Unit Cost

Unit cost represents the supplied cost associated with one unit of the item.

Examples:

```text
₦/panel
₦/battery
₦/meter
₦/breaker
₦/hour
₦/installation
```

The module should treat unit cost as supplied economic data.

It must not assume that a unit price is current market pricing unless the application explicitly supplies and identifies a source for that price.

---

# Currency

Currency must be explicit where the costing contract requires it.

For example:

```text
NGN
USD
EUR
GBP
```

The Costing module should not silently convert between currencies.

If currency conversion is required, the conversion rate should be supplied explicitly by the calling system and represented as an assumption or input where appropriate.

---

# Cost Categories

Cost items may be grouped into categories.

A conceptual structure is:

```text
Project Cost
│
├── Equipment
│   ├── PV
│   ├── Battery
│   ├── Inverter
│   └── Protection
│
├── Electrical Materials
│   ├── Cable
│   ├── Connectors
│   └── Distribution
│
├── Installation
│
├── Engineering
│
└── Other
```

Category names should come from the actual costing contract rather than being hard-coded into engineering calculations unless the domain requires them.

---

# Bill of Materials Relationship

Costing is closely related to the Bill of Materials module.

The conceptual flow is:

```text
Engineering Modules
        │
        ▼
       BOM
        │
        ├── item
        ├── quantity
        └── unit
        │
        ▼
     Costing
        │
        ├── unit cost
        ├── item cost
        ├── subtotal
        └── total
```

The BOM identifies what is required.

Costing determines the monetary value of the supplied quantities.

Therefore:

> **BOM answers what and how much. Costing answers how much money.**

The Costing module should not duplicate BOM-generation logic.

---

# Calculation Lifecycle

The module follows the standard engineering calculation lifecycle:

```text
Input
  │
  ▼
Validate
  │
  ├── invalid ───────► CalculationResult(ERROR)
  │
  ▼
Assumptions
  │
  ▼
Calculate
  │
  ▼
Warnings
  │
  ▼
CalculationResult
```

Execution should use the shared `engineering-core` lifecycle.

The module should not create an independent result/execution framework.

---

# engineering-core Integration

The intended architecture uses:

```ts
import {
  defineCalculation,
  executeCalculation,
} from "@ogwusearch/engineering-core";
```

Conceptually:

```ts
export function runCosting(
  input: CostingInput,
): CalculationResult<CostingOutput> {
  const definition = defineCalculation<
    CostingInput,
    CostingOutput
  >({
    name: "Costing",

    validate(input) {
      return validateCostingInput(input);
    },

    assumptions(input) {
      return createCostingAssumptions(input);
    },

    warnings(input, output) {
      return createCostingWarnings(input, output);
    },

    calculate(input, context) {
      return calculateCosting(input, context);
    },
  });

  return executeCalculation(
    definition,
    input,
  );
}
```

The exact implementation must follow the current `engineering-core` API.

---

# Validation

Validation must occur before cost calculations.

Typical validation includes:

* item identifiers must be valid where required
* quantities must be finite
* quantities must not be negative
* unit costs must be finite
* unit costs must not be negative unless explicitly supported
* contingency rates must be valid where supplied
* additional costs must be valid where supplied
* currency must be valid where required
* required item fields must be present
* calculated costs must remain finite

The module should use the shared engineering validation and issue contracts.

Invalid inputs should produce calculation errors rather than silently correcting the data.

---

# Warnings

Warnings identify conditions that do not necessarily prevent calculation but deserve engineering or commercial review.

Examples include:

* unusually high unit cost
* unusually low unit cost
* missing optional pricing information
* incomplete cost coverage
* significant contingency
* estimated rather than supplied pricing
* mixed pricing sources
* missing currency metadata

A warning should not be used to hide invalid input.

---

# Assumptions

Costing assumptions must be explicit.

Possible assumptions include:

```text
currency
unit prices
pricing source
pricing date
contingency rate
installation allowance
labor allowance
tax treatment
transportation allowance
```

A generic default should not be represented as an actual supplier quotation.

For example:

```text
"unitCost = 250000"
```

does not establish that a supplier currently sells the item for ₦250,000.

The source and date should be captured when available.

---

# Traceability

Cost calculations should produce a deterministic trace.

A typical trace may contain:

```text
1. Cost Item
2. Extended Item Cost
3. Category Subtotal
4. Additional Costs
5. Contingency
6. Total Cost
```

Example:

```json
{
  "id": "cost-item",
  "name": "Item Cost",
  "description": "Calculate extended cost from quantity and unit cost.",
  "formula": "itemCost = quantity × unitCost",
  "inputs": {
    "quantity": 10,
    "unitCost": 2500
  },
  "outputs": {
    "itemCost": 25000
  },
  "unit": "NGN"
}
```

Trace steps should use the shared `CalculationTraceStep` contract.

The trace should make the cost calculation auditable.

---

# Precision

Cost calculations should preserve appropriate numerical precision internally.

For example:

```text
quantity × unitCost
```

should not be prematurely rounded merely for display.

If monetary precision requires a specific rounding policy, that policy must be explicit in the costing contract.

Display formatting belongs outside the core engineering calculation.

---

# Determinism

For identical validated inputs:

```text
same items
    +
same quantities
    +
same unit costs
    +
same assumptions
        │
        ▼
same costing result
```

The calculation must not depend on:

* current time
* random values
* network state
* database state
* browser state
* hidden global configuration

unless explicitly supplied through the calculation context.

---

# Currency and Market Data Boundary

The Costing module calculates costs from supplied pricing information.

It does **not** establish whether those prices are currently available in the market.

For market-aware applications:

```text
Market / Supplier Data
          │
          ▼
     Pricing Input
          │
          ▼
       Costing
```

This separation keeps the engineering calculation deterministic.

A future pricing service may provide:

* supplier
* product
* currency
* unit price
* effective date
* source
* availability

but those concerns should remain outside the core Costing calculation unless explicitly incorporated into the module contract.

---

# Result Contract

The public calculation result should use:

```ts
CalculationResult<CostingOutput>
```

from the engineering foundation.

The result contains:

```text
status
valid
value
errors
warnings
assumptions
trace
metadata
```

The Costing module should not return a custom result structure that duplicates this lifecycle.

---

# Error Handling

Calculation failures should use the shared engineering result infrastructure.

Expected states are:

```text
SUCCESS
WARNING
ERROR
```

Conceptually:

```ts
CalculationResult<CostingOutput>
```

Errors should use the shared engineering error/issue contracts.

The module must not omit required result properties such as:

```text
valid
status
errors
warnings
assumptions
trace
metadata
```

---

# Testing

The module should maintain tests for:

## Calculation

* single-item costing
* multiple-item costing
* quantity × unit-cost calculation
* category subtotals
* total cost
* additional costs where supported
* contingency where supported
* deterministic output
* precision behavior

## Validation

* missing required items
* invalid quantities
* negative quantities
* invalid unit costs
* negative unit costs
* invalid contingency values
* invalid currency data
* non-finite values

## Regression

Regression tests should protect established costing behavior and formulas.

Tests should validate engineering behavior rather than implementation details.

---

# Example

Given:

```text
PV modules
Quantity: 10
Unit cost: ₦250,000
```

The extended cost is:

```text
itemCost =
  10 × ₦250,000

itemCost =
  ₦2,500,000
```

If another item is:

```text
Cable
Quantity: 100 m
Unit cost: ₦1,500/m
```

Then:

```text
cableCost =
  100 × ₦1,500

cableCost =
  ₦150,000
```

The subtotal is:

```text
subtotal =
  ₦2,500,000
  + ₦150,000

subtotal =
  ₦2,650,000
```

Any additional costs or contingency must be explicitly supplied according to the module contract.

---

# Design Principles

The Costing module follows the Solar Engine engineering principles:

1. **Deterministic**
   Identical validated inputs produce identical results.

2. **Traceable**
   Cost calculations expose inputs, formulas, outputs, and sequence.

3. **Explicit pricing**
   Unit costs are supplied inputs rather than hidden market assumptions.

4. **Validated**
   Invalid quantities and costs are rejected before calculation.

5. **Assumptions are visible**
   Currency, contingency, pricing assumptions, and other defaults are explicit.

6. **No silent mutation**
   Input data is not modified.

7. **No silent rounding**
   Monetary rounding follows an explicit policy.

8. **No hidden currency conversion**
   Currency conversion must be explicitly supplied.

9. **Domain ownership**
   Cost aggregation belongs to the Costing module.

10. **Foundation reuse**
    Execution, results, issues, assumptions, and traces come from the engineering foundation.

11. **No application coupling**
    The module remains independent of UI, database, API, browser, and AI infrastructure.

---

# Public API

The public API should expose the intentional costing contract through:

```text
index.ts
```

Typical exports include:

```ts
runCosting
calculateCosting
validateCostingInput
createCostingAssumptions
```

along with the module's public input and output types.

Internal calculation helpers should remain internal unless they are intentionally part of the public API.

---

# Directory Structure

The intended module organization is:

```text
costing/
├── README.md
├── index.ts
├── run.ts
├── warnings.ts
├── types/
│   ├── index.ts
│   ├── input.ts
│   └── output.ts
├── validation/
│   ├── index.ts
│   ├── rules.ts
│   └── validate-costing.ts
├── assumptions/
│   ├── index.ts
│   └── costing-assumptions.ts
├── calculation/
│   ├── index.ts
│   ├── calculate-item-cost.ts
│   ├── calculate-subtotal.ts
│   ├── calculate-contingency.ts
│   └── calculate-total-cost.ts
├── trace/
│   ├── index.ts
│   └── costing-trace.ts
└── __tests__/
    ├── calculation.test.ts
    ├── validation.test.ts
    └── regression.test.ts
```

The existing repository structure remains authoritative. Files should only be introduced when they correspond to an actual module responsibility.

---

# Engineering Boundary

The Costing module answers:

> **What is the calculated cost of the supplied engineering quantities and pricing inputs?**

It does not answer:

> **What equipment should be selected, where should it be purchased, or what price should the market provide?**

Those decisions and data sources belong to the appropriate engineering, procurement, pricing, or application layers.
