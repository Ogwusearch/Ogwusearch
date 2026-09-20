# Engineering Standards

## 1. Deterministic Calculations

Engineering calculations must be deterministic.

The same validated input must produce the same result.

## 2. Units

Every engineering quantity must have an explicit unit.

Examples:

- W
- kW
- Wh
- kWh
- V
- A
- Ah
- mm²
- Ω
- m

## 3. Separation

UI code must not contain core engineering formulas.

Engineering calculations belong in the calculation engine.

## 4. Validation

Inputs must be validated before calculations.

Results must be validated before presentation.

## 5. Traceability

Important results should be traceable to:

- Input
- Assumption
- Formula
- Calculation
- Result
- Validation

## 6. Testing

Every important engineering calculation requires known test cases.

## 7. Documentation

Engineering formulas and assumptions must be documented.

## 8. AI

AI may explain, orchestrate and interact with engineering tools.

AI must not silently replace deterministic engineering calculations.
