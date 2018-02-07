import Explorer from './components/Explorer'
import Tag from './components/Tag'
import Viewer from './components/Viewer'

const routes = [{
  path: '',
  component: Explorer
}, {
  path: 'explorer',
  component: Explorer
}, {
  path: 'tag',
  component: Tag
}, {
  path: 'viewer',
  component: Viewer
}]
export default routes
