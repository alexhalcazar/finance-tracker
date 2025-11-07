import { defineConfig } from "vitest/config";
import { resolve } from "node:path";

export default defineConfig({
  test: {
    setupFiles: "./vitest.setup.js",
    alias: {
      "#db": resolve("./src/db/db.js"),
      "#models": resolve("./src/models"),
      "#config": resolve("./knexfile.js"),
      "#tests": resolve("./tests"),
    },
  },
});
