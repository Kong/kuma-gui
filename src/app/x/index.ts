import XAction from './components/x-action/XAction.vue'
import XTeleportSlot from './components/x-teleport/XTeleportSlot.vue'
import XTeleportTemplate from './components/x-teleport/XTeleportTemplate.vue'
import type { ServiceDefinition } from '@/services/utils'
import { token } from '@/services/utils'

type Token = ReturnType<typeof token>

declare module '@vue/runtime-core' {
  export interface GlobalComponents {
    XAction: typeof XAction
    XTeleportTemplate: typeof XTeleportTemplate
    XTeleportSlot: typeof XTeleportSlot
  }
}

export const services = (app: Record<string, Token>): ServiceDefinition[] => {
  return [
    [token('x.vue.components'),
      {
        service: () => {
          return [
            ['XAction', XAction],
            ['XTeleportTemplate', XTeleportTemplate],
            ['XTeleportSlot', XTeleportSlot],
          ]
        },
        labels: [
          app.components,
        ],
      },
    ],
  ]
}
