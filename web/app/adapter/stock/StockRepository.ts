import { Firestore } from 'firebase-admin/firestore'
import { IStockRepository } from '~/domain/ports/StockRepository'
import { Stock } from '~/type'

export function StockRepository(db: Firestore): IStockRepository {
  async function getStocks() {
    const querySnapshot = await db.collection('stocks').get()

    const data: Stock[] = []

    querySnapshot.forEach((doc) => {
      const docData = doc.data() as Stock

      data.push({ ...docData })
    })

    return data
  }

  return {
    getStocks,
  }
}
