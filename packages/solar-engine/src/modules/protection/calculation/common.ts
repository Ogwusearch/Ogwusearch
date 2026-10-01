import type {
  ProtectionInput,
  ProtectionOutput,
} from "../types/index.js";

/**
 * Calculates the design current used by the protection calculation.
 *
 * Priority:
 * 1. Explicit design current.
 * 2. Operating current × explicit protection factor.
 * 3. Operating current × (1 + explicit design margin).
 *
 * No implicit protection factor is introduced.
 */
export function calculateDesignCurrent(
  input: ProtectionInput,
): number {
  if (input.electrical.designCurrentA !== undefined) {
    return input.electrical.designCurrentA;
  }

  if (
    input.design?.explicitProtectionFactor !== undefined
  ) {
    return (
      input.electrical.operatingCurrentA *
      input.design.explicitProtectionFactor
    );
  }

  const designMargin =
    input.design?.designMargin ?? 0;

  return (
    input.electrical.operatingCurrentA *
    (1 + designMargin)
  );
}

/**
 * Selects the smallest available protective-device
 * current rating that satisfies the required
 * protective current.
 *
 * The supplied rating set is treated as an explicit
 * engineering input. No commercial catalogue or
 * hidden rating set is used.
 */
export function selectProtectiveCurrent(
  requiredProtectiveCurrentA: number,
  availableCurrentRatingsA?: readonly number[],
): number | undefined {
  if (availableCurrentRatingsA === undefined) {
    return undefined;
  }

  const compatibleRatings = availableCurrentRatingsA
    .filter(
      (rating) =>
        Number.isFinite(rating) &&
        rating >= requiredProtectiveCurrentA,
    )
    .sort((a, b) => a - b);

  return compatibleRatings[0];
}

/**
 * Builds the common protection calculation output.
 *
 * Device-current selection priority:
 * 1. Explicitly selected device current rating.
 * 2. Smallest compatible rating from the supplied
 *    available-current-rating set.
 *
 * Explicit device ratings are not replaced or silently
 * corrected by the available rating set. They are checked
 * against the calculated engineering requirement.
 */
export function buildProtectionOutput(
  input: ProtectionInput,
  designCurrentA: number,
  requiredVoltageRatingV: number,
): ProtectionOutput {
  const requiredProtectiveCurrentA =
    designCurrentA;

  const selectedProtectiveCurrentA =
    input.device?.currentRatingA ??
    selectProtectiveCurrent(
      requiredProtectiveCurrentA,
      input.device?.availableCurrentRatingsA,
    );

  const selectedDeviceVoltageRatingV =
    input.device?.voltageRatingV;

  const interruptingRatingRequirementA =
    input.electrical.shortCircuitCurrentA;

  const selectedDeviceInterruptingRatingA =
    input.device?.interruptingRatingA;

  const currentCompatible =
    selectedProtectiveCurrentA === undefined
      ? undefined
      : selectedProtectiveCurrentA >=
        requiredProtectiveCurrentA;

  const voltageCompatible =
    selectedDeviceVoltageRatingV === undefined
      ? undefined
      : selectedDeviceVoltageRatingV >=
        requiredVoltageRatingV;

  const interruptingCompatible =
    selectedDeviceInterruptingRatingA ===
      undefined ||
    interruptingRatingRequirementA ===
      undefined
      ? undefined
      : selectedDeviceInterruptingRatingA >=
        interruptingRatingRequirementA;

  return {
    protectionType: input.protection.type,
    electricalMode: input.protection.mode,

    operatingCurrentA:
      input.electrical.operatingCurrentA,

    designCurrentA,

    requiredProtectiveCurrentA,

    ...(selectedProtectiveCurrentA !==
      undefined && {
      selectedProtectiveCurrentA,
    }),

    requiredVoltageRatingV,

    ...(selectedDeviceVoltageRatingV !==
      undefined && {
      selectedDeviceVoltageRatingV,
    }),

    ...(interruptingRatingRequirementA !==
      undefined && {
      interruptingRatingRequirementA,
    }),

    ...(selectedDeviceInterruptingRatingA !==
      undefined && {
      selectedDeviceInterruptingRatingA,
    }),

    compatibility: {
      ...(currentCompatible !== undefined && {
        currentCompatible,
      }),

      ...(voltageCompatible !== undefined && {
        voltageCompatible,
      }),

      ...(interruptingCompatible !== undefined && {
        interruptingCompatible,
      }),
    },
  };
}