import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Dynamické nastavenie základnej cesty
const basePath = process.env.NODE_ENV === "production" ? "/demoMTest/" : "/";

export default defineConfig({
  plugins: [react()],
  base: basePath,
});
