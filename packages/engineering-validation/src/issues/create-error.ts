import type { EngineeringError } from "@ogwusearch/engineering-types";

export interface CreateErrorOptions {
  code: string;
  message: string;
  path?: string;
  metadata?: Record<string, unknown>;
}

export function createError(
  options: CreateErrorOptions,
): EngineeringError {
  return {
    code: options.code,
    message: options.message,
    severity: "ERROR",

    ...(options.path !== undefined && {
      path: options.path,
    }),

    ...(options.metadata !== undefined && {
      metadata: options.metadata,
    }),
  };
}