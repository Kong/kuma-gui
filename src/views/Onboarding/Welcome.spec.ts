import renderWithVuex from '@/testUtils/renderWithVuex'
import Welcome from './Welcome.vue'

describe('Welcome.vue', () => {
  const customStore = { modules: { config: { state: { tagline: 'Kuma', enviroment: 'universal' } } } }

  it('renders snapshot', async () => {
    const { container } = renderWithVuex(Welcome, { store: customStore })

    expect(container).toMatchSnapshot()
  })

  it('renders multi-zone', async () => {
    const { getByText } = renderWithVuex(Welcome, { store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } } })

    expect(getByText(/Multi-Zone/)).toBeInTheDocument()
  })
})
