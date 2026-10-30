// The extension (src/extension.ts with chalk-talk/markdown, for VS Code's markdown-it) and the preview's script
// (chalk-talk's mount.global.js: the engine, its fonts and Mermaid, which turns the blocks into lessons) and its colours.
import { build } from 'esbuild'
import { copyFileSync, mkdirSync } from 'node:fs'
import { createRequire } from 'node:module'

await build({
  entryPoints: ['src/extension.ts'],
  bundle: true, format: 'cjs', platform: 'node', target: 'node18', minify: true,
  external: ['vscode'], outfile: 'dist/extension.js', logLevel: 'info',
})
mkdirSync('media', { recursive: true })
copyFileSync(createRequire(import.meta.url).resolve('chalk-talk/mount.global.js'), 'media/mount.global.js')
copyFileSync('preview.css', 'media/preview.css')
