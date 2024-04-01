import { Stock } from '~/common/type'
import { db } from '../infrastructure/firebase'

export interface IStockService {
  getStocks: () => Promise<Stock[]>
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

export const stockService: IStockService = {
  getStocks,
}
