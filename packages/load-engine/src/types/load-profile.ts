// types/load-profile.ts
export interface LoadProfilePoint {
  hour: number;
  powerW: number;
}

export interface LoadProfile {
  intervalHours: number;
  points: readonly LoadProfilePoint[];
  peakPowerW: number;
  peakHour: number;
  totalEnergyWh: number;
}