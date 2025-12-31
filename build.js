import { build } from 'esbuild'

build({
  entryPoints: ['src/bin/www'], // 👈 express entry
  bundle: true,
  platform: 'node',
  target: 'node18',
  outfile: 'dist/www.js',

  // 🔑 CRITICAL FOR PUG / CLEAN-CSS
  external: ['source-map', 'pug'],

  // keep runtime requires working
  packages: 'external',
}).catch(() => process.exit(1))
