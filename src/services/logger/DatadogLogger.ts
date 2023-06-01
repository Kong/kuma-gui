import { datadogLogs } from '@datadog/browser-logs'

import type Env from '@/services/env/Env'
import type { ClientConfigInterface } from '@/store/modules/config/config.types'

export default class DatadogLogger {
  env: Env['var']

  constructor(env: Env['var']) {
    this.env = env
  }

  setup(config: ClientConfigInterface) {
    if (config.reports.enabled) {
      datadogLogs.init({
        // This token is called “kuma-gui” in Datadog
        clientToken: 'pub94a0029259f79f29a5d881a06d1e9653',
        site: 'datadoghq.com',
        forwardErrorsToLogs: true,
        service: this.env('KUMA_PRODUCT_NAME'),
        sampleRate: 100,
        env: 'production', // logging is currently disabled in anything other than production
      })
    }
  }
}
