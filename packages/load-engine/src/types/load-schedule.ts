// types/load-schedule.ts
export interface LoadSchedule {
  loadId: string;
  startHour: number;
  durationHours: number;
  dutyCycle?: number;
}