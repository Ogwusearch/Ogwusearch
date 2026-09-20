import type {
  Assumption,
  EngineeringConstant
} from "./assumptions";

export interface FormulaTrace {
  id: string;
  name: string;
  expression: string;
  result?: number | string;
  unit?: string;
}

export interface CalculationStep {
  order: number;
  description: string;
}

export interface IntermediateValue {
  name: string;
  value: number | string;
  unit?: string;
  description?: string;
}

export interface CalculationTrace {
  formulas: FormulaTrace[];
  assumptions: Assumption[];
  intermediateValues: IntermediateValue[];
  constants: EngineeringConstant[];
  steps: CalculationStep[];
}
