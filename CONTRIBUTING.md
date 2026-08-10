# Contributing

This repo exists so people can use and improve an **open-source 3D muscle anatomy** model for visualizations.

It’s not done yet. PRs that make the body clearer, more accurate, or easier to reuse are appreciated.

## Setup

```bash
npm install
npm run dev
```

Preview: http://localhost:3010

## Guidelines

1. Keep the surface area small: a model + a simple viewer people can learn from.
2. Don’t turn this into a full fitness/workout product UI.
3. Credit sources if you add new anatomy assets; stay MIT / CC-compatible.
4. `npm run build` should still pass.

## Good PR targets

- Muscle zone accuracy (`src/muscleComponents.js`)
- Better mesh / proportions (`public/models/`, `npm run bake:body`)
- Cleaner look in the viewer (`src/App.jsx`)
- Docs and examples for embedding the model elsewhere
