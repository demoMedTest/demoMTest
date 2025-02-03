import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";  // Opravený import

// Dynamické nastavenie základnej cesty
const basePath = process.env.NODE_ENV === "production" ? "/demoMTest/" : "/";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',  // Automatické aktualizácie service worker-a
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/assets\/.*\.(?:txt)$/,  // Cachovanie súborov z assets priečinka
            handler: 'NetworkFirst', // Najskôr pokúsi sa načítať z internetu, ak nie je, použije cache
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dní
              },
            },
          },
        ],
      },
    }),
  ],
  base: basePath,  // Dynamické nastavenie základnej cesty
});
