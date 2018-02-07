import * as mTypes from 'pima-store/mutationTypes'
import { cover } from 'pima-utils'

const state = {
}

const getters = {
}

const actions = {
}

const mutations = {
  [mTypes.VIEWER_SET] (state, payload) {
    cover(state, payload)
  }
}

export default {
  state,
  getters,
  actions,
  mutations,
  modules: {}
}
