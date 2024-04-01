import { EventType, Stock, User } from '~/common/type'
import { db } from '../infrastructure/firebase'
import { eventService } from './EventService'
import { DocumentReference } from 'firebase-admin/firestore'

export interface IStockService {
  getStocks: () => Promise<Stock[]>
  getStock: (itemCode: string) => Promise<Stock>
  refreshStocks: (user: User) => Promise<DocumentReference>
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
  return await eventService.createEvent(EventType.REFRESH_STOCKS, user)
}

export const stockService: IStockService = {
  getStocks,
  getStock,
  refreshStocks,
}
