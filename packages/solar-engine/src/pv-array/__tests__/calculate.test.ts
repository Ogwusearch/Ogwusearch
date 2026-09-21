import { describe, expect, it } from "vitest";

import { calculatePvArray } from "../calculate";
import type { PvArrayInput } from "../types";

describe("calculatePvArray", () => {
  it("calculates total modules", () => {
    const input: PvArrayInput = {
      modulePowerW: 550,
      moduleVmpV: 41.5,
      moduleImpA: 13.25,
      moduleVocV: 49.5,
      moduleIscA: 14.1,
      modulesPerString: 10,
      parallelStrings: 4,
    };

    const result = calculatePvArray(input);

    expect(result.totalModules).toBe(40);
  });

  it("calculates series voltage", () => {
    const input: PvArrayInput = {
      modulePowerW: 550,
      moduleVmpV: 41.5,
      moduleImpA: 13.25,
      moduleVocV: 49.5,
      moduleIscA: 14.1,
      modulesPerString: 10,
      parallelStrings: 4,
    };

    const result = calculatePvArray(input);

    expect(result.arrayVmpV).toBe(415);
    expect(result.arrayVocV).toBe(495);
  });

  it("calculates parallel current", () => {
    const input: PvArrayInput = {
      modulePowerW: 550,
      moduleVmpV: 41.5,
      moduleImpA: 13.25,
      moduleVocV: 49.5,
      moduleIscA: 14.1,
      modulesPerString: 10,
      parallelStrings: 4,
    };

    const result = calculatePvArray(input);

    expect(result.arrayImpA).toBe(53);
    expect(result.arrayIscA).toBe(56.4);
  });

  it("calculates total array power", () => {
    const input: PvArrayInput = {
      modulePowerW: 550,
      moduleVmpV: 41.5,
      moduleImpA: 13.25,
      moduleVocV: 49.5,
      moduleIscA: 14.1,
      modulesPerString: 10,
      parallelStrings: 4,
    };

    const result = calculatePvArray(input);

    expect(result.arrayPowerW).toBe(22000);
  });

  it("returns the configured array topology", () => {
    const input: PvArrayInput = {
      modulePowerW: 450,
      moduleVmpV: 41,
      moduleImpA: 10.98,
      moduleVocV: 49,
      moduleIscA: 11.5,
      modulesPerString: 8,
      parallelStrings: 3,
    };

    const result = calculatePvArray(input);

    expect(result.modulesPerString).toBe(8);
    expect(result.parallelStrings).toBe(3);
    expect(result.totalModules).toBe(24);
  });

  it("calculates a single-module single-string array", () => {
    const input: PvArrayInput = {
      modulePowerW: 550,
      moduleVmpV: 41.5,
      moduleImpA: 13.25,
      moduleVocV: 49.5,
      moduleIscA: 14.1,
      modulesPerString: 1,
      parallelStrings: 1,
    };

    const result = calculatePvArray(input);

    expect(result).toEqual({
      totalModules: 1,
      modulesPerString: 1,
      parallelStrings: 1,
      arrayVmpV: 41.5,
      arrayImpA: 13.25,
      arrayVocV: 49.5,
      arrayIscA: 14.1,
      arrayPowerW: 550,
    });
  });

  it("calculates multiple series strings correctly", () => {
    const input: PvArrayInput = {
      modulePowerW: 600,
      moduleVmpV: 42,
      moduleImpA: 14.29,
      moduleVocV: 50,
      moduleIscA: 15,
      modulesPerString: 12,
      parallelStrings: 6,
    };

    const result = calculatePvArray(input);

    expect(result.totalModules).toBe(72);
    expect(result.arrayVmpV).toBe(504);
    expect(result.arrayVocV).toBe(600);
    expect(result.arrayImpA).toBeCloseTo(85.74, 10);
    expect(result.arrayIscA).toBe(90);
    expect(result.arrayPowerW).toBe(43200);
  });

  it("does not mutate the input", () => {
    const input: PvArrayInput = {
      modulePowerW: 550,
      moduleVmpV: 41.5,
      moduleImpA: 13.25,
      moduleVocV: 49.5,
      moduleIscA: 14.1,
      modulesPerString: 10,
      parallelStrings: 4,
    };

    const original = { ...input };

    calculatePvArray(input);

    expect(input).toEqual(original);
  });

  it("is deterministic for identical inputs", () => {
    const input: PvArrayInput = {
      modulePowerW: 550,
      moduleVmpV: 41.5,
      moduleImpA: 13.25,
      moduleVocV: 49.5,
      moduleIscA: 14.1,
      modulesPerString: 10,
      parallelStrings: 4,
    };

    const first = calculatePvArray(input);
    const second = calculatePvArray(input);

    expect(second).toEqual(first);
  });
});