import common from './common/index.yaml'
import components from './components/index.yaml'
import http from './http/index.yaml'
import meshes from '@/app/meshes/locales/en-us/index.yaml'
import zones from '@/app/zones/locales/en-us/index.yaml'

export default {
  ...common,
  ...http,
  ...components,
  ...meshes,
  ...zones,
}
