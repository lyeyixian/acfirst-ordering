import { Stock } from '~/type'

export interface IStockRepository {
  getStocks: () => Promise<Stock[]>
}
