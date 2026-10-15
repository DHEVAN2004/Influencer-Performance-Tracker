import { copyFileSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const staticAssets = [{"source":"favicon.svg","output":"favicon.svg"},{"source":"icons.svg","output":"icons.svg"}];

export default defineConfig({
  publicDir: false,
  plugins: [{
    name: "copy-flattened-public-assets",
    closeBundle() {
      const output = resolve(process.cwd(), "dist");
      mkdirSync(output, { recursive: true });
      for (const asset of staticAssets) {
        copyFileSync(resolve(process.cwd(), asset.source), resolve(output, asset.output));
      }
    },
  }],
});
