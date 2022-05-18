import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootInterface } from '../..'
import { OnboardingInterface } from './onboarding.types'

const state: OnboardingInterface = {
  isCompleted: localStorage.getItem('onboarding/isCompleted') === 'true',
  step: localStorage.getItem('onboarding/step') || 'onboarding-welcome',
  mode: 'demo',
}

const mutations: MutationTree<OnboardingInterface> = {
  SET_STEP: (state, step) => (state.step = step),
  SET_IS_COMPLETED: (state, isCompleted) => (state.isCompleted = isCompleted),
  UPDATE_MODE: (state, message) => (state.mode = message),
}

const getters: GetterTree<OnboardingInterface, RootInterface> = {
  getMode: state => state.mode,
  showOnboarding: (state, getters, { meshes, totalDataplaneCount }) => {
    const onlyDefaultMesh = meshes.total === 1 && meshes.items[0].name === 'default'
    const noDataplane = totalDataplaneCount === 0

    return noDataplane && onlyDefaultMesh
  },
}

const actions: ActionTree<OnboardingInterface, RootInterface> = {
  // complete/skip onboarding
  completeOnboarding({ commit, dispatch }) {
    // fetch the dataplanes
    dispatch('fetchDataplaneTotalCount', null, { root: true })

    // fetch sidebar insights
    dispatch('sidebar/getInsights', null, { root: true })

    commit('SET_IS_COMPLETED', true)
    localStorage.setItem('onboarding/isCompleted', 'true')
  },

  // change step in onboarding
  changeStep({ commit }, step) {
    commit('SET_STEP', step)
    localStorage.setItem('onboarding/step', step)
  },
}

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
}
