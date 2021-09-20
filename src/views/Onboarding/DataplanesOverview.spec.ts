import renderWithVuex from '@/testUtils/renderWithVuex'
import DataplanesOverview from './DataplanesOverview.vue'

describe('DataplanesOverview.vue', () => {
  it('renders snapshot', async () => {
    const { container, getByTestId, findByText } = renderWithVuex(DataplanesOverview)

    expect(getByTestId('loading')).toBeInTheDocument()

    await findByText(/dataplane-test-456/)

    expect(container).toMatchSnapshot()
  })
})
