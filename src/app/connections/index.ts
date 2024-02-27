import { sources } from './sources'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'
export * from './routes'

type Token = ReturnType<typeof token>

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('connections.sources'), {
      service: sources,
      arguments: [
        app.source,
        app.api,
      ],
      labels: [
        app.sources,
      ],
    }],
  ]
}
