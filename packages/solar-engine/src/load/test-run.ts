import { runLoadAudit } from "./run";

const result = runLoadAudit({
  loads: [
    {
      appliance: "LED Bulb",
      quantity: 10,
      ratedPowerW: 10,
      hoursPerDay: 6,
      daysPerWeek: 7,
      powerFactor: 0.95
    },
    {
      appliance: "Refrigerator",
      quantity: 1,
      ratedPowerW: 150,
      hoursPerDay: 12,
      daysPerWeek: 7,
      powerFactor: 0.9
    },
    {
      appliance: "Television",
      quantity: 1,
      ratedPowerW: 100,
      hoursPerDay: 5,
      daysPerWeek: 7,
      powerFactor: 0.95
    }
  ],

  diversityFactor: 0.8,
  designMargin: 0.2
});

console.log(
  JSON.stringify(result, null, 2)
);