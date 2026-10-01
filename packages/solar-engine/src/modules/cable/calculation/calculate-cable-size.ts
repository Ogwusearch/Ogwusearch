import type {
  CableInput,
  CableOutput,
} from "../types/index.js";

export function calculateCableSize(
  input: CableInput,
  operatingCurrentA: number,
): Pick<
  CableOutput,
  | "designCurrentA"
  | "requiredAmpacityA"
  | "selectedConductorAreaMm2"
  | "selectedConductorAmpacityA"
> {
  const designCurrentA =
    operatingCurrentA *
    (1 + input.designMargin);

  const requiredAmpacityA =
    designCurrentA;

  const sortedOptions =
    [...input.conductorOptions].sort(
      (a, b) => {
        if (a.areaMm2 !== b.areaMm2) {
          return (
            a.areaMm2 -
            b.areaMm2
          );
        }

        return (
          a.allowableAmpacityA -
          b.allowableAmpacityA
        );
      },
    );

  const selectedOption =
    sortedOptions.find(
      (option) =>
        option.allowableAmpacityA >=
        requiredAmpacityA,
    );

  if (
    selectedOption ===
    undefined
  ) {
    throw new Error(
      `No conductor option satisfies the required ampacity of ${requiredAmpacityA} A.`,
    );
  }

  return {
    designCurrentA,
    requiredAmpacityA,
    selectedConductorAreaMm2:
      selectedOption.areaMm2,
    selectedConductorAmpacityA:
      selectedOption.allowableAmpacityA,
  };
}