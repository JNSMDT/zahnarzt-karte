// vite.config.js
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve("./src/worker.js"),
      name: "worker",
      fileName: "worker",
      formats: ["es"],
    },
    outDir: "dist/worker",
  },
});
