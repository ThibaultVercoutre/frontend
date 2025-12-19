import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/hints',
    '@nuxt/image',
    '@nuxt/scripts',
    '@nuxt/test-utils',
    '@nuxt/ui',
    '@vite-pwa/nuxt'
  ],

  css: [
    "@/assets/css/main.css"
  ],

  vite: {
    plugins: [tailwindcss()]
  },

  // PWA Configuration
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: 'Gabrielle - Album Musical',
      short_name: 'Gabrielle',
      description: 'Album musical interactif avec lecteur et karaoké',
      theme_color: '#18181b',
      background_color: '#18181b',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      icons: [
        {
          src: '/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
        {
          src: '/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable',
        },
      ],
    },
    workbox: {
      // Exclude large background images from precaching (they'll use runtime caching)
      globPatterns: ['**/*.{js,css,html,svg,ico,woff,woff2}'],
      globIgnores: ['**/backgrounds/**'],
      navigateFallback: null,
      runtimeCaching: [
        {
          // Audio files (local and remote)
          urlPattern: /\.(mp3|wav|ogg)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'audio-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
        {
          // Images (local and remote) - including large backgrounds
          urlPattern: /\.(png|jpg|jpeg|webp|gif)$/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'image-cache',
            expiration: {
              maxEntries: 100,
              maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
            },
            cacheableResponse: {
              statuses: [0, 200],
            },
          },
        },
      ],
    },
    client: {
      installPrompt: true,
    },
    devOptions: {
      enabled: false,
    },
  },
})