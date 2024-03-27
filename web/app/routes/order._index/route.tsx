import OrderPage from './presentation'
import { orderLoader as loader } from './application/loader.server'
import { orderAction as action } from './application/action.server'

export { loader, action }
export default OrderPage
