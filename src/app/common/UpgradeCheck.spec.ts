import { describe, expect, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import UpgradeCheck from './UpgradeCheck.vue'
import { store } from '@/store/store'

function renderComponent() {
  return mount(UpgradeCheck)
}

describe('UpgradeCheck.vue', () => {
  test('renders snapshot', async () => {
    store.state.config.version = '1.2.0'
    store.state.config.tagline = import.meta.env.VITE_NAMESPACE

    const wrapper = renderComponent()

    await flushPromises()
    expect(wrapper.html()).toContain('Update')

    expect(wrapper.element).toMatchSnapshot()
  })
})
