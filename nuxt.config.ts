// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss'],
  runtimeConfig: {
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
      apiUrl: process.env.API_URL ?? '',
      scrapingUrl: process.env.SCRAPING_URL ?? ''
    }
  },
  build: {
    transpile: ['vue-toastification']
  },
  css: [
    'vue-toastification/dist/index.css'
  ],
  ssr: false,
})
