 /**
  * Stable identifier used by engineering entities,
  * calculations, traces, reports, projects, and other
  * domain objects.
  *
  * The type intentionally does not prescribe a specific
  * identifier implementation such as UUID or ULID.
  */
export type EngineeringId = string;

/**
 * Creates a type-safe identifier from a string.
 *
 * Validation or generation of identifiers belongs to the
 * application/infrastructure layer.
 */
export function asEngineeringId(value: string): EngineeringId {
  if (value.trim().length === 0) {
    throw new Error("Engineering identifier cannot be empty.");
  }

  return value;
}