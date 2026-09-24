import type {
  EngineeringAssumption,
} from "@ogwusearch/engineering-types";

export function addAssumption(
  assumptions: EngineeringAssumption[],
  assumption: EngineeringAssumption,
): void {
  assumptions.push(assumption);
}
