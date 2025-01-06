import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  modules: [
    "@pinia/nuxt",
    "nuxt-security",
    "@nuxtjs/google-fonts",
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
  ],

  // ==============================================
  // 1. BLOQUE security (Agregado)
  // ==============================================
  security: {
    headers: {
      permissionsPolicy: {
        // Permite geolocalización en tu propia app
        geolocation: ['self'],

        // Bloquea o ajusta el resto según requieras
        camera: [],
        displayCapture: [],
        fullscreen: [],
        microphone: []
      }
      // Si en algún momento quieres DESHABILITAR
      // completamente esta cabecera, podrías usar:
      // permissionsPolicy: false
      //
      // Y ya no se enviaría la cabecera "Permissions-Policy" en las respuestas HTTP.
    }
  },
  // ==============================================

  css: [
    "~/assets/css/global.css"
  ],
  googleFonts: {
    families: {
      "Lexend Deca": [100, 400, 700, 900],
    },
    display: "swap",
  },
  plugins: ["~/plugins/axios.client.ts", "~/plugins/toastification.js"],
  runtimeConfig: {
    public: {
      backBaseUrl: process.env.BACK_BASE_URL,
    },
  },
  typescript: {
    strict: true,
    typeCheck: true,
  },
  compatibilityDate: "2024-10-23",
  build: {
    transpile: ["vuetify"],
  },
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
    resolve: {
      alias: {
        "@vue-leaflet/vue-leaflet": "@vue-leaflet/vue-leaflet", // 🔥 Ensure Vite resolves this path
      },
    },
    optimizeDeps: {
      include: ["@vue-leaflet/vue-leaflet"], // 🔥 Force Vite to pre-bundle it
    },
  },
});
