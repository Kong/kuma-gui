import { routes } from './routes'
import { sources } from './sources'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'
export * from './routes'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('gateway.sources'), {
      service: sources,
      arguments: [
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
    [token('gateway.routes'), {
      service: () => {
        return [routes()]
      },
      labels: [
        app.routes,
      ],
    }],
  ]
}
