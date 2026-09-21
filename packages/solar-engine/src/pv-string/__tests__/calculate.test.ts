import { describe, expect, it } from "vitest";

import { calculatePvString } from "../calculate";
import type { PvStringInput } from "../types";

describe("calculatePvString", () => {
  const validInput: PvStringInput = {
    modulePowerW: 550,
    moduleVmpV: 41.5,
    moduleImpA: 13.25,
    moduleVocV: 49.5,
    moduleIscA: 14.0,
    modulesPerString: 10,
  };

  it("calculates string Vmp", () => {
    const result = calculatePvString(validInput);

    expect(result.stringVmpV).toBe(415);
  });

  it("keeps string current equal to module current", () => {
    const result = calculatePvString(validInput);

    expect(result.stringImpA).toBe(13.25);
    expect(result.stringIscA).toBe(14.0);
  });

  it("calculates string Voc", () => {
    const result = calculatePvString(validInput);

    expect(result.stringVocV).toBe(495);
  });

  it("calculates string power", () => {
    const result = calculatePvString(validInput);

    expect(result.stringPowerW).toBe(5500);
  });

  it("preserves modules per string", () => {
    const result = calculatePvString(validInput);

    expect(result.modulesPerString).toBe(10);
  });

  it("handles a single-module string", () => {
    const input: PvStringInput = {
      ...validInput,
      modulesPerString: 1,
    };

    const result = calculatePvString(input);

    expect(result.modulesPerString).toBe(1);
    expect(result.stringVmpV).toBe(41.5);
    expect(result.stringVocV).toBe(49.5);
    expect(result.stringPowerW).toBe(550);
  });

  it("does not mutate the input", () => {
    const input = { ...validInput };
    const original = { ...input };

    calculatePvString(input);

    expect(input).toEqual(original);
  });

  it("produces deterministic results", () => {
    const first = calculatePvString(validInput);
    const second = calculatePvString(validInput);

    expect(first).toEqual(second);
  });
});