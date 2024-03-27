import { MetaFunction } from '@remix-run/node'
import { homeAction as action } from './application/action.server'
import { homeLoader as loader } from './application/loader.server'
import HomePage from './presentation'

export const meta: MetaFunction = () => {
  return [
    { title: 'Acfirst Ordering' },
    { name: 'description', content: 'Welcome to Acfirst Ordering!' },
  ]
}

export { loader, action }
export default HomePage
