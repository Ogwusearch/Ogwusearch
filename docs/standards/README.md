# Engineering Standards

These standards govern the design, implementation, validation, testing, error handling, reproducibility, precision, and documentation of engineering systems within Ogwusearch Engineering.

---

## 1. Deterministic Calculations

Engineering calculations must be deterministic.

The same validated input, assumptions, configuration, and calculation version must produce the same result.

Calculation logic must not depend on:

* UI state
* Randomness
* Uncontrolled external state
* AI-generated reasoning
* Non-deterministic execution

Deterministic calculation logic belongs in the engineering engine.

---

## 2. Explicit Engineering Error Handling

Engineering systems must use explicit and structured error handling.

Errors must never be silently ignored or converted into plausible-looking engineering results.

Engineering errors should identify:

```text
Error Code
 ↓
Error Type
 ↓
Affected Input
 ↓
Problem
 ↓
Expected Condition
 ↓
Recommended Action
```

Common engineering error categories include:

```text
INVALID_INPUT
MISSING_INPUT
INVALID_UNIT
UNIT_MISMATCH
OUT_OF_RANGE
INVALID_CONFIGURATION
INSUFFICIENT_DATA
UNSUPPORTED_CONDITION
CALCULATION_ERROR
VALIDATION_ERROR
```

Where practical, errors should contain structured information such as:

```text
{
  code,
  message,
  field,
  value,
  unit,
  expected,
  context
}
```

### Error Handling Rules

1. Never silently continue after a critical engineering error.
2. Never return a trusted result from invalid input.
3. Never hide calculation failures behind a success response.
4. Preserve the original error context.
5. Distinguish input errors from calculation errors.
6. Distinguish validation errors from unsupported engineering conditions.
7. Use stable error codes for APIs, tests, reports, and future MCP integrations.
8. Provide actionable error messages where practical.
9. Errors must be deterministic for the same invalid input and system state.

---

## 3. Units

Every engineering quantity must have an explicit unit.

Examples:

* W
* kW
* Wh
* kWh
* V
* A
* Ah
* mm²
* Ω
* m

Unit conversions must be explicit and validated.

Unit mismatches must produce an explicit engineering error rather than an implicit conversion or silent failure.

---

## 4. Reproducibility

Engineering calculations must be reproducible.

A calculation should be capable of being independently reproduced from its recorded inputs and calculation context.

A reproducible result should preserve, where applicable:

```text
Input
 ↓
Units
 ↓
Assumptions
 ↓
Constants
 ↓
Formula
 ↓
Calculation Method
 ↓
Calculation Version
 ↓
Result
 ↓
Validation
```

Reproducibility requirements include:

* Record all material inputs.
* Record engineering assumptions that affect the result.
* Record relevant constants and configuration.
* Use explicit units.
* Use a defined calculation method.
* Avoid hidden or undocumented inputs.
* Preserve sufficient information to rerun the calculation.
* Version calculation logic when changes can affect results.

The same recorded calculation context should produce the same result under the same supported calculation version.

---

## 5. Precision and Numerical Integrity

Engineering calculations must use appropriate numerical precision.

Precision must be sufficient for the engineering purpose of the calculation and must not be reduced merely for presentation.

### Precision Rules

1. Preserve adequate precision during intermediate calculations.
2. Avoid premature rounding.
3. Round only at defined calculation or presentation boundaries.
4. Define the required precision for important engineering outputs.
5. Use appropriate numerical representations for the calculation.
6. Apply tolerances explicitly when comparing floating-point results.
7. Do not treat display rounding as calculation precision.
8. Document precision and rounding assumptions where they materially affect results.

For example:

```text
Internal Calculation
        ↓
Full Required Precision
        ↓
Validation
        ↓
Defined Rounding Rule
        ↓
Displayed Result
```

Where engineering calculations require tolerances, the tolerance must be explicit and appropriate to the calculation.

```text
Expected Result
      ±
Tolerance
      ↓
PASS / FAIL
```

Precision requirements must not create false accuracy. The system should not present more significant figures than the underlying data or engineering method justifies.

---

## 6. Separation

UI code must not contain core engineering formulas.

Engineering calculations belong in the calculation engine.

The intended separation is:

```text
UI
 ↓
Application Layer
 ↓
Engineering Engine
 ↓
Validation
```

Engineering engines should remain reusable by:

* Web applications
* Desktop applications
* APIs
* Tests
* Reports
* MCP tools
* Future engineering systems

---

## 7. Validation

Inputs must be validated before calculations.

Results must be validated before presentation.

```text
Input
 ↓
Validation
 ↓
Calculation
 ↓
Result Validation
 ↓
Presentation
```

Invalid engineering inputs must not silently produce trusted results.

Validation should detect, where applicable:

* Missing values
* Invalid values
* Negative values where not permitted
* Zero values where not permitted
* Values outside engineering limits
* Invalid units
* Unit mismatches
* Impossible combinations of inputs
* Invalid component configurations
* Missing required assumptions

---

## 8. Traceability

Important engineering results should be traceable through the complete calculation path:

```text
Input
 ↓
Assumption
 ↓
Formula
 ↓
Calculation
 ↓
Result
 ↓
Validation
```

Engineering errors should also be traceable to the input, calculation, or validation stage that produced them.

An engineer should be able to determine:

* What was entered
* What assumptions were used
* What formula was applied
* How the result was calculated
* What result was produced
* Whether the result passed validation
* Why a calculation failed, when applicable

---

## 9. Testing

Every important engineering calculation requires known test cases.

Engineering test cases should define:

```text
Known Input
Expected Result
Actual Result
Tolerance
PASS / FAIL
```

Testing must include, where applicable:

```text
Valid Input
Invalid Input
Boundary Input
Missing Input
Invalid Unit
Unit Mismatch
Out-of-Range Input
Invalid Configuration
Precision / Rounding Cases
Error Handling Cases
Reproducibility Cases
```

Important calculations should also have regression tests to ensure that future changes do not unintentionally alter established engineering behavior.

---

## 10. Documentation

Engineering formulas and assumptions must be documented.

Documentation should make clear:

* What is being calculated
* Which formula is used
* What each variable represents
* Which units are required
* Which assumptions apply
* Which constants are used
* What precision is required
* What rounding rules apply
* What limitations exist
* What errors can occur
* How errors should be interpreted
* How the result should be interpreted

---

## 11. AI

AI may:

* Explain engineering results
* Orchestrate engineering tools
* Interact with engineering systems
* Ask for missing information
* Summarize validated results
* Explain engineering errors
* Assist with documentation

AI must not silently replace deterministic engineering calculations.

AI must not override engineering validation or suppress engineering errors.

The engineering engine remains the source of truth for:

* Calculations
* Validation
* Units
* Engineering errors
* Precision rules
* Reproducible results

```text
User
 ↓
AI
 ↓
Engineering Tools
 ↓
Deterministic Engineering Engine
 ↓
Validation
 ↓
Validated Result / Engineering Error
 ↓
AI Explanation
```

---

## Core Principle

> **Engineering systems must be deterministic, unit-aware, explicitly error-handled, reproducible, numerically precise, validated, traceable, testable, and documented. AI assists the engineering process but does not replace the engineering calculation engine.**
