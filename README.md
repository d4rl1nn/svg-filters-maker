# SVG Filter Lab

Interactive playground for experimenting with SVG filter primitives. Build a chain of `<filter>` primitives, tweak attributes with a friendly UI, preview the result live, and copy the generated markup for use in your own SVGs.

## Features

- Add primitives via picker (all common SVG filter primitives supported) and quick-add buttons for DropShadow, Gaussian Blur, and ColorMatrix.
- Reorder, duplicate, and remove primitives; chain with `in`/`result` values.
- Edit attributes with type-aware inputs; full support for `feComponentTransfer` channel functions and `feMerge` nodes.
- Custom attributes per primitive for advanced use cases.
- Live canvas preview with adjustable size, background color, and sample content (rectangle, circle, text, image, or custom SVG).
- Filter metadata controls: filter ID and color-interpolation-filters (`auto`, `sRGB`, `linearRGB`).
- Presets: save, load, and delete; autosaves the current state locally.
- Light/dark theme toggle.
- One-click copy of generated `<filter>` markup.

## Tech Stack

- React 19 + TypeScript
- Vite 7
- Tailwind CSS (via `@tailwindcss/vite`)
- ESLint (typescript-eslint, React hooks/refresh rules)

## Getting Started

Requirements: Node 18+ or Bun 1.1+.

Install dependencies (Bun is preferred as a lockfile is present):

```sh
# with Bun
bun install

# or with npm
npm ci
```

Run the dev server with HMR:

```sh
bun run dev
# or: npm run dev
```

Build for production (type-checks with `tsc -b`):

```sh
bun run build
# or: npm run build
```

Preview the production build locally:

```sh
bun run preview
# or: npm run preview
```

Lint the codebase:

```sh
bun run lint
# or: npm run lint
```

## Usage

- Use “Add primitive” to insert filter primitives; quick buttons add common ones.
- For chaining, set `in` to a previous primitive’s `result` (or `SourceGraphic`, `SourceAlpha`, `BackgroundImage`, etc.) and set a `result` name when you want to reference the output later.
- Adjust attributes using the generated controls. Special editors appear for:
  - `feComponentTransfer` channel functions (`feFuncR/G/B/A`).
  - `feMerge` with dynamic `feMergeNode` entries.
- Add custom attributes for anything not in the built-in schema (hyphen-case supported).
- Tune the preview in the right panel: canvas size, background color, and sample content. Paste arbitrary SVG in “Custom SVG” when needed.
- Copy the generated `<filter>` markup from the “Generated <filter> Markup” panel.
- Save frequently used setups as presets; they persist in `localStorage`.

## Project Structure

- `src/` — app source. Entry `main.tsx`, single-file UI root in `App.tsx`, styles in `index.css`/`App.css`.
  - `src/components/FilterLab/` — UI for building and editing filter chains.
  - `src/lib/filters/` — filter types, schemas, helpers, and markup generation.
- `public/` — static assets (e.g., `public/vite.svg`).
- `index.html` — Vite HTML entry.
- Config: `vite.config.ts`, `eslint.config.js`, `tsconfig*.json`.

## Scripts

- `dev` — start Vite with HMR.
- `build` — TypeScript build (type-check) and Vite production build.
- `preview` — preview the built app.
- `lint` — run ESLint.

## Coding Style

- TypeScript strict mode; prefer explicit types for exports and props.
- React functional components with hooks only.
- Indentation: 2 spaces; keep files small and cohesive.
- Component names in PascalCase; variables/functions in camelCase.
- Prefer Tailwind utilities; keep global CSS minimal.

## Testing

No test harness is included yet. If adding tests, use Vitest + React Testing Library and co-locate as `*.test.tsx` next to source.

## Contributing

- Use Conventional Commits: `feat:`, `fix:`, `refactor:`, `chore:`, `docs:`.
- Keep diffs focused; avoid unrelated refactors or dependency changes.
- For UI changes, include before/after screenshots in PRs.

## Notes & Limitations

- Some advanced or rarely used attributes may require adding a custom attribute. PRs to extend schemas are welcome.
- This is a client-only app; no secrets or server components.
