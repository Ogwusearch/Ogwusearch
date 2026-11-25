# Ogwusearch Portfolio

The official portfolio website for **Ogwusearch**, showcasing software engineering, AI systems, electronics, and engineering projects.

## Overview

This project is the public-facing portfolio and project showcase for Ogwusearch.

It presents:

- Engineering and software development projects
- AI and intelligent systems experiments
- Technical capabilities and technologies
- Project descriptions and implementation work
- Professional profile and contact information

## Technology Stack

- React
- TypeScript
- Vite
- React Router
- CSS
- pnpm

## Project Location

This application lives inside the Ogwusearch monorepo:

```text
Ogwusearch/
├── packages/
├── projects/
│   ├── ogswebapp/
│   │   ├── public/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   ├── components/
│   │   │   ├── data/
│   │   │   ├── features/
│   │   │   ├── pages/
│   │   │   └── styles/
│   │   ├── docs/
│   │   ├── index.html
│   │   ├── package.json
│   │   ├── vercel.json
│   │   └── README.md
│   └── AI-Engineering-Assistant/
├── pnpm-workspace.yaml
└── pnpm-lock.yaml
```

## **Getting Started**

### **Requirements**

- Node.js
- pnpm 10
- Git

### **Install dependencies**

Run from the monorepo root:

```
cd ~/workspace/Ogwusearch
pnpm install
```

### **Start development server**

```
pnpm --filter ogwusearch-labs dev
```

### **Production build**

```
pnpm --filter ogwusearch-labs build
```

### **Lint**

```
pnpm --filter ogwusearch-labs lint
```

### **Preview production build**

```
pnpm --filter ogwusearch-labs preview
```

## **Application Architecture**

| Directory                   | Responsibility                        |
| --------------------------- | ------------------------------------- |
| `src/app/`                  | Application setup and routing         |
| `src/features/home/`        | Homepage sections                     |
| `src/features/about/`       | About page                            |
| `src/features/projects/`    | Project listing and details           |
| `src/features/engineering/` | Engineering portfolio                 |
| `src/features/experiments/` | Experiments showcase                  |
| `src/features/writing/`     | Writing and publications              |
| `src/components/`           | Shared components                     |
| `src/data/`                 | Portfolio content and structured data |
| `src/styles/`               | Global styles                         |

## **Deployment**

The portfolio is deployed independently from the other projects in the monorepo.

### **Vercel configuration**

GitHub repository:

`Ogwusearch/Ogwusearch`

| Setting           | Value                |
| ----------------- | -------------------- |
| Framework Preset  | Vite                 |
| Root Directory    | `projects/ogswebapp` |
| Production Branch | `main`               |
| Build Command     | `pnpm build`         |
| Output Directory  | `dist`               |

The repository uses a pnpm workspace with its lockfile at the monorepo root. Vercel must resolve dependencies using the workspace configuration and root lockfile.

### **SPA routing**

The `vercel.json` file configures fallback routing to `index.html`, allowing direct navigation and refreshes on application routes.

## **Development Guidelines**

- Keep the portfolio independent from unrelated applications.
- Use reusable components and feature-oriented organization.
- Keep portfolio content in structured data files where appropriate.
- Maintain responsive layouts and accessible interfaces.
- Run production build and lint checks before publishing.
- Do not commit local backups, generated build output, or unrelated project files.

## **Repository**

[https://github.com/Ogwusearch/Ogwusearch](https://github.com/Ogwusearch/Ogwusearch?utm_source=chatgpt.com)

Application directory:

`projects/ogswebapp`

## **Project Status**

**Status:** In development

The portfolio is being prepared for production deployment on Vercel.

**Ogwusearch**\
Engineering, Software, and Intelligent Systems.\
