import Vue from 'vue'
import Vuex from 'vuex'
import App from '@/App.vue'
import Router from '@/router'
import { datadogLogs } from '@datadog/browser-logs'
import VueMeta from 'vue-meta'
import Store from '@/store'
import axios from 'axios'
import Kuma from '@/services/kuma'

/** amCharts */
import * as am4core from '@amcharts/amcharts4/core'
import am4themesAnimated from '@amcharts/amcharts4/themes/animated'

/** Kongponents */
import './kongponents'

/** Tailwind */
import '@/assets/styles/third-party/tailwind.css'

/** Prismjs */
import 'prismjs/themes/prism.css'

/** Styles */
import '@/assets/styles/variables.scss'
import '@/assets/styles/utilities.scss'
import '@/assets/styles/fonts.scss'
import '@/assets/styles/main.scss'
import '@/assets/styles/typography.scss'
import '@/assets/styles/inputs.scss'
import '@/assets/styles/components.scss'
import '@/assets/styles/transitions.scss'
import '@/assets/styles/animations.scss'

/** Initiate Datadog */

if (process.env.NODE_ENV === 'production') {
  datadogLogs.init({
    clientToken: 'pub94a0029259f79f29a5d881a06d1e9653',
    site: 'datadoghq.com',
    forwardErrorsToLogs: true,
    service: process.env.VUE_APP_NAMESPACE,
    sampleRate: 100,
    env: process.env.NODE_ENV,
  })
}

/** Initiate plugins */
Vue.use(VueMeta)

Vue.config.productionTip = false

am4core.useTheme(am4themesAnimated)

/**
 * APP SETUP
 */

/** the app itself */
function VUE_APP() {
  const store = new Vuex.Store(Store())
  const router = Router(store)

  new Vue({
    store,
    router,
    render: h => h(App),
  }).$mount('#app')
}

VUE_APP()

if (process.env.VUE_APP_AMCHARTS_LICENSE) {
  am4core.addLicense(process.env.VUE_APP_AMCHARTS_LICENSE)
}
