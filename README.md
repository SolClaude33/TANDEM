# Tandem

Tandem is a React and TypeScript frontend for shaping one idea into a website and coin with a shared identity. Its Worldbuilding playground combines an idea composer, nine visual directions, twelve project starters, editable local drafts, an ownership model, and an illustrative 75/25 creator fee split.

## Local development

Use Node.js 22 and install the exact locked dependency tree:

```bash
npm ci
npm run dev
```

The development server runs at `http://127.0.0.1:5173/`. Validate changes with:

```bash
npm run lint
npm run build
```

The production bundle is written to `dist/`. Application source lives in `src/`, while production artwork and brand assets live in `public/assets/`.

## Product boundaries

The four hash-routed views are Home, Explore, Create, and Dashboard. Drafts are stored in the current browser on the current device. Wallet connection is explicitly initiated by the visitor and reads only a detected provider's public account. This frontend does not request signatures, submit transactions, call chain RPCs, publish websites, or launch coins.

## Vercel import

Import [`SolClaude33/TANDEM`](https://github.com/SolClaude33/TANDEM) as a new Vercel project with these settings:

- Root Directory: `./`
- Framework Preset: `Vite`
- Node.js Version: `22.x`
- Install Command: `npm ci`
- Build Command: `npm run build`
- Output Directory: `dist`

`vercel.json` declares the Vite framework, install command, build command, and output directory. `package.json` pins Node.js 22.x; select the repository root (`./`) in the Vercel import UI. Routes use URL hashes, so no server rewrite is required. The current frontend needs no environment variables. Vercel deployment is intentionally left to the project owner.

## Project references

`docs/design.md` records the visual system and interaction decisions. Validation captures live in `docs/captures/`; they are versioned in Git but excluded from Vercel uploads with the rest of `docs/`. `AGENTS.md` contains repository conventions and validation boundaries. Source artwork, generation records, and backups under `work/` stay local and are excluded from Git and Vercel uploads; served assets under `public/` remain part of the production bundle.
