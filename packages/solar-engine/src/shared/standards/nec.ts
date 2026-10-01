/**
 * NFPA 70 / NEC references commonly used by solar PV system engineering.
 *
 * This module contains article references only.
 * It does not reproduce NEC requirements.
 *
 * Jurisdictional adoption must be handled separately from
 * this engineering reference layer.
 */

export interface NecArticleReference {
  readonly code: string;
  readonly title: string;
  readonly edition: "2026";
  readonly scope: string;
}

export const NEC_STANDARD = Object.freeze({
  code: "NFPA 70",
  title: "National Electrical Code (NEC)",
  edition: "2026",
} as const);

export const NEC_ARTICLES = Object.freeze({
  PHOTOVOLTAIC_SYSTEMS: {
    code: "Article 690",
    title: "Solar Photovoltaic (PV) Systems",
    edition: "2026",
    scope:
      "Electrical requirements associated with solar photovoltaic systems.",
  },

  INTERCONNECTED_ELECTRIC_POWER_PRODUCTION: {
    code: "Article 705",
    title: "Interconnected Electric Power Production Sources",
    edition: "2026",
    scope:
      "Requirements associated with interconnected electric power production sources.",
  },

  ENERGY_STORAGE: {
    code: "Article 706",
    title: "Energy Storage Systems",
    edition: "2026",
    scope:
      "Requirements associated with electrical energy storage systems.",
  },
} as const satisfies Record<string, NecArticleReference>);

export type NecArticleCode =
  (typeof NEC_ARTICLES)[keyof typeof NEC_ARTICLES]["code"];

export const NEC_PRIMARY_SOLAR_ARTICLES = [
  NEC_ARTICLES.PHOTOVOLTAIC_SYSTEMS.code,
  NEC_ARTICLES.INTERCONNECTED_ELECTRIC_POWER_PRODUCTION.code,
  NEC_ARTICLES.ENERGY_STORAGE.code,
] as const;