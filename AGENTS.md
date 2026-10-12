# Repository Guidelines

## Structure and product

Tandem is a React, TypeScript, and Vite frontend. Its persistent personal project context is the existing note identified as `Projects/Tandem`; resolve it through Nicol's personal workflow without committing private machine paths. Keep application code and styles in `src/`, served brand and production media in `public/assets/`, and visual decisions in `docs/design.md`. Local source artwork, generation records, and backups belong under `work/`; that directory is excluded from Git and deployment. Validation captures belong in `docs/captures/`, remain versioned in Git, and are excluded from Vercel with the rest of `docs/`. All user-facing copy, validation messages, accessibility labels, metadata, and examples must remain in English.

The product has four hash-routed views: Home, Explore, Create, and Dashboard. Preserve the approved Worldbuilding system: lilac, plum ink, tangerine, and ivory; heavy Manrope typography; paired loops; purpose-made artwork; and the dark idea composer. Keep the nine creative directions, twelve concept previews, eight Home chapters, connected ownership panels, illustrative fee calculator, route curtain, responsive reading order, keyboard support, and reduced-motion behavior. Do not imply that a preview is a published customer project or that a coin has launched.

## Verified workflow

Use Node.js 22 and the committed lockfile:

```bash
npm ci
npm run dev
npm run lint
npm run build
```

The dev server binds to loopback and the production bundle is written to `dist/`. Inspect `package.json` before changing scripts or dependencies. Validate relevant desktop and mobile layouts, horizontal overflow, navigation, forms, filters, dialogs, console errors, and failed asset requests. Record only checks actually performed.

## Data and wallet boundaries

Drafts stay in browser storage. Preserve migration keys and edit/update behavior. Wallet access must follow an explicit Connect Wallet action and may read only a public account from a selected installed provider. Never request signatures, send transactions, hold keys, contact an RPC, or invent provider state. Never commit credentials, `.env` files, private keys, dependencies, build output, or local logs.

## Git and deployment

The authorized remote is `https://github.com/SolClaude33/TANDEM.git`. Uploads to that repository require the current user request; do not create or substitute another remote. Vercel is configured for the Vite preset, Node.js 22.x, `npm ci`, `npm run build`, and `dist`. Do not deploy to Vercel unless Nicol explicitly requests deployment. Keep `vercel.json`, `.vercelignore`, the lockfile, and this guide consistent with actual repository behavior.
