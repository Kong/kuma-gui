import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { RootInterface } from '../..'
import { OnboardingInterface } from './onboarding.types'

const state: OnboardingInterface = {
  isCompleted: localStorage.getItem('onboarding/isCompleted') === 'true',
  step: localStorage.getItem('onboarding/step') || 'onboarding-welcome',
}

const mutations: MutationTree<OnboardingInterface> = {
  SET_STEP: (state, step) => (state.step = step),
  SET_IS_COMPLETED: (state, isCompleted) => (state.isCompleted = isCompleted),
}

const getters: GetterTree<OnboardingInterface, RootInterface> = {}

const actions: ActionTree<OnboardingInterface, RootInterface> = {
  // complete/skip onboarding
  completeOnboarding({ commit }) {
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
