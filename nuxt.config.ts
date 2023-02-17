// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: ['@nuxtjs/tailwindcss'],
    runtimeConfig: {
        public: {
            googleClientId: process.env.GOOGLE_CLIENT_ID ?? '',
            apiUrl: process.env.API_URL ?? ''
        }
    },
    ssr: false,
})
