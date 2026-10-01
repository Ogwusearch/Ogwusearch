import type { EngineeringIssue } from "@ogwusearch/engineering-types";

import {
  GENERATOR_CONSTANTS,
} from "../constants.js";
import type { GeneratorInput } from "../types/index.js";

function issue(
  code: string,
  message: string,
  path: string,
  actual: unknown,
  expected?: unknown,
): EngineeringIssue {
  return {
    code,
    severity: "ERROR",
    message,
    path,
    actual,
    ...(expected === undefined ? {} : { expected }),
  };
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function validateRequiredPower(
  input: GeneratorInput,
): EngineeringIssue[] {
  const value = input.requirement.requiredPowerW;

  if (!isFiniteNumber(value) || value <= GENERATOR_CONSTANTS.MIN_CAPACITY_VA) {
    return [
      issue(
        "INVALID_REQUIRED_POWER",
        "Required generator power must be a finite positive number.",
        "requirement.requiredPowerW",
        value,
        "> 0",
      ),
    ];
  }

  return [];
}

export function validateRequiredApparentPower(
  input: GeneratorInput,
): EngineeringIssue[] {
  const value = input.requirement.requiredApparentPowerVA;

  if (value === undefined) {
    return [];
  }

  if (!isFiniteNumber(value) || value <= 0) {
    return [
      issue(
        "INVALID_REQUIRED_APPARENT_POWER",
        "Required apparent power must be a finite positive number.",
        "requirement.requiredApparentPowerVA",
        value,
        "> 0",
      ),
    ];
  }

  return [];
}

export function validateStartingDemand(
  input: GeneratorInput,
): EngineeringIssue[] {
  const value = input.requirement.startingDemandW;

  if (value === undefined) {
    return [];
  }

  if (!isFiniteNumber(value) || value <= 0) {
    return [
      issue(
        "INVALID_STARTING_DEMAND",
        "Starting demand must be a finite positive number when supplied.",
        "requirement.startingDemandW",
        value,
        "> 0",
      ),
    ];
  }

  return [];
}

export function validateGeneratorCapacity(
  input: GeneratorInput,
): EngineeringIssue[] {
  const value = input.generator?.capacityVA;

  if (value === undefined) {
    return [];
  }

  if (!isFiniteNumber(value) || value <= 0) {
    return [
      issue(
        "INVALID_GENERATOR_CAPACITY",
        "Generator capacity must be a finite positive number.",
        "generator.capacityVA",
        value,
        "> 0",
      ),
    ];
  }

  return [];
}

export function validatePowerFactor(
  input: GeneratorInput,
): EngineeringIssue[] {
  const value = input.design?.powerFactor;

  if (value === undefined) {
    return [];
  }

  if (
    !isFiniteNumber(value) ||
    value <= GENERATOR_CONSTANTS.MIN_POWER_FACTOR ||
    value > GENERATOR_CONSTANTS.MAX_POWER_FACTOR
  ) {
    return [
      issue(
        "INVALID_GENERATOR_POWER_FACTOR",
        "Generator power factor must be greater than 0 and less than or equal to 1.",
        "design.powerFactor",
        value,
        "(0, 1]",
      ),
    ];
  }

  return [];
}

export function validateDesignMargin(
  input: GeneratorInput,
): EngineeringIssue[] {
  const value = input.design?.designMargin;

  if (value === undefined) {
    return [];
  }

  if (
    !isFiniteNumber(value) ||
    value < GENERATOR_CONSTANTS.MIN_DESIGN_MARGIN ||
    value > GENERATOR_CONSTANTS.MAX_DESIGN_MARGIN
  ) {
    return [
      issue(
        "INVALID_GENERATOR_DESIGN_MARGIN",
        "Generator design margin must be between 0 and 1.",
        "design.designMargin",
        value,
        "[0, 1]",
      ),
    ];
  }

  return [];
}

export function validateGeneratorVoltage(
  input: GeneratorInput,
): EngineeringIssue[] {
  const value = input.generator?.voltageV;

  if (value === undefined) {
    return [];
  }

  if (!isFiniteNumber(value) || value <= 0) {
    return [
      issue(
        "INVALID_GENERATOR_VOLTAGE",
        "Generator voltage must be a finite positive number.",
        "generator.voltageV",
        value,
        "> 0",
      ),
    ];
  }

  return [];
}

export function validateGeneratorFrequency(
  input: GeneratorInput,
): EngineeringIssue[] {
  const value = input.generator?.frequencyHz;

  if (value === undefined) {
    return [];
  }

  if (!isFiniteNumber(value) || value <= 0) {
    return [
      issue(
        "INVALID_GENERATOR_FREQUENCY",
        "Generator frequency must be a finite positive number.",
        "generator.frequencyHz",
        value,
        "> 0",
      ),
    ];
  }

  return [];
}

export function validateGeneratorPhase(
  input: GeneratorInput,
): EngineeringIssue[] {
  const value = input.generator?.phase;

  if (value === undefined) {
    return [];
  }

  if (value !== 1 && value !== 3) {
    return [
      issue(
        "INVALID_GENERATOR_PHASE",
        "Generator phase must be either 1 or 3.",
        "generator.phase",
        value,
        "1 | 3",
      ),
    ];
  }

  return [];
}

export function validateRequiredVoltage(
  input: GeneratorInput,
): EngineeringIssue[] {
  const value = input.electrical?.requiredVoltageV;

  if (value === undefined) {
    return [];
  }

  if (!isFiniteNumber(value) || value <= 0) {
    return [
      issue(
        "INVALID_REQUIRED_GENERATOR_VOLTAGE",
        "Required generator voltage must be a finite positive number.",
        "electrical.requiredVoltageV",
        value,
        "> 0",
      ),
    ];
  }

  return [];
}

export function validateRequiredFrequency(
  input: GeneratorInput,
): EngineeringIssue[] {
  const value = input.electrical?.requiredFrequencyHz;

  if (value === undefined) {
    return [];
  }

  if (!isFiniteNumber(value) || value <= 0) {
    return [
      issue(
        "INVALID_REQUIRED_GENERATOR_FREQUENCY",
        "Required generator frequency must be a finite positive number.",
        "electrical.requiredFrequencyHz",
        value,
        "> 0",
      ),
    ];
  }

  return [];
}

export function validateRequiredPhase(
  input: GeneratorInput,
): EngineeringIssue[] {
  const value = input.electrical?.requiredPhase;

  if (value === undefined) {
    return [];
  }

  if (value !== 1 && value !== 3) {
    return [
      issue(
        "INVALID_REQUIRED_GENERATOR_PHASE",
        "Required generator phase must be either 1 or 3.",
        "electrical.requiredPhase",
        value,
        "1 | 3",
      ),
    ];
  }

  return [];
}