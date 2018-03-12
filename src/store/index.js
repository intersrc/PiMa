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

const createUniqueId = (key) => `${hash(key)}-${hash(Math.random())}`

const wrapPicture = (base, picture, tags) => {
  const pictureTags = []
  for (const tagId in base.tagged) {
    if (base.tagged[tagId].indexOf(picture.id) >= 0) {
      if (tags[tagId]) pictureTags.push(tags[tagId])
    }
  }

  let poseNumber = 0
  let sketchNumber = 0
  let starNumber = 0
  let isBookmarked = false
  pictureTags.forEach(tag => {
    if (tag.name === '画一画') sketchNumber = Math.max(sketchNumber, 1)
    if (tag.name === '画一画★') sketchNumber = Math.max(sketchNumber, 2)
    if (tag.name === 'Pose') poseNumber = Math.max(poseNumber, 1)
    if (tag.name === 'Pose★') poseNumber = Math.max(poseNumber, 2)
    if (tag.name === '🔖') isBookmarked = true
    if (tag.name === '★') starNumber = Math.max(starNumber, 1)
    if (tag.name === '★★') starNumber = Math.max(starNumber, 2)
    if (tag.name === '★★★') starNumber = Math.max(starNumber, 3)
  })

  return {
    ...picture,
    basePath: base.path,
    tags: pictureTags,
    poseNumber,
    sketchNumber,
    isBookmarked,
    starNumber
  }
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
        scannedTime: 123456,
        taggedTime: 234567,
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
      weight: 0,
      children: ['tid1', 'tid2'] // 可能存在多个父标签
    },
    'tid1': { ... }
  }
}
*/

const state = {
  isLoading: false,
  currentPictures: [],
  current: {
    baseIndex: 0,
    scale: 1,
    tagId: '',
    page: 0,
    pictureBasePath: '',
    pictureId: '',
    sortKey: 'birthtime',
    isHorizontalFlipped: false,
    isRandom: false
  },
  bases: [],
  tags: {
    '0': {
      id: '0',
      name: 'tagme',
      weight: 1,
      children: []
    }
  }
}

const getters = {
  [gTypes.IS_STATIC] () {
    return process.env.NODE_ENV === 'static'
  },
  [gTypes.PER_PAGE] (state, getters) {
    const isStatic = getters[gTypes.IS_STATIC]
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
    return state.currentPictures
  },
  [gTypes.CURRENT_PICTURES_MAP] (state, getters) {
    const map = {}
    const pictures = getters[gTypes.CURRENT_PICTURES]
    pictures.forEach(picture => {
      map[picture.id] = picture
    })
    return map
  },
  [gTypes.CURRENT_PAGED_PICTURES] (state, getters) {
    const pictures = getters[gTypes.CURRENT_PICTURES]
    const perPage = getters[gTypes.PER_PAGE]
    const start = perPage * state.current.page
    return pictures.slice(start, start + perPage)
  },
  [gTypes.PAGE_LENGTH] (state, getters) {
    const pictures = getters[gTypes.CURRENT_PICTURES]
    const perPage = getters[gTypes.PER_PAGE]
    return Math.ceil(pictures.length / perPage)
  },
  [gTypes.CURRENT_PICTURE] (state) {
    const base = state.bases.find(b => b.path === state.current.pictureBasePath)
    return base ? wrapPicture(base, base.all[state.current.pictureId], state.tags) : null
  },
  [gTypes.CURRENT_PICTURE_TAG_IDS] (state) {
    const pictureId = state.current.pictureId
    const pictureBasePath = state.current.pictureBasePath
    const pictureBase = state.bases.find(b => b.path === pictureBasePath)
    const tagIds = []
    if (pictureBase) {
      for (const tagId in pictureBase.tagged) {
        const list = pictureBase.tagged[tagId]
        if (list.indexOf(pictureId) >= 0) {
          tagIds.push(tagId)
        }
      }
    }
    return tagIds
  },
  [gTypes.CURRENT_PICTURE_PAGE] (state, getters) {
    const pictures = getters[gTypes.CURRENT_PICTURES]
    return pictures.findIndex(picture => picture.id === state.current.pictureId)
  },
  [gTypes.TAG_LIST] (state) {
    return Object.keys(state.tags)
      .map(tid => state.tags[tid])
      .sort((a, b) => -(a.weight - b.weight))
  }
}

if (process.env.NODE_ENV !== 'production') {
  const profiler = (name, func) => {
    // eslint-disable-next-line no-console
    console.log(name, 'begin')

    const beginTime = (new Date()).getTime()
    const ret = func()
    const endTime = (new Date()).getTime()

    // eslint-disable-next-line no-console
    console.log(name, 'end', endTime - beginTime)
    return ret
  }

  for (const getterKey in getters) {
    const getter = getters[getterKey]
    getters[getterKey] = function (...args) {
      return profiler(getterKey, () => {
        return getter(...args)
      })
    }
  }
}

const actions = {
  [aTypes.READ_DATA] ({ commit }) {
    fs.readdir('data', (err, files) => {
      if (err) {
        notyError(err)
      } else {
        files.forEach(file => {
          const data = fs.readFileSync(`data/${file}`, 'utf8')
          if (file === 'tags.json') {
            commit(mTypes.SET, { tags: JSON.parse(data) })
            notySuccess('Tags read.')
          } else if (file === 'current.json') {
            commit(mTypes.SET, { current: JSON.parse(data) })
            notySuccess('Current read.')
          } else if (file.indexOf('_') !== 0) {
            const base = JSON.parse(data)
            commit(mTypes.ADD_BASE, { base })
            notySuccess(`Base ${base.path} read.`)
          }
        })
        commit(mTypes.UPDATE_CURRENT_PICTURES)
      }
    })
  },
  [aTypes.READ_TAGS] ({ commit }) {
    fs.readdir('data', (err, files) => {
      if (err) {
        notyError(err)
      } else {
        files
        .filter(file => file === 'tags.json')
        .forEach(file => {
          fs.readFile(`data/${file}`, 'utf8', (err, data) => {
            if (err) {
              notyError(err)
            } else {
              commit(mTypes.SET, { tags: JSON.parse(data) })
              notySuccess('Tags read.')
            }
          })
        })
      }
    })
  },
  // path: 'D:/Downloads/'
  [aTypes.SCAN_BASE] ({ commit }, { path }) {
    // 存在则更新，不存在则创建
    fs.readdir(path, (err, files) => {
      if (err) {
        notyError(err)
      } else {
        const all = {}
        files
          .filter(file => {
            const splits = file.split('.')
            const exts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'mp4', 'webm']
            return exts.indexOf(splits[splits.length - 1].toLowerCase()) >= 0
          })
          .forEach(file => {
            let id = createUniqueId(file)
            while (all[id]) {
              id = createUniqueId(file)
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
        notySuccess(`${base.path} scaned.`)
      }
    })
  },
  [aTypes.SCAN_ALL_BASES] ({ state, dispatch }) {
    state.bases.forEach(base => {
      dispatch(aTypes.SCAN_BASE, { path: base.path })
    })
  },
  [aTypes.SAVE_BASE] ({ state }, { path }) {
    const base = state.bases.find(b => b.path === path)
    if (base) {
      writeFile(`data/${hash(path)}.json`, JSON.stringify(base, null, 2), `Base ${path} saved.`)
    }
  },
  [aTypes.SAVE_ALL_BASES] ({ state }) {
    state.bases.forEach(base => writeFile(`data/${hash(base.path)}.json`, JSON.stringify(base, null, 2), `Base ${base.path} saved.`))
  },
  [aTypes.SAVE_TAGS] ({ state }) {
    writeFile(`data/tags.json`, JSON.stringify(state.tags, null, 2), 'Tags saved.')
  },
  [aTypes.SAVE_CURRENT] ({ state }) {
    writeFile(`data/current.json`, JSON.stringify(state.current, null, 2), 'Current saved.')
  }
}

const updateCurrentPageByCurrentPicture = (state) => {
  const pictureId = state.current.pictureId
  const pictures = store.getters[gTypes.CURRENT_PICTURES]
  const index = pictures.findIndex(p => p.id === pictureId)
  state.current.page = getExplorerPageFromPictureIndex(index)
}

const getExplorerPageFromPictureIndex = (index) => {
  const perPage = store.getters[gTypes.PER_PAGE]
  return Math.floor((index >= 0 ? index : 0) / perPage)
}

const mutations = {
  [mTypes.SET] (state, payload) {
    cover(state, payload)
  },
  [mTypes.UPDATE_CURRENT_PICTURES] (state) {
    const tagId = state.current.tagId
    let pictures = []
    const mapper = (base, pictureId) => wrapPicture(base, base.all[pictureId], state.tags)
    if (tagId) {
      if (state.current.baseIndex < 0) {
        state.bases.forEach(base => {
          if (base.tagged[tagId]) {
            pictures = pictures.concat(base.tagged[tagId].map(pictureId => mapper(base, pictureId)))
          }
        })
      } else {
        const base = store.getters[gTypes.CURRENT_BASE]
        if (base) {
          if (base.tagged[tagId]) {
            pictures = pictures.concat(base.tagged[tagId].map(pictureId => mapper(base, pictureId)))
          }
        }
      }
    } else {
      if (state.current.baseIndex < 0) {
        // All
        state.bases.forEach(base => {
          pictures = pictures.concat(Object.keys(base.all).map(pictureId => mapper(base, pictureId)))
        })
      } else {
        const base = store.getters[gTypes.CURRENT_BASE]
        if (base) {
          pictures = pictures.concat(Object.keys(base.all).map(pictureId => mapper(base, pictureId)))
        }
      }
    }
    // 去重
    const idMap = {}
    pictures = pictures.filter(picture => {
      if (!idMap[picture.id]) {
        idMap[picture.id] = true
        return true
      } else {
        return false
      }
    })
    // 排序
    const sortKey = state.current.sortKey || 'birthtime'
    pictures.sort((a, b) => {
      if (state.current.isRandom) {
        return Math.random() - 0.5
      } else {
        const att = a.taggedTime || -1
        const btt = b.taggedTime || -1
        const aStar = a.isBookmarked ? Number.MAX_SAFE_INTEGER : a.starNumber
        const bStar = b.isBookmarked ? Number.MAX_SAFE_INTEGER : b.starNumber
        const aScannedTime = a.scannedTime || -1
        const bScannedTime = b.scannedTime || -1
        if (sortKey === 'taggedTime' && att !== btt) {
          return -(att - btt)
        } else if (sortKey === 'scannedTime' && aScannedTime !== bScannedTime) {
          return -(aScannedTime - bScannedTime)
        } else if (sortKey === 'star' && aStar !== bStar) {
          return -(aStar - bStar)
        } else if (sortKey === 'star' && att !== btt) {
          return -(att - btt)
        } else {
          const at = a.stats ? a.stats[sortKey] : -1
          const bt = b.stats ? b.stats[sortKey] : -1
          return -(at - bt)
        }
      }
    })

    state.currentPictures = pictures
  },
  [mTypes.SET_PAGE] (state, { page, delta }) {
    const pageLength = store.getters[gTypes.PAGE_LENGTH]
    if (delta) {
      page = state.current.page + delta
    }
    page = Math.max(0, page)
    page = Math.min(page, pageLength - 1)
    state.current.page = page
  },
  [mTypes.SET_PICTURE] (state, { pictureId, basePath }) {
    state.current.pictureBasePath = basePath
    state.current.pictureId = pictureId
  },
  [mTypes.EXPLORER_TOGGLE_TAG] (state, { tagId }) {
    if (state.current.tagId === tagId) {
      state.current.tagId = ''
    } else {
      state.current.tagId = tagId
    }
    mutations[mTypes.UPDATE_CURRENT_PICTURES](state)
    updateCurrentPageByCurrentPicture(state)
  },
  [mTypes.SET_PICTURE_BY_PAGE] (state, { page, delta }) {
    const pictures = store.getters[gTypes.CURRENT_PICTURES]
    if (delta) {
      const currentPicturePage = store.getters[gTypes.CURRENT_PICTURE_PAGE]
      page = currentPicturePage + delta
    }
    page = Math.max(0, page)
    page = Math.min(page, pictures.length - 1)
    const picture = pictures[page]
    state.current.page = getExplorerPageFromPictureIndex(page),
    state.current.pictureBasePath = picture.basePath,
    state.current.pictureId = picture.id
  },
  [mTypes.SET_SCALE] (state, { scale }) {
    state.current.scale = scale
  },
  [mTypes.ADD_BASE] (state, { base }) {
    const index = state.bases.findIndex(b => b.path === base.path)
    if (index >= 0) {
      for (const pictureId in base.all) {
        if (!state.bases[index].all[pictureId] &&
          Object.keys(state.bases[index].all).findIndex(pid => state.bases[index].all[pid].path === base.all[pictureId].path) < 0) {
          state.bases[index].all[pictureId] = base.all[pictureId]

          // tagme!
          if (!state.bases[index].tagged['0']) {
            state.bases[index].tagged['0'] = []
          }
          state.bases[index].tagged['0'].push(pictureId)
        }
      }

      state.bases[index].tagged = { ...state.bases[index].tagged }
      state.bases[index].all = { ...state.bases[index].all }
      state.bases[index] = { ...state.bases[index] }
      state.bases = [...state.bases]
    } else {
      state.bases = [
        ...state.bases,
        base
      ]
    }
    state.bases = state.bases.sort((baseA, baseB) => {
      const nameA = baseA.path.toUpperCase()
      const nameB = baseB.path.toUpperCase()
      if (nameA < nameB) {
        return -1
      }
      if (nameA > nameB) {
        return 1
      }
      return 0
    })
  },

  [mTypes.VIEWER_TOGGLE_TAG] (state, { tagId }) {
    const pictureId = state.current.pictureId
    const pictureBasePath = state.current.pictureBasePath
    const baseIndex = state.bases.findIndex(b => b.path === pictureBasePath)
    const base = state.bases[baseIndex]
    const tagged = base.tagged
    const toggle = (tid, val) => {
      if (!tagged[tid]) {
        tagged[tid] = []
      }
      let targetValue = tagged[tid].indexOf(pictureId) < 0
      if (val) {
        targetValue = val.value
      }
      if (targetValue) {
        tagged[tid].unshift(pictureId)
        tagged[tid] = [...tagged[tid]]
      } else {
        /*
        const index = tagged[tid].indexOf(pictureId)
        tagged[tid].slice(index, 1)
        */
        tagged[tid] = tagged[tid].filter(pid => pid !== pictureId)
      }
      // tag 子传父，untag 不递归
      if (targetValue) {
        for (const t in state.tags) {
          const tag = state.tags[t]
          if (tag.children.indexOf(tid) >= 0) {
            toggle(tag.id, { value: targetValue })
          }
        }
      }
    }
    toggle(tagId)

    // save taggedTime
    // state.bases[baseIndex].all[pictureId].taggedTime = (new Date).getTime()
    state.bases[baseIndex].all[pictureId] = {
      ...state.bases[baseIndex].all[pictureId],
      taggedTime: (new Date).getTime()
    }
    state.bases[baseIndex].all = {
      ...state.bases[baseIndex].all
    }

    state.bases[baseIndex].tagged = { ...state.bases[baseIndex].tagged }
    state.bases[baseIndex] = { ...state.bases[baseIndex] }
    state.bases = [...state.bases]
  },
  [mTypes.TOGGLE_RANDOM] (state) {
    state.current.isRandom = !state.current.isRandom
  },

  [mTypes.ADD_NEW_TAG] (state, { name }) {
    const newId = createUniqueId(name)
    state.tags = {
      ...state.tags,
      [newId]: {
        id: newId,
        name,
        weight: 0,
        children: []
      }
    }
  },
  [mTypes.ADD_CHILD_TAG] (state, { parentId, childId }) {
    const parentTag = state.tags[parentId]
    if (parentId) {
      state.tags = {
        ...state.tags,
        [parentId]: {
          ...parentTag,
          children: [...parentTag.children, childId]
        }
      }
    }
  },
  [mTypes.SET_TAG_WEIGHT] (state, { tagId, weight, delta }) {
    if (state.tags[tagId]) {
      if (delta) {
        weight = state.tags[tagId].weight + delta
      }
      state.tags = {
        ...state.tags,
        [tagId]: {
          ...state.tags[tagId],
          weight
        }
      }
    }
  },
  [mTypes.SET_BASE] (state, { baseIndex }) {
    state.current.baseIndex = baseIndex
    mutations[mTypes.UPDATE_CURRENT_PICTURES](state)
    updateCurrentPageByCurrentPicture(state)
  },
  [mTypes.SET_SORT_KEY] (state, { sortKey }) {
    state.current.sortKey = sortKey
    mutations[mTypes.UPDATE_CURRENT_PICTURES](state)
  },
  [mTypes.TOGGLE_HORIZONTAL_FLIPPED] (state) {
    state.current.isHorizontalFlipped = !state.current.isHorizontalFlipped
  }
}

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations,
  modules: {
    tag
  }
})

export default store
