import { build } from 'esbuild'

/* ---------- SERVER ---------- */
await build({
  entryPoints: ['src/bin/www'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  outfile: 'dist/www.js',
  external: ['pug', 'source-map'],
  packages: 'external',
})

/* ---------- CLIENT ---------- */
await build({
  entryPoints: ['client/javascripts/main.js'],
  bundle: true,

  platform: 'browser',
  format: 'esm',
  target: 'es2020',

  outfile: 'client/public/dist/javascripts/main.js',

  external: ['three', 'three/addons/*', 'three/nodes'],
})
