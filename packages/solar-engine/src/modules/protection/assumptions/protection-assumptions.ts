import type { EngineeringAssumption } from "@ogwusearch/engineering-types";
import type { ProtectionInput } from "../types/index.js";

/**
 * Creates the explicit engineering assumptions consumed by
 * the Protection calculation.
 *
 * No hidden protection factors, ratings, or defaults are introduced.
 */
export function createProtectionAssumptions(
  input: ProtectionInput,
): EngineeringAssumption[] {
  const assumptions: EngineeringAssumption[] = [
    {
      code: "PROTECTION_TYPE",
      name: "Protection Type",
      value: input.protection.type,
      description: `Protection type is explicitly ${input.protection.type}.`,
    },
  ];

  if (input.electrical.designCurrentA === undefined) {
    if (input.design?.explicitProtectionFactor !== undefined) {
      assumptions.push({
        code: "PROTECTION_DESIGN_FACTOR",
        name: "Protection Design Factor",
        value: input.design.explicitProtectionFactor,
        description:
          "Design current uses the explicitly supplied protection factor.",
      });
    } else {
      const designMargin = input.design?.designMargin ?? 0;

      assumptions.push({
        code: "PROTECTION_DESIGN_MARGIN",
        name: "Protection Design Margin",
        value: designMargin,
        description:
          "Design current uses the explicitly supplied design margin.",
      });
    }
  }

  if (input.device?.availableCurrentRatingsA !== undefined) {
    assumptions.push({
      code: "PROTECTION_DEVICE_RATING_BASIS",
      name: "Protection Device Rating Basis",
      value: input.device.availableCurrentRatingsA,
      description:
        "Device selection uses the explicitly supplied nominal current-rating set.",
    });
  }

  if (input.device?.voltageRatingV !== undefined) {
    assumptions.push({
      code: "PROTECTION_VOLTAGE_RATING_BASIS",
      name: "Protection Voltage Rating Basis",
      value: input.device.voltageRatingV,
      unit: "V",
      description:
        "Voltage compatibility is checked against the explicitly supplied device voltage rating.",
    });
  }

  if (input.device?.interruptingRatingA !== undefined) {
    assumptions.push({
      code: "PROTECTION_INTERRUPTING_RATING",
      name: "Protection Interrupting Rating",
      value: input.device.interruptingRatingA,
      unit: "A",
      description:
        "Interrupting capacity is checked against the explicitly supplied device interrupting rating.",
    });
  }

  return assumptions;
}