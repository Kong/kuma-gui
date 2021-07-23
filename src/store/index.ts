import Vue from 'vue'
import Vuex, { Module } from 'vuex'

import config from '@/store/modules/config'
import sidebar from '@/store/modules/sidebar'
import { getItemStatusFromInsight } from '@/dataplane'
import { ONLINE, OFFLINE, PARTIALLY_DEGRADED } from '@/consts'
import onboarding from '@/store/modules/onboarding'

import { fetchAllResources } from '@/helpers'
import { getEmptyInsight, mergeInsightsReducer, parseInsightReducer } from '@/store/reducers/mesh-insights'
import Kuma from '@/services/kuma'

type TODO = any

Vue.use(Vuex)

export type RootInterface = any

export default (): Module<RootInterface, RootInterface> => ({
  modules: {
    sidebar,
    config,
    onboarding,
  },
  state: {
    menu: null,
    globalLoading: true,
    meshPageSize: 500,
    pageSize: 500,
    meshes: {},
    dataplanes: [],
    selectedMesh: 'all', // shows all meshes on initial load
    totalDataplaneCount: 0,

    totalDataplaneList: [],
    anyDataplanesOffline: null,

    version: '',
    itemQueryNamespace: 'item',
    totalClusters: 0,

    // NEW
    serviceSummary: {
      total: 0,
      internal: {
        total: 0,
        online: 0,
        offline: 0,
        partiallyDegraded: 0,
      },
      external: {
        total: 0,
      },
    },
    overviewCharts: {
      dataplanes: {
        data: [],
      },
      services: {
        data: [],
      },
      zones: {
        data: [],
      },
      zonesCPVersions: {
        data: [],
      },
      kumaDPVersions: {
        data: [],
      },
      envoyVersions: {
        data: [],
      },
    },
    meshInsight: getEmptyInsight(),
    meshInsightsFetching: false,
    serviceInsightsFetching: false,
    externalServicesFetching: false,
    zonesInsightsFetching: false,
    supportedVersionsFetching: false,
    supportedVersions: {},
    supportedVersionsFailed: '',
  } as TODO,
  getters: {
    getOnboardingStatus: state => state.onboardingComplete,
    globalLoading: state => state.globalLoading,
    getSelectedMesh: state => state.selectedMesh,
    getMeshList: state => state.meshes,
    getDataplanes: state => state.dataplanes,
    getDataplanesList: state => state.totalDataplaneList,
    getAnyDpOffline: state => state.anyDataplanesOffline,

    getItemQueryNamespace: state => state.itemQueryNamespace,
    getClusterCount: state => state.totalClusters,
    getMeshInsight: state => state.meshInsight,
    getMeshInsightsFetching: state => state.meshInsightsFetching,
    getServiceInsightsFetching: state => state.serviceInsightsFetching,
    getExternalServicesFetching: state => state.externalServicesFetching,
    getResourceFetching: ({ meshInsightsFetching, serviceInsightsFetching, externalServicesFetching }) =>
      meshInsightsFetching || serviceInsightsFetching || externalServicesFetching,
    getServiceResourcesFetching: ({ serviceInsightsFetching, externalServicesFetching }) =>
      serviceInsightsFetching || externalServicesFetching,
    getChart: ({ overviewCharts }) => (chartName: string) => overviewCharts[chartName],
    getZonesInsightsFetching: ({ zonesInsightsFetching }) => zonesInsightsFetching,
    getSupportedVersions: ({ supportedVersions }) => supportedVersions,
    getSupportedVersionsFetching: ({ supportedVersionsFetching }) => supportedVersionsFetching,
    getSupportedVersionsFailed: ({ supportedVersionsFailed }) => supportedVersionsFailed,
    showOnboarding: ({ totalDataplaneCount, meshes }) => {
      const onlyDefaultMesh = meshes.total === 1 && meshes.items[0].name === 'default'
      const noDataplane = totalDataplaneCount === 0

      return noDataplane && onlyDefaultMesh
    },
  },
  mutations: {
    SET_GLOBAL_LOADING: (state, { globalLoading }) => (state.globalLoading = globalLoading),
    FETCH_ALL_MESHES: (state, meshes) => (state.meshes = meshes),
    FETCH_DATAPLANES_FROM_MESH: (state, dataplanes) => (state.dataplanes = dataplanes),
    SET_SELECTED_MESH: (state, mesh) => (state.selectedMesh = mesh),
    SET_TOTAL_DATAPLANE_COUNT: (state, count) => (state.totalDataplaneCount = count),
    SET_TOTAL_DP_LIST: (state, dataplanes) => (state.totalDataplaneList = dataplanes),
    SET_TOTAL_CLUSTER_COUNT: (state, count) => (state.totalClusters = count),
    SET_ANY_DP_OFFLINE: (state, status) => (state.anyDataplanesOffline = status),

    // NEW
    SET_INTERNAL_SERVICE_SUMMARY: (state, { data = [] } = {}) => {
      const { serviceSummary } = state

      const reducer = (acc: TODO, { status = 'offline' }) => ({
        ...acc,
        [status]: acc[status] + 1,
      })

      const initialState = { online: 0, partially_degraded: 0, offline: 0 }

      const { online, offline, partially_degraded: partiallyDegraded } = data.reduce(reducer, initialState)

      const total = online + offline + partiallyDegraded

      serviceSummary.internal = {
        ...serviceSummary.internal,
        total,
        online,
        partiallyDegraded,
        offline,
      }

      serviceSummary.total = serviceSummary.external.total + total
    },
    SET_EXTERNAL_SERVICE_SUMMARY: (state, { total = 0 } = {}) => {
      state.serviceSummary.external.total = total
      state.serviceSummary.total = state.serviceSummary.internal.total + total
    },
    SET_MESH_INSIGHT: (state, value) => (state.meshInsight = parseInsightReducer(value)),
    SET_MESH_INSIGHT_FROM_ALL_MESHES: (state, value) => (state.meshInsight = mergeInsightsReducer(value.data)),
    SET_ZONES_INSIGHTS_FETCHING: (state, value) => (state.zonesInsightsFetching = value),
    SET_MESH_INSIGHTS_FETCHING: (state, value) => (state.meshInsightsFetching = value),
    SET_SERVICE_INSIGHTS_FETCHING: (state, value) => (state.serviceInsightsFetching = value),
    SET_EXTERNAL_SERVICES_FETCHING: (state, value) => (state.externalServicesFetching = value),
    SET_OVERVIEW_CHART_DATA: (state, value) => {
      const { chartName, data } = value

      state.overviewCharts[chartName].data = data
    },
    SET_SUPPORTED_VERSIONS_FETCHING: (state, value) => (state.supportedVersionsFetching = value),
    SET_SUPPORTED_VERSIONS: (state, value) => {
      state.supportedVersions = value
      state.supportedVersionsFailed = ''
    },
    SET_SUPPORTED_VERSIONS_FAILED: (state, value) => (state.supportedVersionsFailed = value),
  },
  actions: {
    // bootstrap app

    async bootstrap({ commit, dispatch, getters }) {
      // check the Kuma status before we do anything else
      await dispatch('config/getStatus')

      // only dispatch these actions if the Kuma is online
      if (getters['config/getStatus'] === 'OK') {
        // get mesh from localStorage or default one from vuex
        const mesh = localStorage.getItem('selectedMesh')

        if (mesh) {
          dispatch('updateSelectedMesh', mesh)
        } else {
          localStorage.setItem('selectedMesh', getters.getSelectedMesh)
        }

        // fetch the mesh list
        const meshPromise = dispatch('fetchMeshList')
        // fetch the dataplanes
        const dataplanePromise = dispatch('fetchDataplaneTotalCount')
        // bootstrap config data
        const configPromise = dispatch('config/bootstrapConfig')

        await Promise.all([meshPromise, dataplanePromise, configPromise])
      }

      commit('SET_GLOBAL_LOADING', { globalLoading: false })
    },

    // update the onboarding state
    updateOnboardingStatus({ commit }, status) {
      commit('SET_ONBOARDING_STATUS', status)
    },

    // fetch all of the meshes from the Kuma
    fetchMeshList({ commit, state }) {
      const params = {
        size: state.meshPageSize,
      }

      return Kuma.getAllMeshes(params)
        .then(response => {
          commit('FETCH_ALL_MESHES', response)
        })
        .catch(error => {
          console.error(error)
        })
    },

    // update the selected mesh
    updateSelectedMesh({ commit }, mesh) {
      commit('SET_SELECTED_MESH', mesh)
    },

    /**
     * Total Counts (for all items)
     */

    // get total clusters (Zones) when in multicluster (or "Multi-Zone") mode
    fetchTotalClusterCount({ commit }) {
      return Kuma.getZones().then(response => {
        const total = response.total

        commit('SET_TOTAL_CLUSTER_COUNT', total)
      })
    },

    // get the total number of dataplanes present
    fetchDataplaneTotalCount({ commit }) {
      const params = { size: 1 }

      return Kuma.getAllDataplanes(params)
        .then(response => {
          const total = response.total

          commit('SET_TOTAL_DATAPLANE_COUNT', total)
        })
        .catch(error => {
          console.error(error)
        })
    },

    /**
     * Dataplane statuses
     */

    // this will get the current status of all dataplanes
    getAllDataplanes({ commit }, params) {
      const getDataplanes = async () =>
        new Promise<void>(async (resolve, reject) => {
          const result = []
          const states = []

          const dataplanes = await Kuma.getAllDataplanes(params)
          const items = await dataplanes.items

          for (let i = 0; i < items.length; i++) {
            const itemName = items[i].name
            const itemMesh = items[i].mesh

            const itemStatus = await Kuma.getDataplaneOverviewFromMesh(itemMesh, itemName).then(response => {
              const items = response.dataplaneInsight.subscriptions

              if (items && items.length > 0) {
                for (let i = 0; i < items.length; i++) {
                  const connectTime = items[i].connectTime
                  const disconnectTime = items[i].disconnectTime

                  if (connectTime && connectTime.length && !disconnectTime) {
                    return ONLINE
                  }
                }
              }

              return OFFLINE
            })

            // create the full data array
            result.push({
              status: itemStatus,
              name: itemName,
              mesh: itemMesh,
            })
          }

          // create a simple flat status object with booleans for checking
          // if any dataplanes are offline
          for (let i = 0; i < Object.values(result).length; i++) {
            const statusVal = Object.values(result[i])[0]
            const isOnline = !(statusVal === OFFLINE || statusVal === OFFLINE.toLowerCase())

            states.push(isOnline)
          }

          // if any of the dataplanes return false for being online
          // commit this so we can check against it
          const anyDpOffline = states.some(i => i === false)

          commit('SET_ANY_DP_OFFLINE', anyDpOffline)

          // commit the total list of dataplanes
          commit('SET_TOTAL_DP_LIST', result)

          // resolve the promise
          resolve()
        })

      return getDataplanes()
    },

    // NEW

    async fetchMeshInsights({ commit, dispatch, state }, mesh = 'all') {
      commit('SET_MESH_INSIGHTS_FETCHING', true)

      try {
        if (mesh === 'all') {
          const params = {
            callEndpoint: Kuma.getAllMeshInsights.bind(Kuma),
            size: state.pageSize,
          }

          commit('SET_MESH_INSIGHT_FROM_ALL_MESHES', await fetchAllResources(params))
        } else {
          commit('SET_MESH_INSIGHT', await Kuma.getMeshInsights(mesh))
        }
      } catch (e) {
        commit('SET_MESH_INSIGHT', getEmptyInsight())
      } finally {
        dispatch('setChartsFromMeshInsights')
      }

      commit('SET_MESH_INSIGHTS_FETCHING', false)
    },

    async fetchServiceInsights({ commit, state }, mesh = 'all') {
      commit('SET_SERVICE_INSIGHTS_FETCHING', true)

      try {
        const params = {
          callEndpoint:
            mesh === 'all'
              ? Kuma.getAllServiceInsights.bind(Kuma)
              : Kuma.getAllServiceInsightsFromMesh.bind(Kuma, mesh),
          size: state.pageSize,
        }

        commit('SET_INTERNAL_SERVICE_SUMMARY', await fetchAllResources(params))
      } catch (e) {
        commit('SET_INTERNAL_SERVICE_SUMMARY')
      }

      commit('SET_SERVICE_INSIGHTS_FETCHING', false)
    },

    async fetchExternalServices({ commit, state, dispatch }, mesh = 'all') {
      commit('SET_EXTERNAL_SERVICES_FETCHING', true)

      try {
        const params = {
          callEndpoint:
            mesh === 'all'
              ? Kuma.getAllExternalServices.bind(Kuma)
              : Kuma.getAllExternalServicesFromMesh.bind(Kuma, mesh),
          size: state.pageSize,
        }

        commit('SET_EXTERNAL_SERVICE_SUMMARY', await fetchAllResources(params))
      } catch (e) {
        commit('SET_EXTERNAL_SERVICE_SUMMARY')
      }

      commit('SET_EXTERNAL_SERVICES_FETCHING', false)
    },

    async fetchServices({ dispatch }, mesh = 'all') {
      const externalServices = dispatch('fetchExternalServices', mesh)
      const serviceInsights = dispatch('fetchServiceInsights', mesh)

      await Promise.all([serviceInsights, externalServices])
      await dispatch('setOverviewServicesChartData')
    },

    async fetchZonesInsights({ commit, dispatch, state, getters }, multicluster = false) {
      commit('SET_ZONES_INSIGHTS_FETCHING', true)

      try {
        if (multicluster) {
          const overviewsParams = {
            callEndpoint: Kuma.getAllZoneOverviews.bind(Kuma),
            size: state.pageSize,
          }

          const statusesParams = {
            callEndpoint: Kuma.getAllZoneOverviews.bind(Kuma),
            size: state.pageSize,
          }

          const overviews = await fetchAllResources(overviewsParams)
          const statuses = await fetchAllResources(statusesParams)

          dispatch('setOverviewZonesChartData', statuses)
          dispatch('setOverviewZonesCPVersionsChartData', overviews)
        } else {
          const zonesData = [
            {
              category: 'Zone',
              value: 1,
              tooltipDisabled: true,
              labelDisabled: true,
            },
          ]

          const versionsData = [
            {
              category: getters['config/getVersion'],
              value: 1,
              tooltipDisabled: true,
            },
          ]

          commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zones', data: zonesData })
          commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zonesCPVersions', data: versionsData })
        }
      } catch (e) {
        commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zones', data: [] })
        commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zonesCPVersions', data: [] })
      }

      commit('SET_ZONES_INSIGHTS_FETCHING', false)
    },

    setChartsFromMeshInsights({ dispatch }) {
      dispatch('setOverviewDataplanesChartData')
      dispatch('setOverviewKumaDPVersionsChartData')
      dispatch('setOverviewEnvoyVersionsChartData')
    },

    setOverviewZonesChartData({ state, commit }, { data = [] }) {
      const total = data.length

      let online = 0

      data.forEach((item: any): void => {
        const { status } = getItemStatusFromInsight(item.zoneInsight)

        if (status === ONLINE) {
          online++
        }
      })

      const chartData = []

      if (total) {
        chartData.push({
          category: ONLINE,
          value: online,
        })

        if (online !== total) {
          chartData.push({
            category: OFFLINE,
            value: total - online,
          })
        }
      }

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zones', data: chartData })
    },

    setOverviewServicesChartData({ state, commit }) {
      const { internal, external } = state.serviceSummary

      const data = []

      if (internal.total) {
        data.push({
          category: 'Internal',
          value: internal.total,
          minSizeForLabel: 0.16,
        })
      }

      if (external.total) {
        data.push({
          category: 'External',
          value: external.total,
          minSizeForLabel: 0.16,
        })
      }

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'services', data })
    },

    setOverviewDataplanesChartData({ state, commit }) {
      const { dataplanes = {} } = state.meshInsight
      const { total, online, partiallyDegraded = 0 } = dataplanes

      const data = []

      if (total) {
        data.push({
          category: ONLINE,
          value: online,
        })

        if (partiallyDegraded) {
          data.push({
            category: PARTIALLY_DEGRADED,
            value: partiallyDegraded,
          })
        }

        if (online + partiallyDegraded !== total) {
          data.push({
            category: OFFLINE,
            value: total - partiallyDegraded - online,
          })
        }
      }

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'dataplanes', data })
    },

    setOverviewZonesCPVersionsChartData({ state, commit }, { data }) {
      const chartData = data.reduce((acc: TODO, curr: TODO) => {
        const { subscriptions } = curr.zoneInsight

        if (!subscriptions.length) {
          return acc
        }

        const { version } = curr.zoneInsight.subscriptions.pop()

        const item = acc.find(({ category }: { category: TODO }) => category === version?.kumaCp?.version)

        if (!item) {
          acc.push({ category: version.kumaCp.version, value: 1 })
        } else {
          item.value++
        }

        return acc
      }, [])

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'zonesCPVersions', data: chartData })
    },

    setOverviewEnvoyVersionsChartData({ state, commit }) {
      const { envoy } = state.meshInsight.dpVersions

      const data = Object.entries(envoy).map(([version, stats]: [TODO, TODO]) => ({
        category: version,
        value: stats.total,
      }))

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'envoyVersions', data })
    },

    setOverviewKumaDPVersionsChartData({ state, commit }) {
      const { kumaDp } = state.meshInsight.dpVersions

      const data = Object.entries(kumaDp).map(([version, stats]: [TODO, TODO]) => ({
        category: version,
        value: stats.total,
      }))

      commit('SET_OVERVIEW_CHART_DATA', { chartName: 'kumaDPVersions', data })
    },

    async fetchSupportedVersions({ commit }) {
      commit('SET_SUPPORTED_VERSIONS_FETCHING', true)

      try {
        commit('SET_SUPPORTED_VERSIONS', await Kuma.getSupportedVersions())
      } catch (e) {
        commit('SET_SUPPORTED_VERSIONS_FAILED', e.toString())
      }

      commit('SET_SUPPORTED_VERSIONS_FETCHING', false)
    },
  },
})
