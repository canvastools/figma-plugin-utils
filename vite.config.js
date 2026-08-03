import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

/**
 * Same lib build as the other workspace packages: ESM with `preserveModules`,
 * so every helper stays its own module and a consumer importing one function
 * never pulls the rest of the library into its bundle.
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
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index',
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
