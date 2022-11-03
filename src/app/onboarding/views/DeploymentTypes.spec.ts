import { RouterLinkStub } from '@vue/test-utils'
import userEvent from '@testing-library/user-event'
import { render, screen } from '@testing-library/vue'

import DeploymentTypes from './DeploymentTypes.vue'

function renderComponent() {
  return render(DeploymentTypes, {
    global: {
      stubs: {
        routerLink: RouterLinkStub,
      },
    },
  })
}

describe('DeploymentTypes.vue', () => {
  it('renders snapshot', () => {
    const { container } = renderComponent()

    expect(container).toMatchSnapshot()
  })

  it('changes selected graph', async () => {
    renderComponent()

    await userEvent.click(screen.getByText(/Multi-zone deployment/))

    expect(screen.getByTestId('multizone-graph')).toBeInTheDocument()
  })
})
