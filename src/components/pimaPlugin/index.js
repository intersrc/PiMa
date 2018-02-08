import PimaNav from './Nav'
import PimaTag from './Tag'
import PimaTags from './Tags'

const components = {
  PimaNav,
  PimaTag,
  PimaTags
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
