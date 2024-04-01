import { Stock } from '~/common/type'

export interface IStockService {
  getStocks: () => Promise<Stock[]>
}
