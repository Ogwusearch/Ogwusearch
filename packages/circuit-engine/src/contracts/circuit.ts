export type CircuitComponentKind =
  | "resistor"
  | "capacitor"
  | "inductor"
  | "diode"
  | "bjt"
  | "mosfet"
  | "op-amp"
  | "transformer"
  | "voltage-source"
  | "current-source"
  | "switch";

export interface CircuitNode {
  readonly id: string;
  readonly name?: string;
  readonly isReference?: boolean;
}

export type CircuitParameterValue = number | string | boolean;

export interface CircuitComponent {
  readonly id: string;
  readonly kind: CircuitComponentKind;
  /**
   * Maps terminal names to node IDs.
   * Terminal conventions are defined by each component model.
   */
  readonly terminals: Readonly<Record<string, string>>;
  /**
   * Model parameters are explicit input data, not solver-derived values.
   */
  readonly parameters: Readonly<Record<string, CircuitParameterValue>>;
}

export interface CircuitDefinition {
  readonly id: string;
  readonly name?: string;
  readonly nodes: readonly CircuitNode[];
  readonly components: readonly CircuitComponent[];
}
