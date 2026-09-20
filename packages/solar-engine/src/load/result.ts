export interface LoadItemResult {
  appliance: string;
  quantity: number;

  ratedPowerW: number;
  totalPowerW: number;

  hoursPerDay: number;

  dailyEnergyWh: number;
  dailyEnergyKWh: number;

  weeklyEnergyWh: number;
  weeklyEnergyKWh: number;

  powerFactor?: number;
  apparentPowerVA?: number;
}

export interface LoadAuditResult {
  loads: LoadItemResult[];

  totalConnectedLoadW: number;
  totalConnectedLoadKW: number;

  diversifiedLoadW: number;
  diversifiedLoadKW: number;

  designLoadW: number;
  designLoadKW: number;

  totalDailyEnergyWh: number;
  totalDailyEnergyKWh: number;

  totalWeeklyEnergyWh: number;
  totalWeeklyEnergyKWh: number;

  diversityFactor: number;
  designMargin: number;
}