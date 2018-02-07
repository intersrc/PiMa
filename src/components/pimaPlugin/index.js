import PimaPagination from './Pagination'

const components = {
  PimaPagination
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
