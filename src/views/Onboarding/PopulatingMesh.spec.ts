import renderWithVuex from '@/testUtils/renderWithVuex'
import { screen } from '@testing-library/vue'
import PopulatingMesh from './PopulatingMesh.vue'

describe('PopulatingMesh.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderWithVuex(PopulatingMesh)

    expect(container).toMatchSnapshot()
  })

  it('renders multizone next step', () => {
    renderWithVuex(PopulatingMesh, {
      store: { modules: { config: { state: { clientConfig: { mode: 'global' } } } } },
      stubs: {
        routerLink: {
          props: ['to'],
          template: '<span>{{to.name}}</span>',
        },
      },
    })

    expect(screen.getByText('onboarding-multi-zone')).toBeInTheDocument()
  })
})
