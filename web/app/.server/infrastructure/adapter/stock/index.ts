import { db } from '~/.server/infrastructure/firebase'
import { StockRepository } from './StockRepository'

const stockRepository = StockRepository(db)

export { stockRepository }
