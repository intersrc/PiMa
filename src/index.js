import 'normalize.css'
import 'noty/lib/noty.css'
import 'noty/lib/themes/mint.css'
// import 'noty/lib/themes/sunset.css'
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

import * as gTypes from 'pima-store/getterTypes'
import * as mTypes from 'pima-store/mutationTypes'
import hash from 'object-hash'
import Noty from 'noty'

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
    const bases = [{
      path,
      all,
      tagged: {}
    }]
    const tags = {}
    store.commit(mTypes.SET, {
      bases,
      tags
    })

    if (!store.getters[gTypes.IS_STATIC]) {
      const write = (path, text, message) => {
        fs.mkdir('data', 0o777, () => {
          fs.writeFile(path, text, 'utf8', (err) => {
            if (err) throw err
            new Noty({
              // theme: 'sunset',
              timeout: 3000,
              text: message
            }).show()
          })
        })
      }
      write(`data/${hash(path)}.bases.json`, JSON.stringify(bases, null, 2), 'bases saved.')
      write(`data/${hash(path)}.tags.json`, JSON.stringify(tags, null, 2), 'tags saved.')
    }
  }
})
