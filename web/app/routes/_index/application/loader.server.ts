import { LoaderFunction } from '@remix-run/node'
import { eventService } from '~/.server/application/EventService'
import { sessionService } from '~/.server/application/SessionService'
import { stockService } from '~/.server/application/StockService'
import { EventType } from '~/common/type'

export const homeLoader: LoaderFunction = async ({ request }) => {
  return sessionService.verifySession(request, async (user) => {
    eventService.createEvent(EventType.REFRESH_STOCKS, user)
    return {
      data: {
        stocks: await stockService.getStocks(),
        events: await eventService.getEventsForUser(user),
      },
      status: 200,
    }
  })
}
