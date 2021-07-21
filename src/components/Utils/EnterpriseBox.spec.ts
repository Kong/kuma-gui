import { render } from '@testing-library/vue'
import EnterpriseBox from './EnterpriseBox.vue'

describe('EnterpriseBox.vue', () => {
  it('renders snapshot', async () => {
    const { container } = render(EnterpriseBox)

    expect(container).toMatchSnapshot()
  })
})
