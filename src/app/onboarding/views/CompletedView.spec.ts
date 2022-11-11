import { mount } from '@vue/test-utils'

import CompletedView from './CompletedView.vue'

function renderComponent() {
  return mount(CompletedView)
}

describe('CompletedView.vue', () => {
  it('renders snapshot', () => {
    const wrapper = renderComponent()

    expect(wrapper.element).toMatchSnapshot()
  })
})
