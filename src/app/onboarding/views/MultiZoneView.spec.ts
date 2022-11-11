import { flushPromises, mount } from '@vue/test-utils'

import MultiZoneView from './MultiZoneView.vue'
import { kumaApi } from '@/api/kumaApi'

function renderComponent() {
  return mount(MultiZoneView)
}

describe('MultiZoneView.vue', () => {
  it('renders snapshot', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })

  it('detects resources on call and allow to proceed', async () => {
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.find('[data-testid="zone-connected"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="zone-ingress-connected"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="onboarding-next-button"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(false)
  })

  it('refetch resources if any not available', async () => {
    jest.useFakeTimers()
    jest
      .spyOn(kumaApi, 'getAllZoneIngressOverviews')
      .mockResolvedValueOnce({
        total: 0,
      })
      .mockResolvedValueOnce({
        total: 1,
      })

    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.find('[data-testid="zone-connected"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="zone-ingress-disconnected"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)

    jest.runAllTimers()
    await flushPromises()

    expect(wrapper.find('[data-testid="zone-ingress-connected"]').exists()).toBe(true)
    expect(kumaApi.getAllZoneIngressOverviews).toHaveBeenCalledTimes(2)
    jest.useRealTimers()
  })
})
