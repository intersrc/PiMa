import PimaNav from './Nav'

const components = {
  PimaNav
}

const plugin = {
  install (Vue, options) {
    for (const key in components) {
      Vue.component(key, components[key])
    }
    // Vue.prototype.$foo = 'bar'
  }
}

export default plugin
