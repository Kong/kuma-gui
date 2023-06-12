import { describe, expect, jest, test } from '@jest/globals'
import { flushPromises, mount } from '@vue/test-utils'

import ZoneListView from './ZoneListView.vue'
import { useMock } from '@/../jest/jest-setup-after-env'
import { useKumaApi, useStore } from '@/utilities'

const kumaApi = useKumaApi()

function renderComponent() {
  return mount(ZoneListView)
}

describe('ZoneListView', () => {
  const mock = useMock()
  const store = useStore()

  test('renders snapshot when no multizone', async () => {
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders snapshot when multizone', async () => {
    mock('/zones+insights', {
      KUMA_ZONE_COUNT: '4',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'cluster-1',
            },
            {
              name: 'zone-1',
            },
            {
              name: 'zone-2',
            },
            {
              name: 'zone-3',
            },
          ],
        },
      })
    })
    mock('/config', {}, (merge) => {
      return merge({
        body: {
          mode: 'global',
        },
      })
    })
    await store.dispatch('bootstrap')
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('cluster-1')
    expect(wrapper.html()).toContain('dpToken')

    expect(wrapper.element).toMatchSnapshot()
  })

  test('renders config of multizone', async () => {
    mock('/zones+insights', {
      KUMA_ZONE_COUNT: '4',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'cluster-1',
            },
            {
              name: 'zone-1',
            },
            {
              name: 'zone-2',
            },
            {
              name: 'zone-3',
            },
          ],
        },
      })
    })
    mock('/config', {}, (merge) => {
      return merge({
        body: {
          mode: 'global',
        },
      })
    })
    await store.dispatch('bootstrap')
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('dpToken')

    await wrapper.find('#config-tab').trigger('click')
    expect(wrapper.html()).toContain('adminAccessLogPath')
  })

  test('renders zone insights', async () => {
    mock('/zones+insights', {
      KUMA_ZONE_COUNT: '4',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: 'cluster-1',
            },
            {
              name: 'zone-1',
            },
            {
              name: 'zone-2',
            },
            {
              name: 'zone-3',
            },
          ],
        },
      })
    })
    mock('/config', {}, (merge) => {
      return merge({
        body: {
          mode: 'global',
        },
      })
    })
    await store.dispatch('bootstrap')
    const wrapper = renderComponent()

    await flushPromises()

    expect(wrapper.html()).toContain('dpToken')

    await wrapper.find('#insights-tab').trigger('click')
    expect(wrapper.find('[data-testid="tab-container"]').element).toMatchSnapshot()
  })

  test('updates list when deleting Zone', async () => {
    const firstZoneName = 'zone-1'
    mock('/zones+insights', {
      KUMA_ZONE_COUNT: '3',
    }, (merge) => {
      return merge({
        body: {
          items: [
            {
              name: firstZoneName,
            },
            {
              name: 'zone-2',
            },
            {
              name: 'zone-3',
            },
          ],
        },
      })
    })
    mock('/config', {}, (merge) => {
      return merge({
        body: {
          mode: 'global',
        },
      })
    })
    await store.dispatch('bootstrap')

    jest.spyOn(kumaApi, 'deleteZone').mockImplementation(() => Promise.resolve())
    jest.spyOn(kumaApi, 'getAllZoneOverviews')

    const wrapper = renderComponent()

    await flushPromises()

    expect(kumaApi.getAllZoneOverviews).toHaveBeenCalledTimes(1)

    expect(wrapper.findAll('[data-testid="data-overview-table"] tbody tr').length).toBe(3)

    // Opens the action dropdown
    const actionsDropdown = wrapper.find('[data-testid="actions-dropdown"] [data-testid="k-dropdown-menu-popover"]')
    await actionsDropdown.trigger('click')

    // Clicks the delete action
    const deleteItem = wrapper.find('[data-testid="dropdown-delete-item"] [data-testid="k-dropdown-item-trigger"]')
    await deleteItem.trigger('click')

    const deleteModal = wrapper.find('[data-testid="delete-resource-modal"]')

    // Enter Zone name to confirm deletion
    const confirmationInput = deleteModal.find('[data-testid="confirmation-input"]')
    await confirmationInput.setValue(firstZoneName)

    // Confirms deletion
    const buttons = deleteModal.findAll('button')
    const deleteButton = buttons[buttons.length - 1]
    await deleteButton.trigger('click')

    expect(kumaApi.getAllZoneOverviews).toHaveBeenCalledTimes(2)
  })
})
