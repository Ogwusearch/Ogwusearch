export function calculateContingency(
  subtotal: number,
  contingencyRate = 0,
): number {
  return subtotal * contingencyRate;
}
