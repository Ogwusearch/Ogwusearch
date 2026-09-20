export interface LoadItemInput {
  appliance: string;
  quantity: number;
  ratedPowerW: number;
  hoursPerDay: number;
  daysPerWeek?: number;
  powerFactor?: number;
}

export interface LoadAuditInput {
  loads: LoadItemInput[];
  diversityFactor: number;
  designMargin: number;
}