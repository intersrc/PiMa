import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './components/App.vue'
import pimaPlugin from './components/pimaPlugin'
import routes from './routes'
import store from './store'
import $ from 'jquery'

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(pimaPlugin)

const $el = $('#app')

const router = new VueRouter({
  mode: 'hash',
  saveScrollPosition: false,
  routes
})

new Vue({
  router,
  store,
  el: $el[0],
  render: h => h(Vue.component('app', App))
})

// init database

import * as mTypes from 'pima-store/mutationTypes'
import hash from 'object-hash'

const path = 'D:/Downloads/'
const createId = (file) => `${hash(file)}-${hash(Math.random())}`

fs.readdir(path, (err, files) => {
  if (err) {
    console.error(err)
    window.alert(err)
  } else {
    const all = {}
    files.map(file => {
      let id = createId(file)
      while (all[id]) {
        id = createId(file)
      }
      all[id] = {
        id,
        path: file,
        scannedTime: (new Date()).getTime()
      }
    })
    store.commit(mTypes.SET, {
      bases: [{
        path,
        all,
        tagged: {}
      }],
      tags: {}
    })
  }
})
