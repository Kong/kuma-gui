import { PAGE_SIZE_DEFAULT } from '@/constants'
import { getLastNumberParameter } from '@/router/getLastParameter'
import type { RouteRecordRaw } from 'vue-router'
export const routes = () => {
  const item = (prefix: string = 'gateway'): RouteRecordRaw[] => {
    return [
      {
        path: `${prefix}`,
        name: `${prefix}-abstract-view`,
        meta: {
          module: 'gateways',
        },
        redirect: () => ({ name: 'gateways-list-view' }),
        children: [
          {
            path: ':dataPlane',
            name: `${prefix}-detail-tabs-view`,
            component: () => import('@/app/data-planes/views/DataPlaneDetailTabsView.vue'),
            props: {
              isGatewayView: true,
            },
            children: [
              {
                path: '',
                name: `${prefix}-detail-view`,
                component: () => import('@/app/data-planes/views/DataPlaneDetailView.vue'),
              },
              {
                path: 'policies',
                name: `${prefix}-policies-view`,
                component: () => import('@/app/gateways/views/GatewayPoliciesView.vue'),
              },
              {
                path: 'xds-config',
                name: `${prefix}-xds-config-view`,
                component: () => import('@/app/data-planes/views/DataPlaneXdsConfigView.vue'),
              },
              {
                path: 'stats',
                name: `${prefix}-stats-view`,
                component: () => import('@/app/data-planes/views/DataPlaneStatsView.vue'),
              },
              {
                path: 'clusters',
                name: `${prefix}-clusters-view`,
                component: () => import('@/app/data-planes/views/DataPlaneClustersView.vue'),
              },
            ],
          },
        ],
      },
    ]
  }

  return {
    items: (prefix: string = 'gateways'): RouteRecordRaw[] => {
      return [
        {
          path: `${prefix}`,
          name: `${prefix}-abstract-view`,
          meta: {
            module: 'gateways',
          },
          redirect: () => ({ name: 'gateways-list-view' }),
          children: [
            {
              path: '',
              name: `${prefix}-list-view`,
              props: (route) => ({
                mesh: route.params.mesh,
                page: getLastNumberParameter(route.query.page, 1),
                size: getLastNumberParameter(route.query.size, PAGE_SIZE_DEFAULT),
                query: decodeURIComponent(String(route.query.query || '')),
                search: decodeURIComponent(String(route.query.s || '')),
                gatewayType: route.query.gatewayType || 'all',
              }),
              component: () => import('@/app/gateways/views/GatewayListView.vue'),
              // children: [
              //   ...(item(prefix)[0]).children ?? [],
              // ],
            },
          ],
        },
      ]
    },
    item,
  }
}
