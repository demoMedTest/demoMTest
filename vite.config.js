import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const basePath = process.env.NODE_ENV === "production" ? "/demoMTest/" : "/";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /\/.*\.(?:js|css|html|json|txt|jpg|jpeg|png|svg|gif|webp|mp4|woff2?)$/,
            handler: "CacheFirst",
            options: {
              cacheName: "public-assets-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
      includeAssets: ["favicon.ico", "robots.txt"], // Dodatočné statické súbory
      manifest: {
        name: "My PWA App",
        short_name: "PWA App",
        start_url: ".",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#000000",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      strategies: "injectManifest", // Použitie precache stratégie
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,jpg,svg,gif,webp,mp4,woff2}"], // Prednačítanie všetkých súborov
        globDirectory: "public", // Hľadanie v public/
      },
    }),
  ],
  base: basePath,
});

