
import type {
  PeakDemandCalculationTrace,
  PeakDemandInput,
  PeakDemandValue,
} from "./types";

const WATTS_PER_KILOWATT = 1000;
const DEFAULT_DEMAND_FACTOR = 1;

export function calculatePeakDemand(
  input: PeakDemandInput,
): PeakDemandValue {
  let totalConnectedLoadW = 0;
  let peakDemandW = 0;

  const loads = input.loads.map((load) => {
    const connectedLoadW =
      load.quantity * load.powerW;

    const demandFactor =
      load.demandFactor ?? DEFAULT_DEMAND_FACTOR;

    const demandLoadW =
      connectedLoadW * demandFactor;

    totalConnectedLoadW += connectedLoadW;
    peakDemandW += demandLoadW;

    return {
      name: load.name,
      quantity: load.quantity,
      powerW: load.powerW,
      demandFactor,
      connectedLoadW,
      demandLoadW,
    };
  });

  return {
    connectedLoadW: totalConnectedLoadW,

    connectedLoadKW:
      totalConnectedLoadW / WATTS_PER_KILOWATT,

    peakDemandW,

    peakDemandKW:
      peakDemandW / WATTS_PER_KILOWATT,

    loads,
  };
}

export function createCalculationTrace(
  input: PeakDemandInput,
  value: PeakDemandValue,
): PeakDemandCalculationTrace {
  return {
    formulas: {
      connectedLoadW:
        "quantity × powerW",

      demandLoadW:
        "quantity × powerW × demandFactor",

      connectedLoadKW:
        "connectedLoadW ÷ 1000",

      peakDemandKW:
        "peakDemandW ÷ 1000",
    },

    assumptions: input.loads
      .map((load, index) => {
        if (load.demandFactor === undefined) {
          return (
            `loads[${index}].demandFactor: ` +
            "No demand factor supplied; " +
            "demandFactor = 1 was assumed."
          );
        }

        return null;
      })
      .filter(
        (assumption): assumption is string =>
          assumption !== null,
      ),

    calculations: value.loads.map((load) => ({
      load: load.name,
      quantity: load.quantity,
      powerW: load.powerW,
      demandFactor: load.demandFactor,
      connectedLoadW: load.connectedLoadW,
      demandLoadW: load.demandLoadW,
    })),
  };
}