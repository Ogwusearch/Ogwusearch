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
    status: "In development",
    technologies: ["React", "TypeScript", "Vite"],
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
      "A circuit-analysis and simulation project for modelling electrical networks and exploring their behaviour.",
    category: "Electronics",
    status: "In development",
    technologies: ["Python", "Circuit Analysis", "Numerical Simulation"],
    featured: true,
    overview:
      "A software project exploring the modelling and analysis of electronic circuits and their electrical behaviour.",
    built:
      "A developing simulation environment for modelling circuits and evaluating electrical behaviour.",
  },
  {
    name: "MineCore",
    slug: "minecore",
    description:
      "A multi-tenant mining operations platform designed to support mining organizations, sites, and operational workflows.",
    category: "Business Software",
    status: "In development",
    technologies: ["Python", "PostgreSQL", "React"],
    featured: true,
    overview:
      "MineCore is being developed as a multi-tenant platform for mining organizations managing one or more sites and mineral operations.",
    built:
      "Development is focused on the multi-tenant foundation and the operational workflows needed by mining organizations managing multiple sites.",
  },
  {
    name: "Engineering Core",
    slug: "engineering-core",
    description:
      "A reusable TypeScript foundation for validated engineering calculations and structured, traceable results.",
    category: "Engineering Infrastructure",
    status: "In development",
    technologies: ["TypeScript", "Validation", "Automated Testing"],
    featured: true,
    overview:
      "Shared infrastructure for engineering types, units, validation, calculations, and structured results.",
    built:
      "Shared packages for engineering types, units, validation, calculation contracts, and structured results.",
  },
  {
    name: "PostgreSQL Project Manager",
    slug: "postgres-project-manager",
    description:
      "A multi-tenant PostgreSQL management platform for administering projects, database instances, migrations, backups, and access.",
    category: "Database Platform",
    status: "In development",
    technologies: ["TypeScript", "React", "PostgreSQL", "Node.js"],
    featured: true,
    overview:
      "An independent platform for managing PostgreSQL projects and database environments.",
    built:
      "An authenticated management application with tenant-scoped projects, database instances, role-based access, and operational management workflows.",
    architecture:
      "A separate repository and application architecture, independent of the Ogwusearch engineering monorepo.",
  },
  {
    name: "4pol PCB Fab",
    slug: "4pol-pcb-fab",
    description:
      "Development of a modular desktop PCB manufacturing machine family for local electronics prototyping and production.",
    category: "Hardware & Manufacturing",
    status: "In development",
    technologies: ["KiCad", "Electronics", "Mechanical Design", "CNC"],
    featured: true,
    overview:
      "A hardware engineering project exploring a family of machines for PCB fabrication and electronics manufacturing.",
    built:
      "A modular machine-development programme covering PCB milling, via processing, paste dispensing, pick-and-place, reflow, and testing.",
    engineeringDetails:
      "The project separates manufacturing functions into dedicated machines, with engineering documentation, design decisions, and development plans.",
  },
];
