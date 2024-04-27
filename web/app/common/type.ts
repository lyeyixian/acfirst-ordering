import { Timestamp } from '@google-cloud/firestore'

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

// Events
export enum EventType {
  REFRESH_STOCKS = 'refreshStocks',
  CREATE_INVOICE = 'createInvoice',
  CREATE_DELIVERY_ORDER = 'createDeliveryOrder',
}

export interface Event {
  id?: string
  type: EventType
  payload: EventPayload | null
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
  Code: string
  Data: EventStockPayload[]
}

export interface EventStockPayload {
  ItemCode: string
  Qty: number
}

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

// Stocks
export interface Stock {
  itemCode: string
  location: string
  batch: string
  quantity: number
  pricePerUnit: number
  updatedAt: Timestamp
}

export interface StockRowData {
  'Item Code': string
  Location: string
  Batch: string
  Quantity: number
  'Price per Unit (MYR)': number
}

export interface EventRowData {
  'Order ID': string | undefined
  Type: EventType
  Order: string | null
  Status: EventStatus
  'Created By': string
  'Created At': Date
  'Updated At': Date
}
