import { service, constant, get, injected } from './utils'
import Env, { EnvArgs, EnvVars } from '@/services/env/Env'
import Logger from '@/services/logger/DatadogLogger'
import KumaApi from '@/services/kuma-api/KumaApi'
import routes from '@/router/routes'
import { getNavItems } from '@/app/getNavItems'
import { storeConfig, State } from '@/store/'

import { InjectionKey } from 'vue'
import { createStore, Store } from 'vuex'

export const TOKENS = {
  EnvVars: constant({
    KUMA_PRODUCT_NAME: import.meta.env.VITE_NAMESPACE,
    KUMA_FEEDBACK_URL: import.meta.env.VITE_FEEDBACK_URL,
    KUMA_CHAT_URL: import.meta.env.VITE_CHAT_URL,
    KUMA_INSTALL_URL: import.meta.env.VITE_INSTALL_URL,
    KUMA_VERSION_URL: import.meta.env.VITE_VERSION_URL,
    KUMA_DOCS_URL: import.meta.env.VITE_DOCS_BASE_URL,
  } as EnvArgs, { description: 'EnvVars' }),
  Env: service(Env, { description: 'Env' }),
  env: service(() => (key: keyof EnvVars) => get(TOKENS.Env).var(key), { description: 'env' }),

  api: service(KumaApi, { description: 'api' }),

  storeKey: constant(Symbol('store') as InjectionKey<Store<State>>, { description: 'storeKey' }),
  storeConfig: service(storeConfig, { description: 'storeConfig' }),
  store: service(createStore<State>, { description: 'store' }),

  nav: service(() => (multizone: boolean, hasMeshes: boolean) => getNavItems(multizone, hasMeshes), { description: 'nav' }),
  routes: service(routes, { description: 'routes' }),
  logger: service(Logger, { description: 'logger' }),
}

injected(Env, TOKENS.EnvVars)
injected(KumaApi, TOKENS.Env)
injected(storeConfig, TOKENS.api)
injected(createStore<State>, TOKENS.storeConfig)
injected(routes, TOKENS.store)
injected(Logger, TOKENS.Env)
