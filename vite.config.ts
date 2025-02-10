import { resolve } from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { ServerOptions } from "vite";

const getServerProxy: (env: string) => ServerOptions["proxy"] | undefined = (
  env
) => {
  if (env === "development") {
    return {
      "/api": {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
        secure: false,
        // Use false if you're not using HTTPS in development
        // rewrite: (path) => path.replace(/^\/api/, ""), // Optional, modify this based on your API routes
      },
    };
  }
  return undefined;
};

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: { ...getServerProxy(process.env.NODE_ENV || "development") },
  },
});
