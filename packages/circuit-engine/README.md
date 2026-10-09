# @ogwusearch/circuit-engine

**Circuit topology, structural validation, and linear DC circuit analysis for the Ogwusearch Engineering platform.**

`@ogwusearch/circuit-engine` is a domain-specific engineering package for representing electrical circuits, validating circuit definitions, and solving supported linear DC circuits.

It belongs to the Ogwusearch Engineering ecosystem and builds on the shared engineering foundation while keeping circuit-specific contracts and analysis logic within the circuit domain.

## 1. Current Capabilities

The package currently provides:

* Circuit topology contracts and component definitions.
* Circuit node and terminal connectivity validation.
* Duplicate identifier and unsupported component detection.
* Linear DC operating-point analysis using modified nodal analysis (MNA).
* Gaussian elimination with partial pivoting for solving the resulting linear system.
* Support for resistors and independent ideal DC voltage and current sources.
* Calculated node voltages and branch voltage, current, and power.
* Explicit errors for invalid circuit definitions, invalid parameters, unsupported components, and singular systems.
* Public TypeScript exports for downstream applications and engineering packages.

## 2. Package Architecture

The package separates circuit-domain concerns from shared engineering infrastructure.

```text
@ogwusearch/circuit-engine
├── contracts/
│   └── circuit.ts
├── validation/
│   └── validate-circuit.ts
├── analysis/
│   └── linear-dc-solver.ts
├── __tests__/
│   ├── circuit.test.ts
│   └── linear-dc-solver.test.ts
└── index.ts
```

### Architecture responsibilities

| Area         | Responsibility                                                                           |
| ------------ | ---------------------------------------------------------------------------------------- |
| `contracts`  | Defines circuit nodes, components, parameters, and circuit definitions.                  |
| `validation` | Checks circuit structure and connectivity before analysis.                               |
| `analysis`   | Implements numerical analysis for supported linear DC circuits.                          |
| `__tests__`  | Verifies structural validation, numerical results, sign conventions, and error handling. |
| `index.ts`   | Defines the public package API.                                                          |

Circuit-specific behavior remains inside this package. Shared validation and engineering infrastructure should be reused rather than duplicated.

## 3. Circuit Contracts

### Circuit component kinds

The circuit contract currently recognizes these component kinds:

* `resistor`
* `capacitor`
* `inductor`
* `diode`
* `bjt`
* `mosfet`
* `op-amp`
* `transformer`
* `voltage-source`
* `current-source`
* `switch`

**Important:** A component kind being recognized by the contract does not mean the DC solver can simulate it. The current solver supports only resistors and independent ideal DC sources.

### Core types

```typescript
export interface CircuitNode {
  readonly id: string;
  readonly name?: string;
  readonly isReference?: boolean;
}

export type CircuitParameterValue =
  | number
  | string
  | boolean;

export interface CircuitComponent {
  readonly id: string;
  readonly kind: CircuitComponentKind;
  readonly terminals: Readonly<Record<string, string>>;
  readonly parameters: Readonly<
    Record<string, CircuitParameterValue>
  >;
}

export interface CircuitDefinition {
  readonly id: string;
  readonly name?: string;
  readonly nodes: readonly CircuitNode[];
  readonly components: readonly CircuitComponent[];
}
```

These contracts provide a structured representation of a circuit without tying the circuit definition to a particular user interface, database, or simulation application.

## 4. Structural Validation

Use `validateCircuit()` to validate a circuit definition before performing analysis.

```typescript
import {
  validateCircuit,
} from "@ogwusearch/circuit-engine";

const result = validateCircuit(circuit);

if (!result.valid) {
  console.error(result.errors);
}
```

Structural validation checks such as component identifiers, duplicate IDs, supported component kinds, terminal definitions, and referenced nodes help identify malformed circuits.

Structural validation and numerical analysis serve different purposes:

* **Structural validation** checks whether the circuit definition is well formed.
* **Numerical analysis** checks whether the supported electrical model can be solved and calculates its operating point.

A structurally valid circuit may still be unsupported by the linear DC solver or produce a singular system.

## 5. Linear DC Analysis

The public solver is:

```typescript
solveLinearDcCircuit(circuit)
```

It calculates the DC operating point of supported circuits using modified nodal analysis and a linear-system solver.

### Supported components

| Component      | Parameter        | Requirements                 |
| -------------- | ---------------- | ---------------------------- |
| Resistor       | `resistanceOhms` | Finite and greater than zero |
| Voltage source | `voltageVolts`   | Finite numeric value         |
| Current source | `currentAmps`    | Finite numeric value         |

The solver requires exactly one reference node.

### Example: 12 V resistor divider

```typescript
import {
  solveLinearDcCircuit,
} from "@ogwusearch/circuit-engine";

import type {
  CircuitDefinition,
} from "@ogwusearch/circuit-engine";

const circuit: CircuitDefinition = {
  id: "voltage-divider",
  name: "12 V Resistor Divider",

  nodes: [
    { id: "ground", isReference: true },
    { id: "input" },
    { id: "midpoint" },
  ],

  components: [
    {
      id: "v1",
      kind: "voltage-source",
      terminals: {
        positive: "input",
        negative: "ground",
      },
      parameters: {
        voltageVolts: 12,
      },
    },
    {
      id: "r1",
      kind: "resistor",
      terminals: {
        positive: "input",
        negative: "midpoint",
      },
      parameters: {
        resistanceOhms: 1000,
      },
    },
    {
      id: "r2",
      kind: "resistor",
      terminals: {
        positive: "midpoint",
        negative: "ground",
      },
      parameters: {
        resistanceOhms: 1000,
      },
    },
  ],
};

const result = solveLinearDcCircuit(circuit);

if (!result.success) {
  console.error(result.errors);
} else {
  console.log(
    "Midpoint voltage:",
    result.analysis.nodeVoltages.midpoint,
    "V",
  );

  console.log(
    "R1 current:",
    result.analysis.branchResults.r1?.currentAmps,
    "A",
  );

  console.log(
    "R2 power:",
    result.analysis.branchResults.r2?.powerWatts,
    "W",
  );
}
```

Expected results, within normal floating-point numerical tolerance:

| Quantity           | Expected value |
| ------------------ | -------------: |
| Input node voltage |           12 V |
| Midpoint voltage   |            6 V |
| R1 current         |        0.006 A |
| R2 current         |        0.006 A |
| R1 power           |        0.036 W |
| R2 power           |        0.036 W |
| Ideal source power |       -0.072 W |

The source power is negative because the source supplies power while the resistors absorb it.

## 6. Result Contract

A successful solver result contains an `analysis` object.

```typescript
interface CircuitBranchResult {
  readonly voltageVolts: number;
  readonly currentAmps: number;
  readonly powerWatts: number;
}

interface LinearDcAnalysis {
  readonly referenceNodeId: string;
  readonly nodeVoltages: Readonly<
    Record<string, number>
  >;
  readonly branchResults: Readonly<
    Record<string, CircuitBranchResult>
  >;
}
```

The public result is a discriminated union:

* When `success` is `true`, the result contains `analysis` and an empty `errors` array.
* When `success` is `false`, the result contains an `errors` array explaining why analysis failed.

Node voltages are keyed by node ID. Branch results are keyed by component ID.

## 7. Electrical Sign Conventions

Consistent sign conventions are essential for interpreting solver results correctly.

### Voltage sources

The specified voltage follows:

$$
V_{positive}-V_{negative}=V_s
$$

A negative `voltageVolts` value reverses the effective source polarity.

### Current sources

Positive current flows from the component's `positive` terminal to its `negative` terminal.

### Branch voltage and current

Branch voltage is calculated as:

$$
V_{branch}=V_{positive}-V_{negative}
$$

Branch current follows the same positive-to-negative reference direction.

For a resistor:

$$
I_{branch}=\frac{V_{branch}}{R}
$$

### Power

Branch power is calculated as:

$$
P_{branch}=V_{branch}I_{branch}
$$

Under this passive sign convention:

* Positive power indicates absorbed power.
* Negative power indicates supplied power.

These conventions allow the results to be checked against Kirchhoff's Current Law, Kirchhoff's Voltage Law, and conservation of power.

## 8. Error Handling

The linear DC solver exposes these error codes:

| Code                          | Meaning                                                                                                 |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| `INVALID_CIRCUIT`             | The circuit definition failed structural validation.                                                    |
| `REFERENCE_NODE_COUNT`        | The circuit does not have exactly one reference node.                                                   |
| `UNSUPPORTED_COMPONENT`       | A component is not supported by the current solver.                                                     |
| `INVALID_COMPONENT_PARAMETER` | A required parameter is missing, non-numeric, non-finite, or outside the supported range.               |
| `SINGULAR_SYSTEM`             | The resulting linear system cannot be solved because it is singular or numerically treated as singular. |

Example:

```typescript
const result = solveLinearDcCircuit(circuit);

if (!result.success) {
  for (const error of result.errors) {
    console.error(error.code);
    console.error(error.message);

    if (error.path) {
      console.error("Location:", error.path);
    }
  }
}
```

Callers should use error codes for programmatic handling and messages for diagnostic information.

## 9. Numerical Method

The current implementation uses modified nodal analysis (MNA) to formulate the supported circuit equations.

The resulting linear system is solved using Gaussian elimination with partial pivoting.

This implementation is intended for supported linear DC circuits. Numerical conditioning, extreme component-value ratios, and floating-point limitations can affect results. A singular-system check is not a substitute for comprehensive numerical conditioning analysis.

Applications should not assume the solver is validated for every possible circuit topology or numerical scale.

## 10. Current Limitations

The following features are not currently implemented by the linear DC solver:

* Nonlinear operating-point analysis for diodes and transistors.
* MOSFET, BJT, and operational amplifier models.
* Capacitor and inductor transient behavior.
* AC frequency-domain analysis.
* Transient simulation and time-domain integration.
* Switching simulation.
* Temperature-dependent electrical models.
* Parasitic component modeling.
* Automated component selection or circuit optimization.
* Physical design-rule and safety-compliance verification.

These are potential future capabilities, not current solver guarantees.

## 11. Engineering Foundation Integration

The package is designed to work with shared Ogwusearch Engineering infrastructure, including:

* `@ogwusearch/engineering-types`
* `@ogwusearch/engineering-units`
* `@ogwusearch/engineering-validation`
* `@ogwusearch/engineering-core`

Circuit topology, supported electrical models, and numerical analysis remain circuit-domain responsibilities.

The package should remain reusable by command-line tools, APIs, engineering applications, and other domain engines without requiring a particular frontend or persistence technology.

## 12. Development

Run the following commands from the monorepo root.

### Run circuit-engine tests

```bash
pnpm exec vitest run packages/circuit-engine/src/__tests__
```

### Typecheck

```bash
pnpm --dir packages/circuit-engine typecheck
```

### Build

```bash
pnpm --dir packages/circuit-engine build
```

### Check patch formatting

```bash
git diff --check
```

The test suite covers circuit validation, supported DC operating points, source polarity, signed branch currents, Kirchhoff's laws, power balance, invalid parameters, unsupported components, reference-node constraints, and singular systems.

## 13. Design Principles

Development of `@ogwusearch/circuit-engine` follows these principles:

1. **Explicit contracts:** Circuit structure and parameters must be represented clearly.
2. **Deterministic analysis:** Identical supported inputs should produce consistent results within floating-point limitations.
3. **Explicit failures:** Unsupported or unsolvable circuits should return errors rather than fabricated results.
4. **Traceable calculations:** Results should be understandable through documented equations, sign conventions, and numerical assumptions.
5. **Separation of concerns:** Circuit-domain logic should remain separate from applications and infrastructure.
6. **Incremental implementation:** New component models and analysis modes should be introduced only with appropriate tests.
7. **Verification before expansion:** Existing functionality should remain tested as the package evolves.

## License

MIT. See the repository's applicable license file and package publishing configuration.
