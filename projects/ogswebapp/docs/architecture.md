# Portfolio Application Architecture

## Product identity

- Public identity: Okpe Emmanuel Ogwu
- Professional brand: OGWU SEARCH
- Purpose: personal software, AI, electronics, energy and engineering portfolio.

## Application stack

- React
- TypeScript
- Vite
- React Router
- CSS
- Static, typed TypeScript content

No backend, database, CMS, or new runtime dependency is introduced by this architecture migration.

## Source layout

- `src/app/`: application composition, route configuration and application-level pages.
- `src/features/`: page and component implementations grouped by portfolio capability.
- `src/components/layout/`: shared site shell, header, navigation and footer.
- `src/components/ui/`: reusable low-level UI components.
- `src/data/`: typed portfolio content and navigation data.
- `src/styles/`: global styles, reset and design tokens.
- `src/assets/`: assets imported by source modules.
- `public/`: static files served directly by Vite.

## Feature boundaries

- `features/home`: homepage sections.
- `features/about`: biography and professional profile page.
- `features/projects`: project catalogue, cards, details and project pages.
- `features/experiments`: experiments page.
- `features/writing`: writing page.

## Routing

`src/app/router.tsx` owns route definitions. `src/app/App.tsx` owns the router provider and shared layout. A catch-all route renders the 404 page.

## Dependency direction

Feature pages may use their own feature components, shared layout/UI components, and typed data. Shared layout and UI components should not import feature implementations.

## Migration compatibility

The original `src/pages/`, `src/components/projects/`, and `src/components/sections/` paths currently contain re-export shims. They preserve old import paths while implementation ownership moves into `src/features/`. Remove these shims only after confirming no remaining imports depend on them.

## Change-safety rules

- Keep this application within the Ogwusearch monorepo.
- Do not alter monorepo-wide package manifests or lockfiles for feature-level changes.
- Do not add dependencies without a demonstrated need.
- Keep portfolio content separate from presentation components.
- Keep project status and evidence accurate; distinguish completed, in-development and experimental work.
