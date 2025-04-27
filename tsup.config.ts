import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['./src/index.ts'],
  splitting: true,
  bundle: true,
  format: ['esm'],
  clean: true,
  dts: true,
})
