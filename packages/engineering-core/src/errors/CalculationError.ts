export class CalculationError extends Error {
  readonly code: string;

  constructor(
    code: string,
    message: string,
  ) {
    super(message);

    this.name = "CalculationError";
    this.code = code;
  }
}
