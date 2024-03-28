import { LoaderFunction } from '@remix-run/node'
import { sessionRepository } from '~/adapter/auth'
import { stockRepository } from '~/adapter/stock'
import { getEvents } from '~/firebase.server'

export const homeLoader: LoaderFunction = async ({ request }) => {
  return sessionRepository.verifySession(request, async () => {
    return {
      data: {
        stocks: await stockRepository.getStocks(),
        events: await getEvents(),
      },
      status: 200,
    }
  })
}
