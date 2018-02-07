import Vue from 'vue'
import Vuex from 'vuex'
import * as gTypes from 'pima-store/getterTypes'
import * as mTypes from 'pima-store/mutationTypes'
import { cover } from 'pima-utils'

import viewer from './modules/viewer'

Vue.use(Vuex)

/*
{
  bases: [{
    path: '',
    all: {
      'pid': {
        id: 'pid',
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
      id: 'tid',
      name: 'xxx',
      children: ['tid1', 'tid2'] // 可能存在多个父标签
    },
    'tid1': { ... }
  }
}
*/

const state = {
  current: {
    baseIndex: 0,
    tagId: '',
    page: 0,
    pictureId: ''
  },
  bases: [],
  tags: {}
}

const getters = {
  [gTypes.IS_STATIC] (state) {
    return process.env.NODE_ENV === 'static'
  },
  [gTypes.PER_PAGE] (state) {
    const isStatic = getters[gTypes.IS_STATIC](state)
    if (isStatic) {
      return 10
    } else {
      return 100
    }
  },
  [gTypes.CURRENT_BASE] (state) {
    return state.bases[state.current.baseIndex]
  },
  [gTypes.CURRENT_PICTURES] (state) {
    const currentBase = getters[gTypes.CURRENT_BASE](state)
    const tagId = state.current.tagId
    let pictures
    if (tagId) {
      pictures = currentBase ? currentBase.tagged[tagId] : []
    } else {
      pictures = []
      state.bases.forEach(base => {
        pictures = pictures.concat(Object.keys(base.all).map(id => base.all[id]))
      })
    }
    return pictures
  },
  [gTypes.CURRENT_PAGED_PICTURES] (state) {
    const pictures = getters[gTypes.CURRENT_PICTURES](state)
    const perPage = getters[gTypes.PER_PAGE](state)
    const start = perPage * state.current.page
    return pictures.slice(start, start + perPage)
  },
  [gTypes.PAGE_LENGTH] (state) {
    const pictures = getters[gTypes.CURRENT_PICTURES](state)
    const perPage = getters[gTypes.PER_PAGE](state)
    return Math.ceil(pictures.length / perPage)
  },
  [gTypes.CURRENT_PICTURE] (state) {
    const currentBase = getters[gTypes.CURRENT_BASE](state)
    return currentBase ? currentBase.all[state.current.pictureId] : null
  },
  [gTypes.CURRENT_PICTURE_PAGE] (state) {
    const pictures = getters[gTypes.CURRENT_PICTURES](state)
    return pictures.findIndex(picture => picture.id === state.current.pictureId)
  }
}

const actions = {
}

const mutations = {
  [mTypes.SET] (state, payload) {
    cover(state, payload)
  },
  [mTypes.SET_PAGE] (state, { page, delta }) {
    const pageLength = getters[gTypes.PAGE_LENGTH](state)
    if (delta) {
      page = state.current.page + delta
    }
    page = Math.max(0, page)
    page = Math.min(page, pageLength - 1)
    state.current.page = page
  },
  [mTypes.SET_PICTURE] (state, { pictureId }) {
    state.current = {
      ...state.current,
      pictureId
    }
  },
  [mTypes.SET_PICTURE_BY_PAGE] (state, { page, delta }) {
    const pictures = getters[gTypes.CURRENT_PICTURES](state)
    if (delta) {
      const currentPicturePage = getters[gTypes.CURRENT_PICTURE_PAGE](state)
      page = currentPicturePage + delta
    }
    page = Math.max(0, page)
    page = Math.min(page, pictures.length - 1)
    const pictureId = pictures[page].id
    state.current = {
      ...state.current,
      pictureId
    }
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    viewer
  }
})
