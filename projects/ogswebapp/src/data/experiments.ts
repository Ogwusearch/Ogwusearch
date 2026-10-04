export interface Experiment {
  title: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  technologies: string[];
}

export const experiments: Experiment[] = [
  {
    title: "Electronics Experiments",
    slug: "electronics-experiments",
    description:
      "Practical exploration of circuits, components, power electronics, and electronic systems.",
    category: "Electronics",
    status: "Ongoing",
    technologies: [
      "Electronics",
      "Circuits",
      "Testing",
    ],
  },

  {
    title: "Engineering Calculations",
    slug: "engineering-calculations",
    description:
      "Exploration of engineering calculations, models, validation, and technical workflows.",
    category: "Engineering",
    status: "Ongoing",
    technologies: [
      "Engineering",
      "Mathematics",
      "TypeScript",
    ],
  },

  {
    title: "Circuit Simulation",
    slug: "circuit-simulation",
    description:
      "Experiments involving circuit models and simulation techniques.",
    category: "Simulation",
    status: "Development",
    technologies: [
      "Python",
      "Simulation",
      "Electronics",
    ],
  },

  {
    title: "Software Architecture",
    slug: "software-architecture",
    description:
      "Experiments with application architecture, reusable components, validation, and testing.",
    category: "Software",
    status: "Ongoing",
    technologies: [
      "TypeScript",
      "React",
      "Testing",
    ],
  },

  {
    title: "AI Experiments",
    slug: "ai-experiments",
    description:
      "Exploration of artificial intelligence and AI-assisted technical workflows.",
    category: "AI",
    status: "Experimental",
    technologies: [
      "AI",
      "Software",
      "Automation",
    ],
  },
];