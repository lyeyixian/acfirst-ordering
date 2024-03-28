import { Timestamp } from 'firebase-admin/firestore'
import { EventType } from './type'
import { db } from './infrastructure/firebase'

// Events
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

export async function getEvents() {
  const querySnapshot = await db.collection('events').get()

  const data: Event[] = []

  querySnapshot.forEach((doc) => {
    const docData = doc.data() as Event

    data.push({ ...docData, id: doc.id })
  })

  return data
}

export async function createEvent(event: Event) {
  return db.collection('events').add(event)
}
