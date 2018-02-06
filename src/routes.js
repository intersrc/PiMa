import App from './components/App'
import Explorer from './components/Explorer'
import Viewer from './components/Viewer'

const routes = [{
  path: '',
  component: App,
  children: [{
    path: '',
    component: Explorer
  }, {
    path: 'explorer',
    component: Explorer
  }, {
    path: 'viewer',
    component: Viewer
  }]
}]
export default routes
