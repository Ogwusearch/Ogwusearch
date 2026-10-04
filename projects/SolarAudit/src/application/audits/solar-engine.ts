import {
  runLoadAudit,
  runEnergyAnalysis,
  runPeakDemand,
} from "@ogwusearch/solar-engine";

import type {
  EnergyInput,
  EnergyOutput,
  LoadAuditInput,
  LoadAuditOutput,
  PeakDemandInput,
  PeakDemandOutput,
} from "@ogwusearch/solar-engine";

import type { CalculationResult } from "@ogwusearch/engineering-types";

export interface SolarAuditEngine {
  runLoadAudit(
    input: LoadAuditInput,
  ): CalculationResult<LoadAuditOutput>;

  runEnergyAnalysis(
    input: EnergyInput,
  ): CalculationResult<EnergyOutput>;

  runPeakDemand(
    input: PeakDemandInput,
  ): CalculationResult<PeakDemandOutput>;
}

export const solarAuditEngine: SolarAuditEngine = {
  runLoadAudit,
  runEnergyAnalysis,
  runPeakDemand,
};
