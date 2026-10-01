export function calculateTotalCost(
  subtotal: number,
  additionalCosts = 0,
  contingency = 0,
): number {
  return subtotal + additionalCosts + contingency;
}
