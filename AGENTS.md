# Repository Guidelines

This repository is a React 19 + TypeScript + Vite app for experimenting with SVG filter primitives, styled with Tailwind CSS.

## Project Structure & Module Organization
- `src/` — app source. Entry `main.tsx`, single-file UI in `App.tsx`, styles in `index.css`/`App.css`, assets in `src/assets/`.
- `public/` — static assets served as-is (e.g., `public/vite.svg`).
- `index.html` — Vite HTML entry.
- Config: `vite.config.ts`, `eslint.config.js`, `tsconfig*.json`.
- If extracting UI, place reusable components in `src/components/` and shared helpers in `src/lib/`.

## Build, Test, and Development Commands
- Install: `bun install` (preferred, lockfile present) or `npm ci`.
- Dev server: `bun run dev` (or `npm run dev`) — starts Vite with HMR.
- Lint: `bun run lint` — ESLint (TS + React hooks/refresh rules).
- Build: `bun run build` — type-checks (`tsc -b`) and outputs production build to `dist/`.
- Preview: `bun run preview` — serves the built app locally.

## Coding Style & Naming Conventions
- TypeScript strict mode; prefer explicit types for exports and props.
- React functional components with hooks; no class components.
- Indentation: 2 spaces; keep files small and cohesive.
- Names: Components `PascalCase` (e.g., `FilterPanel.tsx`), variables/functions `camelCase`, assets `kebab-case`.
- Styling: prefer Tailwind utilities; keep global CSS minimal in `index.css`/`App.css`.
- Linting via `eslint.config.js`; fix issues before pushing.

## Testing Guidelines
- No test harness yet. If adding tests, use Vitest + React Testing Library.
- Co-locate tests as `*.test.tsx` next to source (e.g., `src/App.test.tsx`).
- Keep logic in small pure functions for easier unit testing.

## Commit & Pull Request Guidelines
- Use Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
  - Example: `feat(ui): add feDropShadow controls`.
- PRs include: clear description, linked issues, before/after screenshots for UI changes, and updates to docs if commands/structure change.
- Keep diffs focused; avoid unrelated refactors or dependency additions without discussion.

## Security & Configuration Tips
- Client-only app: do not commit secrets. Use Node 18+ or Bun 1.1+.
- Keep bundle lean; prefer standard libraries and avoid heavy deps.
