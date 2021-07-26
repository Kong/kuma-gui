import renderWithVuex from '@/testUtils/renderWithVuex'
import userEvent from '@testing-library/user-event'
import Introduction from './Introduction.vue'

describe('Introduction.vue', () => {
  const customStore = { modules: { config: { state: { tagline: 'Kuma' } } } }

  it('renders snapshot', async () => {
    const { container } = renderWithVuex(Introduction, { store: customStore })

    expect(container).toMatchSnapshot()
  })

  it('changes selected graph', async () => {
    const { getByText } = renderWithVuex(Introduction, { store: customStore })

    await userEvent.click(getByText(/Multi-Zone deployment/))

    expect(getByText('Multizone 1')).toBeInTheDocument()
  })
})
