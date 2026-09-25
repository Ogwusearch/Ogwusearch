export const PEAK_DEMAND_DEFAULTS = {
  demandFactor: 1,
  diversityFactor: 1,
  surgeFactor: 1,
  demandMargin: 0,
} satisfies {
  demandFactor: number;
  diversityFactor: number;
  surgeFactor: number;
  demandMargin: number;
};

export const WATTS_PER_KILOWATT = 1000;
