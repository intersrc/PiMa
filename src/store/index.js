import Vue from 'vue'
import Vuex from 'vuex'
import * as mTypes from 'pima-store/mutationTypes'
import { cover } from 'pima-utils'

Vue.use(Vuex)

/*
{
  bases: [{
    path: '',
    all: {
      'pid': {
        path: '',
        scannedTime: 123456
      }
    },
    tagged: {
      'tid': ['pid']
    }
  }],
  tags: {
    'tid': {
      name: 'xxx',
      children: ['tid1', 'tid2'] // 可能存在多个父标签
    },
    'tid1': { ... }
  }
}
*/

const state = {
  currentBaseIndex: 0,
  currentTag: '',
  bases: [],
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
