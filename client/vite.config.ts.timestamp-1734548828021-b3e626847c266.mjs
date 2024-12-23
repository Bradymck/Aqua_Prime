// vite.config.ts
import path from "path";
import { defineConfig } from "file:///Users/bradymckenna/Aqua_Prime/node_modules/vite/dist/node/index.js";
import topLevelAwait from "file:///Users/bradymckenna/Aqua_Prime/node_modules/.pnpm/vite-plugin-top-level-await@1.4.4_@swc+helpers@0.5.15_rollup@4.28.1_vite@client+@tanstack+router-plugin+vite/node_modules/vite-plugin-top-level-await/exports/import.mjs";
import react from "file:///Users/bradymckenna/Aqua_Prime/node_modules/.pnpm/@vitejs+plugin-react@4.3.3_vite@client+@tanstack+router-plugin+vite/node_modules/@vitejs/plugin-react/dist/index.mjs";
import wasm from "file:///Users/bradymckenna/Aqua_Prime/node_modules/.pnpm/vite-plugin-wasm@3.3.0_vite@client+@tanstack+router-plugin+vite/node_modules/vite-plugin-wasm/exports/import.mjs";
var __vite_injected_original_dirname = "/Users/bradymckenna/Aqua_Prime/client";
var vite_config_default = defineConfig({
  plugins: [wasm(), topLevelAwait(), react()],
  optimizeDeps: {
    exclude: ["onnxruntime-node", "@anush008/tokenizers"]
  },
  build: {
    commonjsOptions: {
      exclude: ["onnxruntime-node", "@anush008/tokenizers"]
    },
    rollupOptions: {
      external: ["onnxruntime-node", "@anush008/tokenizers"]
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYnJhZHltY2tlbm5hL0FxdWFfUHJpbWUvY2xpZW50XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvYnJhZHltY2tlbm5hL0FxdWFfUHJpbWUvY2xpZW50L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9icmFkeW1ja2VubmEvQXF1YV9QcmltZS9jbGllbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB0b3BMZXZlbEF3YWl0IGZyb20gXCJ2aXRlLXBsdWdpbi10b3AtbGV2ZWwtYXdhaXRcIjtcbmltcG9ydCByZWFjdCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tcmVhY3RcIjtcbmltcG9ydCB3YXNtIGZyb20gXCJ2aXRlLXBsdWdpbi13YXNtXCI7XG5cbi8vIGh0dHBzOi8vdml0ZS5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgICBwbHVnaW5zOiBbd2FzbSgpLCB0b3BMZXZlbEF3YWl0KCksIHJlYWN0KCldLFxuICAgIG9wdGltaXplRGVwczoge1xuICAgICAgICBleGNsdWRlOiBbXCJvbm54cnVudGltZS1ub2RlXCIsIFwiQGFudXNoMDA4L3Rva2VuaXplcnNcIl0sXG4gICAgfSxcbiAgICBidWlsZDoge1xuICAgICAgICBjb21tb25qc09wdGlvbnM6IHtcbiAgICAgICAgICAgIGV4Y2x1ZGU6IFtcIm9ubnhydW50aW1lLW5vZGVcIiwgXCJAYW51c2gwMDgvdG9rZW5pemVyc1wiXSxcbiAgICAgICAgfSxcbiAgICAgICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgICAgICAgZXh0ZXJuYWw6IFtcIm9ubnhydW50aW1lLW5vZGVcIiwgXCJAYW51c2gwMDgvdG9rZW5pemVyc1wiXSxcbiAgICAgICAgfSxcbiAgICB9LFxuICAgIHJlc29sdmU6IHtcbiAgICAgICAgYWxpYXM6IHtcbiAgICAgICAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLFxuICAgICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICAgIHByb3h5OiB7XG4gICAgICAgICAgICBcIi9hcGlcIjoge1xuICAgICAgICAgICAgICAgIHRhcmdldDogXCJodHRwOi8vbG9jYWxob3N0OjMwMDBcIixcbiAgICAgICAgICAgICAgICBjaGFuZ2VPcmlnaW46IHRydWUsXG4gICAgICAgICAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sIFwiXCIpLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSxcbiAgICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlTLE9BQU8sVUFBVTtBQUNsVCxTQUFTLG9CQUFvQjtBQUM3QixPQUFPLG1CQUFtQjtBQUMxQixPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBSmpCLElBQU0sbUNBQW1DO0FBT3pDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQ3hCLFNBQVMsQ0FBQyxLQUFLLEdBQUcsY0FBYyxHQUFHLE1BQU0sQ0FBQztBQUFBLEVBQzFDLGNBQWM7QUFBQSxJQUNWLFNBQVMsQ0FBQyxvQkFBb0Isc0JBQXNCO0FBQUEsRUFDeEQ7QUFBQSxFQUNBLE9BQU87QUFBQSxJQUNILGlCQUFpQjtBQUFBLE1BQ2IsU0FBUyxDQUFDLG9CQUFvQixzQkFBc0I7QUFBQSxJQUN4RDtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ1gsVUFBVSxDQUFDLG9CQUFvQixzQkFBc0I7QUFBQSxJQUN6RDtBQUFBLEVBQ0o7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNMLE9BQU87QUFBQSxNQUNILEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN4QztBQUFBLEVBQ0o7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNKLE9BQU87QUFBQSxNQUNILFFBQVE7QUFBQSxRQUNKLFFBQVE7QUFBQSxRQUNSLGNBQWM7QUFBQSxRQUNkLFNBQVMsQ0FBQ0EsVUFBU0EsTUFBSyxRQUFRLFVBQVUsRUFBRTtBQUFBLE1BQ2hEO0FBQUEsSUFDSjtBQUFBLEVBQ0o7QUFDSixDQUFDOyIsCiAgIm5hbWVzIjogWyJwYXRoIl0KfQo=
