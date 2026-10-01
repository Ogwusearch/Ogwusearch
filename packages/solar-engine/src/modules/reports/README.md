# Reports Module

The `reports` module produces structured engineering reports from validated solar-engine calculation results.

It is the reporting and aggregation boundary of `solar-engine`. It does **not** introduce new engineering formulas or silently modify calculation results. Its purpose is to collect, organize, summarize, and expose engineering outputs in a deterministic and traceable format suitable for downstream applications, documents, dashboards, exports, or human review.

---

## Purpose

The Reports module provides a consistent way to transform completed engineering calculations into structured report data.

It may aggregate results from modules such as:

* `load`
* `energy`
* `peak-demand`
* `pv-sizing`
* `pv-array`
* `pv-string`
* `battery`
* `inverter`
* `charge-controller`
* `cable`
* `voltage-drop`
* `protection`
* `earthing`
* `generator`
* `bom`
* `costing`
* `system-validation`

The module preserves the engineering meaning of those results while presenting them in a report-oriented structure.

---

## Architecture Position

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
        ┌───────────┴───────────┐
        │                       │
   Engineering Modules      reports
        │                       │
        └───────────┬───────────┘
                    ▼
          Structured Report Data
```

The Reports module belongs to the `solar-engine` domain layer.

It may depend on engineering foundation packages and solar-engine domain contracts, but foundation packages must never depend on `reports`.

---

## Responsibilities

The Reports module is responsible for:

* aggregating engineering calculation results
* organizing results into report sections
* preserving calculation status
* preserving errors and warnings
* preserving assumptions
* preserving calculation traces
* presenting engineering quantities with their units
* summarizing system-level results
* identifying incomplete or failed calculations
* producing deterministic report structures
* supporting downstream rendering and export layers

---

## Non-Responsibilities

The Reports module must not:

* perform independent engineering design calculations
* replace domain calculation modules
* silently alter calculation outputs
* silently convert units
* invent missing engineering values
* fetch live market data
* access databases
* access browser APIs
* render HTML
* render PDFs directly
* depend on React or other UI frameworks
* contain authentication or authorization logic
* contain API/server logic
* mutate source calculation results

Report formatting and document rendering should remain outside the engineering domain.

---

# Reporting Model

A report represents the result of one or more completed engineering calculations.

Conceptually:

```text
Engineering Inputs
       │
       ▼
Domain Calculations
       │
       ▼
CalculationResult
       │
       ├── status
       ├── valid
       ├── value
       ├── errors
       ├── warnings
       ├── assumptions
       ├── trace
       └── metadata
       │
       ▼
     Reports
       │
       ├── sections
       ├── summaries
       ├── engineering values
       ├── warnings
       ├── assumptions
       └── traceability
```

The report should preserve the distinction between:

* calculated values
* engineering assumptions
* warnings
* errors
* validation state
* explanatory metadata

---

# Report Sections

A system report may contain sections such as:

```text
System Summary
Load Analysis
Energy Analysis
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
Bill of Materials
Cost Estimate
System Validation
Assumptions
Warnings
Calculation Trace
```

Not every report must contain every section.

Sections should be included according to the available calculation results.

---

# Core Principle

Reports describe engineering results.

They do not become another calculation engine.

For example:

```text
peak-demand
    │
    └── calculates design demand

reports
    │
    └── reports the calculated design demand
```

The Reports module must not recalculate:

```text
Design Demand
```

from the original load data merely because it wants to display the value.

The authoritative result remains the output of the `peak-demand` module.

---

# Calculation Results

Reports should consume the shared `CalculationResult` contract from `engineering-types` / `engineering-core`.

Conceptually:

```ts
CalculationResult<T>
```

contains:

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

The Reports module should preserve this information rather than flattening it into unstructured strings.

---

# Report Status

A report may contain results with different calculation states.

For example:

```text
SUCCESS
WARNING
ERROR
```

A report must distinguish between:

### Successful calculation

```text
status: SUCCESS
valid: true
```

### Successful calculation with engineering warnings

```text
status: WARNING
valid: true
```

### Failed calculation

```text
status: ERROR
valid: false
```

A warning must not be represented as an error.

Likewise, an error must not be hidden merely because a report can still be generated.

---

# Validation

Report validation is concerned with report integrity rather than redesigning the underlying engineering calculations.

Examples include:

* required report metadata is present
* section identifiers are valid
* section results are structurally valid
* duplicate sections are handled deterministically
* calculation results are associated with the correct section
* invalid calculation results are not represented as successful results
* required report inputs are present

Domain-specific validation remains inside the corresponding engineering module.

For example:

```text
Battery validation
        │
        ▼
battery module

Voltage-drop validation
        │
        ▼
voltage-drop module

Report structure validation
        │
        ▼
reports module
```

---

# Warnings

Reports may expose warnings generated by underlying engineering modules.

Examples:

```text
LOW_PEAK_SUN_HOURS
INVERTER_UTILIZATION_HIGH
VOLTAGE_DROP_HIGH
PROTECTIVE_CURRENT_RATING_INSUFFICIENT
```

The Reports module should preserve warning codes and messages.

It should not reinterpret or suppress warnings without an explicit reporting policy.

---

# Assumptions

Engineering assumptions must remain distinguishable from calculated values.

For example:

```text
Calculated:
    Daily Energy = 18.4 kWh/day

Assumption:
    System Loss Factor = 0.85
```

The report should make this distinction explicit.

Assumptions may include:

* design margins
* efficiencies
* derating factors
* reference environmental conditions
* standard values
* default engineering parameters
* user-supplied assumptions

The source of an assumption should be preserved whenever available.

---

# Traceability

Engineering reports should remain traceable back to their source calculations.

A report section may reference:

```text
Calculation
    │
    ├── input
    ├── assumptions
    ├── formula
    ├── intermediate values
    └── output
```

Where available, the original calculation trace should be preserved.

This allows a downstream consumer to answer:

> Where did this reported value come from?

without requiring the Reports module to reproduce the calculation.

---

# Units

Reports must preserve engineering units.

Examples:

| Quantity    | Unit              |
| ----------- | ----------------- |
| Power       | W / kW            |
| Energy      | Wh / kWh          |
| Voltage     | V                 |
| Current     | A                 |
| Resistance  | Ω                 |
| Length      | m                 |
| Temperature | °C                |
| Percentage  | %                 |
| Cost        | Explicit currency |

Unit handling belongs to the engineering units foundation and domain calculations.

The Reports module must not silently change units.

If presentation requires a different display unit, the conversion should be explicit and deterministic.

---

# Cost Reporting

Cost information may be reported from the `costing` module.

For example:

```text
Bill of Materials
        │
        ▼
Costing
        │
        ├── item costs
        ├── subtotal
        ├── contingency
        └── total
        │
        ▼
Reports
```

The Reports module should report the authoritative costing result.

It should not independently recalculate:

```text
quantity × unit cost
```

or contingency values.

---

# Bill of Materials

The Reports module may present BOM information produced by the `bom` module.

The distinction remains:

```text
BOM
    = What equipment/materials are required?

Costing
    = What is the monetary value?

Reports
    = How are those results presented together?
```

---

# Engineering-Core Integration

The Reports module should follow the same execution architecture used by other migrated solar-engine modules.

Where the report operation itself requires calculation lifecycle behavior, it may use:

```ts
defineCalculation(...)
executeCalculation(...)
```

Conceptually:

```ts
const definition = defineCalculation<
  ReportInput,
  ReportOutput
>({
  name: "Solar Engineering Report",

  validate: validateReport,

  assumptions: createReportAssumptions,

  calculate: generateReport,
});

return executeCalculation(definition, input);
```

The exact implementation should follow the actual `engineering-core` contracts in the repository.

---

# Determinism

Given the same validated inputs and source calculation results, report generation should produce the same report structure.

Avoid:

* timestamps that change deterministic output unless explicitly requested
* random identifiers
* random section ordering
* hidden environment-dependent values
* live external data
* implicit locale-dependent formatting

If report metadata requires generation timestamps or identifiers, those should be explicit inputs or clearly defined metadata rather than hidden calculation state.

---

# Precision

Reports should preserve the precision of engineering results.

For example, the reporting layer should not change:

```text
4.666576648695213
```

into a different engineering value merely for presentation.

Display rounding may be applied by a presentation layer.

Engineering result:

```text
4.666576648695213 Ω
```

Display representation:

```text
4.667 Ω
```

These are different concerns.

The underlying engineering result should remain authoritative.

---

# Errors

Report generation may fail because of:

* invalid report input
* missing required calculation result
* malformed section data
* incompatible result structures
* invalid report configuration

Errors should use the shared engineering error/result contracts.

The module must not silently replace failed calculations with fabricated values.

For example:

```text
Battery calculation
        │
        ▼
ERROR
        │
        ▼
Report
        │
        └── Battery section = ERROR
```

not:

```text
Battery calculation
        │
        ▼
ERROR
        │
        ▼
Report
        │
        └── Battery section = 0
```

---

# Report Generation Lifecycle

A typical report lifecycle is:

```text
1. Receive report input
        │
        ▼
2. Validate report structure
        │
        ▼
3. Collect calculation results
        │
        ▼
4. Preserve statuses/errors/warnings
        │
        ▼
5. Assemble report sections
        │
        ▼
6. Attach assumptions
        │
        ▼
7. Attach traceability information
        │
        ▼
8. Produce structured report
```

The lifecycle must not introduce hidden engineering calculations.

---

# Example Conceptual Output

A report may conceptually contain:

```ts
{
  status: "SUCCESS",
  valid: true,

  sections: [
    {
      id: "peak-demand",
      title: "Peak Demand",
      status: "SUCCESS",
      result: {
        designPeakDemandW: 12500
      }
    },

    {
      id: "pv-sizing",
      title: "PV Sizing",
      status: "WARNING",
      result: {
        requiredPvPowerW: 15600
      }
    },

    {
      id: "battery",
      title: "Battery",
      status: "SUCCESS",
      result: {
        requiredCapacityAh: 420
      }
    }
  ],

  warnings: [],
  errors: [],
  assumptions: [],
  trace: {}
}
```

The actual TypeScript contract must follow the repository's established `engineering-types` and `engineering-core` contracts.

---

# Testing

The Reports module should include tests for:

### Calculation / generation

* report generation
* section aggregation
* section ordering
* successful results
* warning results
* error results
* empty or partial reports

### Validation

* required fields
* invalid section data
* missing calculation results
* incompatible result structures
* invalid report configuration

### Regression

Regression tests should protect:

* report structure
* section identifiers
* status propagation
* warning propagation
* error propagation
* assumptions
* traceability
* deterministic ordering

Tests must not change established engineering formulas simply to satisfy reporting expectations.

---

# Public API

The module's public API should expose only intentional report contracts.

A typical structure is:

```text
reports/
├── index.ts
├── run.ts
├── types/
├── validation/
├── assumptions/
├── calculation/
├── trace/
└── warnings.ts
```

`index.ts` should provide the public entry points without exposing unnecessary internal implementation details.

---

# Target Directory Structure

```text
reports/
├── README.md
├── index.ts
├── run.ts
├── warnings.ts
│
├── types/
│   ├── index.ts
│   ├── input.ts
│   └── output.ts
│
├── validation/
│   ├── index.ts
│   ├── rules.ts
│   └── validate-reports.ts
│
├── assumptions/
│   ├── index.ts
│   └── reports-assumptions.ts
│
├── calculation/
│   ├── index.ts
│   ├── collect-results.ts
│   ├── build-sections.ts
│   └── build-report.ts
│
├── trace/
│   ├── index.ts
│   └── reports-trace.ts
│
└── __tests__/
    ├── calculation.test.ts
    ├── validation.test.ts
    └── regression.test.ts
```

The exact structure should follow the actual repository state rather than creating duplicate files or replacing existing implementations.

---

# Design Principles

The Reports module follows these principles:

1. **Do not recalculate authoritative engineering results.**
2. **Preserve source calculation status.**
3. **Preserve warnings and errors.**
4. **Preserve assumptions.**
5. **Preserve traceability.**
6. **Keep engineering units explicit.**
7. **Keep report generation deterministic.**
8. **Do not silently mutate source results.**
9. **Keep presentation separate from engineering logic.**
10. **Keep UI, API, database, and rendering concerns outside the domain module.**
11. **Use `engineering-core` for shared calculation lifecycle behavior where applicable.**
12. **Treat domain modules as the authoritative source of engineering calculations.**

---

# Relationship to Other Modules

```text
load
  │
  ▼
energy
  │
  ▼
peak-demand
  │
  ├──► pv-sizing
  ├──► battery
  ├──► inverter
  ├──► charge-controller
  ├──► cable
  ├──► voltage-drop
  ├──► protection
  ├──► earthing
  └──► generator
          │
          ▼
         BOM
          │
          ▼
       costing
          │
          ▼
       reports
```

Reports is therefore a downstream aggregation boundary.

It should consume authoritative domain outputs rather than becoming a second implementation of the engineering model.

---

# Summary

The `reports` module provides the structured reporting layer for `solar-engine`.

Its core responsibility is:

```text
Engineering Results
        +
Assumptions
        +
Warnings
        +
Errors
        +
Traceability
        ↓
Structured Engineering Report
```

It does not replace the engineering modules that produce those results.

The module should remain:

* deterministic
* traceable
* unit-aware
* validated
* explicit
* domain-focused
* independent of presentation frameworks
* compatible with `engineering-core`
* faithful to authoritative engineering calculations
