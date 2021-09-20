import renderWithVuex from '@/testUtils/renderWithVuex'
import userEvent from '@testing-library/user-event'
import { screen } from '@testing-library/vue'
import DeploymentTypes from './DeploymentTypes.vue'

describe('DeploymentTypes.vue', () => {
  const customStore = { modules: { config: { state: { tagline: 'Kuma' } } } }

  it('renders snapshot', async () => {
    const { container } = renderWithVuex(DeploymentTypes, {
      store: customStore,
    })

    expect(container).toMatchSnapshot()
  })

  it('changes selected graph', async () => {
    renderWithVuex(DeploymentTypes, { store: customStore })

    await userEvent.click(screen.getByText(/Multi-Zone deployment/))

    expect(screen.getByTestId('multizone-graph')).toBeInTheDocument()
  })

  xit('hoverable section disappear on hover', async () => {
    jest.useFakeTimers()

    renderWithVuex(DeploymentTypes, { store: customStore })

    await userEvent.hover(<HTMLElement>screen.queryByTestId('hoverable-overlay'))

    jest.advanceTimersByTime(1000)

    expect(screen.queryByTestId('hoverable-overlay')).not.toBeInTheDocument()
  })
})
