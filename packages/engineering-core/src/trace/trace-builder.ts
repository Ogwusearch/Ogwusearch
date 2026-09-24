import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

export class TraceBuilder {
  private readonly steps: CalculationTraceStep[] = [];

  add(step: CalculationTraceStep): void {
    this.steps.push(step);
  }

  getSteps(): readonly CalculationTraceStep[] {
    return this.steps;
  }
}
