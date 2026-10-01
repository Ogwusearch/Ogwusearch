import type {
  CalculationTraceStep,
} from "@ogwusearch/engineering-types";

import type {
  ChargeControllerSizingInput,
  ChargeControllerSizingValue,
} from "../types/index.js";

import {
  createChargeControllerTrace,
} from "./charge-controller-trace.js";

/**
 * Trace interface required by engineering-core.
 *
 * The core execution context exposes a TraceContext with an
 * add() method. Keeping this small interface here prevents the
 * domain module from depending on the concrete TraceContext
 * implementation.
 */
export interface ChargeControllerTraceSink {
  add(
    step: CalculationTraceStep,
  ): void;
}

/**
 * Adapts the existing domain-level charge-controller trace
 * into engineering-core CalculationTraceStep objects.
 *
 * This function does not perform any engineering calculation.
 * It only transfers the already-calculated trace information
 * into the core trace context.
 */
export function appendChargeControllerTrace(
  trace: ChargeControllerTraceSink,
  input: ChargeControllerSizingInput,
  value: ChargeControllerSizingValue,
): void {
  const domainTrace =
    createChargeControllerTrace(
      input,
      value,
    );

  for (
    const [index, step] of
      domainTrace.entries()
  ) {
    trace.add({
      id: createTraceStepId(
        step.name,
      ),
      name: createTraceStepName(
        step.name,
      ),
      description:
        step.description,
      ...(isRecord(step.input) && {
        inputs: step.input,
      }),
      ...(isRecord(step.output) && {
        outputs: step.output,
      }),
      sequence: index + 1,
    });
  }
}

/**
 * Converts the existing domain trace name into
 * a stable machine-readable trace identifier.
 */
function createTraceStepId(
  name: string,
): string {
  return `charge-controller-${name}`;
}

/**
 * Converts the existing domain trace name into
 * a human-readable trace name.
 */
function createTraceStepName(
  name: string,
): string {
  return name
    .split("-")
    .map(
      (part) =>
        part.charAt(0).toUpperCase() +
        part.slice(1),
    )
    .join(" ");
}

/**
 * Narrows unknown trace input/output values to the
 * record structure expected by CalculationTraceStep.
 */
function isRecord(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}