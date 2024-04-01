import { LoaderFunction } from '@remix-run/node'
import { eventService } from '~/.server/services/EventService'
import { sessionService } from '~/.server/services/SessionService'
import { stockService } from '~/.server/services/StockService'

export const homeLoader: LoaderFunction = async ({ request }) => {
  return sessionService.verifySession(request, async () => {
    return {
      data: {
        stocks: await stockService.getStocks(),
        events: await eventService.getEvents(),
      },
      status: 200,
    }
  })
}
