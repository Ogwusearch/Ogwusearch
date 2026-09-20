import { convert, quantity } from "./quantity";

export function convertValue(
  value: number,
  from: string,
  to: string,
): number {
  return convert(
    quantity(value, from),
    to,
  ).value;
}

export function kWhToWh(value: number): number {
  return convertValue(value, "kWh", "Wh");
}

export function WhToKWh(value: number): number {
  return convertValue(value, "Wh", "kWh");
}

export function kWToW(value: number): number {
  return convertValue(value, "kW", "W");
}

export function WToKW(value: number): number {
  return convertValue(value, "W", "kW");
}

export function AhToCoulomb(value: number): number {
  return convertValue(value, "Ah", "C");
}

export function CoulombToAh(value: number): number {
  return convertValue(value, "C", "Ah");
}