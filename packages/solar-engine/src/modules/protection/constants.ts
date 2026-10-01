/**
 * Standard nominal protective-current ratings.
 *
 * This list is not automatically applied by the Protection
 * calculation. It may be explicitly supplied as the available
 * device-rating set through `availableCurrentRatingsA`.
 */
export const DEFAULT_PROTECTIVE_CURRENT_RATINGS_A = [
  16,
  20,
  25,
  32,
  40,
  50,
  63,
  80,
  100,
] as const;

/**
 * Default protection design margin.
 *
 * A value of zero means no additional margin is applied when
 * neither an explicit design current nor protection factor nor
 * design margin is supplied.
 */
export const DEFAULT_DESIGN_MARGIN = 0;