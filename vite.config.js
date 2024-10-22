import { resolve } from "path";
import { defineConfig } from "vite";
import dns from "dns";

dns.setDefaultResultOrder("verbatim");

export default defineConfig({
  root: "src/",
  server: {
    host: "localhost",
    port: 3000,
    open: true,
  },
  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        cart: resolve(__dirname, "src/playlist/index.html"),
        search: resolve(__dirname, "src/search/index.html"),
        favorite: resolve(__dirname, "src/favorite/index.html"),
        compare: resolve(__dirname, "src/compare/index.html")
      },
    },
  },
});
