import { createApp } from 'vue'
import { RouteRecordRaw } from 'vue-router'

import { createRouter } from './router/router'
import { kumaApi } from './api/kumaApi'
import { setupDatadog } from './utilities/setupDatadog'
import { storeKey, store } from './store/store'
import { EnvVars } from '@/services/env/Env'
import { TOKENS, get } from '@/services'
import App from './app/App.vue'

if (import.meta.env.PROD) {
  setupDatadog()
}

/**
 * Initializes and mounts the Vue application.
 *
 * This is a good place to run operations that should ideally be initiated or completed before the Vue application instance exists.
 */

async function initializeVue(env: (key: keyof EnvVars) => string, routes: readonly RouteRecordRaw[]) {
  document.title = `${env('KUMA_PRODUCT_NAME')} Manager`
  kumaApi.setBaseUrl(env('KUMA_API_URL'))

  if (import.meta.env.VITE_MOCK_API_ENABLED === 'true') {
    // The combination of reading the environment variable and using dynamic import
    // ensures that msw isn’t actually bundled with the production application.
    const { setupMockWorker } = await import('./api/setupMockWorker')

    setupMockWorker(kumaApi.baseUrl)
  }

  const app = createApp(App)

  app.use(store, storeKey)

  await Promise.all([
    // Fetches basic resources before setting up the router and mounting the
    // application. This is mainly needed to properly redirect users to the
    // onboarding flow in the appropriate scenarios.
    store.dispatch('bootstrap'),
    // Loads available policy types in order to populate the necessary information used for titling/breadcrumbing and policy lookups in the app.
    store.dispatch('fetchPolicyTypes'),
  ])

  const router = await createRouter(routes, env('KUMA_BASE_PATH'))

  app.use(router)

  app.mount('#app')
}

initializeVue(get(TOKENS.env), get(TOKENS.routes))
