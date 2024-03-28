import { Timestamp } from '@google-cloud/firestore'

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

export interface Stock {
  itemCode: string
  location: string
  batch: string
  quantity: number
  pricePerUnit: number
  updatedAt: Timestamp
}

export interface Event {
  id?: string
  type: EventType
  payload?: EventPayload
  status: EventStatus
  createdBy: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
export enum EventStatus {
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
}
export interface EventPayload {
  docNo: string
  code: string
  data: EventStockPayload[]
}
export interface EventStockPayload {
  itemCode: string
  qty: number
}
