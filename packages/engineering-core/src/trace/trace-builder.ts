import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

export class TraceBuilder {
  private readonly steps: CalculationTraceStep[] = [];

  add(step: CalculationTraceStep): void {
    this.steps.push({
      ...step,
      sequence:
        step.sequence ??
        this.steps.length + 1,
    });
  }

  getSteps(): readonly CalculationTraceStep[] {
    return [...this.steps];
  }

  toTrace(): {
    steps: CalculationTraceStep[];
  } {
    return {
      steps: [...this.steps],
    };
  }
}
