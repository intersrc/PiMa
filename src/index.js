import Vue from 'vue'
import VueRouter from 'vue-router'
import Vuex from 'vuex'
import App from './components/App.vue'
import store from './store'
import routes from './routes'
import $ from 'jquery'

Vue.use(VueRouter)
Vue.use(Vuex)

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

const dir = 'D:/Downloads/'

fs.readdir(dir, (err, files) => {
  if (err) {
    console.error(err)
  } else {
    store.commit(mTypes.SET, {
      all: files.map(f => `${dir}/${f}`),
      tags: {}
    })
  }
})
