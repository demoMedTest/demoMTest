import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import VitePWA from "vite-plugin-pwa";

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
            handler: 'CacheFirst', // Najskôr kontroluje cache, ak nie je, pošle požiadavku na server
            options: {
              cacheName: 'assets-cache',
              expiration: {
                maxEntries: 50,  // Maximálny počet položiek v cache
                maxAgeSeconds: 60 * 60 * 24 * 30, // Maximálna doba uchovávania súborov (30 dní)
              },
            },
          },
        ],
      },
    }),
  ],
  base: basePath,  // Dynamické nastavenie základnej cesty
});
