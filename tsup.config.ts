import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  splitting: true,
  bundle: false,
  format: ['esm'],
  clean: true,
  dts: true,
})
