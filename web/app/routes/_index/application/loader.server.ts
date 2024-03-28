import { LoaderFunction } from '@remix-run/node'
import { sessionRepository } from '~/infrastructure/adapter/auth'
import { eventRepository } from '~/infrastructure/adapter/event'
import { stockRepository } from '~/infrastructure/adapter/stock'

export const homeLoader: LoaderFunction = async ({ request }) => {
  return sessionRepository.verifySession(request, async () => {
    return {
      data: {
        stocks: await stockRepository.getStocks(),
        events: await eventRepository.getEvents(),
      },
      status: 200,
    }
  })
}
