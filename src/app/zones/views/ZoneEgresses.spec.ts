import { createRouter, createWebHashHistory } from 'vue-router'
import { flushPromises, RouterLinkStub } from '@vue/test-utils'
import { render, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'

import ZoneEgresses from './ZoneEgresses.vue'
import { store, storeKey } from '@/store/store'
import { ClientConfigInterface } from '@/store/modules/config/config.types'
import * as config from '@/api/mock-data/config.json'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: { template: 'TestComponent' },
    },
  ],
})

jest.mock('@/utilities/helpers', () => {
  const originalModule = jest.requireActual('@/utilities/helpers')

  return {
    __esModule: true,
    ...originalModule,
    humanReadableDate: (data: string) => data,
    rawReadableDate: (data: string) => data,
  }
})

function renderComponent(mode = 'standalone') {
  const clientConfig: ClientConfigInterface = { ...config, mode }
  store.state.config.clientConfig = clientConfig

  return render(ZoneEgresses, {
    global: {
      plugins: [router, [store, storeKey]],
      stubs: {
        'router-link': RouterLinkStub,
      },
      mocks: {
        $route: {
          query: {},
        },
      },
    },
  })
}

describe('ZoneEgresses.vue', () => {
  it('renders snapshot when no multizone', async () => {
    const { container } = renderComponent()

    await flushPromises()

    await screen.findByText(/ZoneEgressOverview/)

    expect(container).toMatchSnapshot()
  })

  it('renders snapshot when multizone', async () => {
    const { container } = renderComponent('global')

    await flushPromises()

    await screen.findByText(/ZoneEgressOverview/)

    expect(container).toMatchSnapshot()
  })

  it('renders zoneegress insights', async () => {
    renderComponent('global')

    await screen.findByText(/ZoneEgressOverview/)

    await userEvent.click(screen.getByText(/Zone Egress Insights/))
    expect(screen.getByTestId('tab-container')).toMatchSnapshot()
  })
})
