/* eslint-disable */

import fs from 'fs'
import esbuild from 'esbuild'

const isProduction = process.argv.includes('--prod')

const renamePlugin = () => {
  return {
    name: 'rename-plugin',
    setup(build) {
      build.onEnd((result) => {
        fs.rename('dist/index.js', 'dist/lib.js', () => {})
      })
    }
  }
}

let ctx = await esbuild.context({
  entryPoints: ['src/index.ts'],
  outdir: 'dist/',
  target: ['es2017'],
  bundle: true,
  minify: isProduction,
  logLevel: 'debug',
  format: 'esm',
  plugins: [renamePlugin()]
})

if (process.env.npm_config_watch) {
  await ctx.watch()
  console.log('Watching...')
} else {
  await ctx.rebuild()
  console.log('Build is ready!')
  process.exit(1)
}

/* eslint-enable */
