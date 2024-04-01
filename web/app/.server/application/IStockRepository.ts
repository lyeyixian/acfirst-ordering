import { Stock } from '~/common/type'

export interface IStockRepository {
  getStocks: () => Promise<Stock[]>
}
