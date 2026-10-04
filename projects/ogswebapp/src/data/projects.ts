export interface Project {
  name: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  technologies: string[];

  featured: boolean;

  image?: string;
  repository?: string;
  demo?: string;
  detail?: string;

  overview?: string;
  problem?: string;
  built?: string;
  architecture?: string;
  screenshots?: string[];
  engineeringDetails?: string;
}

export const projects: Project[] = [
  {
    name: "SolarAudit",
    slug: "solaraudit",
    description:
      "Solar engineering software for system auditing, analysis, and design workflows.",
    category: "Engineering Software",
    status: "Active",

    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "SQLite",
    ],

    featured: true,

    overview:
      "Solar engineering software for system auditing, analysis, and design workflows.",

    built:
      "A software application focused on solar system auditing, analysis, and engineering design workflows.",

    engineeringDetails:
      "The project includes engineering workflows for load auditing, solar sizing, battery sizing, and related system calculations.",
  },

  {
    name: "Circuit Simulator",
    slug: "circuit-simulator",
    description:
      "An electronics and circuit simulation project for exploring circuit behavior and engineering concepts.",
    category: "Electronics",
    status: "Active",

    technologies: [
      "Python",
      "Electronics",
      "Simulation",
    ],

    featured: true,

    overview:
      "An electronics and circuit simulation project for exploring circuit behavior and engineering concepts.",

    built:
      "A circuit simulation environment for experimenting with electronic circuits and simulation models.",
  },

  {
    name: "MineCore",
    slug: "minecore",
    description:
      "Mining operations software focused on structured operational and data workflows.",
    category: "Business Software",
    status: "Development",

    technologies: [
      "Python",
      "PostgreSQL",
      "React",
    ],

    featured: true,

    overview:
      "Mining operations software focused on structured operational and data workflows.",

    built:
      "A mining software project focused on structured operational and data workflows.",
  },

  {
    name: "Engineering Core",
    slug: "engineering-core",
    description:
      "Reusable engineering calculation, validation, and result-processing infrastructure.",
    category: "Engineering Infrastructure",
    status: "Development",

    technologies: [
      "TypeScript",
      "Engineering",
      "Testing",
    ],

    featured: true,

    overview:
      "Reusable engineering calculation, validation, and result-processing infrastructure.",

    built:
      "Reusable infrastructure for engineering calculations, validation, metadata, and structured calculation results.",
  },
];