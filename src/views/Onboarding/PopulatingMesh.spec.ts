import renderWithVuex from '@/testUtils/renderWithVuex'
import PopulatingMesh from './PopulatingMesh.vue'

describe('PopulatingMesh.vue', () => {
  const customStore = { modules: { config: { state: { tagline: 'Kuma' } } } }

  it('renders snapshot', () => {
    const { container } = renderWithVuex(PopulatingMesh, { store: customStore, routes: [] })

    expect(container).toMatchSnapshot()
  })
})
