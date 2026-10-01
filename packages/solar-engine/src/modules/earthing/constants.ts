/**
 * Earthing calculation constants.
 *
 * These values are intentionally conservative defaults for the
 * software calculation layer only. They are not a substitute
 * for project-specific code, standard, soil, fault-current,
 * installation, or authority requirements.
 */

/**
 * Default design margin applied when no explicit margin is supplied.
 */
export const DEFAULT_EARTHING_DESIGN_MARGIN = 0;

/**
 * Default bonding-conductor multiplier relative to the
 * calculated earth-conductor area.
 *
 * Kept at 1.0 so no hidden reduction is introduced.
 */
export const DEFAULT_BONDING_CONDUCTOR_FACTOR = 1;

/**
 * Default earth-resistance target.
 *
 * This is only a software default. Projects should explicitly
 * provide the applicable design target.
 */
export const DEFAULT_EARTH_RESISTANCE_TARGET_OHM = 10;