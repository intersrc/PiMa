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

Vue.use(VueRouter)
Vue.use(Vuex)
Vue.use(pimaPlugin)

const router = new VueRouter({
  mode: 'hash',
  saveScrollPosition: false,
  routes
})

new Vue({
  router,
  store,
  el: document.getElementById('app'),
  render: h => h(Vue.component('app', App))
})

window.store = store
