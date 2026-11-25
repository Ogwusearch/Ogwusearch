export interface EngineeringArea {
  title: string;
  description: string;
  disciplines: string[];
}

export const engineeringAreas: EngineeringArea[] = [
  {
    title: "Energy Systems",
    description:
      "Solar power systems, load assessment, energy analysis, battery storage, power conversion, and electrical system design.",
    disciplines: [
      "Solar energy",
      "Battery systems",
      "Power systems",
      "Electrical design",
    ],
  },
  {
    title: "Electronics & Embedded Systems",
    description:
      "Circuit design, electronic components, power electronics, embedded hardware, measurement, and practical troubleshooting.",
    disciplines: [
      "Circuit design",
      "Power electronics",
      "Embedded systems",
      "Testing and measurement",
    ],
  },
  {
    title: "Engineering Software",
    description:
      "Structured engineering applications, calculation engines, simulation, validation, and technical analysis tools.",
    disciplines: [
      "Engineering calculations",
      "Simulation",
      "Software architecture",
      "Validation and testing",
    ],
  },
  {
    title: "Manufacturing & Prototyping",
    description:
      "Exploration of practical manufacturing workflows, PCB fabrication equipment, prototyping, and engineering documentation.",
    disciplines: [
      "PCB fabrication",
      "Machine development",
      "Prototyping",
      "Technical documentation",
    ],
  },
];
