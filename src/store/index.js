import Vue from 'vue'
import Vuex from 'vuex'
import hash from 'object-hash'
import * as aTypes from 'pima-store/actionTypes'
import * as gTypes from 'pima-store/getterTypes'
import * as mTypes from 'pima-store/mutationTypes'
import { cover, notySuccess, notyError } from 'pima-utils'

import tag from './modules/tag'

Vue.use(Vuex)

const writeFile = (path, text, successMessage) => {
  fs.mkdir('data', 0o777, () => {
    fs.writeFile(path, text, 'utf8', (err) => {
      if (err) {
        notyError(err)
      } else {
        notySuccess(successMessage)
      }
    })
  })
}

/*
{
  bases: [{
    path: '',
    all: {
      'pid': {
        id: 'pid',
        path: '',
        stats: {},
        scannedTime: 123456
      }
    },
    tagged: {
      'tid': ['pid'] // 有顺序
    }
  }],
  tags: {
    'tid': {
      id: 'tid',
      name: 'xxx',
      color: '#fff',
      children: ['tid1', 'tid2'] // 可能存在多个父标签
    },
    'tid1': { ... }
  }
}
*/

const state = {
  current: {
    baseIndex: 0,
    scale: 1,
    tagId: '',
    page: 0,
    pictureId: ''
  },
  bases: [],
  tags: {
    '0': {
      id: '0',
      name: 'tagme',
      children: []
    }
  }
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
      return 15
    }
  },
  [gTypes.CURRENT_BASE] (state) {
    return state.bases[state.current.baseIndex]
  },
  [gTypes.CURRENT_PICTURES] (state) {
    const tagId = state.current.tagId
    let pictures = []
    if (tagId) {
      state.bases.forEach(base => {
        pictures = pictures.concat(base.tagged[tagId].map(pictureId => base.all[pictureId]) || [])
      })
    } else {
      state.bases.forEach(base => {
        pictures = pictures.concat(Object.keys(base.all).map(id => base.all[id]))
      })
    }
    // 排序
    const key = 'birthtime'
    pictures.sort((a, b) => {
      const at = a.stats ? a.stats[key] : -1
      const bt = b.stats ? b.stats[key] : -1
      return -(at - bt)
    })
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
  [gTypes.CURRENT_PICTURE_TAG_IDS] (state) {
    const pictureId = state.current.pictureId
    const currentBase = getters[gTypes.CURRENT_BASE](state)
    const tagIds = []
    if (currentBase) {
      for (const tagId in currentBase.tagged) {
        const list = currentBase.tagged[tagId]
        if (list.indexOf(pictureId) >= 0) {
          tagIds.push(tagId)
        }
      }
    }
    return tagIds
  },
  [gTypes.CURRENT_PICTURE_PAGE] (state) {
    const pictures = getters[gTypes.CURRENT_PICTURES](state)
    return pictures.findIndex(picture => picture.id === state.current.pictureId)
  }
}

const actions = {
  [aTypes.READ_DATA] ({ commit }, payload) {
    fs.readdir('data', (err, files) => {
      if (err) {
        notyError(err)
      } else {
        files.forEach(file => {
          fs.readFile(`data/${file}`, 'utf8', (err, data) => {
            if (err) {
              notyError(err)
            } else {
              if (file === 'tags.json') {
                commit(mTypes.SET, { tags: JSON.parse(data) })
                notySuccess('Tags read.')
              } else if (file === 'current.json') {
                commit(mTypes.SET, { current: JSON.parse(data) })
                notySuccess('Current read.')
              } else {
                const base = JSON.parse(data)
                commit(mTypes.ADD_BASE, { base })
                notySuccess(`Base ${base.path} read.`)
              }
            }
          })
        })
      }
    })
  },
  // path: 'D:/Downloads/'
  [aTypes.SCAN_BASE] ({ commit, dispatch, getters }, { path }) {
    // hash 验证，存在则更新，不存在则创建
    const createFileId = (file) => `${hash(file)}-${hash(Math.random())}`

    fs.readdir(path, (err, files) => {
      if (err) {
        notyError(err)
      } else {
        const all = {}
        files
          .filter(file => {
            const splits = file.split('.')
            const exts = ['png', 'jpg', 'jpeg', 'gif']
            return exts.indexOf(splits[splits.length - 1]) >= 0
          })
          .forEach(file => {
            let id = createFileId(file)
            while (all[id]) {
              id = createFileId(file)
            }
            const stats = fs.statSync(`${path}${file}`)
            all[id] = {
              id,
              path: file,
              stats: {
                ...stats,
                atime: stats.atime ? stats.atime.getTime() : -1,
                mtime: stats.mtime ? stats.mtime.getTime() : -1,
                ctime: stats.ctime ? stats.ctime.getTime() : -1,
                birthtime: stats.birthtime ? stats.birthtime.getTime() : -1
              },
              scannedTime: (new Date()).getTime()
            }
          })
        const base = {
          path,
          all,
          tagged: {
            '0': Object.keys(all)
          }
        }
        commit(mTypes.ADD_BASE, { base })
        dispatch(aTypes.SAVE_BASE, { path: base.path })
      }
    })
  },
  [aTypes.SAVE_BASE] ({ state, commit }, { path }) {
    const base = state.bases.find(b => b.path === path)
    if (base) {
      writeFile(`data/${hash(path)}.json`, JSON.stringify(base, null, 2), `Base ${path} saved.`)
    }
  },
  [aTypes.SAVE_TAGS] ({ state, commit }) {
    writeFile(`data/tags.json`, JSON.stringify(state.tags, null, 2), 'Tags saved.')
  },
  [aTypes.SAVE_CURRENT] ({ state, commit }) {
    writeFile(`data/current.json`, JSON.stringify(state.current, null, 2), 'Current saved.')
  }
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
    state.current.pictureId = pictureId
  },
  [mTypes.EXPLORER_TOGGLE_TAG] (state, { tagId }) {
    if (state.current.tagId === tagId) {
      state.current.tagId = ''
    } else {
      state.current.tagId = tagId
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
    state.current.pictureId = pictureId

    // current.page
    const perPage = getters[gTypes.PER_PAGE](state)
    state.current.page = Math.floor(page / perPage)
  },
  [mTypes.SET_SCALE] (state, { scale }) {
    state.current.scale = scale
  },
  [mTypes.ADD_BASE] (state, { base }) {
    const index = state.bases.findIndex(b => b.path === base.path)
    if (index >= 0) {
      for (const pictureId in base.all) {
        if (!state.bases[index].all[pictureId]) {
          state.bases[index].all[pictureId] = base.all[pictureId]
        }
      }
      state.bases[index].all = { ...state.bases[index].all }
      state.bases[index] = { ...state.bases[index] }
      state.bases = [...state.bases]
    } else {
      state.bases = [
        ...state.bases,
        base
      ]
    }
  },

  [mTypes.VIEWER_TOGGLE_TAG] (state, { pictureId, tagId }) {
    const baseIndex = state.current.baseIndex
    const tagged = state.bases[baseIndex].tagged
    const toggle = (tid) => {
      if (!tagged[tid]) {
        tagged[tid] = []
      }
      if (tagged[tid].indexOf(pictureId) >= 0) {
        tagged[tid] = tagged[tid].filter(pid => pid !== pictureId)
      } else {
        tagged[tid].unshift(pictureId)
        tagged[tid] = [...tagged[tid]]
      }
      for (const t in state.tags) {
        const tag = state.tags[t]
        if (tag.children.indexOf(tid) >= 0) {
          toggle(tag.id)
        }
      }
    }
    toggle(tagId)
    state.bases[baseIndex].tagged = { ...state.bases[baseIndex].tagged }
    state.bases[baseIndex] = { ...state.bases[baseIndex] }
    state.bases = [...state.bases]
  }
}

export default new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    tag
  }
})
