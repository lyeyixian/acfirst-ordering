import { Event, EventStatus, EventType, Stock, User } from '~/common/type'
import { db } from '../infrastructure/firebase'
import { Timestamp } from 'firebase-admin/firestore'
import { eventService } from './EventService'

export interface IStockService {
  getStocks: () => Promise<Stock[]>
  getStock: (itemCode: string) => Promise<Stock>
  refreshStocks: (user: User) => Promise<void>
}

async function getStocks() {
  const querySnapshot = await db.collection('stocks').get()

  const data: Stock[] = []

  querySnapshot.forEach((doc) => {
    const docData = doc.data() as Stock

    data.push({ ...docData })
  })

  return data
}

async function getStock(itemCode: string) {
  const docSnapshot = await db.collection('stocks').doc(itemCode).get()

  if (!docSnapshot.exists) {
    throw new Error('Stock does not exist')
  }

  return docSnapshot.data() as Stock
}

async function refreshStocks(user: User) {
  const event: Event = {
    type: EventType.REFRESH_STOCKS,
    status: EventStatus.QUEUED,
    createdBy: user.username,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  }

  await eventService.createEvent(event)
}

export const stockService: IStockService = {
  getStocks,
  getStock,
  refreshStocks,
}
