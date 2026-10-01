export interface CostItem {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly quantity: number;
  readonly unitCost: number;
  readonly unit?: string;
}

export interface CostingInput {
  readonly items: readonly CostItem[];
  readonly currency: string;
  readonly additionalCosts?: number;
  readonly contingencyRate?: number;
}
