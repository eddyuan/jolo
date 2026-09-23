// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/supabase'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Jolo',
      meta: [{ name: 'description', content: 'Your job search agent.' }],
    },
  },
  supabase: {
    types: '~~/shared/types/database.types.ts',
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      // Public routes; everything else requires a session.
      exclude: ['/'],
      saveRedirectToCookie: true,
    },
  },
})
