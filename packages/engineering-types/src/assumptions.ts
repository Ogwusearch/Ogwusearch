export interface Assumption {
  id: string;
  name: string;
  value: string | number | boolean;
  unit?: string;
  reason?: string;
  source?: string;
}

export interface EngineeringConstant {
  name: string;
  value: string | number;
  unit?: string;
  source?: string;
}