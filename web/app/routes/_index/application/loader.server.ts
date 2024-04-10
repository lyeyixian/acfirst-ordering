import { LoaderFunction } from '@remix-run/node'
import { eventService } from '~/.server/application/EventService'
import { sessionService } from '~/.server/application/SessionService'
import { stockService } from '~/.server/application/StockService'

export const homeLoader: LoaderFunction = async ({ request }) => {
  return sessionService.verifySession(request, async (user) => {
    return {
      data: {
        stocks: await stockService.getStocks(),
        events: await eventService.getEventsForUser(user),
      },
      status: 200,
    }
  })
}

