import { createI18n } from '@kong-ui-public/i18n'

import { get } from '@/app/application'
import type Env from '@/app/application/services/env/Env'

declare module 'intl-messageformat' {
  interface Options {
    defaultMessage: string
  }
}

interface I18nRecord {
  [key: string]: I18nRecord | string
}

class I18nError extends Error {
  get key() {
    return this.message
  }
}
const camelCaseToWords = (str: string): string => {
  const words = str
    .split(/([A-Z][a-z]+)/)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  return words.charAt(0).toUpperCase() + words.substring(1)
}

export default <T extends I18nRecord>(strs: T, env: Env['var']) => {
  const i18n = createI18n<typeof strs>('en-us', strs, {
    isGlobal: true,
    onError: (e) => {
      // TODO: change the below code that we used before we had onError to be
      // here instead of just rethrowing
      throw e
    },
  })
  const globals = {
    KUMA_VERSION: env('KUMA_VERSION'),
    KUMA_DOCS_URL: env('KUMA_DOCS_URL'),
    KUMA_UTM_QUERY_PARAMS: i18n.t('common.product.utm_query_params' as Parameters<typeof i18n['t']>[0]),
    KUMA_PRODUCT_NAME: i18n.t('common.product.name' as Parameters<typeof i18n['t']>[0]),
    count: 1,
  }
  return {
    ...i18n,
    t: function (...rest: Parameters<typeof i18n['t']>) {
      const key = rest[0]
      try {
        if (typeof get(strs, key) === 'undefined') {
          if (key.startsWith('http.api.')) {
            throw new I18nError(key)
          } else {
            throw new Error(`Missing message: "${key}" for locale "en-us", using id as fallback`)
          }
        }
        if (get(strs, key).length === 0) {
          return ''
        }
        rest[1] = {
          ...globals,
          ...rest[1],
        }
        return i18n.t(...rest)
      } catch (e) {
        switch (true) {
          case e instanceof I18nError:
            // temporarily change any http.api terms to camelCase at runtime
            return camelCaseToWords((e as I18nError).key.split('.').pop()!)
          default:
            if (typeof rest[2]?.defaultMessage === 'string') {
              return rest[2].defaultMessage
            }

            throw e
        }
      }
    },
  }
}
