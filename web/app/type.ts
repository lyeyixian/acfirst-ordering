import { User } from './type'

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
} // Firestore
// Users

export interface CreateUserPayload {
  username: string
  email: string
  company: string
  userId: string
}
export interface User {
  username: string
  email: string
  company: string
  userId: string
}
