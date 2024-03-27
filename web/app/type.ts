import { User } from './firebase.server'

export enum EventType {
  REFRESH_STOCKS = 'refreshStocks',
  CREATE_INVOICE = 'createInvoice',
  CREATE_DELIVERY_ORDER = 'createDeliveryOrder',
}
export interface CallbackData {
  data?: Record<string, unknown>
  error?: string
  status: number
}
export interface ResponseData {
  user: User
  data?: Record<string, unknown>
  error?: string
}
