import Vue from 'vue'
import Vuex from 'vuex'
import * as mTypes from 'pima-store/mutationTypes'
import { cover } from 'pima-utils'

Vue.use(Vuex)

/*
{
  all: [],
  tags: {
    'xxx': {
      all: [],
      tags: {}
    }
  }
}
*/

const state = {
  all: [],
  tags: {}
}

const actions = {
}

const mutations = {
  [mTypes.SET] (state, payload) {
    cover(state, payload)
  }
}

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {}
})
