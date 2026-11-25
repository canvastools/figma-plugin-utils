import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

/**
 * ESM with `preserveModules`: each helper stays a module of its own.
 * So a bundle that imports one helper gets only that helper.
 * Two entries: `index` for the sandbox, `ui` for the code outside the sandbox.
 */
export default defineConfig({
  plugins: [
    dts({
      tsconfigPath: './tsconfig.types.json',
    }),
  ],
  build: {
    target: 'es2020',
    minify: true,
    lib: {
      entry: { index: 'src/index.ts', ui: 'src/ui.ts' },
      formats: ['es'],
    },
    rollupOptions: {
      output: {
        exports: 'named',
        preserveModules: true,
        preserveModulesRoot: 'src',
        entryFileNames: '[name].js',
      },
    },
  },
})
