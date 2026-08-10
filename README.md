# Unisex 3D Muscle Anatomy

Open-source **3D human muscle anatomy** for visualization.

A simple unisex body you can orbit and inspect — meant for apps, education, fitness tools, or anyone who needs a reusable muscle map in 3D.

This project is **early / unfinished**. The mesh and zone mapping still need work. **Contributions are welcome** to help finish a clean, accurate model others can drop into their own products.

## Quick start

```bash
npm install
npm run dev
```

Open **http://localhost:3010** — drag to orbit, scroll to zoom.

```bash
npm run build       # production build
npm run bake:body   # regenerate the muscular GLB from the original mesh
```

## What’s in the box

- `public/models/human_body.glb` — the 3D body
- `src/muscleComponents.js` — 24 muscle zones (for coloring / highlighting)
- `src/App.jsx` — minimal Three.js viewer (no workout app UI)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md).

Helpful work: better proportions, sharper muscle zones, cleaner materials, docs, or a stronger base mesh (keep licenses compatible).

## License

MIT — see [LICENSE](LICENSE).

Mesh notes and anatomy attributions (Z-Anatomy, BodyParts3D) are in the LICENSE file. Use and remix freely under those terms.
