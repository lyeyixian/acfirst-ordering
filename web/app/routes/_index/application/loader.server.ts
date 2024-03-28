import { LoaderFunction } from '@remix-run/node'
import { sessionRepository } from '~/.server/infrastructure/adapter/auth'
import { eventRepository } from '~/.server/infrastructure/adapter/event'
import { stockRepository } from '~/.server/infrastructure/adapter/stock'

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
