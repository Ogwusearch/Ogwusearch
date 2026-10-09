export interface EngineeringToolInput {
  readonly value: number;
  readonly unit: string;
}

export interface EngineeringToolResult {
  readonly ok: boolean;
  readonly value: number | null;
  readonly unit: string;
  readonly message: string;
}

export interface EngineeringTool {
  readonly name: string;
  readonly description: string;

  execute(
    input: EngineeringToolInput,
  ): EngineeringToolResult;
}
