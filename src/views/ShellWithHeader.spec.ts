import renderWithVuex from '@/testUtils/renderWithVuex'
import TestComponent from '@/testUtils/TestComponent.vue'
import ShellWithHeader from './ShellWithHeader.vue'

describe('ShellWithHeader.vue', () => {
  it('renders component with route', () => {
    const { container } = renderWithVuex(ShellWithHeader, {
      routes: [
        {
          path: '/',
          name: 'default',
          component: TestComponent,
        },
      ],
    })

    expect(container).toMatchSnapshot()
  })
})
