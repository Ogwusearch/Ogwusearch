import type {
  LoadCategory,
  LoadPhase,
} from "@ogwusearch/load-engine";

import type { SolarAuditLoad } from "../../domain/load.js";
import type { LoadRepository } from "../../persistence/index.js";

export interface AddLoadInput {
  readonly id: string;
  readonly projectId: string;

  readonly name: string;
  readonly category: LoadCategory;

  readonly quantity: number;
  readonly ratedPowerW: number;
  readonly powerFactor: number;

  readonly efficiency?: number;

  readonly operatingHoursPerDay: number;
  readonly operatingDaysPerMonth: number;

  readonly demandFactor?: number;

  readonly phase: LoadPhase;

  readonly description?: string;
}

export interface AddLoadDependencies {
  readonly loads: LoadRepository;
}

export async function addLoad(
  input: AddLoadInput,
  dependencies: AddLoadDependencies,
): Promise<SolarAuditLoad> {
  const load: SolarAuditLoad = {
    id: input.id,
    projectId: input.projectId,

    name: input.name,
    category: input.category,

    quantity: input.quantity,
    ratedPowerW: input.ratedPowerW,
    powerFactor: input.powerFactor,

    ...(input.efficiency !== undefined
      ? { efficiency: input.efficiency }
      : {}),

    operatingHoursPerDay:
      input.operatingHoursPerDay,

    operatingDaysPerMonth:
      input.operatingDaysPerMonth,

    ...(input.demandFactor !== undefined
      ? { demandFactor: input.demandFactor }
      : {}),

    phase: input.phase,

    ...(input.description !== undefined
      ? { description: input.description }
      : {}),
  };

  return dependencies.loads.create(load);
}
