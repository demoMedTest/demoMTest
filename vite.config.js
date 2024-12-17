import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/medTest/", // Názov tvojho repozitára na GitHub-e
});
